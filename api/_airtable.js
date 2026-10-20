/**
 * GreenNext Digital Infrastructure — Airtable Lead Database Integration
 * 
 * Provides server-side lead persistence, idempotency verification, rate-limit backoff,
 * adaptive schema tolerance, and secure credential handling.
 * 
 * Configuration:
 * - AIRTABLE_PAT: Personal Access Token with data.records:read and data.records:write scope
 * - AIRTABLE_BASE_ID: appnkJABVWFGwX7Lv
 * - AIRTABLE_LEADS_TABLE_ID: tblYi5BguStHsPtA4
 * - View ID: viwDw74iTVtxylb60
 */

const DEFAULT_BASE_ID = 'appnkJABVWFGwX7Lv';
const DEFAULT_TABLE_ID = 'tblYi5BguStHsPtA4';
const DEFAULT_VIEW_ID = 'viwDw74iTVtxylb60';
const AIRTABLE_API_BASE = 'https://api.airtable.com/v0';

/**
 * Reads Airtable configuration from environment variables.
 * Never exposes secrets in logs or responses.
 */
export function getAirtableConfig() {
  const pat = (process.env.AIRTABLE_PAT || '').trim();
  const baseId = (process.env.AIRTABLE_BASE_ID || DEFAULT_BASE_ID).trim();
  const tableId = (process.env.AIRTABLE_LEADS_TABLE_ID || DEFAULT_TABLE_ID).trim();
  const viewId = (process.env.AIRTABLE_VIEW_ID || DEFAULT_VIEW_ID).trim();

  return {
    pat,
    baseId,
    tableId,
    viewId,
    isConfigured: Boolean(pat && baseId && tableId),
  };
}

/**
 * Builds standard Bearer authorization header for Airtable REST API.
 */
function getHeaders(pat) {
  return {
    'Authorization': `Bearer ${pat}`,
    'Content-Type': 'application/json',
    'User-Agent': 'GreenNext-Enterprise-Ingestion/1.0',
  };
}

/**
 * Maps incoming normalized lead data to candidate Airtable fields.
 * Only includes fields that have meaningful values.
 */
export function mapLeadToAirtableFields(leadData = {}) {
  const fields = {};

  if (leadData.enquiryId) {
    fields['Enquiry ID'] = String(leadData.enquiryId).trim();
  }

  const name = leadData.fullName || leadData.name;
  if (name && name !== '—') {
    fields['Name'] = String(name).trim();
  }

  const email = leadData.businessEmail || leadData.email;
  if (email && email !== '—') {
    fields['Email'] = String(email).trim();
  }

  const phone = leadData.phoneNumber || leadData.phone;
  if (phone && phone !== '—') {
    fields['Phone'] = String(phone).trim();
  }

  const company = leadData.companyName || leadData.company;
  if (company && company !== '—') {
    fields['Company'] = String(company).trim();
  }

  const location = leadData.location || leadData.city;
  if (location && location !== '—') {
    fields['Location'] = String(location).trim();
  }

  const industry = leadData.industry;
  if (industry && industry !== '—') {
    fields['Industry'] = String(industry).trim();
  }

  const formType = leadData.formType || leadData.form_type;
  if (formType && formType !== '—') {
    fields['Enquiry Type'] = String(formType).trim();
  }

  const requirements = leadData.projectRequirements || leadData.areaOfInterest || leadData.requirements;
  if (requirements && requirements !== '—') {
    fields['Requirements'] = String(requirements).trim();
  }

  const challenge = leadData.businessChallenge || leadData.projectRequirements;
  if (challenge && challenge !== '—') {
    fields['Business Challenge'] = String(challenge).trim();
  }

  const timeline = leadData.expectedTimeline || leadData.timeline;
  if (timeline && timeline !== '—') {
    fields['Project Timeline'] = String(timeline).trim();
  }

  const budget = leadData.budget || leadData.budgetRange;
  if (budget && budget !== '—') {
    fields['Budget'] = String(budget).trim();
  }

  const page = leadData.metadata?.page_url || leadData.page_url || leadData.page_source;
  if (page) {
    fields['Source Page'] = String(page).trim();
  }

  const utmSource = leadData.metadata?.utm_source || leadData.utm_source;
  if (utmSource) fields['UTM Source'] = String(utmSource).trim();

  const utmMedium = leadData.metadata?.utm_medium || leadData.utm_medium;
  if (utmMedium) fields['UTM Medium'] = String(utmMedium).trim();

  const utmCampaign = leadData.metadata?.utm_campaign || leadData.utm_campaign;
  if (utmCampaign) fields['UTM Campaign'] = String(utmCampaign).trim();

  fields['Lead Status'] = leadData.leadStatus || 'New';

  const nowIso = new Date().toISOString();
  fields['Created At'] = leadData.createdAt || nowIso;
  fields['Updated At'] = nowIso;

  if (leadData.leadSaved !== undefined) {
    fields['Google Sheets Sync Status'] = leadData.leadSaved ? 'Synced' : 'Pending';
  }

  if (leadData.jira?.parentKey || leadData.jiraKey) {
    fields['Jira Issue Key'] = leadData.jira?.parentKey || leadData.jiraKey;
  }

  if (leadData.emailNotificationStatus || leadData.email?.success) {
    fields['Email Notification Status'] = leadData.emailNotificationStatus || (leadData.email?.success ? 'Sent' : 'Pending');
  }

  // Consultation & Calendar Booking fields
  if (leadData.calendarEventId) {
    fields['Calendar Event ID'] = String(leadData.calendarEventId).trim();
  }
  if (leadData.meetLink) {
    fields['Google Meet Link'] = String(leadData.meetLink).trim();
  }
  if (leadData.meetingMode) {
    fields['Meeting Mode'] = String(leadData.meetingMode).trim();
  }
  if (leadData.bookingTimezone) {
    fields['Booking Timezone'] = String(leadData.bookingTimezone).trim();
  }
  if (leadData.bookingStatus) {
    fields['Booking Status'] = String(leadData.bookingStatus).trim();
  }

  return fields;
}

/**
 * Sleep helper for exponential backoff.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Checks Airtable for an existing record with the specified Enquiry ID
 * to guarantee strict idempotency and prevent duplicate records on retry.
 */
export async function findExistingAirtableRecord(enquiryId, config = getAirtableConfig()) {
  if (!config.isConfigured || !enquiryId) {
    return { exists: false, record: null };
  }

  try {
    const encodedFormula = encodeURIComponent(`{Enquiry ID} = '${enquiryId}'`);
    const url = `${AIRTABLE_API_BASE}/${config.baseId}/${config.tableId}?filterByFormula=${encodedFormula}&maxRecords=1`;

    const res = await fetch(url, {
      method: 'GET',
      headers: getHeaders(config.pat),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      // If formula fails (e.g. {Enquiry ID} field doesn't exist yet in user's schema), return safely
      return { exists: false, record: null, status: res.status };
    }

    const data = await res.json().catch(() => null);
    if (data && Array.isArray(data.records) && data.records.length > 0) {
      return { exists: true, record: data.records[0] };
    }

    return { exists: false, record: null };
  } catch (err) {
    console.error('[Airtable] Idempotency search notice:', err.message);
    return { exists: false, record: null, error: err.message };
  }
}

/**
 * Saves a normalized lead record to Airtable with:
 * 1. Verification of server credentials
 * 2. Idempotency deduplication check
 * 3. Rate-limit (429) backoff retry
 * 4. Adaptive field handling (recovers gracefully if some fields don't exist yet in the table)
 */
export async function saveLeadToAirtable(leadData, options = {}) {
  const config = options.config || getAirtableConfig();

  if (!config.isConfigured) {
    return {
      success: false,
      configured: false,
      status: 'missing_credentials',
      message: 'Airtable Personal Access Token (AIRTABLE_PAT) is not configured in server environment.',
      enquiryId: leadData?.enquiryId || null,
    };
  }

  const enquiryId = leadData?.enquiryId;

  // 1. Idempotency Check
  if (enquiryId) {
    const existing = await findExistingAirtableRecord(enquiryId, config);
    if (existing.exists && existing.record) {
      return {
        success: true,
        configured: true,
        isDuplicate: true,
        recordId: existing.record.id,
        status: 'already_exists',
        message: 'Lead record already exists in Airtable for this Enquiry ID.',
        enquiryId,
      };
    }
  }

  // 2. Prepare payload fields
  const fields = mapLeadToAirtableFields(leadData);
  const omittedFields = [];
  let attempt = 0;
  const maxAttempts = 5;

  const url = `${AIRTABLE_API_BASE}/${config.baseId}/${config.tableId}`;

  while (attempt < maxAttempts) {
    attempt++;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: getHeaders(config.pat),
        body: JSON.stringify({
          fields,
          typecast: true,
        }),
        signal: AbortSignal.timeout(12000),
      });

      // Success
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        return {
          success: true,
          configured: true,
          recordId: data.id,
          enquiryId,
          status: 'created',
          savedFields: Object.keys(fields),
          omittedFields,
          message: 'Lead successfully saved to Airtable.',
        };
      }

      // Handle Rate Limiting (HTTP 429)
      if (res.status === 429) {
        const retryAfter = parseInt(res.headers.get('retry-after') || '1', 10);
        const backoffMs = (retryAfter > 0 ? retryAfter * 1000 : 1000) * attempt;
        console.warn(`[Airtable] Rate limited (429). Retrying in ${backoffMs}ms... (Attempt ${attempt}/${maxAttempts})`);
        await sleep(backoffMs);
        continue;
      }

      // Parse error details
      const errorJson = await res.json().catch(() => ({}));
      const errorObj = errorJson.error || {};
      const errorType = errorObj.type || '';
      const errorMessage = errorObj.message || '';

      // Adaptive schema tolerance:
      // If table is missing a field, Airtable returns:
      // "Unknown field name: \"Business Challenge\""
      if (res.status === 422 && (errorType === 'UNKNOWN_FIELD_NAME' || errorMessage.includes('Unknown field name'))) {
        const match = errorMessage.match(/Unknown field name:? "(.*?)"/i);
        const unknownField = match ? match[1] : null;

        if (unknownField && fields[unknownField] !== undefined) {
          console.warn(`[Airtable] Field "${unknownField}" not in table schema. Omitting and retrying...`);
          omittedFields.push(unknownField);
          delete fields[unknownField];
          continue; // Retry with remaining fields
        }
      }

      // Authentication or Permission errors
      if (res.status === 401 || res.status === 403) {
        return {
          success: false,
          configured: true,
          status: 'auth_error',
          httpStatus: res.status,
          message: `Airtable authentication error (${res.status}): ${errorMessage || 'Invalid PAT or insufficient permissions'}.`,
          enquiryId,
        };
      }

      // Other 4xx / 5xx errors
      return {
        success: false,
        configured: true,
        status: 'api_error',
        httpStatus: res.status,
        errorType,
        message: `Airtable API error (${res.status}): ${errorMessage || 'Unknown error'}`,
        enquiryId,
        omittedFields,
      };
    } catch (netErr) {
      if (attempt < maxAttempts) {
        await sleep(500 * attempt);
        continue;
      }
      return {
        success: false,
        configured: true,
        status: 'network_error',
        message: `Airtable network request failed: ${netErr.message}`,
        enquiryId,
      };
    }
  }

  return {
    success: false,
    configured: true,
    status: 'max_retries_exceeded',
    message: 'Exceeded maximum retry attempts while saving lead to Airtable.',
    enquiryId,
    omittedFields,
  };
}

/**
 * Diagnostic helper to verify connectivity and inspect table status.
 * Never exposes credentials.
 */
export async function verifyAirtableConnection(config = getAirtableConfig()) {
  if (!config.isConfigured) {
    return {
      connected: false,
      configured: false,
      message: 'Airtable PAT (AIRTABLE_PAT) is not configured.',
      baseId: config.baseId,
      tableId: config.tableId,
    };
  }

  try {
    const url = `${AIRTABLE_API_BASE}/${config.baseId}/${config.tableId}?maxRecords=1`;
    const res = await fetch(url, {
      method: 'GET',
      headers: getHeaders(config.pat),
      signal: AbortSignal.timeout(8000),
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      const sampleRecord = data.records?.[0];
      const existingFieldKeys = sampleRecord ? Object.keys(sampleRecord.fields || {}) : [];

      return {
        connected: true,
        configured: true,
        baseId: config.baseId,
        tableId: config.tableId,
        viewId: config.viewId,
        recordCountDetected: Array.isArray(data.records) ? data.records.length : 0,
        sampleFieldsFound: existingFieldKeys,
        message: 'Successfully connected to Airtable base and table.',
      };
    }

    const err = await res.json().catch(() => ({}));
    return {
      connected: false,
      configured: true,
      httpStatus: res.status,
      baseId: config.baseId,
      tableId: config.tableId,
      errorType: err.error?.type || 'UNKNOWN',
      message: err.error?.message || `Airtable returned status ${res.status}`,
    };
  } catch (err) {
    return {
      connected: false,
      configured: true,
      baseId: config.baseId,
      tableId: config.tableId,
      message: `Failed to connect to Airtable: ${err.message}`,
    };
  }
}
