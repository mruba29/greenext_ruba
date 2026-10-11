/**
 * GREENNEXT — GOOGLE SHEETS ENQUIRY INTEGRATION BACKEND
 * Google Apps Script Web App
 *
 * Automatically records enterprise inquiries from GreenNext website
 * (both Long Form "Talk to an Expert" and Short Form "Quick Enquiry")
 * into the "Enquiries" worksheet.
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

// If running as a standalone Apps Script project, replace with your Spreadsheet ID:
// e.g., '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'
// If this script is container-bound (created via Extensions > Apps Script inside the sheet),
// leave as 'ACTIVE' to automatically attach to the parent spreadsheet.
var SPREADSHEET_ID = 'ACTIVE';

// Name of the target worksheet
var SHEET_NAME = 'Enquiries';

// Target Timezone for submission timestamps
var TIMEZONE = 'Asia/Kolkata';

// 16 Standardized Columns matching GreenNext Information Architecture
var COLUMNS = [
  'Enquiry ID',
  'Submitted At',
  'Form Type',
  'Full Name',
  'Business Email',
  'Company Name',
  'Phone Number',
  'Location',
  'Industry',
  'Area of Interest',
  'Project Requirements',
  'Expected Timeline',
  'Preferred Contact Method',
  'Message',
  'Consent',
  'Status'
];

// ============================================================================
// HTTP HANDLERS
// ============================================================================

/**
 * Health check and configuration verification endpoint.
 */
function doGet(e) {
  try {
    var sheet = getOrInitSheet();
    return createJsonResponse({
      success: true,
      status: 'online',
      service: 'GreenNext Google Sheets Enquiry API',
      sheetConnected: true,
      sheetName: sheet.getName(),
      totalRows: sheet.getLastRow(),
      timestamp: formatTimestamp(new Date())
    });
  } catch (err) {
    return createJsonResponse({
      success: false,
      status: 'configuration_error',
      message: 'Unable to access spreadsheet. Check SPREADSHEET_ID and permissions.',
      error: sanitizeError(err.message)
    });
  }
}

/**
 * Form submission receiver endpoint.
 */
function doPost(e) {
  // Concurrency Lock: Prevents simultaneous row write collisions
  var lock = LockService.getScriptLock();
  var lockAcquired = false;

  try {
    // Wait up to 15 seconds for concurrent submissions to clear
    lockAcquired = lock.tryLock(15000);
    if (!lockAcquired) {
      return createJsonResponse({
        success: false,
        message: 'Server is currently processing high volume. Please retry in a few seconds.'
      });
    }

    // 1. Parse incoming payload (supports application/json, text/plain, or form-urlencoded)
    var data = parsePostData(e);
    if (!data) {
      return createJsonResponse({
        success: false,
        message: 'Invalid request payload. Ensure JSON body is supplied.'
      });
    }

    // 2. Validate form inputs server-side
    var validationResult = validatePayload(data);
    if (!validationResult.valid) {
      return createJsonResponse({
        success: false,
        message: validationResult.message
      });
    }

    // 3. Connect to / Initialize worksheet
    var sheet = getOrInitSheet();

    // 4. Build sanitized, formula-injection-safe row data
    var now = new Date();
    var enquiryId = generateEnquiryId(now);
    var submittedAt = formatTimestamp(now);
    var formType = sanitize(data.form_type || (data.is_short_form ? 'Short Form' : 'Long Form'));

    var fullName = sanitize(data.full_name || data.name || '');
    var businessEmail = sanitize(data.business_email || data.email || '');
    var companyName = sanitize(data.company_name || data.company || '—');
    var phoneNumber = sanitize(data.phone || data.phone_number || '');
    var location = sanitize(data.location || data.city || '—');
    var industry = sanitize(data.industry || '—');
    var areaOfInterest = sanitize(data.area_of_interest || data.interest || '—');
    var projectRequirements = sanitize(data.project_requirements || data.requirements || '—');
    var expectedTimeline = sanitize(data.timeline || data.expected_timeline || '—');
    var preferredContactMethod = sanitize(data.contact_method || data.preferred_contact_method || '—');
    var message = sanitize(data.message || '—');
    var consent = data.consent === true || data.consent === 'true' || data.consent === 'on' || data.consent === 'Granted' ? 'Granted' : 'Granted';
    var status = 'New';

    // If Short Form passed a combined contact field (email or phone)
    if (formType === 'Short Form' && data.contact) {
      var contactVal = String(data.contact).trim();
      if (contactVal.indexOf('@') !== -1) {
        if (!businessEmail) businessEmail = sanitize(contactVal);
      } else {
        if (!phoneNumber) phoneNumber = sanitize(contactVal);
      }
    }

    var rowValues = [
      enquiryId,
      submittedAt,
      formType,
      fullName,
      businessEmail,
      companyName,
      phoneNumber,
      location,
      industry,
      areaOfInterest,
      projectRequirements,
      expectedTimeline,
      preferredContactMethod,
      message,
      consent,
      status
    ];

    // 5. Atomic Append to Sheet
    sheet.appendRow(rowValues);

    return createJsonResponse({
      success: true,
      message: 'Enquiry submitted successfully',
      enquiryId: enquiryId
    });

  } catch (err) {
    return createJsonResponse({
      success: false,
      message: 'Unable to submit your enquiry. Please try again or reach our desk directly.'
    });
  } finally {
    if (lockAcquired) {
      lock.releaseLock();
    }
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Accesses target spreadsheet and ensures "Enquiries" sheet exists with header row.
 */
function getOrInitSheet() {
  var ss;
  if (SPREADSHEET_ID && SPREADSHEET_ID !== 'ACTIVE') {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  } else {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  }

  if (!ss) {
    throw new Error('Spreadsheet could not be opened. Provide valid SPREADSHEET_ID.');
  }

  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  // If newly created or empty, initialize headers and styling
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS);
    var headerRange = sheet.getRange(1, 1, 1, COLUMNS.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#0E3A2B'); // GreenNext deep forest green
    headerRange.setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);

    // Set auto-width on initial columns
    for (var i = 1; i <= COLUMNS.length; i++) {
      sheet.autoResizeColumn(i);
    }
  }

  return sheet;
}

/**
 * Parses POST body regardless of whether received as JSON or text/plain.
 */
function parsePostData(e) {
  if (!e) return null;
  if (e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (parseErr) {
      // Fallback: Check if x-www-form-urlencoded
      if (e.parameter && Object.keys(e.parameter).length > 0) {
        return e.parameter;
      }
      return null;
    }
  }
  if (e.parameter && Object.keys(e.parameter).length > 0) {
    return e.parameter;
  }
  return null;
}

/**
 * Server-side input validation and length limits.
 */
function validatePayload(data) {
  var formType = data.form_type || (data.is_short_form ? 'Short Form' : 'Long Form');

  if (formType === 'Short Form') {
    var name = (data.name || data.full_name || '').trim();
    var contact = (data.contact || data.business_email || data.phone || '').trim();
    var interest = (data.area_of_interest || '').trim();

    if (!name || name.length < 2) {
      return { valid: false, message: 'Please provide a valid name (at least 2 characters).' };
    }
    if (name.length > 150) {
      return { valid: false, message: 'Name exceeds maximum allowed length.' };
    }
    if (!contact || contact.length < 5) {
      return { valid: false, message: 'Please provide a valid work email or phone number.' };
    }
    if (contact.length > 150) {
      return { valid: false, message: 'Contact info exceeds maximum allowed length.' };
    }
    if (!interest) {
      return { valid: false, message: 'Please select an area of interest.' };
    }
    return { valid: true };
  }

  // Long Form validation
  var fullName = (data.full_name || data.name || '').trim();
  var email = (data.business_email || data.email || '').trim();
  var phone = (data.phone || data.phone_number || '').trim();
  var requirements = (data.project_requirements || data.requirements || data.message || '').trim();

  if (!fullName || fullName.length < 2) {
    return { valid: false, message: 'Full Name is required (at least 2 characters).' };
  }
  if (fullName.length > 150) {
    return { valid: false, message: 'Full Name exceeds maximum allowed length.' };
  }

  if (!email || !isValidEmail(email)) {
    return { valid: false, message: 'A valid business email address is required.' };
  }
  if (email.length > 150) {
    return { valid: false, message: 'Email address exceeds maximum allowed length.' };
  }

  if (!phone || !isValidPhone(phone)) {
    return { valid: false, message: 'A valid contact phone number is required (min 7 digits).' };
  }
  if (phone.length > 50) {
    return { valid: false, message: 'Phone number exceeds maximum allowed length.' };
  }

  if (requirements && requirements.length > 4000) {
    return { valid: false, message: 'Project Requirements cannot exceed 4,000 characters.' };
  }

  return { valid: true };
}

/**
 * Basic email format verification.
 */
function isValidEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(email);
}

/**
 * Basic phone verification (supports international + prefixes, spaces, dashes).
 */
function isValidPhone(phone) {
  var digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

/**
 * Sanitizes strings against CSV/Spreadsheet formula injection attacks.
 * If user text begins with =, +, -, @, \t, or \r, it prepends a single quote.
 */
function sanitize(val) {
  if (val === null || val === undefined) return '';
  var str = String(val).trim();
  if (str.length === 0) return '';

  // Limit arbitrary field length to 4000 characters max
  if (str.length > 4000) {
    str = str.substring(0, 4000);
  }

  var first = str.charAt(0);
  if (first === '=' || first === '+' || first === '-' || first === '@' || first === '\t' || first === '\r') {
    return "'" + str;
  }
  return str;
}

/**
 * Generates unique enterprise enquiry identifier: GN-YYYYMMDD-XXXX
 */
function generateEnquiryId(date) {
  var dateStr = Utilities.formatDate(date, TIMEZONE, 'yyyyMMdd');
  var rand = Math.floor(1000 + Math.random() * 9000);
  return 'GN-' + dateStr + '-' + rand;
}

/**
 * Formats timestamps in ISO-style localized string.
 */
function formatTimestamp(date) {
  return Utilities.formatDate(date, TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
}

/**
 * Helper to produce JSON HTTP responses with proper MIME type.
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Strips internal paths or credentials from error messages.
 */
function sanitizeError(msg) {
  if (!msg) return 'Unknown error';
  return String(msg).replace(/(key|token|id)=[^\s&]+/gi, '$1=***');
}
