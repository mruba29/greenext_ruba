/**
 * GreenNext Digital Infrastructure — Enterprise Lead Ingestion & Jira Forwarding API
 * 
 * Vercel Serverless Function & Local Development Route
 * 
 * Flow:
 * 1. Validate Form Submission Server-Side
 * 2. Sanitize against CSV/Spreadsheet Formula Injection
 * 3. Store Lead in Google Sheets (Raw Data workbook: 14ciH1aNzWIJHJkQ5rYCdrEhci3KYMjrTSeY3QMaerVI)
 * 4. Generate/Retrieve Unique Sequential Lead Identifier (GN-YYYYMMDD-XXXX)
 * 5. Create Parent Task & Required Subtasks in Atlassian Jira Cloud (Project DI)
 * 6. Assign Tasks to Verified Jira User (Ruba Dharshini M)
 * 7. Add Parent Task to Active Sprint (DI Sprint 1 / Sprint 35)
 * 8. Return Integrated Processing Status & Idempotent Enquiry Reference
 */

import { createJiraLeadTask } from './_jira.js';
import { sendLeadNotificationEmail } from './_email.js';
import { saveLeadToAirtable } from './_airtable.js';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const GAS_URL = process.env.GOOGLE_APPS_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbzY7QqSNPMyK05FraOoGMtUvD5lXLnuwVlE5D1rPmQiV1nf8qyyiknvlzi_w9c_HJ6G/exec';

function sanitize(val, maxLen = 4000) {
  if (val === null || val === undefined) return '';
  let str = String(val).trim();
  if (!str) return '';
  if (str.length > maxLen) str = str.substring(0, maxLen);
  const first = str.charAt(0);
  if (['=', '+', '-', '@', '\t', '\r'].includes(first)) return "'" + str;
  return str;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function isValidPhone(phone) {
  const digits = (phone || '').replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

export default async function handler(req, res) {
  // 1. Set standard CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  // 2. Health check & status retrieval
  if (req.method === 'GET') {
    res.status(200).json({
      success: true,
      service: 'GreenNext Lead & Jira Automation API',
      status: 'online',
      gasConfigured: Boolean(GAS_URL),
      jiraConfigured: Boolean(process.env.JIRA_API_TOKEN && process.env.JIRA_EMAIL),
      airtableConfigured: Boolean(process.env.AIRTABLE_PAT),
    });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
    return;
  }

  // 3. Parse and normalize body
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      res.status(400).json({ success: false, message: 'Invalid JSON request payload' });
      return;
    }
  }
  body = body || {};

  let formType = body.form_type || (body.is_short_form ? 'Short Form' : 'Long Form');
  if (formType.toLowerCase().includes('quick') || formType.toLowerCase().includes('short')) {
    formType = 'Short Form';
  }
  const fullName = (body.full_name || body.name || '').trim();
  const contact = (body.contact || body.business_email || body.phone || '').trim();

  // 4. Server-Side Input Validation
  if (!fullName || fullName.length < 2) {
    res.status(400).json({ success: false, message: 'Please provide a valid name (at least 2 characters).' });
    return;
  }

  if (formType === 'Short Form') {
    if (!contact || contact.length < 5) {
      res.status(400).json({ success: false, message: 'Please provide a valid email or phone number.' });
      return;
    }
    if (!body.area_of_interest) {
      res.status(400).json({ success: false, message: 'Please select an area of interest.' });
      return;
    }
  } else if (formType === 'Floating Lead Form') {
    const email = (body.business_email || body.email || '').trim();
    const phone = (body.phone || body.phone_number || '').trim();
    if (!email || !isValidEmail(email)) {
      res.status(400).json({ success: false, message: 'A valid business email address is required.' });
      return;
    }
    if (!phone || !isValidPhone(phone)) {
      res.status(400).json({ success: false, message: 'A valid contact phone number is required (min 7 digits).' });
      return;
    }
    const interest = (body.area_of_interest || body.service_interest || body.service || '').trim();
    if (!interest) {
      res.status(400).json({ success: false, message: 'Please select a requirement or service.' });
      return;
    }
  } else if (formType === 'Careers Application') {
    const email = (body.business_email || body.email || '').trim();
    const phone = (body.phone || body.phone_number || '').trim();
    if (!email || !isValidEmail(email)) {
      res.status(400).json({ success: false, message: 'A valid email address is required.' });
      return;
    }
    if (!phone || !isValidPhone(phone)) {
      res.status(400).json({ success: false, message: 'A valid contact phone number is required (min 7 digits).' });
      return;
    }
  } else {
    // Long Form validation
    const email = (body.business_email || body.email || '').trim();
    const phone = (body.phone || body.phone_number || '').trim();
    if (!email || !isValidEmail(email)) {
      res.status(400).json({ success: false, message: 'A valid business email address is required.' });
      return;
    }
    if (!phone || !isValidPhone(phone)) {
      res.status(400).json({ success: false, message: 'A valid contact phone number is required (min 7 digits).' });
      return;
    }
  }

  // 5. Build standardized lead data record
  const now = new Date();
  const yyyymmdd = now.toISOString().slice(0, 10).replace(/-/g, '');
  let businessEmail = sanitize(body.business_email || body.email || '');
  let phoneNumber = sanitize(body.phone || body.phone_number || '');

  if (formType === 'Short Form' && contact) {
    if (contact.includes('@')) {
      if (!businessEmail) businessEmail = sanitize(contact);
    } else {
      if (!phoneNumber) phoneNumber = sanitize(contact);
    }
  }

  // Hidden tracking metadata
  const metadata = {
    page_url: body.page_url || '',
    page_title: body.page_title || '',
    referrer: body.referrer || '',
    utm_source: body.utm_source || '',
    utm_medium: body.utm_medium || '',
    utm_campaign: body.utm_campaign || '',
    utm_term: body.utm_term || '',
    utm_content: body.utm_content || '',
  };

  let enquiryId = '';
  let isDuplicate = false;
  let leadSavedInSheets = false;

  // 6. Persist Lead to Google Sheets via Google Apps Script (Priority 1)
  if (GAS_URL) {
    try {
      const gasRes = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(12000),
      });

      if (gasRes.ok) {
        const gasJson = await gasRes.json().catch(() => null);
        if (gasJson && gasJson.success) {
          enquiryId = gasJson.enquiryId || '';
          isDuplicate = Boolean(gasJson.duplicate);
          leadSavedInSheets = true;
        }
      }
    } catch (gasErr) {
      console.error('[Enquiry API] Google Apps Script forward notice:', gasErr.message);
    }
  }

  // Fallback to local storage persistence if GAS wasn't reachable
  if (!leadSavedInSheets) {
    try {
      const cwd = process.cwd();
      const dataDir = join(cwd, 'data');
      const enquiriesFile = join(dataDir, 'enquiries.json');
      await mkdir(dataDir, { recursive: true });
      const raw = await readFile(enquiriesFile, 'utf8').catch(() => '[]');
      let list = [];
      try { list = JSON.parse(raw); } catch (e) { list = []; }

      // Check duplicates in local store
      const emailNorm = businessEmail.toLowerCase().trim();
      const phoneDigits = phoneNumber.replace(/\D/g, '');
      const dup = list.slice(-15).reverse().find(item => {
        const itemEmail = (item.businessEmail || '').toLowerCase().trim();
        const itemPhone = (item.phoneNumber || '').replace(/\D/g, '');
        return emailNorm && itemEmail === emailNorm && phoneDigits && itemPhone === phoneDigits && item.formType === sanitize(formType);
      });

      if (dup) {
        enquiryId = dup.enquiryId;
        isDuplicate = true;
        leadSavedInSheets = true;
      } else {
        const prefix = `GN-${yyyymmdd}-`;
        let maxSeq = 0;
        for (const item of list) {
          const idStr = String(item.enquiryId || '').trim();
          if (idStr.startsWith(prefix)) {
            const num = parseInt(idStr.substring(prefix.length), 10);
            if (!isNaN(num) && num > maxSeq) maxSeq = num;
          }
        }
        enquiryId = `${prefix}${String(maxSeq + 1).padStart(4, '0')}`;
        list.push({
          enquiryId,
          submittedAt: now.toISOString(),
          formType: sanitize(formType),
          fullName: sanitize(fullName),
          businessEmail,
          phoneNumber,
          companyName: sanitize(body.company_name || body.company || '—'),
          areaOfInterest: sanitize(body.area_of_interest || body.service_interest || body.service || body.position || '—'),
          projectRequirements: sanitize(body.project_requirements || body.requirements || body.resume || '—'),
          metadata,
          status: 'New',
        });
        await writeFile(enquiriesFile, JSON.stringify(list, null, 2), 'utf8');
        leadSavedInSheets = true;
      }
    } catch (fsErr) {
      console.error('[Enquiry API] Local storage notice:', fsErr.message);
      if (!enquiryId) {
        enquiryId = `GN-${yyyymmdd}-0001`;
      }
    }
  }

  // 7. Handle Duplicate Submission Early
  if (isDuplicate) {
    res.status(200).json({
      success: true,
      duplicate: true,
      enquiryId,
      leadSaved: true,
      message: 'Enquiry received. Our enterprise team is already processing your request.',
    });
    return;
  }

  // 8. Create Jira Parent Task & Subtasks (Asynchronous / Non-blocking to user lead receipt)
  const normalizedLeadData = {
    enquiryId,
    fullName: sanitize(fullName),
    formType: sanitize(formType),
    companyName: sanitize(body.company_name || body.company || '—'),
    businessEmail,
    phoneNumber,
    location: sanitize(body.location || body.city || '—'),
    industry: sanitize(body.industry || '—'),
    areaOfInterest: sanitize(body.area_of_interest || body.service_interest || body.service || body.position || '—'),
    projectRequirements: sanitize(body.project_requirements || body.requirements || body.resume || '—'),
    businessChallenge: sanitize(body.business_challenge || body.challenge || body.requirements || body.project_requirements || '—'),
    expectedTimeline: sanitize(body.timeline || body.expected_timeline || '—'),
    budget: sanitize(body.budget || body.budget_range || ''),
    preferredContactMethod: sanitize(body.contact_method || body.preferred_contact_method || body.linkedin || '—'),
    submittedAt: now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }),
    createdAt: now.toISOString(),
    leadStatus: 'New',
    leadSaved: leadSavedInSheets,
    metadata,
  };

  let jiraResult = null;
  try {
    jiraResult = await createJiraLeadTask(normalizedLeadData);
  } catch (jErr) {
    jiraResult = {
      success: false,
      status: 'jira_failed',
      error: jErr.message,
    };
  }

  // 9. Automated Lead Notification Email Delivery
  normalizedLeadData.jira = jiraResult;
  normalizedLeadData.jiraKey = jiraResult?.parentKey || '—';
  let emailResult = null;
  try {
    emailResult = await sendLeadNotificationEmail(normalizedLeadData);
  } catch (emErr) {
    emailResult = {
      success: false,
      error: emErr.message,
      timestamp: new Date().toISOString(),
    };
  }
  normalizedLeadData.email = emailResult;
  normalizedLeadData.emailNotificationStatus = emailResult?.success ? 'Sent' : (emailResult?.error ? 'Failed' : 'Disabled');

  // 10. Persist Lead to Airtable Database
  let airtableResult = null;
  try {
    airtableResult = await saveLeadToAirtable(normalizedLeadData);
  } catch (aErr) {
    airtableResult = {
      success: false,
      status: 'airtable_failed',
      error: aErr.message,
      message: 'Failed to record lead in Airtable: ' + aErr.message,
    };
  }

  // 11. Update Lead Notification, Jira Status, and Airtable Status in Google Sheets
  const notificationStatusPayload = {
    action: 'update_lead_status',
    enquiryId,
    formType: normalizedLeadData.formType,
    fullName: normalizedLeadData.fullName,
    companyName: normalizedLeadData.companyName,
    areaOfInterest: normalizedLeadData.areaOfInterest,
    parentJiraKey: jiraResult?.parentKey || '—',
    parentJiraUrl: jiraResult?.parentUrl || '—',
    jiraStatus: jiraResult?.status || (jiraResult?.parentKey ? 'jira_created' : 'pending'),
    jiraSubtasksStatus: jiraResult?.subtasks ? `${jiraResult.subtasks.length} of 7 subtasks created` : (jiraResult?.parentKey ? 'Subtasks configured' : 'Pending'),
    airtableRecordId: airtableResult?.recordId || '—',
    airtableStatus: airtableResult?.status || (airtableResult?.success ? 'Saved' : 'Pending'),
    emailNotificationStatus: normalizedLeadData.emailNotificationStatus,
    emailSentTimestamp: emailResult?.timestamp || new Date().toISOString(),
    emailRecipient: emailResult?.recipient || '',
    emailMessageId: emailResult?.messageId || '',
    emailErrorDetails: emailResult?.error || '',
    lastUpdated: new Date().toISOString(),
  };

  if (GAS_URL) {
    try {
      await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(notificationStatusPayload),
        signal: AbortSignal.timeout(8000),
      });
    } catch (uErr) {
      console.error('[Enquiry API] Status tracking update notice:', uErr.message);
    }
  }

  // Also update local storage record if available
  try {
    const cwd = process.cwd();
    const dataDir = join(cwd, 'data');
    const enquiriesFile = join(dataDir, 'enquiries.json');
    const raw = await readFile(enquiriesFile, 'utf8').catch(() => '[]');
    let list = [];
    try { list = JSON.parse(raw); } catch (e) { list = []; }
    const item = list.find(l => l.enquiryId === enquiryId);
    if (item) {
      item.jira = jiraResult;
      item.email = emailResult;
      item.airtable = airtableResult;
      item.airtableRecordId = airtableResult?.recordId || null;
      item.emailNotificationStatus = notificationStatusPayload.emailNotificationStatus;
      item.lastUpdated = notificationStatusPayload.lastUpdated;
      await writeFile(enquiriesFile, JSON.stringify(list, null, 2), 'utf8');
    }
  } catch (fsErr) {
    // Non-blocking
  }

  // 12. Deliver integrated response to website
  // If Airtable is not successfully recorded, do not show success
  if (airtableResult && !airtableResult.success) {
    const statusCode = airtableResult.status === 'missing_credentials' ? 503 : 502;
    res.status(statusCode).json({
      success: false,
      message: airtableResult.message || 'Unable to store lead in Airtable database.',
      enquiryId,
      leadSaved: leadSavedInSheets,
      airtable: airtableResult,
      jira: jiraResult,
      email: emailResult,
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: 'Enquiry submitted successfully',
    enquiryId,
    leadSaved: leadSavedInSheets,
    airtable: airtableResult,
    jira: jiraResult,
    email: emailResult,
  });
}
