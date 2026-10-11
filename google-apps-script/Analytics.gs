/**
 * GREENNEXT — ANALYTICS INTELLIGENCE BACKEND
 * Google Apps Script Web App
 *
 * Handles three analytics modules:
 *   1. Traffic Analysis   — raw event records, per-event tracking
 *   2. Traffic Intelligence — aggregated insights & recommendations
 *   3. Session Intelligence — per-session behaviour summaries
 *
 * Uses the SAME spreadsheet as the Enquiry integration.
 * SPREADSHEET_ID: 1Pt-xvwZ1WzWQd8U-2mPmeGsygiq7QZZ0pc_A-yRxCK4
 *   (analytics workbook — keep separate from enquiry workbook)
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

// Analytics-specific spreadsheet (separate from enquiry sheet)
var ANALYTICS_SPREADSHEET_ID = '1Pt-xvwZ1WzWQd8U-2mPmeGsygiq7QZZ0pc_A-yRxCK4';

var TIMEZONE = 'Asia/Kolkata';

// ── Sheet names ──────────────────────────────────────────────────────────────
var SHEET_TRAFFIC   = 'Traffic Analysis';
var SHEET_INTEL     = 'Traffic Intelligence';
var SHEET_SESSION   = 'Session Intelligence';

// ── Column schemas ───────────────────────────────────────────────────────────
var COLS_TRAFFIC = [
  'Event ID', 'Server Timestamp', 'Anonymous Session ID',
  'Event Type', 'Page URL', 'Page Title',
  'Referrer Source', 'UTM Source', 'UTM Medium', 'UTM Campaign',
  'Device Category', 'Browser Category', 'Operating System',
  'Landing Page', 'CTA Name', 'Form Type', 'Conversion Status',
  'Scroll Depth %', 'Session Age (s)'
];

var COLS_INTEL = [
  'Insight ID', 'Analysis Date', 'Insight Category',
  'Observation', 'Supporting Metric',
  'Current Period', 'Comparison Period',
  'Suggested Action', 'Priority', 'Confidence Level', 'Data Period'
];

var COLS_SESSION = [
  'Session ID', 'Session Start Time', 'Session End Time (est)',
  'Session Duration (s)', 'Landing Page', 'Last Viewed Page',
  'Pages Viewed', 'Total Page Views', 'Traffic Source',
  'UTM Campaign', 'Device Category',
  'Navigation Interactions', 'CTA Click Count', 'WhatsApp CTA Clicked',
  'Long Form Started', 'Short Form Started', 'Form Submitted Successfully',
  'Conversion Status', 'Exit Page', 'Session Classification',
  'Analysis Timestamp'
];

// ============================================================================
// HTTP HANDLERS
// ============================================================================

/**
 * GET /exec — Health check and summary stats
 */
function doGet(e) {
  try {
    var ss       = getSpreadsheet();
    var tSheet   = getOrInitSheet(ss, SHEET_TRAFFIC,  COLS_TRAFFIC,  '#0E3A2B');
    var iSheet   = getOrInitSheet(ss, SHEET_INTEL,    COLS_INTEL,    '#1A5C3A');
    var sSheet   = getOrInitSheet(ss, SHEET_SESSION,  COLS_SESSION,  '#0D4D2C');

    return createJsonResponse({
      success       : true,
      status        : 'online',
      service       : 'GreenNext Analytics API',
      sheets        : {
        trafficAnalysis   : { rows: Math.max(0, tSheet.getLastRow() - 1) },
        trafficIntelligence: { rows: Math.max(0, iSheet.getLastRow() - 1) },
        sessionIntelligence: { rows: Math.max(0, sSheet.getLastRow() - 1) }
      },
      timestamp     : formatTimestamp(new Date())
    });
  } catch (err) {
    return createJsonResponse({
      success: false,
      status : 'error',
      message: sanitizeError(err.message)
    });
  }
}

/**
 * POST /exec — Receive analytics event batch from website
 *
 * Expected body:
 *   { events: [ { event_type, session_id, page_url, ... }, ... ] }
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  var lockAcquired = false;

  try {
    lockAcquired = lock.tryLock(12000);
    if (!lockAcquired) {
      return createJsonResponse({ success: false, message: 'Service busy — retry shortly.' });
    }

    var data = parseBody(e);
    if (!data) {
      return createJsonResponse({ success: false, message: 'Invalid JSON payload.' });
    }

    var events = data.events;
    if (!Array.isArray(events) || events.length === 0) {
      // Also accept a single event (legacy / direct call)
      if (data.event_type) {
        events = [data];
      } else {
        return createJsonResponse({ success: false, message: 'No events provided.' });
      }
    }

    // Cap at 50 events per batch (rate-limit safety)
    events = events.slice(0, 50);

    var ss       = getSpreadsheet();
    var tSheet   = getOrInitSheet(ss, SHEET_TRAFFIC, COLS_TRAFFIC, '#0E3A2B');

    var now     = new Date();
    var written = 0;

    events.forEach(function(ev) {
      if (!ev || !ev.event_type) return;

      var validated = validateEvent(ev);
      if (!validated) return;

      var eventId   = generateEventId(now);
      var serverTs  = formatTimestamp(now);
      var formType  = sanitize(ev.form_type || '');
      var convStatus= sanitize(ev.conversion_status || '');

      // --- Traffic Analysis row ---
      tSheet.appendRow([
        eventId,
        serverTs,
        sanitize(ev.session_id     || ''),
        sanitize(ev.event_type     || ''),
        sanitize(ev.page_url       || ''),
        sanitize(ev.page_title     || ''),
        sanitize(ev.referrer_source|| ''),
        sanitize(ev.utm_source     || ''),
        sanitize(ev.utm_medium     || ''),
        sanitize(ev.utm_campaign   || ''),
        sanitize(ev.device_category || ''),
        sanitize(ev.browser_category|| ''),
        sanitize(ev.os_name        || ''),
        sanitize(ev.landing_page   || ''),
        sanitize(ev.cta_name       || ''),
        formType,
        convStatus,
        sanitize(String(ev.scroll_depth_pct || '')),
        sanitize(String(ev.session_age_seconds || ''))
      ]);
      written++;
    });

    // --- Update / create Session Intelligence rows for completed sessions ---
    try {
      updateSessionIntelligence(ss, events, now);
    } catch (sessErr) {
      Logger.log('Session update error: ' + sessErr.message);
    }

    // --- Periodically regenerate Traffic Intelligence insights ---
    try {
      var tRows = tSheet.getLastRow() - 1; // exclude header
      // Regenerate insights every 20 new events (approximate throttle)
      if (tRows > 0 && tRows % 20 < events.length) {
        regenerateIntelligence(ss, tSheet, now);
      }
    } catch (intelErr) {
      Logger.log('Intelligence regeneration error: ' + intelErr.message);
    }

    return createJsonResponse({
      success : true,
      received: events.length,
      written : written
    });

  } catch (err) {
    Logger.log('Analytics doPost error: ' + err.message);
    return createJsonResponse({
      success: false,
      message: 'Analytics service error. Events not recorded.'
    });
  } finally {
    if (lockAcquired) lock.releaseLock();
  }
}

// ============================================================================
// SESSION INTELLIGENCE — UPDATE LOGIC
// ============================================================================

/**
 * Reads incoming event batch and upserts Session Intelligence rows.
 * Session row is keyed by Session ID. If it already exists, update it.
 * If not, create a new row.
 */
function updateSessionIntelligence(ss, events, now) {
  var sSheet = getOrInitSheet(ss, SHEET_SESSION, COLS_SESSION, '#0D4D2C');

  // Index existing sessions by Session ID (column 1, 0-indexed)
  var existingData = sSheet.getDataRange().getValues();
  var sessionIndex = {}; // sessionId -> row number (1-indexed)
  for (var r = 1; r < existingData.length; r++) {
    var sid = String(existingData[r][0]);
    if (sid) sessionIndex[sid] = r + 1; // 1-indexed sheet row
  }

  // Group incoming events by session
  var sessionMap = {};
  events.forEach(function(ev) {
    var sid = ev.session_id;
    if (!sid) return;
    if (!sessionMap[sid]) sessionMap[sid] = [];
    sessionMap[sid].push(ev);
  });

  Object.keys(sessionMap).forEach(function(sid) {
    var evs = sessionMap[sid];
    var firstEv = evs[0];

    // --- Aggregate session metrics ---
    var pageViews  = evs.filter(function(e) { return e.event_type === 'page_view'; }).length;
    var navClicks  = evs.filter(function(e) { return e.event_type === 'nav_click'; }).length;
    var ctaClicks  = evs.filter(function(e) {
      return e.event_type === 'cta_click' || e.event_type === 'nav_click' || e.event_type === 'whatsapp_cta_click';
    }).length;
    var waClicked  = evs.some(function(e)  { return e.event_type === 'whatsapp_cta_click'; });
    var longStarted= evs.some(function(e)  { return e.event_type === 'form_start' && e.form_type === 'Long Form'; });
    var shortStart = evs.some(function(e)  { return e.event_type === 'form_start' && e.form_type === 'Short Form'; });
    var converted  = evs.some(function(e)  { return e.event_type === 'form_submission_success'; });

    var pagesViewed = evs
      .filter(function(e) { return e.event_type === 'page_view'; })
      .map(function(e)    { return e.page_url; });
    var uniquePages = pagesViewed.filter(function(p, i, a) { return a.indexOf(p) === i; });

    var lastPage = evs.reduce(function(acc, e) {
      return (e.client_ts && e.client_ts > (acc.ts || 0)) ? { page: e.page_url, ts: e.client_ts } : acc;
    }, {}).page || firstEv.page_url;

    var startTs  = parseInt(firstEv.session_start_ts || Date.now(), 10);
    var latestTs = evs.reduce(function(max, e) { return Math.max(max, e.client_ts || 0); }, startTs);
    var durationS= Math.round((latestTs - startTs) / 1000);

    var classification =
      converted           ? 'Converted'        :
      longStarted || shortStart ? 'Lead Engaged' :
      ctaClicks > 2       ? 'Engaged'           :
      pageViews > 3       ? 'Explorer'          :
      'Browsing';

    var rowData = [
      sanitize(sid),
      formatTimestamp(new Date(startTs)),
      formatTimestamp(now),                      // estimated end = now
      String(durationS),
      sanitize(firstEv.landing_page  || ''),
      sanitize(lastPage              || ''),
      uniquePages.join(' → ').substring(0, 400),
      String(pageViews),
      sanitize(firstEv.referrer_source || ''),
      sanitize(firstEv.utm_campaign    || ''),
      sanitize(firstEv.device_category || ''),
      String(navClicks),
      String(ctaClicks),
      waClicked   ? 'Yes' : 'No',
      longStarted ? 'Yes' : 'No',
      shortStart  ? 'Yes' : 'No',
      converted   ? 'Yes' : 'No',
      converted   ? 'Converted' : 'Not Converted',
      sanitize(lastPage || ''),
      classification,
      formatTimestamp(now)
    ];

    if (sessionIndex[sid]) {
      // Update existing row
      sSheet.getRange(sessionIndex[sid], 1, 1, COLS_SESSION.length).setValues([rowData]);
    } else {
      // Append new row
      sSheet.appendRow(rowData);
      sessionIndex[sid] = sSheet.getLastRow();
    }
  });
}

// ============================================================================
// TRAFFIC INTELLIGENCE — INSIGHT GENERATION
// ============================================================================

/**
 * Reads Traffic Analysis data and generates actionable intelligence insights.
 * Clears and rewrites the Traffic Intelligence sheet.
 * Only called periodically to avoid excessive computation.
 */
function regenerateIntelligence(ss, tSheet, now) {
  var iSheet = getOrInitSheet(ss, SHEET_INTEL, COLS_INTEL, '#1A5C3A');

  var data = tSheet.getDataRange().getValues();
  if (data.length < 2) return; // Need at least header + 1 row

  var headers = data[0];
  var rows    = data.slice(1);

  // Build column index map
  var colIdx = {};
  headers.forEach(function(h, i) { colIdx[h] = i; });

  // ── Period split: last 7 days vs previous 7 days ──
  var nowMs     = now.getTime();
  var day7Ms    = 7 * 24 * 60 * 60 * 1000;
  var cutCurrent= nowMs - day7Ms;
  var cutPrev   = nowMs - 2 * day7Ms;

  function rowToMs(row) {
    var ts = row[colIdx['Server Timestamp']];
    return ts ? new Date(ts).getTime() : 0;
  }

  var currentRows = rows.filter(function(r) { var t = rowToMs(r); return t >= cutCurrent && t <= nowMs; });
  var prevRows    = rows.filter(function(r) { var t = rowToMs(r); return t >= cutPrev && t < cutCurrent; });
  var allRows     = rows;

  var totalEvents  = allRows.length;
  var dataLabel    = 'All-time (' + totalEvents + ' events)';

  // ── Counting helpers ──
  function countBy(arr, colName) {
    var map = {};
    arr.forEach(function(r) {
      var val = sanitize(r[colIdx[colName]] || 'Unknown');
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

  function addInsight(category, observation, metric, currentVal, prevVal, action, priority, confidence) {
    insights.push([
      'GNI-' + Utilities.formatDate(now, TIMEZONE, 'yyyyMMdd') + '-' + String(insightNum++).padStart(3, '0'),
      formatTimestamp(now),
      category,
      observation,
      metric,
      String(currentVal),
      String(prevVal),
      action,
      priority,
      confidence,
      dataLabel
    ]);
  }

  // ── 1. Total Page Views ──
  var pvCurrent = filterType(currentRows, 'page_view').length;
  var pvPrev    = filterType(prevRows,    'page_view').length;
  addInsight(
    'Page Views',
    'Total page views in the last 7 days: ' + pvCurrent +
      (pvPrev > 0 ? ' (vs. ' + pvPrev + ' previous week, ' + pctChange(pvCurrent, pvPrev) + ')' : ''),
    pvCurrent + ' page views',
    pvCurrent, pvPrev,
    pvCurrent < pvPrev
      ? 'Consider publishing a new case study or promoting content to drive traffic.'
      : 'Traffic is stable or growing — continue current content strategy.',
    'Informational',
    totalEvents >= 50 ? 'High' : totalEvents >= 10 ? 'Medium' : 'Low (preliminary)'
  );

  // ── 2. Top Pages ──
  var pageMap     = countBy(filterType(allRows, 'page_view'), 'Page URL');
  var topPages    = topN(pageMap, 5);
  addInsight(
    'Top Pages',
    'Most visited pages: ' + (topPages || 'Insufficient data'),
    'By page view count',
    topPages, 'N/A',
    'Ensure top pages have clear CTA sections and fast load times.',
    'Informational',
    totalEvents >= 20 ? 'Medium' : 'Low (preliminary)'
  );

  // ── 3. Traffic Sources ──
  var srcMap      = countBy(allRows, 'Referrer Source');
  var topSources  = topN(srcMap, 5);
  addInsight(
    'Traffic Sources',
    'Primary traffic sources: ' + (topSources || 'Insufficient data'),
    'By session count',
    topSources, 'N/A',
    srcMap['Direct'] > (allRows.length * 0.6)
      ? 'High direct traffic — invest in SEO and referral campaigns to diversify.'
      : 'Good source diversity — track top sources for ROI.',
    'Strategic',
    totalEvents >= 30 ? 'Medium' : 'Low (preliminary)'
  );

  // ── 4. Device Distribution ──
  var devMap   = countBy(allRows, 'Device Category');
  var mobile   = devMap['Mobile']  || 0;
  var desktop  = devMap['Desktop'] || 0;
  var tablet   = devMap['Tablet']  || 0;
  var total    = mobile + desktop + tablet || 1;
  var mobilePct= Math.round(mobile / total * 100);
  addInsight(
    'Device Distribution',
    'Device split — Desktop: ' + Math.round(desktop/total*100) + '%, Mobile: ' + mobilePct + '%, Tablet: ' + Math.round(tablet/total*100) + '%',
    mobile + ' mobile / ' + desktop + ' desktop sessions',
    'Mobile: ' + mobilePct + '%', 'N/A',
    mobilePct > 40
      ? 'Over ' + mobilePct + '% mobile visitors — verify mobile form usability and CTA tap-target sizes.'
      : 'Primarily desktop audience — ensure rich desktop experience with detailed content.',
    mobilePct > 40 ? 'High' : 'Informational',
    totalEvents >= 20 ? 'Medium' : 'Low (preliminary)'
  );

  // ── 5. CTA Engagement ──
  var ctaClicks  = filterType(allRows, 'cta_click').length +
                   filterType(allRows, 'nav_click').length;
  var waClicks   = filterType(allRows, 'whatsapp_cta_click').length;
  var conversions= filterType(allRows, 'form_submission_success').length;
  var pvAll      = filterType(allRows, 'page_view').length || 1;
  var ctaRate    = Math.round(ctaClicks / pvAll * 100);
  var convRate   = Math.round(conversions / pvAll * 100);
  addInsight(
    'CTA Engagement',
    'CTA clicks: ' + ctaClicks + ' (' + ctaRate + '% of page views). WhatsApp clicks: ' + waClicks + '. Form conversions: ' + conversions + ' (' + convRate + '% conversion rate)',
    ctaClicks + ' CTA clicks / ' + conversions + ' conversions',
    'Conv rate: ' + convRate + '%', 'N/A',
    convRate < 2
      ? 'Conversion rate is below 2%. Review CTA copy, placement, and enquiry form length.'
      : 'Conversion rate is healthy. A/B test CTA copy to push it higher.',
    convRate < 2 ? 'High' : 'Informational',
    totalEvents >= 20 ? 'Medium' : 'Low (preliminary)'
  );

  // ── 6. Form funnel ──
  var longStart = filterType(allRows, 'form_start')
    .filter(function(r) { return r[colIdx['Form Type']] === 'Long Form'; }).length;
  var shortStart= filterType(allRows, 'form_start')
    .filter(function(r) { return r[colIdx['Form Type']] === 'Short Form'; }).length;
  if (longStart > 0 || shortStart > 0) {
    var longConv  = longStart  > 0 ? Math.round(conversions / longStart  * 100) : 0;
    addInsight(
      'Form Funnel',
      'Long Form started: ' + longStart + ', Short Form started: ' + shortStart + ', Total conversions: ' + conversions + '. Long Form completion rate: ' + longConv + '%',
      longStart + ' starts → ' + conversions + ' submissions',
      longConv + '% long form completion', 'N/A',
      longStart > conversions * 3
        ? 'High form abandonment detected. Consider shortening the long form or adding progress indicators.'
        : 'Form completion looks reasonable. Monitor over time.',
      longStart > conversions * 3 ? 'High' : 'Informational',
      totalEvents >= 10 ? 'Medium' : 'Low (preliminary)'
    );
  }

  // ── 7. Location page engagement ──
  var locRows = filterType(allRows, 'page_view').filter(function(r) {
    return (r[colIdx['Page URL']] || '').includes('/locations/');
  });
  if (locRows.length > 0) {
    var locMap = countBy(locRows, 'Page URL');
    addInsight(
      'Location Engagement',
      'Location page visits: ' + locRows.length + '. Top location: ' + topN(locMap, 1),
      locRows.length + ' location page views',
      topN(locMap, 3), 'N/A',
      'Feature the most-visited location prominently on the homepage and in navigation.',
      'Strategic',
      totalEvents >= 20 ? 'Medium' : 'Low (preliminary)'
    );
  }

  // ── 8. UTM Campaign performance ──
  var utmRows = allRows.filter(function(r) { return r[colIdx['UTM Campaign']]; });
  if (utmRows.length > 0) {
    var utmMap = countBy(utmRows, 'UTM Campaign');
    addInsight(
      'Campaign Performance',
      'Tracked campaigns: ' + Object.keys(utmMap).join(', ') + '. Top: ' + topN(utmMap, 3),
      utmRows.length + ' tracked campaign events',
      topN(utmMap, 3), 'N/A',
      'Allocate budget toward top-performing campaigns. Add UTM tags to all email/social links.',
      'Strategic',
      utmRows.length >= 5 ? 'Medium' : 'Low (preliminary)'
    );
  }

  // ── Write all insights (clear old, write new) ──
  var lastRow = iSheet.getLastRow();
  if (lastRow > 1) {
    iSheet.deleteRows(2, lastRow - 1);
  }
  insights.forEach(function(row) { iSheet.appendRow(row); });
}

// ============================================================================
// HELPERS
// ============================================================================

function pctChange(current, previous) {
  if (!previous) return '+∞%';
  var pct = Math.round((current - previous) / previous * 100);
  return (pct >= 0 ? '+' : '') + pct + '%';
}

function getSpreadsheet() {
  if (ANALYTICS_SPREADSHEET_ID && ANALYTICS_SPREADSHEET_ID !== 'ACTIVE') {
    return SpreadsheetApp.openById(ANALYTICS_SPREADSHEET_ID);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getOrInitSheet(ss, name, columns, headerColor) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(columns);
    var hRange = sheet.getRange(1, 1, 1, columns.length);
    hRange.setFontWeight('bold');
    hRange.setBackground(headerColor || '#0E3A2B');
    hRange.setFontColor('#FFFFFF');
    hRange.setWrap(false);
    sheet.setFrozenRows(1);
    for (var i = 1; i <= columns.length; i++) {
      sheet.setColumnWidth(i, 160);
    }
  }
  return sheet;
}

function parseBody(e) {
  if (!e) return null;
  try {
    if (e.postData && e.postData.contents) {
      return JSON.parse(e.postData.contents);
    }
    if (e.parameter && Object.keys(e.parameter).length) return e.parameter;
  } catch (err) {}
  return null;
}

function validateEvent(ev) {
  if (!ev || typeof ev !== 'object') return null;
  var type = ev.event_type;
  if (!type || typeof type !== 'string' || type.length > 80) return null;
  if (ev.session_id && ev.session_id.length > 80) return null;
  return ev;
}

function generateEventId(date) {
  var dateStr = Utilities.formatDate(date, TIMEZONE, 'yyyyMMdd');
  var rand    = Math.floor(1000 + Math.random() * 9000);
  return 'EVT-' + dateStr + '-' + rand;
}

function formatTimestamp(date) {
  return Utilities.formatDate(date, TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
}

function sanitize(val) {
  if (val === null || val === undefined) return '';
  var str = String(val).trim();
  if (!str) return '';
  if (str.length > 500) str = str.substring(0, 500);
  var first = str.charAt(0);
  if (first === '=' || first === '+' || first === '-' || first === '@' || first === '\t' || first === '\r') {
    return "'" + str;
  }
  return str;
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function sanitizeError(msg) {
  if (!msg) return 'Unknown error';
  return String(msg).replace(/(key|token|id)=[^\s&]+/gi, '$1=***');
}

// ============================================================================
// MANUAL TRIGGER — Run from Apps Script editor to force insight regeneration
// ============================================================================

function manualRegenerateInsights() {
  var ss     = getSpreadsheet();
  var tSheet = getOrInitSheet(ss, SHEET_TRAFFIC, COLS_TRAFFIC, '#0E3A2B');
  regenerateIntelligence(ss, tSheet, new Date());
  Logger.log('Intelligence insights regenerated.');
}

// ============================================================================
// MANUAL TRIGGER — Initialize all three sheets with headers
// ============================================================================

function initAllSheets() {
  var ss = getSpreadsheet();
  getOrInitSheet(ss, SHEET_TRAFFIC, COLS_TRAFFIC,  '#0E3A2B');
  getOrInitSheet(ss, SHEET_INTEL,   COLS_INTEL,    '#1A5C3A');
  getOrInitSheet(ss, SHEET_SESSION, COLS_SESSION,  '#0D4D2C');
  Logger.log('All three analytics sheets initialized.');
}
