/**
 * GREENNEXT — ANALYTICS INTELLIGENCE BACKEND
 * Google Apps Script Web App
 *
 * Handles three analytics modules:
 *   1. Traffic Analysis   — raw event records, per-event tracking
 *   2. Traffic Intelligence — aggregated insights & recommendations
 *   3. Session Intelligence — per-session behaviour summaries
 *
 * Uses the SAME spreadsheet as the Enquiry integration or a dedicated analytics workbook.
 * SPREADSHEET_ID: 1Pt-xvwZ1WzWQd8U-2mPmeGsygiq7QZZ0pc_A-yRxCK4
 *
 * Designed to work either:
 *   - As an independent standalone Web App
 *   - Coexisting seamlessly in the SAME Apps Script project with Code.gs
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

// Analytics-specific spreadsheet (Reuse existing GreenNext raw data workbook)
var ANALYTICS_SPREADSHEET_ID = '14ciH1aNzWIJHJkQ5rYCdrEhci3KYMjrTSeY3QMaerVI';

var TIMEZONE = 'Asia/Kolkata';

// ── Sheet names ──────────────────────────────────────────────────────────────
var SHEET_TRAFFIC   = 'Traffic Analysis';
var SHEET_INTEL     = 'Traffic Intelligence';
var SHEET_SESSION   = 'Session Intelligence';

// ── Column schemas (matching Section 2 of requirements) ──────────────────────
var COLS_TRAFFIC = [
  'Event ID', 'Timestamp', 'Anonymous Session ID',
  'Event Type', 'Page URL', 'Page Title',
  'Referrer Source', 'UTM Source', 'UTM Medium', 'UTM Campaign',
  'Device Category', 'Browser Category',
  'Landing Page', 'CTA Name', 'Form Type', 'Conversion Status'
];

var COLS_INTEL = [
  'Insight ID', 'Analysis Date', 'Insight Category',
  'Observation', 'Supporting Metric',
  'Current Period', 'Comparison Period',
  'Suggested Action', 'Priority', 'Confidence Level', 'Data Period'
];

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
// HTTP DISPATCHERS (Dual-Mode: Standalone or Unified with Code.gs)
// ============================================================================

/**
 * GET /exec — Health check, stats, or insights query.
 * Dispatches deterministically regardless of script file compilation order.
 */
function doGet(e) {
  var service = (e && e.parameter && (e.parameter.service || e.parameter.type)) || '';
  if (service.toLowerCase() === 'analytics' && typeof handleAnalyticsGet === 'function') {
    return handleAnalyticsGet(e);
  }
  if (service.toLowerCase() === 'enquiry' && typeof handleEnquiryGet === 'function') {
    return handleEnquiryGet(e);
  }
  if (e && e.parameter && e.parameter.view && typeof handleAnalyticsGet === 'function') {
    return handleAnalyticsGet(e);
  }
  // Default preference when both are installed
  if (typeof handleEnquiryGet === 'function') {
    return handleEnquiryGet(e);
  }
  if (typeof handleAnalyticsGet === 'function') {
    return handleAnalyticsGet(e);
  }
  return createJsonResponse({ success: false, message: 'No handler available' });
}

/**
 * POST /exec — Receive analytics event batch or delegate enquiry.
 * Dispatches deterministically based on payload structure.
 */
function doPost(e) {
  var postData = null;
  if (typeof parseAnalyticsBody === 'function') {
    postData = parseAnalyticsBody(e);
  } else if (typeof parsePostData === 'function') {
    postData = parsePostData(e);
  }

  // If this is an analytics batch or single event
  if (postData && (postData.events || postData.event_type)) {
    if (typeof handleAnalyticsPost === 'function') {
      return handleAnalyticsPost(e, postData);
    }
  }

  // If this is an enquiry submission
  if (typeof handleEnquiryPost === 'function') {
    return handleEnquiryPost(e, postData);
  }

  if (typeof handleAnalyticsPost === 'function') {
    return handleAnalyticsPost(e, postData);
  }

  return createJsonResponse({ success: false, message: 'No handler available' });
}

// ============================================================================
// ANALYTICS IMPLEMENTATION HANDLERS
// ============================================================================

/**
 * Handles GET requests for analytics health check, KPI summaries, and insights.
 */
function handleAnalyticsGet(e) {
  try {
    var ss       = getSpreadsheet();
    var tSheet   = getOrInitAnalyticsSheet(ss, SHEET_TRAFFIC,  COLS_TRAFFIC,  '#0E3A2B');
    var iSheet   = getOrInitAnalyticsSheet(ss, SHEET_INTEL,    COLS_INTEL,    '#1A5C3A');
    var sSheet   = getOrInitAnalyticsSheet(ss, SHEET_SESSION,  COLS_SESSION,  '#0D4D2C');

    var view = (e && e.parameter && (e.parameter.view || e.parameter.action)) ? String(e.parameter.view || e.parameter.action).toLowerCase() : '';

    // If caller requested formatted insights report
    if (view === 'insights') {
      var intelData = iSheet.getDataRange().getValues();
      var insightsList = [];
      if (intelData.length > 1) {
        var headers = intelData[0];
        for (var i = 1; i < intelData.length; i++) {
          var row = intelData[i];
          var item = {};
          headers.forEach(function(h, idx) { item[h] = row[idx]; });
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

    // If caller requested dashboard KPI summary
    if (view === 'dashboard' || view === 'kpis' || view === 'summary') {
      var summary = buildAnalyticsSummary(tSheet, sSheet, iSheet);
      return createJsonResponse(Object.assign({
        success  : true,
        service  : 'GreenNext Analytics Dashboard Intelligence',
        timestamp: formatTimestamp(new Date())
      }, summary));
    }

    return createJsonResponse({
      success       : true,
      status        : 'online',
      service       : 'GreenNext Analytics API',
      sheets        : {
        trafficAnalysis    : { rows: Math.max(0, tSheet.getLastRow() - 1) },
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
 * Builds aggregated dashboard metrics and KPI cards from live sheets.
 */
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
  var pageViews = 0;
  var ctaClicks = 0;
  var waClicks = 0;
  var conversions = 0;
  var pageCounts = {};
  var sourceCounts = {};
  var deviceCounts = {};
  var dailyCounts = {};

  tRows.forEach(function(r) {
    var type = r[tCol['Event Type']];
    var page = r[tCol['Page URL']] || '/';
    var src = r[tCol['Referrer Source']] || 'Direct';
    var dev = r[tCol['Device Category']] || 'Desktop';
    var tsStr = r[tCol['Timestamp']] || '';
    var dateKey = tsStr.length >= 10 ? tsStr.substring(0, 10) : 'Today';

    dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;

    if (type === 'page_view') {
      pageViews++;
      pageCounts[page] = (pageCounts[page] || 0) + 1;
    }
    if (type === 'cta_click' || type === 'nav_click' || type === 'whatsapp_cta_click' || type === 'slider_interaction') {
      ctaClicks++;
    }
    if (type === 'whatsapp_cta_click') {
      waClicks++;
    }
    if (type === 'form_submission_success') {
      conversions++;
    }

    sourceCounts[src] = (sourceCounts[src] || 0) + 1;
    deviceCounts[dev] = (deviceCounts[dev] || 0) + 1;
  });

  var uniqueSessions = sRows.length;
  var convertedSessions = 0;
  var totalDurationS = 0;
  var durationsCount = 0;
  var navigationPaths = {};

  sRows.forEach(function(r) {
    if (r[sCol['Conversion Status']] === 'Converted' || r[sCol['Form Submitted Successfully']] === 'Yes') {
      convertedSessions++;
    }
    var durStr = String(r[sCol['Session Duration']] || '0').replace(/[^0-9]/g, '');
    var dur = parseInt(durStr, 10);
    if (!isNaN(dur) && dur > 0) {
      totalDurationS += dur;
      durationsCount++;
    }
    var path = r[sCol['Pages Viewed']];
    if (path) {
      navigationPaths[path] = (navigationPaths[path] || 0) + 1;
    }
  });

  var conversionRate = uniqueSessions > 0 ? ((convertedSessions / uniqueSessions) * 100).toFixed(1) : '0.0';
  var avgDurationS = durationsCount > 0 ? Math.round(totalDurationS / durationsCount) : 0;
  var avgDurationMins = Math.floor(avgDurationS / 60);
  var avgDurationSecs = avgDurationS % 60;
  var avgDurationFormatted = (avgDurationMins > 0 ? avgDurationMins + 'm ' : '') + avgDurationSecs + 's';

  var topPages = Object.keys(pageCounts).map(function(url) {
    return { url: url, views: pageCounts[url] };
  }).sort(function(a, b) { return b.views - a.views; }).slice(0, 8);

  var topSources = Object.keys(sourceCounts).map(function(s) {
    return { source: s, count: sourceCounts[s] };
  }).sort(function(a, b) { return b.count - a.count; }).slice(0, 6);

  var insightsList = [];
  if (iData.length > 1) {
    for (var i = 1; i < iData.length; i++) {
      var row = iData[i];
      var item = {};
      iHeaders.forEach(function(h, idx) { item[h] = row[idx]; });
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
      conversionRate: conversionRate,
      avgSessionDuration: avgDurationFormatted,
      avgDurationSeconds: avgDurationS,
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

/**
 * Handles POST event batches from the website tracker.
 */
function handleAnalyticsPost(e, preParsedData) {
  var lock = LockService.getScriptLock();
  var lockAcquired = false;

  try {
    lockAcquired = lock.tryLock(12000);
    if (!lockAcquired) {
      return createJsonResponse({ success: false, message: 'Service busy — retry shortly.' });
    }

    var data = preParsedData || parseAnalyticsBody(e);
    if (!data) {
      return createJsonResponse({ success: false, message: 'Invalid JSON payload.' });
    }

    var events = data.events;
    if (!Array.isArray(events) || events.length === 0) {
      // Also accept a single event
      if (data.event_type) {
        events = [data];
      } else {
        return createJsonResponse({ success: false, message: 'No events provided.' });
      }
    }

    // Cap at 50 events per batch (rate-limit safety)
    events = events.slice(0, 50);

    var ss       = getSpreadsheet();
    var tSheet   = getOrInitAnalyticsSheet(ss, SHEET_TRAFFIC, COLS_TRAFFIC, '#0E3A2B');

    var now = new Date();
    var validEvents = [];
    var rowsToWrite = [];

    events.forEach(function(ev) {
      if (!ev || !ev.event_type) return;

      var validated = validateEvent(ev);
      if (!validated) return;

      validEvents.push(validated);

      var eventId    = generateEventId(now);
      var serverTs   = formatTimestamp(now);
      var formType   = sanitize(ev.form_type || '', 100);
      var convStatus = sanitize(ev.conversion_status || '', 100);

      // Match 16 columns of COLS_TRAFFIC
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
        formType,
        convStatus
      ]);
    });

    var written = 0;
    if (rowsToWrite.length > 0) {
      var startRow = tSheet.getLastRow() + 1;
      tSheet.getRange(startRow, 1, rowsToWrite.length, COLS_TRAFFIC.length).setValues(rowsToWrite);
      written = rowsToWrite.length;
    }

    // --- Update / accumulate Session Intelligence rows ---
    if (validEvents.length > 0) {
      try {
        updateSessionIntelligence(ss, validEvents, now);
      } catch (sessErr) {
        Logger.log('Session update error: ' + sessErr.message);
      }
    }

    // --- Periodically regenerate Traffic Intelligence insights (every 20 recorded events) ---
    try {
      var tRows = tSheet.getLastRow() - 1; // exclude header
      var prevRows = Math.max(0, tRows - written);
      if (written > 0 && Math.floor(tRows / 20) > Math.floor(prevRows / 20)) {
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
// SESSION INTELLIGENCE — ACCUMULATIVE UPSERT LOGIC
// ============================================================================

/**
 * Reads incoming validated events and accumulatively updates Session Intelligence.
 * Preserves historical session attributes and increments counts across batches.
 */
function updateSessionIntelligence(ss, events, now) {
  var sSheet = getOrInitAnalyticsSheet(ss, SHEET_SESSION, COLS_SESSION, '#0D4D2C');

  // Index existing sessions by Session ID (column 1, 0-indexed)
  var existingData = sSheet.getDataRange().getValues();
  var sessionIndex = {}; // sessionId -> row number (1-indexed)
  for (var r = 1; r < existingData.length; r++) {
    var sid = String(existingData[r][0]);
    if (sid) sessionIndex[sid] = r + 1;
  }

  // Group incoming events by session
  var sessionMap = {};
  events.forEach(function(ev) {
    if (!ev || !ev.session_id) return;
    var sid = ev.session_id;
    if (!sessionMap[sid]) sessionMap[sid] = [];
    sessionMap[sid].push(ev);
  });

  Object.keys(sessionMap).forEach(function(sid) {
    var evs = sessionMap[sid];
    var firstEv = evs[0];
    var rowIndex = sessionIndex[sid];
    var existingRow = (rowIndex && rowIndex <= existingData.length) ? existingData[rowIndex - 1] : null;

    // --- Current batch metrics ---
    var batchPageViews = evs.filter(function(e) { return e.event_type === 'page_view'; }).length;
    var batchCtaClicks = evs.filter(function(e) {
      return e.event_type === 'cta_click' || e.event_type === 'nav_click' || e.event_type === 'whatsapp_cta_click' || e.event_type === 'slider_interaction';
    }).length;

    var batchWaClicked   = evs.some(function(e) { return e.event_type === 'whatsapp_cta_click'; });
    var batchLongStarted = evs.some(function(e) { return e.event_type === 'form_start' && e.form_type === 'Long Form'; });
    var batchShortStart  = evs.some(function(e) { return e.event_type === 'form_start' && e.form_type === 'Short Form'; });
    var batchConverted   = evs.some(function(e) { return e.event_type === 'form_submission_success'; });

    var batchPagesViewed = evs
      .filter(function(e) { return e.event_type === 'page_view'; })
      .map(function(e)    { return e.page_url; })
      .filter(Boolean);

    var batchLastPage = evs.reduce(function(acc, e) {
      return (e.client_ts && e.client_ts >= (acc.ts || 0)) ? { page: e.page_url, ts: e.client_ts } : acc;
    }, {}).page || firstEv.page_url || '';

    // --- Merge with existing session data (monotonic accumulation) ---
    // COLS_SESSION 20 columns:
    // 0:Session ID, 1:Session Start Time, 2:Last Observed Activity, 3:Estimated Session End, 4:Session Duration,
    // 5:Landing Page, 6:Last Viewed Page, 7:Pages Viewed, 8:Total Page Views, 9:Traffic Source,
    // 10:UTM Campaign, 11:Device Category, 12:CTA Click Count, 13:WhatsApp CTA Clicked,
    // 14:Long Form Started, 15:Short Form Started, 16:Form Submitted Successfully,
    // 17:Conversion Status, 18:Exit Page, 19:Analysis Timestamp
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

    // Time calculations
    var startTs = 0;
    if (existingRow && existingRow[1]) {
      startTs = parseDateToMs(existingRow[1]);
    }
    if (!startTs) {
      startTs = parseInt(firstEv.session_start_ts || Date.now(), 10);
    }

    var latestTs = evs.reduce(function(max, e) { return Math.max(max, e.client_ts || 0); }, now.getTime());
    var durationS = Math.max(0, Math.round((latestTs - startTs) / 1000));
    if (existingRow && existingRow[4]) {
      var prevDuration = parseInt(String(existingRow[4]).replace(/[^0-9]/g, '') || 0, 10);
      durationS = Math.max(durationS, prevDuration);
    }

    // 20 Standard Columns matching Section 2 of requirements
    var rowData = [
      sanitize(sid, 100),                                   // 1. Session ID
      formatTimestamp(new Date(startTs)),                  // 2. Session Start Time
      formatTimestamp(new Date(latestTs)),                 // 3. Last Observed Activity
      formatTimestamp(new Date(latestTs + 30 * 60 * 1000)),// 4. Estimated Session End
      String(durationS) + 's',                             // 5. Session Duration
      sanitize(landingPage, 300),                          // 6. Landing Page
      sanitize(lastPage, 300),                             // 7. Last Viewed Page
      pagesViewedStr,                                      // 8. Pages Viewed
      String(totalPageViews),                              // 9. Total Page Views
      sanitize(trafficSource, 100),                        // 10. Traffic Source
      sanitize(utmCampaign, 100),                          // 11. UTM Campaign
      sanitize(deviceCategory, 50),                        // 12. Device Category
      String(totalCtaClicks),                              // 13. CTA Click Count
      waClicked   ? 'Yes' : 'No',                          // 14. WhatsApp CTA Clicked
      longStarted ? 'Yes' : 'No',                          // 15. Long Form Started
      shortStart  ? 'Yes' : 'No',                          // 16. Short Form Started
      converted   ? 'Yes' : 'No',                          // 17. Form Submitted Successfully
      converted   ? 'Converted' : 'Not Converted',         // 18. Conversion Status
      sanitize(lastPage, 300),                             // 19. Exit Page
      formatTimestamp(now)                                 // 20. Analysis Timestamp
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
// TRAFFIC INTELLIGENCE — INSIGHT GENERATION
// ============================================================================

/**
 * Reads Traffic Analysis data and generates actionable intelligence insights.
 * Atomically clears and rewrites the Traffic Intelligence sheet.
 */
function regenerateIntelligence(ss, tSheet, now) {
  var iSheet = getOrInitAnalyticsSheet(ss, SHEET_INTEL, COLS_INTEL, '#1A5C3A');

  var data = tSheet.getDataRange().getValues();
  if (data.length < 2) return; // Need at least header + 1 row

  var headers = data[0];
  var rows    = data.slice(1);

  // Build column index map
  var colIdx = {};
  headers.forEach(function(h, i) { colIdx[h] = i; });

  // ── Period split: last 7 days vs previous 7 days ──
  var nowMs      = now.getTime();
  var day7Ms     = 7 * 24 * 60 * 60 * 1000;
  var cutCurrent = nowMs - day7Ms;
  var cutPrev    = nowMs - 2 * day7Ms;

  function rowToMs(row) {
    var idx = (typeof colIdx['Timestamp'] !== 'undefined') ? colIdx['Timestamp'] : colIdx['Server Timestamp'];
    return parseDateToMs(row[idx]);
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

  function addInsight(category, observation, metric, currentVal, prevVal, action, priority, confidence) {
    var numStr = ('00' + insightNum++).slice(-3);
    insights.push([
      'GNI-' + Utilities.formatDate(now, TIMEZONE, 'yyyyMMdd') + '-' + numStr,
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
    topPages || 'None', 'N/A',
    'Ensure top pages have clear CTA sections and fast load times.',
    'Informational',
    totalEvents >= 20 ? 'Medium' : 'Low (preliminary)'
  );

  // ── 3. Traffic Sources ──
  var srcMap      = countBy(allRows, 'Referrer Source');
  var topSources  = topN(srcMap, 5);
  var directCount = srcMap['Direct'] || 0;
  addInsight(
    'Traffic Sources',
    'Primary traffic sources: ' + (topSources || 'Insufficient data'),
    'By session count',
    topSources || 'None', 'N/A',
    directCount > (allRows.length * 0.6)
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
  var totalDev = Object.keys(devMap).reduce(function(acc, k) { return acc + devMap[k]; }, 0) || 1;
  var mobilePct= Math.round(mobile / totalDev * 100);
  addInsight(
    'Device Distribution',
    'Device split — Desktop: ' + Math.round(desktop / totalDev * 100) + '%, Mobile: ' + mobilePct + '%, Tablet: ' + Math.round(tablet / totalDev * 100) + '%',
    mobile + ' mobile / ' + desktop + ' desktop sessions',
    'Mobile: ' + mobilePct + '%', 'N/A',
    mobilePct > 40
      ? 'Over ' + mobilePct + '% mobile visitors — verify mobile form usability and CTA tap-target sizes.'
      : 'Primarily desktop audience — ensure rich desktop experience with detailed content.',
    mobilePct > 40 ? 'High' : 'Informational',
    totalEvents >= 20 ? 'Medium' : 'Low (preliminary)'
  );

  // ── 5. CTA Engagement ──
  var ctaClicks   = filterType(allRows, 'cta_click').length +
                    filterType(allRows, 'nav_click').length +
                    filterType(allRows, 'whatsapp_cta_click').length;
  var waClicks    = filterType(allRows, 'whatsapp_cta_click').length;
  var conversions = filterType(allRows, 'form_submission_success').length;
  var pvAll       = filterType(allRows, 'page_view').length || 1;
  var ctaRate     = (ctaClicks / pvAll * 100).toFixed(1);
  var convRate    = (conversions / pvAll * 100).toFixed(1);
  addInsight(
    'CTA Engagement',
    'CTA clicks: ' + ctaClicks + ' (' + ctaRate + '% of page views). WhatsApp clicks: ' + waClicks + '. Form conversions: ' + conversions + ' (' + convRate + '% conversion rate)',
    ctaClicks + ' CTA clicks / ' + conversions + ' conversions',
    'Conv rate: ' + convRate + '%', 'N/A',
    parseFloat(convRate) < 2.0
      ? 'Conversion rate is below 2%. Review CTA copy, placement, and enquiry form length.'
      : 'Conversion rate is healthy. A/B test CTA copy to push it higher.',
    parseFloat(convRate) < 2.0 ? 'High' : 'Informational',
    totalEvents >= 20 ? 'Medium' : 'Low (preliminary)'
  );

  // ── 6. Form funnel ──
  var longStart  = filterType(allRows, 'form_start').filter(function(r) { return r[colIdx['Form Type']] === 'Long Form'; }).length;
  var shortStart = filterType(allRows, 'form_start').filter(function(r) { return r[colIdx['Form Type']] === 'Short Form'; }).length;
  var longConv   = filterType(allRows, 'form_submission_success').filter(function(r) { return r[colIdx['Form Type']] === 'Long Form'; }).length;
  var shortConv  = filterType(allRows, 'form_submission_success').filter(function(r) { return r[colIdx['Form Type']] === 'Short Form'; }).length;

  if (longStart > 0 || shortStart > 0) {
    var longRate = longStart > 0 ? (longConv / longStart * 100).toFixed(1) : '0.0';
    var shortRate = shortStart > 0 ? (shortConv / shortStart * 100).toFixed(1) : '0.0';
    addInsight(
      'Form Funnel',
      'Long Form: ' + longStart + ' starts → ' + longConv + ' submissions (' + longRate + '%). Short Form: ' + shortStart + ' starts → ' + shortConv + ' submissions (' + shortRate + '%). Total conversions: ' + conversions,
      (longStart + shortStart) + ' starts → ' + conversions + ' submissions',
      'Long: ' + longRate + '%, Short: ' + shortRate + '%', 'N/A',
      longStart > longConv * 3
        ? 'High form abandonment on long form detected. Consider shortening or adding progress indicators.'
        : 'Form completion looks reasonable. Monitor over time.',
      longStart > longConv * 3 ? 'High' : 'Informational',
      totalEvents >= 10 ? 'Medium' : 'Low (preliminary)'
    );
  }

  // ── 7. Location page engagement ──
  var locRows = filterType(allRows, 'page_view').filter(function(r) {
    return String(r[colIdx['Page URL']] || '').includes('/locations/');
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
  var utmRows = allRows.filter(function(r) { return Boolean(r[colIdx['UTM Campaign']]); });
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

  // ── Write all insights atomically ──
  var lastRow = iSheet.getLastRow();
  if (lastRow > 1) {
    iSheet.getRange(2, 1, lastRow - 1, COLS_INTEL.length).clearContent();
  }
  if (insights.length > 0) {
    iSheet.getRange(2, 1, insights.length, COLS_INTEL.length).setValues(insights);
  }
}

// ============================================================================
// HELPERS
// ============================================================================

function pctChange(current, previous) {
  if (!previous) return '+∞%';
  var pct = Math.round((current - previous) / previous * 100);
  return (pct >= 0 ? '+' : '') + pct + '%';
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

function getSpreadsheet() {
  if (ANALYTICS_SPREADSHEET_ID && ANALYTICS_SPREADSHEET_ID !== 'ACTIVE') {
    try {
      return SpreadsheetApp.openById(ANALYTICS_SPREADSHEET_ID);
    } catch (openErr) {
      return SpreadsheetApp.getActiveSpreadsheet();
    }
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getOrInitAnalyticsSheet(ss, name, columns, headerColor) {
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

// Backwards compatibility alias
function getOrInitSheet(ss, name, columns, headerColor) {
  return getOrInitAnalyticsSheet(ss, name, columns, headerColor);
}

function parseAnalyticsBody(e) {
  if (!e) return null;
  try {
    if (e.postData && e.postData.contents) {
      return JSON.parse(e.postData.contents);
    }
    if (e.parameter && Object.keys(e.parameter).length) return e.parameter;
  } catch (err) {}
  return null;
}

// Legacy alias
function parseBody(e) {
  return parseAnalyticsBody(e);
}

function validateEvent(ev) {
  if (!ev || typeof ev !== 'object') return null;
  var type = ev.event_type;
  if (!type || typeof type !== 'string' || type.length > 80) return null;
  if (ev.session_id && String(ev.session_id).length > 80) return null;
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
  var tSheet = getOrInitAnalyticsSheet(ss, SHEET_TRAFFIC, COLS_TRAFFIC, '#0E3A2B');
  regenerateIntelligence(ss, tSheet, new Date());
  Logger.log('Intelligence insights regenerated.');
}

// ============================================================================
// MANUAL TRIGGER — Initialize all three sheets with headers
// ============================================================================

function initAllSheets() {
  var ss = getSpreadsheet();
  getOrInitAnalyticsSheet(ss, SHEET_TRAFFIC, COLS_TRAFFIC,  '#0E3A2B');
  getOrInitAnalyticsSheet(ss, SHEET_INTEL,   COLS_INTEL,    '#1A5C3A');
  getOrInitAnalyticsSheet(ss, SHEET_SESSION, COLS_SESSION,  '#0D4D2C');
  Logger.log('All three analytics sheets initialized.');
}
