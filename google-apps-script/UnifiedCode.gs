/**
 * ============================================================================
 * GREENNEXT — COMPLETE ENTERPRISE BACKEND (UNIFIED WEB APP)
 * Google Apps Script Web App
 * 
 * Unifies:
 *   1. Enterprise Lead Ingestion (Enquiries worksheet)
 *   2. Traffic Analysis         (Raw event tracking, 16 standardized columns)
 *   3. Traffic Intelligence     (Actionable business insights, 11 columns)
 *   4. Session Intelligence     (Visitor journey accumulation, 20 columns)
 * 
 * Target Workbook: 14ciH1aNzWIJHJkQ5rYCdrEhci3KYMjrTSeY3QMaerVI
 * Timezone: Asia/Kolkata
 * ============================================================================
 */

// ============================================================================
// 1. GLOBAL CONFIGURATION & SCHEMAS
// ============================================================================

var SPREADSHEET_ID = '14ciH1aNzWIJHJkQ5rYCdrEhci3KYMjrTSeY3QMaerVI';
var TIMEZONE       = 'Asia/Kolkata';

// Optional lead notification email (e.g. 'contact@greennext.in', leave '' to disable)
var NOTIFICATION_EMAIL = 'ruba.int2027g3@gmail.com';

// Target worksheet names
var SHEET_ENQUIRY       = 'Enquiries';
var SHEET_TRAFFIC       = 'Traffic Analysis';
var SHEET_INTEL         = 'Traffic Intelligence';
var SHEET_SESSION       = 'Session Intelligence';
var SHEET_JIRA_TRACKING = 'Jira Lead Tracking';

// Schema: Jira Lead Tracking (18 Standard Columns)
var COLS_JIRA_TRACKING = [
  'Enquiry ID',
  'Submitted At',
  'Lead Source',
  'Company Name',
  'Contact Name',
  'Area of Interest',
  'Parent Jira Issue Key',
  'Parent Jira URL',
  'Initial Contact Subtask Key',
  'Follow-up 1 Subtask Key',
  'Requirements Gathering Subtask Key',
  'Site Visit Subtask Key',
  'Proposal Subtask Key',
  'Lead Closure Subtask Key',
  'Operations Handover Subtask Key',
  'Jira Creation Status',
  'Email Notification Status',
  'Email Sent Timestamp',
  'Email Recipient',
  'Email Error Details',
  'Last Sync Timestamp',
  'Error Details'
];

// Schema: Enquiries (16 Standard Columns)
var COLUMNS_ENQUIRY = [
  'Enquiry ID', 'Submitted At', 'Form Type', 'Full Name',
  'Business Email', 'Company Name', 'Phone Number', 'Location',
  'Industry', 'Area of Interest', 'Project Requirements',
  'Expected Timeline', 'Preferred Contact Method', 'Message',
  'Consent', 'Status'
];

// Schema: Traffic Analysis (16 Standard Columns)
var COLS_TRAFFIC = [
  'Event ID', 'Timestamp', 'Anonymous Session ID',
  'Event Type', 'Page URL', 'Page Title',
  'Referrer Source', 'UTM Source', 'UTM Medium', 'UTM Campaign',
  'Device Category', 'Browser Category',
  'Landing Page', 'CTA Name', 'Form Type', 'Conversion Status'
];

// Schema: Traffic Intelligence (11 Standard Columns)
var COLS_INTEL = [
  'Insight ID', 'Analysis Date', 'Insight Category',
  'Observation', 'Supporting Metric',
  'Current Period', 'Comparison Period',
  'Suggested Action', 'Priority', 'Confidence Level', 'Data Period'
];

// Schema: Session Intelligence (20 Standard Columns)
var COLS_SESSION = [
  'Session ID', 'Session Start Time', 'Last Observed Activity',
  'Estimated Session End', 'Session Duration', 'Landing Page',
  'Last Viewed Page', 'Pages Viewed', 'Total Page Views',
  'Traffic Source', 'UTM Campaign', 'Device Category',
  'CTA Click Count', 'WhatsApp CTA Clicked',
  'Long Form Started', 'Short Form Started', 'Form Submitted Successfully',
  'Conversion Status', 'Exit Page', 'Analysis Timestamp'
];

// ============================================================================
// 2. HTTP DISPATCHERS (doGet / doPost)
// ============================================================================

function doGet(e) {
  var service = (e && e.parameter && (e.parameter.service || e.parameter.type)) || '';
  var view    = (e && e.parameter && (e.parameter.view || e.parameter.action)) || '';

  if (service.toLowerCase() === 'analytics' || view) {
    return handleAnalyticsGet(e);
  }
  return handleEnquiryGet(e);
}

function doPost(e) {
  var postData = parsePostData(e);

  // If payload contains an explicit action dispatcher
  if (postData && postData.action) {
    if (postData.action === 'send_lead_email') {
      return handleSendLeadEmailAction(postData);
    }
    if (postData.action === 'update_lead_status' || postData.action === 'update_notification_status') {
      return handleUpdateLeadStatusAction(postData);
    }
  }

  // If payload contains analytics event batch or single event
  if (postData && (postData.events || postData.event_type)) {
    return handleAnalyticsPost(e, postData);
  }

  // Otherwise handle lead enquiry
  return handleEnquiryPost(e, postData);
}


// ============================================================================
// 3. ENQUIRY HANDLERS & PROCESSING
// ============================================================================

function handleEnquiryGet(e) {
  try {
    var ss = getSpreadsheet();
    var sheet = getOrInitSheet(ss, SHEET_ENQUIRY, COLUMNS_ENQUIRY, '#062317');
    return createJsonResponse({
      success       : true,
      status        : 'online',
      service       : 'GreenNext Google Sheets Enquiry API',
      sheetConnected: true,
      sheetName     : sheet.getName(),
      totalRows     : sheet.getLastRow(),
      timestamp     : formatTimestamp(new Date())
    });
  } catch (err) {
    return createJsonResponse({
      success: false,
      status : 'configuration_error',
      message: 'Unable to access spreadsheet. Check SPREADSHEET_ID and permissions.',
      error  : sanitizeError(err.message)
    });
  }
}

function handleEnquiryPost(e, preParsedData) {
  var lock = LockService.getScriptLock();
  var lockAcquired = false;

  try {
    lockAcquired = lock.tryLock(15000);
    if (!lockAcquired) {
      return createJsonResponse({
        success: false,
        message: 'Server is currently processing high volume. Please retry in a few seconds.'
      });
    }

    var data = preParsedData || parsePostData(e);
    if (!data) {
      return createJsonResponse({ success: false, message: 'Invalid request: No payload received.' });
    }

    var formType = data.form_type || (data.is_short_form ? 'Short Form' : 'Long Form');
    var fullName = (data.full_name || data.name || '').trim();
    var contact  = (data.contact || data.business_email || data.phone || '').trim();

    if (!fullName || fullName.length < 2) {
      return createJsonResponse({ success: false, message: 'Please provide a valid full name.' });
    }

    if (formType === 'Floating Lead Form') {
      var interestCheck = (data.area_of_interest || data.service_interest || data.service || '').trim();
      if (!interestCheck) {
        return createJsonResponse({ success: false, message: 'Please select an area of interest or service.' });
      }
    }

    var ss    = getSpreadsheet();
    var sheet = getOrInitSheet(ss, SHEET_ENQUIRY, COLUMNS_ENQUIRY, '#062317');
    var now   = new Date();

    // Duplicate submission guard (10-minute duplicate window)
    var isDuplicate = checkDuplicateSubmission(sheet, fullName, contact, now);
    if (isDuplicate) {
      return createJsonResponse({
        success      : true,
        message      : 'Your enquiry has already been received. Our team will contact you shortly.',
        duplicate    : true,
        enquiryId    : isDuplicate.existingId,
        submittedAt  : isDuplicate.submittedAt
      });
    }

    var enquiryId = generateSequentialEnquiryId(sheet, now);
    var timestampStr = formatTimestamp(now);

    var email = (data.business_email || data.email || (contact.indexOf('@') > -1 ? contact : '')).trim();
    var phone = (data.phone || (contact.indexOf('@') === -1 ? contact : '')).trim();

    var extraNotes = [];
    if (data.page_url)     extraNotes.push('URL: ' + data.page_url);
    if (data.referrer)     extraNotes.push('Referrer: ' + data.referrer);
    if (data.utm_source || data.utm_medium) extraNotes.push('UTM: ' + (data.utm_source || '') + '/' + (data.utm_medium || ''));
    if (data.utm_campaign) extraNotes.push('Campaign: ' + data.utm_campaign);
    var messageContent = (data.message || '').trim();
    if (extraNotes.length > 0) {
      messageContent = (messageContent ? messageContent + '\n\n' : '') + extraNotes.join('\n');
    }

    var row = [
      enquiryId,
      timestampStr,
      sanitize(formType, 100),
      sanitize(fullName, 200),
      sanitize(email, 200),
      sanitize(data.company_name || data.company || '', 200),
      sanitize(phone, 50),
      sanitize(data.location || '', 100),
      sanitize(data.industry || '', 100),
      sanitize(data.area_of_interest || data.service_interest || data.service || data.position || '', 200),
      sanitize(data.project_requirements || data.requirements || data.resume || '', 4000),
      sanitize(data.expected_timeline || data.timeline || '', 100),
      sanitize(data.preferred_contact_method || data.contact_method || data.linkedin || '', 100),
      sanitize(messageContent, 4000),
      data.consent ? 'Yes' : 'No',
      'New'
    ];

    sheet.appendRow(row);

    // Also trigger Session Intelligence conversion if session_id is provided
    if (data.session_id) {
      try {
        var convEvent = {
          event_type       : 'form_submission_success',
          session_id       : data.session_id,
          page_url         : data.page_url || '/',
          form_type        : formType,
          conversion_status: 'Converted',
          client_ts        : now.getTime()
        };
        updateSessionIntelligence(ss, [convEvent], now);
      } catch (sessSyncErr) {}
    }
    
    // Automatic Jira Cloud Parent Task & Subtask Creation
    var jiraResult = null;
    try {
      jiraResult = createJiraLeadTaskFromGas(
        enquiryId, formType, fullName, email,
        data.company_name || data.company || '',
        phone,
        data.location || '',
        data.industry || '',
        data.area_of_interest || data.service || '',
        data.project_requirements || data.requirements || '',
        data.expected_timeline || data.timeline || '',
        data.preferred_contact_method || data.contact_method || '',
        messageContent
      );
      if (jiraResult && jiraResult.parentKey) {
        var lastR = sheet.getLastRow();
        sheet.getRange(lastR, 16).setValue('New [Jira: ' + jiraResult.parentKey + ']');
      }
    } catch (jiraErr) {
      Logger.log('Jira issue creation skipped/failed: ' + jiraErr.message);
    }

    // Step 4: Automated Lead Notification Email Dispatch
    var emailResult = null;
    try {
      emailResult = sendLeadNotificationEmailFromGas(
        enquiryId, formType, fullName, email,
        data.company_name || data.company || '—',
        phone,
        data.location || '—',
        data.industry || '—',
        data.area_of_interest || data.service || '—',
        data.project_requirements || data.requirements || '—',
        data.expected_timeline || data.timeline || '—',
        data.preferred_contact_method || data.contact_method || '—',
        data.page_url || '/',
        data.utm_source || 'Direct / Organic',
        jiraResult,
        timestampStr
      );
    } catch (emErr) {
      Logger.log('Lead notification email error: ' + emErr.message);
      emailResult = { success: false, status: 'failed', error: emErr.message };
    }

    // Step 5: Record in dedicated Jira Lead Tracking worksheet (18 columns)
    try {
      var jiraTrackingSheet = getOrInitSheet(ss, SHEET_JIRA_TRACKING, COLS_JIRA_TRACKING, '#0D3B66');
      var subMap = (jiraResult && jiraResult.subtaskMap) || {};
      var parentKey = (jiraResult && jiraResult.parentKey) || '—';
      var parentUrl = (jiraResult && jiraResult.parentUrl) || '—';
      var creationStatus = (jiraResult && jiraResult.status) || 'jira_not_configured';
      var errorDetails = (jiraResult && (jiraResult.error || jiraResult.note)) || '—';

      var jiraRow = [
        enquiryId,
        timestampStr,
        sanitize(formType, 100),
        sanitize(data.company_name || data.company || '—', 200),
        sanitize(fullName, 200),
        sanitize(data.area_of_interest || data.service || '—', 200),
        parentKey,
        parentUrl,
        subMap['initial_contact'] || '—',
        subMap['follow_up_1'] || '—',
        subMap['requirements_gathering'] || '—',
        subMap['site_visit'] || '—',
        subMap['proposal_quote'] || '—',
        subMap['lead_closure'] || '—',
        subMap['operations_handover'] || '—',
        creationStatus,
        (emailResult && (emailResult.status || (emailResult.success ? 'Sent' : 'Failed'))) || 'Pending / Disabled',
        (emailResult && emailResult.timestamp) || '—',
        (emailResult && emailResult.recipient) || '—',
        (emailResult && (emailResult.error || emailResult.note)) || '—',
        timestampStr,
        sanitize(errorDetails, 400)
      ];
      jiraTrackingSheet.appendRow(jiraRow);
    } catch (trackSheetErr) {
      Logger.log('Jira Lead Tracking row error: ' + trackSheetErr.message);
    }



    return createJsonResponse({
      success  : true,
      message  : 'Thank you! Your enquiry has been registered successfully.',
      enquiryId: enquiryId,
      timestamp: timestampStr,
      jira     : jiraResult,
      email    : emailResult
    });

  } catch (err) {
    Logger.log('Enquiry error: ' + err.message);
    return createJsonResponse({
      success: false,
      message: 'Failed to record enquiry. Please try again or reach us via WhatsApp.',
      error  : sanitizeError(err.message)
    });
  } finally {
    if (lockAcquired) lock.releaseLock();
  }
}

// ============================================================================
// 4. ANALYTICS HANDLERS (TRAFFIC ANALYSIS, SESSION & TRAFFIC INTEL)
// ============================================================================

function handleAnalyticsGet(e) {
  try {
    var ss     = getSpreadsheet();
    var tSheet = getOrInitSheet(ss, SHEET_TRAFFIC, COLS_TRAFFIC, '#0E3A2B');
    var iSheet = getOrInitSheet(ss, SHEET_INTEL,   COLS_INTEL,   '#1A5C3A');
    var sSheet = getOrInitSheet(ss, SHEET_SESSION, COLS_SESSION, '#0D4D2C');

    var view = (e && e.parameter && (e.parameter.view || e.parameter.action)) ? String(e.parameter.view || e.parameter.action).toLowerCase() : '';

    if (view === 'insights') {
      var intelData = iSheet.getDataRange().getValues();
      var insightsList = [];
      if (intelData.length > 1) {
        var headers = intelData[0];
        for (var i = 1; i < intelData.length; i++) {
          var item = {};
          headers.forEach(function(h, idx) { item[h] = intelData[i][idx]; });
          insightsList.push(item);
        }
      }
      return createJsonResponse({
        success  : true,
        service  : 'GreenNext Traffic Intelligence',
        total    : insightsList.length,
        insights : insightsList,
        timestamp: formatTimestamp(new Date())
      });
    }

    if (view === 'dashboard' || view === 'kpis' || view === 'summary') {
      var summary = buildAnalyticsSummary(tSheet, sSheet, iSheet);
      return createJsonResponse(Object.assign({
        success  : true,
        service  : 'GreenNext Analytics Dashboard Intelligence',
        timestamp: formatTimestamp(new Date())
      }, summary));
    }

    return createJsonResponse({
      success  : true,
      status   : 'online',
      service  : 'GreenNext Analytics API',
      sheets   : {
        trafficAnalysis    : { rows: Math.max(0, tSheet.getLastRow() - 1) },
        trafficIntelligence: { rows: Math.max(0, iSheet.getLastRow() - 1) },
        sessionIntelligence: { rows: Math.max(0, sSheet.getLastRow() - 1) }
      },
      timestamp: formatTimestamp(new Date())
    });

  } catch (err) {
    return createJsonResponse({
      success: false,
      status : 'error',
      message: sanitizeError(err.message)
    });
  }
}

function handleAnalyticsPost(e, preParsedData) {
  var lock = LockService.getScriptLock();
  var lockAcquired = false;

  try {
    lockAcquired = lock.tryLock(12000);
    if (!lockAcquired) {
      return createJsonResponse({ success: false, message: 'Analytics service busy — retry shortly.' });
    }

    var data = preParsedData || parsePostData(e);
    if (!data) return createJsonResponse({ success: false, message: 'Invalid JSON payload.' });

    var events = data.events || (data.event_type ? [data] : []);
    if (!Array.isArray(events) || events.length === 0) {
      return createJsonResponse({ success: false, message: 'No events provided.' });
    }

    events = events.slice(0, 50);

    var ss     = getSpreadsheet();
    var tSheet = getOrInitSheet(ss, SHEET_TRAFFIC, COLS_TRAFFIC, '#0E3A2B');

    var now = new Date();
    var validEvents = [];
    var rowsToWrite = [];

    events.forEach(function(ev) {
      if (!ev || !ev.event_type) return;

      validEvents.push(ev);
      var eventId  = 'EVT-' + Utilities.formatDate(now, TIMEZONE, 'yyyyMMdd') + '-' + Math.floor(1000 + Math.random() * 9000);
      var serverTs = formatTimestamp(now);

      rowsToWrite.push([
        eventId,
        serverTs,
        sanitize(ev.session_id      || '', 100),
        sanitize(ev.event_type      || '', 100),
        sanitize(ev.page_url        || '', 300),
        sanitize(ev.page_title      || '', 200),
        sanitize(ev.referrer_source || '', 100),
        sanitize(ev.utm_source      || '', 100),
        sanitize(ev.utm_medium      || '', 100),
        sanitize(ev.utm_campaign    || '', 100),
        sanitize(ev.device_category || '', 50),
        sanitize(ev.browser_category|| '', 50),
        sanitize(ev.landing_page    || '', 300),
        sanitize(ev.cta_name        || '', 150),
        sanitize(ev.form_type       || '', 100),
        sanitize(ev.conversion_status || '', 100)
      ]);
    });

    var written = 0;
    if (rowsToWrite.length > 0) {
      var startRow = tSheet.getLastRow() + 1;
      tSheet.getRange(startRow, 1, rowsToWrite.length, COLS_TRAFFIC.length).setValues(rowsToWrite);
      written = rowsToWrite.length;
    }

    if (validEvents.length > 0) {
      try {
        updateSessionIntelligence(ss, validEvents, now);
      } catch (sErr) {
        Logger.log('Session update error: ' + sErr.message);
      }
    }

    try {
      var tRows = tSheet.getLastRow() - 1;
      var prevRows = Math.max(0, tRows - written);
      if (written > 0 && Math.floor(tRows / 20) > Math.floor(prevRows / 20)) {
        regenerateIntelligence(ss, tSheet, now);
      }
    } catch (iErr) {
      Logger.log('Intel error: ' + iErr.message);
    }

    return createJsonResponse({
      success : true,
      received: events.length,
      written : written
    });

  } catch (err) {
    return createJsonResponse({
      success: false,
      message: 'Analytics processing error.'
    });
  } finally {
    if (lockAcquired) lock.releaseLock();
  }
}

// ============================================================================
// 5. SESSION INTELLIGENCE ACCUMULATION (20 COLUMNS)
// ============================================================================

function updateSessionIntelligence(ss, events, now) {
  var sSheet = getOrInitSheet(ss, SHEET_SESSION, COLS_SESSION, '#0D4D2C');
  var existingData = sSheet.getDataRange().getValues();
  var sessionIndex = {};

  for (var r = 1; r < existingData.length; r++) {
    var sid = String(existingData[r][0]);
    if (sid) sessionIndex[sid] = r + 1;
  }

  var sessionMap = {};
  events.forEach(function(ev) {
    if (!ev || !ev.session_id) return;
    if (!sessionMap[ev.session_id]) sessionMap[ev.session_id] = [];
    sessionMap[ev.session_id].push(ev);
  });

  Object.keys(sessionMap).forEach(function(sid) {
    var evs = sessionMap[sid];
    var firstEv = evs[0];
    var rowIndex = sessionIndex[sid];
    var existingRow = (rowIndex && rowIndex <= existingData.length) ? existingData[rowIndex - 1] : null;

    var batchPageViews = evs.filter(function(e) { return e.event_type === 'page_view'; }).length;
    var batchCtaClicks = evs.filter(function(e) {
      return e.event_type === 'cta_click' || e.event_type === 'nav_click' || e.event_type === 'whatsapp_cta_click' || e.event_type === 'slider_interaction';
    }).length;

    var batchWaClicked   = evs.some(function(e) { return e.event_type === 'whatsapp_cta_click'; });
    var batchLongStarted = evs.some(function(e) { return e.event_type === 'form_start' && e.form_type === 'Long Form'; });
    var batchShortStart  = evs.some(function(e) { return e.event_type === 'form_start' && e.form_type === 'Short Form'; });
    var batchConverted   = evs.some(function(e) { return e.event_type === 'form_submission_success'; });

    var batchPagesViewed = evs.filter(function(e) { return e.event_type === 'page_view'; }).map(function(e) { return e.page_url; }).filter(Boolean);
    var batchLastPage = evs.reduce(function(acc, e) {
      return (e.client_ts && e.client_ts >= (acc.ts || 0)) ? { page: e.page_url, ts: e.client_ts } : acc;
    }, {}).page || firstEv.page_url || '';

    var landingPage    = existingRow ? (existingRow[5] || firstEv.landing_page || '') : (firstEv.landing_page || '');
    var trafficSource  = existingRow ? (existingRow[9] || firstEv.referrer_source || 'Direct') : (firstEv.referrer_source || 'Direct');
    var utmCampaign    = existingRow ? (existingRow[10] || firstEv.utm_campaign || '') : (firstEv.utm_campaign || '');
    var deviceCategory = existingRow ? (existingRow[11] || firstEv.device_category || 'Desktop') : (firstEv.device_category || 'Desktop');
    var lastPage       = batchLastPage || (existingRow ? (existingRow[6] || '') : '');

    var prevPages = (existingRow && existingRow[7]) ? String(existingRow[7]).split(' → ').map(function(s) { return s.trim(); }).filter(Boolean) : [];
    var combinedPages = prevPages.concat(batchPagesViewed).filter(function(p, i, a) { return a.indexOf(p) === i; });
    var pagesViewedStr = combinedPages.join(' → ').substring(0, 400);

    var totalPageViews = (existingRow ? parseInt(existingRow[8] || 0, 10) : 0) + batchPageViews;
    var totalCtaClicks = (existingRow ? parseInt(existingRow[12] || 0, 10) : 0) + batchCtaClicks;

    var waClicked   = (existingRow && existingRow[13] === 'Yes') || batchWaClicked;
    var longStarted = (existingRow && existingRow[14] === 'Yes') || batchLongStarted;
    var shortStart  = (existingRow && existingRow[15] === 'Yes') || batchShortStart;
    var converted   = (existingRow && existingRow[16] === 'Yes') || batchConverted;

    var startTs = 0;
    if (existingRow && existingRow[1]) startTs = parseDateToMs(existingRow[1]);
    if (!startTs) startTs = parseInt(firstEv.session_start_ts || Date.now(), 10);

    var latestTs = evs.reduce(function(max, e) { return Math.max(max, e.client_ts || 0); }, now.getTime());
    var durationS = Math.max(0, Math.round((latestTs - startTs) / 1000));
    if (existingRow && existingRow[4]) {
      var prevDuration = parseInt(String(existingRow[4]).replace(/[^0-9]/g, '') || 0, 10);
      durationS = Math.max(durationS, prevDuration);
    }

    var rowData = [
      sanitize(sid, 100),
      formatTimestamp(new Date(startTs)),
      formatTimestamp(new Date(latestTs)),
      formatTimestamp(new Date(latestTs + 30 * 60 * 1000)),
      String(durationS) + 's',
      sanitize(landingPage, 300),
      sanitize(lastPage, 300),
      pagesViewedStr,
      String(totalPageViews),
      sanitize(trafficSource, 100),
      sanitize(utmCampaign, 100),
      sanitize(deviceCategory, 50),
      String(totalCtaClicks),
      waClicked   ? 'Yes' : 'No',
      longStarted ? 'Yes' : 'No',
      shortStart  ? 'Yes' : 'No',
      converted   ? 'Yes' : 'No',
      converted   ? 'Converted' : 'Not Converted',
      sanitize(lastPage, 300),
      formatTimestamp(now)
    ];

    if (sessionIndex[sid]) {
      sSheet.getRange(sessionIndex[sid], 1, 1, COLS_SESSION.length).setValues([rowData]);
    } else {
      sSheet.appendRow(rowData);
      sessionIndex[sid] = sSheet.getLastRow();
    }
  });
}

// ============================================================================
// 6. TRAFFIC INTELLIGENCE INSIGHTS GENERATOR
// ============================================================================

function regenerateIntelligence(ss, tSheet, now) {
  var iSheet = getOrInitSheet(ss, SHEET_INTEL, COLS_INTEL, '#1A5C3A');
  var data = tSheet.getDataRange().getValues();
  if (data.length < 2) return;

  var headers = data[0];
  var rows    = data.slice(1);
  var colIdx  = {};
  headers.forEach(function(h, i) { colIdx[h] = i; });

  var nowMs      = now.getTime();
  var day7Ms     = 7 * 24 * 60 * 60 * 1000;
  var cutCurrent = nowMs - day7Ms;
  var cutPrev    = nowMs - 2 * day7Ms;

  function rowToMs(r) {
    var idx = (typeof colIdx['Timestamp'] !== 'undefined') ? colIdx['Timestamp'] : colIdx['Server Timestamp'];
    return parseDateToMs(r[idx]);
  }

  var currentRows = rows.filter(function(r) { var t = rowToMs(r); return t >= cutCurrent && t <= nowMs; });
  var prevRows    = rows.filter(function(r) { var t = rowToMs(r); return t >= cutPrev && t < cutCurrent; });
  var allRows     = rows;
  var totalEvents = allRows.length;
  var dataLabel   = 'All-time (' + totalEvents + ' events)';

  function countBy(arr, colName) {
    var map = {};
    arr.forEach(function(r) {
      var val = sanitize(r[colIdx[colName]] || 'Unknown', 200);
      map[val] = (map[val] || 0) + 1;
    });
    return map;
  }

  function topN(map, n) {
    return Object.keys(map)
      .sort(function(a, b) { return map[b] - map[a]; })
      .slice(0, n)
      .map(function(k) { return k + ' (' + map[k] + ')'; })
      .join(', ');
  }

  function filterType(arr, type) {
    return arr.filter(function(r) { return r[colIdx['Event Type']] === type; });
  }

  var insights = [];
  var insightNum = 1;

  function addInsight(cat, obs, met, cur, prev, act, prio, conf) {
    var numStr = ('00' + insightNum++).slice(-3);
    insights.push([
      'GNI-' + Utilities.formatDate(now, TIMEZONE, 'yyyyMMdd') + '-' + numStr,
      formatTimestamp(now),
      cat, obs, met, String(cur), String(prev), act, prio, conf, dataLabel
    ]);
  }

  // 1. Page views
  var pvCurrent = filterType(currentRows, 'page_view').length;
  var pvPrev    = filterType(prevRows,    'page_view').length;
  addInsight(
    'Page Views',
    'Total page views in the last 7 days: ' + pvCurrent + (pvPrev > 0 ? ' (vs. ' + pvPrev + ' previous week, ' + pctChange(pvCurrent, pvPrev) + ')' : ''),
    pvCurrent + ' page views',
    pvCurrent, pvPrev,
    pvCurrent < pvPrev ? 'Publish a case study or promote technical content to drive fresh audience.' : 'Traffic is stable or growing — continue current content strategy.',
    'Informational', totalEvents >= 50 ? 'High' : totalEvents >= 10 ? 'Medium' : 'Low (preliminary)'
  );

  // 2. Top pages
  var pageMap  = countBy(filterType(allRows, 'page_view'), 'Page URL');
  var topPages = topN(pageMap, 5);
  addInsight('Top Pages', 'Most visited pages: ' + (topPages || 'Insufficient data'), 'By page view count', topPages || 'None', 'N/A', 'Ensure top pages feature high-converting CTA modules.', 'Informational', totalEvents >= 20 ? 'Medium' : 'Low (preliminary)');

  // 3. Traffic sources
  var srcMap     = countBy(allRows, 'Referrer Source');
  var topSources = topN(srcMap, 5);
  var directCount = srcMap['Direct'] || 0;
  addInsight('Traffic Sources', 'Primary traffic sources: ' + (topSources || 'Insufficient data'), 'By session count', topSources || 'None', 'N/A', directCount > (allRows.length * 0.6) ? 'High direct proportion — invest in technical SEO and LinkedIn outreach.' : 'Good referral diversity — continue monitoring.', 'Strategic', totalEvents >= 30 ? 'Medium' : 'Low (preliminary)');

  // 4. Device distribution
  var devMap  = countBy(allRows, 'Device Category');
  var mobile  = devMap['Mobile'] || 0;
  var desktop = devMap['Desktop'] || 0;
  var totalDev = (mobile + desktop + (devMap['Tablet'] || 0)) || 1;
  var mobilePct = Math.round(mobile / totalDev * 100);
  addInsight('Device Distribution', 'Device split — Desktop: ' + Math.round(desktop / totalDev * 100) + '%, Mobile: ' + mobilePct + '%', mobile + ' mobile / ' + desktop + ' desktop', 'Mobile: ' + mobilePct + '%', 'N/A', mobilePct > 40 ? 'High mobile audience — audit mobile consultation form speed.' : 'Primarily desktop audience — maintain comprehensive spec sheets.', mobilePct > 40 ? 'High' : 'Informational', totalEvents >= 20 ? 'Medium' : 'Low (preliminary)');

  // 5. CTA engagement
  var ctaClicks = filterType(allRows, 'cta_click').length + filterType(allRows, 'nav_click').length + filterType(allRows, 'whatsapp_cta_click').length;
  var waClicks = filterType(allRows, 'whatsapp_cta_click').length;
  var conversions = filterType(allRows, 'form_submission_success').length;
  var pvAll = filterType(allRows, 'page_view').length || 1;
  var convRate = (conversions / pvAll * 100).toFixed(1);
  addInsight('CTA Engagement', 'CTA clicks: ' + ctaClicks + '. WhatsApp clicks: ' + waClicks + '. Form conversions: ' + conversions + ' (' + convRate + '% conversion rate)', ctaClicks + ' CTAs / ' + conversions + ' conversions', 'Conv rate: ' + convRate + '%', 'N/A', parseFloat(convRate) < 2.0 ? 'Conversion rate is below 2%. Test stronger value propositions on contact forms.' : 'Healthy conversion rate. Expand A/B copy tests.', parseFloat(convRate) < 2.0 ? 'High' : 'Informational', totalEvents >= 20 ? 'Medium' : 'Low (preliminary)');

  // 6. Form funnel
  var longStart  = filterType(allRows, 'form_start').filter(function(r) { return r[colIdx['Form Type']] === 'Long Form'; }).length;
  var shortStart = filterType(allRows, 'form_start').filter(function(r) { return r[colIdx['Form Type']] === 'Short Form'; }).length;
  var longConv   = filterType(allRows, 'form_submission_success').filter(function(r) { return r[colIdx['Form Type']] === 'Long Form'; }).length;
  var shortConv  = filterType(allRows, 'form_submission_success').filter(function(r) { return r[colIdx['Form Type']] === 'Short Form'; }).length;

  if (longStart > 0 || shortStart > 0) {
    var longRate  = longStart > 0 ? (longConv / longStart * 100).toFixed(1) : '0.0';
    var shortRate = shortStart > 0 ? (shortConv / shortStart * 100).toFixed(1) : '0.0';
    addInsight('Form Funnel', 'Long Form: ' + longStart + ' starts → ' + longConv + ' submissions (' + longRate + '%). Short Form: ' + shortStart + ' starts → ' + shortConv + ' submissions (' + shortRate + '%).', (longStart + shortStart) + ' starts → ' + conversions + ' submissions', 'Long: ' + longRate + '%, Short: ' + shortRate + '%', 'N/A', longStart > longConv * 3 ? 'High long form abandonment — verify field lengths and optional indicators.' : 'Form conversion ratios are performing solidly.', longStart > longConv * 3 ? 'High' : 'Informational', totalEvents >= 10 ? 'Medium' : 'Low (preliminary)');
  }

  // 7. Location engagement
  var locRows = filterType(allRows, 'page_view').filter(function(r) { return String(r[colIdx['Page URL']] || '').includes('/locations/'); });
  if (locRows.length > 0) {
    var locMap = countBy(locRows, 'Page URL');
    addInsight('Location Engagement', 'Location visits: ' + locRows.length + '. Top location: ' + topN(locMap, 1), locRows.length + ' location views', topN(locMap, 3), 'N/A', 'Feature high-demand regional hub on hero slider and homepage.', 'Strategic', totalEvents >= 20 ? 'Medium' : 'Low (preliminary)');
  }

  // Write insights
  var lastRow = iSheet.getLastRow();
  if (lastRow > 1) iSheet.getRange(2, 1, lastRow - 1, COLS_INTEL.length).clearContent();
  if (insights.length > 0) iSheet.getRange(2, 1, insights.length, COLS_INTEL.length).setValues(insights);
}

// ============================================================================
// 7. HELPERS, DASHBOARD BUILDER & UTILITIES
// ============================================================================

function buildAnalyticsSummary(tSheet, sSheet, iSheet) {
  var tData = tSheet.getDataRange().getValues();
  var sData = sSheet.getDataRange().getValues();
  var iData = iSheet.getDataRange().getValues();

  var tHeaders = tData.length > 0 ? tData[0] : [];
  var sHeaders = sData.length > 0 ? sData[0] : [];
  var iHeaders = iData.length > 0 ? iData[0] : [];

  var tCol = {};
  tHeaders.forEach(function(h, idx) { tCol[h] = idx; });
  var sCol = {};
  sHeaders.forEach(function(h, idx) { sCol[h] = idx; });

  var tRows = tData.slice(1);
  var sRows = sData.slice(1);

  var totalEvents = tRows.length;
  var pageViews = 0, ctaClicks = 0, waClicks = 0, conversions = 0;
  var pageCounts = {}, sourceCounts = {}, deviceCounts = {}, dailyCounts = {};

  tRows.forEach(function(r) {
    var type = r[tCol['Event Type']];
    var page = r[tCol['Page URL']] || '/';
    var src = r[tCol['Referrer Source']] || 'Direct';
    var dev = r[tCol['Device Category']] || 'Desktop';
    var tsStr = r[tCol['Timestamp']] || '';
    var dateKey = tsStr.length >= 10 ? tsStr.substring(0, 10) : 'Today';

    dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;
    if (type === 'page_view') { pageViews++; pageCounts[page] = (pageCounts[page] || 0) + 1; }
    if (['cta_click', 'nav_click', 'whatsapp_cta_click', 'slider_interaction'].indexOf(type) > -1) ctaClicks++;
    if (type === 'whatsapp_cta_click') waClicks++;
    if (type === 'form_submission_success') conversions++;
    sourceCounts[src] = (sourceCounts[src] || 0) + 1;
    deviceCounts[dev] = (deviceCounts[dev] || 0) + 1;
  });

  var uniqueSessions = sRows.length;
  var convertedSessions = 0, totalDurationS = 0, durationsCount = 0;
  var navigationPaths = {};

  sRows.forEach(function(r) {
    if (r[sCol['Conversion Status']] === 'Converted' || r[sCol['Form Submitted Successfully']] === 'Yes') convertedSessions++;
    var durStr = String(r[sCol['Session Duration']] || '0').replace(/[^0-9]/g, '');
    var dur = parseInt(durStr, 10);
    if (!isNaN(dur) && dur > 0) { totalDurationS += dur; durationsCount++; }
    var path = r[sCol['Pages Viewed']];
    if (path) navigationPaths[path] = (navigationPaths[path] || 0) + 1;
  });

  var convRate = uniqueSessions > 0 ? ((convertedSessions / uniqueSessions) * 100).toFixed(1) : '0.0';
  var avgDurS = durationsCount > 0 ? Math.round(totalDurationS / durationsCount) : 0;
  var avgDurMins = Math.floor(avgDurS / 60);
  var avgDurSecs = avgDurS % 60;
  var avgDurFormatted = (avgDurMins > 0 ? avgDurMins + 'm ' : '') + avgDurSecs + 's';

  var topPages = Object.keys(pageCounts).map(function(url) {
    return { url: url, views: pageCounts[url] };
  }).sort(function(a, b) { return b.views - a.views; }).slice(0, 8);

  var topSources = Object.keys(sourceCounts).map(function(s) {
    return { source: s, count: sourceCounts[s] };
  }).sort(function(a, b) { return b.count - a.count; }).slice(0, 6);

  var insightsList = [];
  if (iData.length > 1) {
    for (var i = 1; i < iData.length; i++) {
      var item = {};
      iHeaders.forEach(function(h, idx) { item[h] = iData[i][idx]; });
      insightsList.push(item);
    }
  }

  return {
    kpis: {
      pageViews: pageViews,
      uniqueSessions: uniqueSessions,
      ctaClicks: ctaClicks,
      whatsappClicks: waClicks,
      conversions: conversions,
      convertedSessions: convertedSessions,
      conversionRate: convRate,
      avgSessionDuration: avgDurFormatted,
      avgDurationSeconds: avgDurS,
      totalEvents: totalEvents
    },
    topPages: topPages,
    sources: topSources,
    devices: deviceCounts,
    dailyTrends: dailyCounts,
    navigationPaths: Object.keys(navigationPaths).map(function(p) {
      return { path: p, count: navigationPaths[p] };
    }).sort(function(a, b) { return b.count - a.count; }).slice(0, 5),
    insights: insightsList
  };
}

function getSpreadsheet() {
  if (SPREADSHEET_ID && SPREADSHEET_ID !== 'ACTIVE') {
    try {
      return SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (e) {
      return SpreadsheetApp.getActiveSpreadsheet();
    }
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getOrInitSheet(ss, name, columns, headerColor) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(columns);
    var hRange = sheet.getRange(1, 1, 1, columns.length);
    hRange.setFontWeight('bold');
    hRange.setBackground(headerColor || '#062317');
    hRange.setFontColor('#FFFFFF');
    hRange.setWrap(false);
    sheet.setFrozenRows(1);
    for (var i = 1; i <= columns.length; i++) {
      sheet.setColumnWidth(i, 160);
    }
  }
  return sheet;
}

function checkDuplicateSubmission(sheet, name, contact, now) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;
  var checkRangeCount = Math.min(25, lastRow - 1);
  var startRow = lastRow - checkRangeCount + 1;
  var rows = sheet.getRange(startRow, 1, checkRangeCount, 7).getValues();

  var nameLower = (name || '').toLowerCase().trim();
  var contactLower = (contact || '').toLowerCase().trim();
  var tenMinutesMs = 10 * 60 * 1000;

  for (var i = rows.length - 1; i >= 0; i--) {
    var r = rows[i];
    var rId = r[0], rDateStr = r[1], rName = (r[3] || '').toLowerCase().trim(), rEmail = (r[4] || '').toLowerCase().trim(), rPhone = (r[6] || '').toLowerCase().trim();
    var matchName = nameLower && (rName === nameLower);
    var matchContact = (contactLower && (rEmail === contactLower || rPhone === contactLower));
    if (matchName || matchContact) {
      var rTime = parseDateToMs(rDateStr);
      if (rTime && (now.getTime() - rTime) < tenMinutesMs) {
        return { existingId: rId, submittedAt: rDateStr };
      }
    }
  }
  return null;
}

function generateSequentialEnquiryId(sheet, date) {
  var dateStr = Utilities.formatDate(date, TIMEZONE, 'yyyyMMdd');
  var prefix = 'GN-' + dateStr + '-';
  var lastRow = sheet.getLastRow();
  var maxSeq = 0;

  if (lastRow > 1) {
    var checkCount = Math.min(100, lastRow - 1);
    var idColValues = sheet.getRange(lastRow - checkCount + 1, 1, checkCount, 1).getValues();
    for (var i = 0; i < idColValues.length; i++) {
      var val = String(idColValues[i][0] || '').trim();
      if (val.indexOf(prefix) === 0) {
        var numPart = parseInt(val.substring(prefix.length), 10);
        if (!isNaN(numPart) && numPart > maxSeq) maxSeq = numPart;
      }
    }
  }
  var nextSeq = maxSeq + 1;
  var seqStr = ('0000' + nextSeq).slice(-4);
  return prefix + seqStr;
}

function formatTimestamp(date) {
  return Utilities.formatDate(date, TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
}

function parseDateToMs(val) {
  if (!val) return 0;
  if (val instanceof Date) return val.getTime();
  var str = String(val).trim();
  if (!str) return 0;
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(str)) {
    str = str.replace(' ', 'T') + '+05:30';
  }
  var d = new Date(str);
  var t = d.getTime();
  return isNaN(t) ? 0 : t;
}

function pctChange(cur, prev) {
  if (!prev) return '+∞%';
  var pct = Math.round((cur - prev) / prev * 100);
  return (pct >= 0 ? '+' : '') + pct + '%';
}

function sanitize(val, maxLen) {
  if (val === null || val === undefined) return '';
  var str = String(val).trim();
  if (!str) return '';
  var limit = (typeof maxLen === 'number' && maxLen > 0) ? maxLen : 4000;
  if (str.length > limit) str = str.substring(0, limit);
  var first = str.charAt(0);
  if (first === '=' || first === '+' || first === '-' || first === '@' || first === '\t' || first === '\r') {
    return "'" + str;
  }
  return str;
}

function sanitizeError(msg) {
  if (!msg) return 'Unknown error';
  return String(msg).replace(/(key|token|id)=[^\s&]+/gi, '$1=***');
}

function parsePostData(e) {
  if (!e) return null;
  try {
    if (e.postData && e.postData.contents) return JSON.parse(e.postData.contents);
    if (e.parameter && Object.keys(e.parameter).length) return e.parameter;
  } catch (err) {}
  return null;
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================================
// 8. ONE-CLICK INITIALIZATION TRIGGER
// ============================================================================

function initAllSheets() {
  var ss = getSpreadsheet();
  getOrInitSheet(ss, SHEET_ENQUIRY,       COLUMNS_ENQUIRY,    '#062317');
  getOrInitSheet(ss, SHEET_TRAFFIC,       COLS_TRAFFIC,       '#0E3A2B');
  getOrInitSheet(ss, SHEET_INTEL,         COLS_INTEL,         '#1A5C3A');
  getOrInitSheet(ss, SHEET_SESSION,       COLS_SESSION,       '#0D4D2C');
  getOrInitSheet(ss, SHEET_JIRA_TRACKING, COLS_JIRA_TRACKING, '#0D3B66');
  Logger.log('GreenNext: All 5 worksheets initialized with standardized headers.');
}

// ============================================================================
// 9. JIRA CLOUD INTEGRATION (PARENT TASK & SUBTASKS)
// ============================================================================

/**
 * Automatically creates Jira Parent Task & Subtasks from Google Apps Script.
 * Reads credentials securely from Script Properties:
 * - JIRA_BASE_URL (default: 'https://trustworkz.atlassian.net')
 * - JIRA_EMAIL
 * - JIRA_API_TOKEN
 * - JIRA_PROJECT_KEY (default: 'DI')
 * - JIRA_ASSIGNEE_ACCOUNT_ID
 * - JIRA_ACTIVE_SPRINT_ID
 */
function createJiraLeadTaskFromGas(enquiryId, formType, fullName, email, company, phone, location, industry, interest, requirements, timeline, contactMethod, message) {
  var props = null;
  try {
    if (typeof PropertiesService !== 'undefined' && PropertiesService.getScriptProperties) {
      props = PropertiesService.getScriptProperties();
    }
  } catch (pErr) {}

  if (!props) return { configured: false, note: 'PropertiesService unavailable' };

  var baseUrl = (props.getProperty('JIRA_BASE_URL') || 'https://trustworkz.atlassian.net').replace(/\/+$/, '');
  var jiraEmail = props.getProperty('JIRA_EMAIL');
  var apiToken = props.getProperty('JIRA_API_TOKEN');
  var projectKey = props.getProperty('JIRA_PROJECT_KEY') || 'DI';
  var assigneeId = props.getProperty('JIRA_ASSIGNEE_ACCOUNT_ID') || '';
  var sprintIdStr = props.getProperty('JIRA_ACTIVE_SPRINT_ID') || '';

  if (!jiraEmail || !apiToken) {
    return { configured: false, note: 'Jira credentials not set in Script Properties' };
  }

  var auth = 'Basic ' + Utilities.base64Encode(jiraEmail + ':' + apiToken);

  // 1. Idempotency search
  try {
    var searchPayload = {
      jql: 'project = "' + projectKey + '" AND text ~ "' + enquiryId + '"',
      fields: ['summary', 'status', 'subtasks'],
      maxResults: 1
    };
    var searchRes = UrlFetchApp.fetch(baseUrl + '/rest/api/3/search/jql', {
      method: 'post',
      contentType: 'application/json',
      headers: { 'Authorization': auth, 'Accept': 'application/json' },
      payload: JSON.stringify(searchPayload),
      muteHttpExceptions: true
    });
    if (searchRes.getResponseCode() === 200) {
      var sData = JSON.parse(searchRes.getContentText());
      if (sData.issues && sData.issues.length > 0) {
        return {
          success: true,
          duplicate: true,
          parentKey: sData.issues[0].key
        };
      }
    }
  } catch (searchErr) {}

  // 2. Build parent task
  var companyClean = (company && company !== 'Direct Client' && company !== '—') ? company : enquiryId;
  var parentSummary = 'GreenNext Lead — ' + companyClean;

  var descAdf = {
    type: 'doc',
    version: 1,
    content: [
      {
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: 'GreenNext Enterprise Lead Capture' }]
      },
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'Enquiry Reference: ' + enquiryId },
          { type: 'hardBreak' },
          { type: 'text', text: 'Form Type: ' + formType },
          { type: 'hardBreak' },
          { type: 'text', text: 'Google Sheets Reference: Workbook 14ciH1aNzWIJHJkQ5rYCdrEhci3KYMjrTSeY3QMaerVI (Enquiries & Jira Lead Tracking)' }
        ]
      },
      {
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: 'Contact Details' }]
      },
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'Contact Name: ' + fullName },
          { type: 'hardBreak' },
          { type: 'text', text: 'Company: ' + company },
          { type: 'hardBreak' },
          { type: 'text', text: 'Email: ' + email },
          { type: 'hardBreak' },
          { type: 'text', text: 'Phone: ' + phone },
          { type: 'hardBreak' },
          { type: 'text', text: 'Location: ' + location },
          { type: 'hardBreak' },
          { type: 'text', text: 'Industry: ' + industry },
          { type: 'hardBreak' },
          { type: 'text', text: 'Area of Interest: ' + interest },
          { type: 'hardBreak' },
          { type: 'text', text: 'Expected Timeline: ' + timeline },
          { type: 'hardBreak' },
          { type: 'text', text: 'Preferred Contact: ' + contactMethod }
        ]
      },
      {
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: 'Requirements & Message' }]
      },
      {
        type: 'paragraph',
        content: [{ type: 'text', text: requirements || message || '—' }]
      }
    ]
  };

  var parentFields = {
    project: { key: projectKey },
    summary: parentSummary,
    description: descAdf,
    issuetype: { name: 'Task' }
  };
  if (assigneeId) {
    parentFields.assignee = { accountId: assigneeId };
  }

  var parentRes = UrlFetchApp.fetch(baseUrl + '/rest/api/3/issue', {
    method: 'post',
    contentType: 'application/json',
    headers: { 'Authorization': auth, 'Accept': 'application/json' },
    payload: JSON.stringify({ fields: parentFields }),
    muteHttpExceptions: true
  });

  if (parentRes.getResponseCode() < 200 || parentRes.getResponseCode() >= 300) {
    return {
      success: false,
      status: 'jira_failed',
      code: parentRes.getResponseCode(),
      error: parentRes.getContentText().slice(0, 300)
    };
  }

  var parentData = JSON.parse(parentRes.getContentText());
  var parentKey = parentData.key;
  var parentUrl = baseUrl + '/browse/' + parentKey;

  // 3. Add to active sprint if configured
  if (sprintIdStr && parentKey) {
    try {
      UrlFetchApp.fetch(baseUrl + '/rest/agile/1.0/sprint/' + sprintIdStr + '/issue', {
        method: 'post',
        contentType: 'application/json',
        headers: { 'Authorization': auth, 'Accept': 'application/json' },
        payload: JSON.stringify({ issues: [parentKey] }),
        muteHttpExceptions: true
      });
    } catch (spErr) {}
  }

  // 4. Create 7 Required Lead Workflow Subtasks
  var LEAD_WORKFLOW = [
    { stage: 'initial_contact',        name: 'Initial Contact — GreenNext Lead',       dueHours: 24, priority: 'High',   offsetHours: 24 },
    { stage: 'follow_up_1',            name: 'Follow-up 1 — GreenNext Lead',           dueHours: 48, priority: 'High',   offsetHours: 48 },
    { stage: 'requirements_gathering', name: 'Requirements Gathering — GreenNext Lead',dueHours: 48, priority: 'Medium', offsetHours: 48 },
    { stage: 'site_visit',             name: 'Data Center Consultation / Site Visit',  dueHours: 48, priority: 'Medium', offsetHours: 48 },
    { stage: 'proposal_quote',         name: 'Proposal / Quote Submission',            dueHours: 24, priority: 'Medium', offsetHours: 72 },
    { stage: 'lead_closure',           name: 'Lead Closure',                           dueHours: 24, priority: 'Medium', offsetHours: 96 },
    { stage: 'operations_handover',    name: 'Handover to Operations',                 dueHours: 24, priority: 'Medium', offsetHours: 120 }
  ];

  var subtaskKeys = [];
  var subtaskMap = {};
  var nowMs = new Date().getTime();

  for (var i = 0; i < LEAD_WORKFLOW.length; i++) {
    var spec = LEAD_WORKFLOW[i];
    var dueDateObj = new Date(nowMs + (spec.offsetHours || 24) * 3600 * 1000);
    var dueDateStr = Utilities.formatDate(dueDateObj, TIMEZONE, 'yyyy-MM-dd');

    var stDescAdf = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Stage: ' + spec.name },
            { type: 'hardBreak' },
            { type: 'text', text: 'Parent Lead: ' + enquiryId + ' (' + fullName + ' - ' + company + ')' },
            { type: 'hardBreak' },
            { type: 'text', text: 'Configured SLA: ' + spec.dueHours + ' hours from stage trigger' },
            { type: 'hardBreak' },
            { type: 'text', text: 'Target Due Date: ' + dueDateStr }
          ]
        }
      ]
    };

    var stFields = {
      project: { key: projectKey },
      parent: { key: parentKey },
      summary: spec.name,
      description: stDescAdf,
      issuetype: { name: 'Subtask' },
      priority: { name: spec.priority },
      duedate: dueDateStr
    };
    if (assigneeId) {
      stFields.assignee = { accountId: assigneeId };
    }

    try {
      var stRes = UrlFetchApp.fetch(baseUrl + '/rest/api/3/issue', {
        method: 'post',
        contentType: 'application/json',
        headers: { 'Authorization': auth, 'Accept': 'application/json' },
        payload: JSON.stringify({ fields: stFields }),
        muteHttpExceptions: true
      });

      // Graceful fallback if custom screen does not accept priority or duedate
      if (stRes.getResponseCode() === 400) {
        delete stFields.priority;
        delete stFields.duedate;
        stRes = UrlFetchApp.fetch(baseUrl + '/rest/api/3/issue', {
          method: 'post',
          contentType: 'application/json',
          headers: { 'Authorization': auth, 'Accept': 'application/json' },
          payload: JSON.stringify({ fields: stFields }),
          muteHttpExceptions: true
        });
      }

      if (stRes.getResponseCode() >= 200 && stRes.getResponseCode() < 300) {
        var stData = JSON.parse(stRes.getContentText());
        subtaskKeys.push(stData.key);
        subtaskMap[spec.stage] = stData.key;
      }
    } catch (stErr) {}
  }

  return {
    success: true,
    status: 'jira_created',
    parentKey: parentKey,
    parentUrl: parentUrl,
    subtaskKeys: subtaskKeys,
    subtaskMap: subtaskMap
  };
}


// ============================================================================
// 10. AUTOMATED LEAD NOTIFICATION EMAIL ENGINE
// ============================================================================

/**
 * Sends a responsive, dark navy HTML lead notification email to the configured administrator.
 * Uses Google Apps Script MailApp / GmailApp with fallback to Script Properties NOTIFICATION_EMAIL.
 */
function sendLeadNotificationEmailFromGas(
  enquiryId, formType, fullName, email, company, phone,
  location, industry, interest, requirements, timeline,
  contactMethod, pageUrl, trafficSource, jiraResult, timestampStr
) {
  // Provide safe defaults so clicking 'Run' directly in the Apps Script editor works smoothly
  enquiryId     = enquiryId || ('GN-' + Date.now().toString(36).toUpperCase());
  formType      = formType || 'Quick Enquiry';
  fullName      = fullName || 'Enterprise Lead';
  email         = email || 'lead@example.com';
  company       = company || 'GreenNext Partner';
  phone         = phone || '+91 98765 43210';
  location      = location || 'Bangalore, India';
  industry      = industry || 'AI & Cloud Infrastructure';
  interest      = interest || 'AI Infrastructure';
  requirements  = requirements || 'Automated lead notification test.';
  timeline      = timeline || 'Immediate';
  contactMethod = contactMethod || 'Email';
  pageUrl       = pageUrl || '/';
  trafficSource = trafficSource || 'Direct';
  timestampStr  = timestampStr || formatTimestamp(new Date());

  var props = PropertiesService.getScriptProperties();
  var adminEmail = props.getProperty('NOTIFICATION_EMAIL') || props.getProperty('ADMIN_EMAIL') || NOTIFICATION_EMAIL || 'ruba.int2027g3@gmail.com';

  if (!adminEmail || adminEmail.indexOf('@') === -1) {
    return {
      success: false,
      status: 'disabled',
      note: 'NOTIFICATION_EMAIL not configured in Script Properties'
    };
  }

  var subject = '[GreenNext] New Lead Received — ' + (fullName || enquiryId);
  var parentKey = (jiraResult && jiraResult.parentKey) || '—';
  var parentUrl = (jiraResult && jiraResult.parentUrl) || '';
  var isQuick = String(formType).toLowerCase().indexOf('quick') > -1 || String(formType).toLowerCase().indexOf('short') > -1;
  var badgeColor = isQuick ? '#10B981' : '#8B5CF6';
  var badgeBg = isQuick ? 'rgba(16, 185, 129, 0.15)' : 'rgba(139, 92, 246, 0.15)';

  var replyMailto = email ? ('mailto:' + encodeURIComponent(email) + '?subject=' + encodeURIComponent('GreenNext Enquiry — ' + enquiryId) + '&body=' + encodeURIComponent('Hello ' + (fullName || '') + ',\n\nThank you for reaching out to GreenNext regarding our AI Data Center and digital infrastructure solutions.\n\nBest regards,\nGreenNext Team')) : '';
  var waUrl = 'https://wa.me/919876543210?text=' + encodeURIComponent('Hello ' + (fullName || 'there') + ', thank you for contacting GreenNext regarding ' + (interest || 'Digital Infrastructure') + '. Our team would be happy to discuss your requirements.');
  var sheetsUrl = 'https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID + '/edit';

  var htmlBody = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>' +
    '<body style="margin: 0; padding: 24px 0; background-color: #070B14; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif;">' +
    '<center>' +
    '<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; margin: 0 auto; background-color: #0F172A; border-radius: 16px; overflow: hidden; border: 1px solid #1E293B;">' +
    '<tr><td style="padding: 36px 32px 30px; background: linear-gradient(135deg, #4338CA 0%, #3B82F6 50%, #06B6D4 100%); text-align: left;">' +
    '<div style="font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #E0E7FF; margin-bottom: 8px;">GREENNEXT DIGITAL INFRASTRUCTURE</div>' +
    '<h1 style="margin: 0 0 10px 0; font-size: 26px; font-weight: 800; color: #FFFFFF;">New Lead Received</h1>' +
    '<p style="margin: 0; font-size: 14px; color: #DBEAFE;">A new enterprise prospect submitted an enquiry through the GreenNext AI Data Center portal.</p>' +
    '</td></tr>' +
    '<tr><td style="background-color: #131D33; padding: 16px 32px; border-bottom: 1px solid #1E293B;">' +
    '<table width="100%"><tr>' +
    '<td><span style="display: inline-block; padding: 4px 12px; font-size: 12px; font-weight: 700; text-transform: uppercase; border-radius: 20px; background-color: ' + badgeBg + '; color: ' + badgeColor + '; border: 1px solid ' + badgeColor + ';">' + formType + '</span>' +
    '<span style="color: #94A3B8; font-size: 13px; margin-left: 12px;">ID: <strong style="color: #F8FAFC;">' + enquiryId + '</strong></span></td>' +
    '<td style="text-align: right; font-size: 12px; color: #64748B;">' + timestampStr + '</td>' +
    '</tr></table>' +
    '</td></tr>' +
    '<tr><td style="padding: 28px 32px;">' +
    '<h2 style="margin: 0 0 12px 0; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #818CF8; border-bottom: 1px solid #1E293B; padding-bottom: 8px;">Contact Information</h2>' +
    '<table width="100%" cellpadding="6" cellspacing="0" style="margin-bottom: 24px;">' +
    '<tr><td width="38%" style="font-size: 13px; color: #94A3B8;">Full Name:</td><td style="font-size: 14px; font-weight: 600; color: #F1F5F9;">' + fullName + '</td></tr>' +
    (email ? '<tr><td style="font-size: 13px; color: #94A3B8;">Business Email:</td><td style="font-size: 14px; color: #38BDF8;"><a href="mailto:' + email + '" style="color: #38BDF8; text-decoration: none;">' + email + '</a></td></tr>' : '') +
    (phone ? '<tr><td style="font-size: 13px; color: #94A3B8;">Phone Number:</td><td style="font-size: 14px; color: #F1F5F9;">' + phone + '</td></tr>' : '') +
    (company && company !== '—' ? '<tr><td style="font-size: 13px; color: #94A3B8;">Company Name:</td><td style="font-size: 14px; color: #F1F5F9;">' + company + '</td></tr>' : '') +
    (location && location !== '—' ? '<tr><td style="font-size: 13px; color: #94A3B8;">Location:</td><td style="font-size: 14px; color: #F1F5F9;">' + location + '</td></tr>' : '') +
    '</table>' +
    '<h2 style="margin: 0 0 12px 0; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #818CF8; border-bottom: 1px solid #1E293B; padding-bottom: 8px;">Requirements &amp; Business Context</h2>' +
    '<table width="100%" cellpadding="6" cellspacing="0" style="margin-bottom: 24px;">' +
    (interest && interest !== '—' ? '<tr><td width="38%" style="font-size: 13px; color: #94A3B8;">Area of Interest:</td><td style="font-size: 14px; font-weight: 600; color: #A7F3D0;">' + interest + '</td></tr>' : '') +
    (industry && industry !== '—' ? '<tr><td style="font-size: 13px; color: #94A3B8;">Industry Vertical:</td><td style="font-size: 14px; color: #F1F5F9;">' + industry + '</td></tr>' : '') +
    (timeline && timeline !== '—' ? '<tr><td style="font-size: 13px; color: #94A3B8;">Expected Timeline:</td><td style="font-size: 14px; color: #F1F5F9;">' + timeline + '</td></tr>' : '') +
    (requirements && requirements !== '—' ? '<tr><td colspan="2"><div style="font-size: 12px; color: #94A3B8; text-transform: uppercase; margin-bottom: 6px;">Requirements / Message:</div><div style="background-color: #070B14; border: 1px solid #1E293B; border-radius: 8px; padding: 12px 14px; font-size: 13px; color: #E2E8F0;">' + requirements + '</div></td></tr>' : '') +
    '</table>' +
    '<h2 style="margin: 0 0 12px 0; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #818CF8; border-bottom: 1px solid #1E293B; padding-bottom: 8px;">Submission Metadata</h2>' +
    '<table width="100%" cellpadding="4" cellspacing="0" style="margin-bottom: 24px;">' +
    '<tr><td width="38%" style="font-size: 12px; color: #64748B;">Enquiry ID:</td><td style="font-size: 13px; color: #E2E8F0; font-family: monospace;">' + enquiryId + '</td></tr>' +
    '<tr><td style="font-size: 12px; color: #64748B;">Source Page:</td><td style="font-size: 13px; color: #E2E8F0;">' + pageUrl + '</td></tr>' +
    '<tr><td style="font-size: 12px; color: #64748B;">Traffic Source:</td><td style="font-size: 13px; color: #E2E8F0;">' + trafficSource + '</td></tr>' +
    '<tr><td style="font-size: 12px; color: #64748B;">Google Sheets:</td><td style="font-size: 13px; color: #34D399;"><a href="' + sheetsUrl + '" style="color: #34D399; text-decoration: none;">Synchronized &rarr;</a></td></tr>' +
    (parentKey && parentKey !== '—' ? '<tr><td style="font-size: 12px; color: #64748B;">Jira Lead Issue:</td><td style="font-size: 13px; color: #818CF8;"><a href="' + parentUrl + '" style="color: #818CF8; font-weight: 700; text-decoration: none;">' + parentKey + ' &rarr;</a></td></tr>' : '') +
    '</table>' +
    '<div style="background-color: #070B14; border: 1px solid #1E293B; border-radius: 12px; padding: 20px;">' +
    '<div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #CBD5E1; margin-bottom: 14px;">Next Steps &amp; Direct Engagement</div>' +
    '<table border="0" cellpadding="0" cellspacing="0"><tr>' +
    (replyMailto ? '<td style="padding-right: 12px; padding-bottom: 8px;"><a href="' + replyMailto + '" style="display: inline-block; background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%); color: #FFFFFF; font-size: 14px; font-weight: 700; text-decoration: none; padding: 12px 22px; border-radius: 8px; border: 1px solid #818CF8;">✉️ Reply to Lead</a></td>' : '') +
    '<td style="padding-right: 12px; padding-bottom: 8px;"><a href="' + waUrl + '" style="display: inline-block; background-color: #10B981; color: #FFFFFF; font-size: 14px; font-weight: 700; text-decoration: none; padding: 12px 22px; border-radius: 8px; border: 1px solid #34D399;">💬 Open WhatsApp</a></td>' +
    (parentUrl ? '<td style="padding-bottom: 8px;"><a href="' + parentUrl + '" style="display: inline-block; background-color: #1E293B; color: #94A3B8; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 18px; border-radius: 8px; border: 1px solid #334155;">📌 Jira Lead</a></td>' : '') +
    '</tr></table></div>' +
    '</td></tr>' +
    '<tr><td style="padding: 24px 32px; background-color: #070B14; border-top: 1px solid #1E293B; text-align: center;">' +
    '<p style="margin: 0 0 6px 0; font-size: 12px; color: #64748B;">Automated enterprise notification by GreenNext Lead Management Engine.</p>' +
    '<p style="margin: 0; font-size: 11px; color: #475569;">&copy; 2026 GreenNext Digital Infrastructure. Confidential.</p>' +
    '</td></tr>' +
    '</table></center></body></html>';

  var plainBody = '[GreenNext] New Lead Received — ' + fullName + ' (' + enquiryId + ')\n' +
    'Form Type: ' + formType + '\n' +
    'Submitted At: ' + timestampStr + '\n\n' +
    'CONTACT INFORMATION\n' +
    'Full Name: ' + fullName + '\n' +
    'Email: ' + (email || '—') + '\n' +
    'Phone: ' + (phone || '—') + '\n' +
    'Company: ' + company + '\n\n' +
    'REQUIREMENTS & CONTEXT\n' +
    'Area of Interest: ' + interest + '\n' +
    'Requirements: ' + requirements + '\n\n' +
    'SUBMISSION METADATA\n' +
    'Enquiry ID: ' + enquiryId + '\n' +
    'Jira Key: ' + parentKey + '\n\n' +
    'Direct Reply: ' + replyMailto + '\n' +
    'WhatsApp Chat: ' + waUrl;

  try {
    MailApp.sendEmail({
      to: adminEmail,
      subject: subject,
      htmlBody: htmlBody,
      body: plainBody
    });

    return {
      success: true,
      status: 'sent',
      recipient: adminEmail,
      timestamp: timestampStr
    };
  } catch (mailErr) {
    Logger.log('MailApp.sendEmail failed: ' + mailErr.message);
    return {
      success: false,
      status: 'failed',
      recipient: adminEmail,
      error: mailErr.message,
      timestamp: timestampStr
    };
  }
}

/**
 * Run this test directly in the Google Apps Script Editor by clicking 'Run'
 * to send a real lead notification email to ruba.int2027g3@gmail.com and authorize MailApp.
 */
function testSendLeadNotificationEmail() {
  var result = sendLeadNotificationEmailFromGas(
    'GN-TEST-0001',
    'Quick Enquiry',
    'Ruba Dharshini M',
    'ruba.int2027g3@gmail.com',
    'GreenNext Digital Infrastructure',
    '+919876543210',
    'Bangalore, India',
    'AI Data Center',
    'AI Infrastructure & High-Density Racks',
    'This is a verified test email sent directly from Google Apps Script editor.',
    'Immediate',
    'Email',
    'https://greenextruba.vercel.app/',
    'Direct',
    { parentKey: 'DI-322', parentUrl: 'https://trustworkz.atlassian.net/browse/DI-322' },
    formatTimestamp(new Date())
  );
  Logger.log('Test Email Result: ' + JSON.stringify(result));
  return result;
}

/**
 * Handles explicit action 'send_lead_email' posted from Node.js /api/enquiry or serverless route
 */
function handleSendLeadEmailAction(postData) {
  try {
    var adminEmail = (postData.adminEmail || NOTIFICATION_EMAIL || 'ruba.int2027g3@gmail.com').trim();
    var subject = postData.subject || '[GreenNext] New Lead Notification';
    var html = postData.html || '';
    var text = postData.text || '';

    if (!html && !text) {
      return createJsonResponse({ success: false, emailSent: false, emailError: 'No email content provided.' });
    }

    MailApp.sendEmail({
      to: adminEmail,
      subject: subject,
      htmlBody: html,
      body: text || 'GreenNext new lead received.'
    });

    return createJsonResponse({
      success: true,
      emailSent: true,
      messageId: 'gas-mail-' + new Date().getTime(),
      recipient: adminEmail,
      timestamp: formatTimestamp(new Date())
    });
  } catch (err) {
    Logger.log('MailApp.sendEmail error: ' + err.message);
    return createJsonResponse({
      success: false,
      emailSent: false,
      emailError: err.message
    });
  }
}

/**
 * Handles explicit action 'update_lead_status' posted from Node.js /api/enquiry
 * Upserts the tracking row in Jira Lead Tracking worksheet.
 */
function handleUpdateLeadStatusAction(postData) {
  try {
    var ss = getSpreadsheet();
    var sheet = getOrInitSheet(ss, SHEET_JIRA_TRACKING, COLS_JIRA_TRACKING, '#0D3B66');
    var enquiryId = (postData.enquiryId || '').trim();
    if (!enquiryId) {
      return createJsonResponse({ success: false, message: 'Enquiry ID required' });
    }

    var data = sheet.getDataRange().getValues();
    var rowIndex = -1;
    for (var r = 1; r < data.length; r++) {
      if (String(data[r][0]).trim() === enquiryId) {
        rowIndex = r + 1;
        break;
      }
    }

    var now = new Date();
    var tsStr = formatTimestamp(now);

    if (rowIndex > -1) {
      if (postData.parentJiraKey && postData.parentJiraKey !== '—') sheet.getRange(rowIndex, 7).setValue(postData.parentJiraKey);
      if (postData.parentJiraUrl && postData.parentJiraUrl !== '—') sheet.getRange(rowIndex, 8).setValue(postData.parentJiraUrl);
      if (postData.jiraStatus) sheet.getRange(rowIndex, 16).setValue(postData.jiraStatus);
      if (postData.emailNotificationStatus) sheet.getRange(rowIndex, 17).setValue(postData.emailNotificationStatus);
      if (postData.emailSentTimestamp) sheet.getRange(rowIndex, 18).setValue(postData.emailSentTimestamp);
      if (postData.emailRecipient) sheet.getRange(rowIndex, 19).setValue(postData.emailRecipient);
      if (postData.emailErrorDetails) sheet.getRange(rowIndex, 20).setValue(postData.emailErrorDetails);
      sheet.getRange(rowIndex, 21).setValue(tsStr);
      if (postData.jiraSubtasksStatus) sheet.getRange(rowIndex, 22).setValue(postData.jiraSubtasksStatus);
    } else {
      var newRow = [
        enquiryId,
        tsStr,
        postData.formType || 'Enquiry Form',
        postData.companyName || '—',
        postData.fullName || '—',
        postData.areaOfInterest || '—',
        postData.parentJiraKey || '—',
        postData.parentJiraUrl || '—',
        '—', '—', '—', '—', '—', '—', '—',
        postData.jiraStatus || 'Pending',
        postData.emailNotificationStatus || 'Pending',
        postData.emailSentTimestamp || '—',
        postData.emailRecipient || '—',
        postData.emailErrorDetails || '—',
        tsStr,
        postData.jiraSubtasksStatus || '—'
      ];
      sheet.appendRow(newRow);
    }

    return createJsonResponse({
      success: true,
      enquiryId: enquiryId,
      statusUpdated: true,
      timestamp: tsStr
    });
  } catch (err) {
    Logger.log('Update lead status error: ' + err.message);
    return createJsonResponse({
      success: false,
      message: 'Failed to update lead status: ' + err.message
    });
  }
}

