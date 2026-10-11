/**
 * GreenNext — Privacy-First Analytics & Session Intelligence Tracker
 *
 * Tracks real website events and sends them to the backend analytics API.
 * All data is anonymous. No names, emails, phone numbers, or form contents
 * are sent to analytics endpoints.
 *
 * Architecture:
 *  - Anonymous session ID (generated client-side, stored in sessionStorage)
 *  - Event queue with batched flush (max 10 events or 8s, whichever first)
 *  - Deduplication guard for rapid-fire events
 *  - Session duration tracked via periodic heartbeat
 *  - UTM + referrer capture from URL parameters
 */
(function () {
  'use strict';

  // ─── CONSTANTS ───────────────────────────────────────────────────────────────
  var ANALYTICS_ENDPOINT = '/api/analytics';
  var SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30-minute inactivity timeout
  var FLUSH_INTERVAL_MS  = 8000;            // Batch flush every 8 seconds
  var MAX_BATCH_SIZE     = 10;             // Max events per batch send
  var SESSION_KEY        = 'gn_session_id';
  var SESSION_START_KEY  = 'gn_session_start';
  var SESSION_LAST_KEY   = 'gn_session_last_active';
  var HEARTBEAT_MS       = 60000;          // Heartbeat every 60s for duration tracking

  // ─── SESSION MANAGEMENT ──────────────────────────────────────────────────────

  /**
   * Generate a random anonymous ID: gns_<timestamp_base36>_<random_hex>
   * Not tied to any personal identifier.
   */
  function generateSessionId() {
    var ts   = Date.now().toString(36);
    var rand = Math.random().toString(36).slice(2, 8);
    return 'gns_' + ts + '_' + rand;
  }

  function getOrCreateSession() {
    var now = Date.now();
    var sid = null;
    var lastActive = 0;
    try {
      sid        = sessionStorage.getItem(SESSION_KEY);
      lastActive = parseInt(sessionStorage.getItem(SESSION_LAST_KEY) || '0', 10);
    } catch (e) {}

    // If more than 30 min since last activity → new session
    var isExpired = sid && (now - lastActive) > SESSION_TIMEOUT_MS;
    if (!sid || isExpired) {
      sid = generateSessionId();
      try {
        sessionStorage.setItem(SESSION_KEY, sid);
        sessionStorage.setItem(SESSION_START_KEY, String(now));
        sessionStorage.setItem(SESSION_LAST_KEY, String(now));
      } catch (e) {}
    }
    return sid;
  }

  function touchSession() {
    try {
      sessionStorage.setItem(SESSION_LAST_KEY, String(Date.now()));
    } catch (e) {}
  }

  var SESSION_ID    = getOrCreateSession();
  var SESSION_START = parseInt((function() {
    try { return sessionStorage.getItem(SESSION_START_KEY) || String(Date.now()); }
    catch(e) { return String(Date.now()); }
  })(), 10);

  // ─── UTM & REFERRER CAPTURE ──────────────────────────────────────────────────

  function getUtmParams() {
    var params = new URLSearchParams(window.location.search);
    return {
      utm_source  : params.get('utm_source')   || '',
      utm_medium  : params.get('utm_medium')   || '',
      utm_campaign: params.get('utm_campaign') || '',
    };
  }

  function getReferrerSource() {
    var ref = document.referrer;
    if (!ref) return 'Direct';
    try {
      var refHost = new URL(ref).hostname.replace(/^www\./, '');
      var searchEngines = ['google', 'bing', 'yahoo', 'duckduckgo', 'baidu', 'yandex'];
      var socialMedia   = ['linkedin', 'twitter', 'facebook', 'instagram', 'youtube', 'whatsapp'];
      if (searchEngines.some(function(se) { return refHost.includes(se); })) return 'Organic Search';
      if (socialMedia.some(function(sm)   { return refHost.includes(sm); })) return 'Social Media';
      if (refHost === window.location.hostname) return 'Internal';
      return 'Referral: ' + refHost;
    } catch (e) {
      return 'Referral';
    }
  }

  function getDeviceCategory() {
    var ua = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(ua)) return 'Tablet';
    if (/mobile|android|iphone|ipod|phone|blackberry|windows phone/i.test(ua)) return 'Mobile';
    return 'Desktop';
  }

  function getBrowserCategory() {
    var ua = navigator.userAgent;
    if (/edg\//i.test(ua))  return 'Edge';
    if (/opr\//i.test(ua))  return 'Opera';
    if (/chrome/i.test(ua)) return 'Chrome';
    if (/safari/i.test(ua)) return 'Safari';
    if (/firefox/i.test(ua)) return 'Firefox';
    return 'Other';
  }

  function getOS() {
    var ua = navigator.userAgent;
    if (/windows/i.test(ua)) return 'Windows';
    if (/mac os/i.test(ua))  return 'macOS';
    if (/android/i.test(ua)) return 'Android';
    if (/iphone|ipad|ipod/i.test(ua)) return 'iOS';
    if (/linux/i.test(ua))   return 'Linux';
    return 'Other';
  }

  var UTM_PARAMS = getUtmParams();
  // Cache UTM params for the session — persist in sessionStorage for cross-page referral
  (function() {
    try {
      if (UTM_PARAMS.utm_source) {
        sessionStorage.setItem('gn_utm', JSON.stringify(UTM_PARAMS));
      } else {
        var cached = sessionStorage.getItem('gn_utm');
        if (cached) UTM_PARAMS = JSON.parse(cached);
      }
    } catch(e) {}
  })();

  var LANDING_PAGE = (function() {
    try { return sessionStorage.getItem('gn_landing') || ''; } catch(e) { return ''; }
  })();
  if (!LANDING_PAGE) {
    LANDING_PAGE = window.location.pathname;
    try { sessionStorage.setItem('gn_landing', LANDING_PAGE); } catch(e) {}
  }

  var REFERRER_SOURCE  = getReferrerSource();
  var DEVICE_CATEGORY  = getDeviceCategory();
  var BROWSER_CATEGORY = getBrowserCategory();
  var OS_NAME          = getOS();

  // ─── EVENT QUEUE & BATCHING ──────────────────────────────────────────────────

  var _queue        = [];
  var _flushTimer   = null;
  var _lastEventKey = '';   // Simple dedup — skip identical rapid-fire events

  function buildBaseEvent(eventType, extra) {
    touchSession();
    return Object.assign({
      event_type      : eventType,
      session_id      : SESSION_ID,
      page_url        : window.location.pathname,
      page_title      : document.title.substring(0, 120),
      referrer_source : REFERRER_SOURCE,
      utm_source      : UTM_PARAMS.utm_source,
      utm_medium      : UTM_PARAMS.utm_medium,
      utm_campaign    : UTM_PARAMS.utm_campaign,
      device_category : DEVICE_CATEGORY,
      browser_category: BROWSER_CATEGORY,
      os_name         : OS_NAME,
      landing_page    : LANDING_PAGE,
      session_start_ts: SESSION_START,
      client_ts       : Date.now(),
    }, extra || {});
  }

  function enqueue(event) {
    // Simple deduplication: skip if identical key fired within 500ms
    var key = event.event_type + '|' + (event.cta_name || '') + '|' + event.page_url;
    if (key === _lastEventKey) return;
    _lastEventKey = key;
    setTimeout(function() { if (_lastEventKey === key) _lastEventKey = ''; }, 500);

    _queue.push(event);

    if (_queue.length >= MAX_BATCH_SIZE) {
      flush();
    } else {
      scheduleFlush();
    }
  }

  function scheduleFlush() {
    if (_flushTimer) return;
    _flushTimer = setTimeout(flush, FLUSH_INTERVAL_MS);
  }

  function flush() {
    if (_flushTimer) { clearTimeout(_flushTimer); _flushTimer = null; }
    if (!_queue.length) return;

    var batch = _queue.splice(0, _queue.length);
    var config = window.GreenNextConfig || {};

    // Priority 1: Direct Google Apps Script URL (works on Vercel / static hosting)
    var gasUrl      = config.ANALYTICS_GAS_URL;
    // Priority 2: Server-side proxy endpoint (works on local Node.js server)
    var proxyUrl    = config.ANALYTICS_ENDPOINT || ANALYTICS_ENDPOINT;
    var payload     = JSON.stringify({ events: batch });

    if (gasUrl) {
      // Direct GAS call: must use text/plain to avoid CORS OPTIONS preflight
      if (navigator.sendBeacon) {
        navigator.sendBeacon(gasUrl, new Blob([payload], { type: 'text/plain;charset=utf-8' }));
      } else {
        fetch(gasUrl, {
          method   : 'POST',
          headers  : { 'Content-Type': 'text/plain;charset=utf-8' },
          body     : payload,
          redirect : 'follow',
          keepalive: true
        }).catch(function() {});
      }
    } else if (proxyUrl) {
      // Local proxy (Node.js serve.mjs) — standard JSON POST
      if (navigator.sendBeacon) {
        navigator.sendBeacon(proxyUrl, new Blob([payload], { type: 'application/json' }));
      } else {
        fetch(proxyUrl, {
          method   : 'POST',
          headers  : { 'Content-Type': 'application/json' },
          body     : payload,
          keepalive: true
        }).catch(function() {});
      }
    }
    // If neither configured: events collected but silently dropped (no errors shown to visitor)
  }

  // Flush before page unload
  window.addEventListener('pagehide', flush);
  window.addEventListener('beforeunload', flush);

  // ─── PUBLIC TRACK FUNCTION ────────────────────────────────────────────────────

  window.GreenNextAnalytics = {
    track: function(eventType, extra) {
      enqueue(buildBaseEvent(eventType, extra));
    }
  };

  // ─── AUTO-TRACKING: PAGE VIEWS ────────────────────────────────────────────────

  window.GreenNextAnalytics.track('page_view');

  // ─── AUTO-TRACKING: CTA CLICKS ───────────────────────────────────────────────

  document.addEventListener('click', function(e) {
    var el = e.target;

    // Walk up DOM to find trackable element
    var target = el.closest(
      'a[data-cta], button[data-cta], ' +
      '.btn-primary, .btn-secondary, .btn-outline, ' +
      '.hero-cta, .hero-cta-secondary, ' +
      '.talk-expert-btn, .whatsapp-cta, [data-whatsapp="true"], ' +
      '.floating-whatsapp, #floating-whatsapp, ' +
      '.nav-link, .dropdown-item, .mobile-nav-item, .mobile-accordion-link, ' +
      '.slider-arrow--prev, .slider-arrow--next, .slider-indicator, ' +
      '.card-cta, .solution-card a, .capability-card a, .location-card a'
    );

    if (!target) return;

    // Determine CTA name
    var ctaName = target.getAttribute('data-cta') ||
                  target.getAttribute('aria-label') ||
                  (target.textContent || '').trim().substring(0, 60) ||
                  target.className.split(' ')[0];

    // Determine event type
    var eventType = 'cta_click';
    if (target.matches('[data-whatsapp="true"], .floating-whatsapp, #floating-whatsapp, .whatsapp-cta')) {
      eventType = 'whatsapp_cta_click';
    } else if (target.matches('.nav-link, .dropdown-item, .mobile-nav-item, .mobile-accordion-link')) {
      eventType = 'nav_click';
    } else if (target.matches('.slider-arrow--prev, .slider-arrow--next, .slider-indicator')) {
      eventType = 'slider_interaction';
    }

    var href = target.getAttribute('href') || '';
    window.GreenNextAnalytics.track(eventType, {
      cta_name        : ctaName,
      cta_href        : href.substring(0, 200),
      conversion_status: '',
    });
  }, { passive: true });

  // ─── AUTO-TRACKING: FORM EVENTS ──────────────────────────────────────────────

  // Track form-start (first interaction with a form field)
  document.querySelectorAll('.lead-form, .quick-enquiry-form, .careers-form').forEach(function(form) {
    var formType = form.classList.contains('quick-enquiry-form') ? 'Short Form' :
                   form.classList.contains('careers-form')       ? 'Careers'   : 'Long Form';
    var started  = false;

    form.addEventListener('focusin', function() {
      if (started) return;
      started = true;
      window.GreenNextAnalytics.track('form_start', {
        form_type: formType,
        cta_name : 'Form Start: ' + formType,
      });
    }, { once: false });
  });

  // ─── AUTO-TRACKING: HEARTBEAT (SESSION DURATION) ─────────────────────────────

  setInterval(function() {
    touchSession();
    window.GreenNextAnalytics.track('session_heartbeat', {
      session_age_seconds: Math.round((Date.now() - SESSION_START) / 1000),
    });
  }, HEARTBEAT_MS);

  // ─── EXPOSE CONVERSION TRACKER (called from forms.js on success) ─────────────

  /**
   * Called by forms.js on successful submission.
   * Only sends event type and form type — no personal data.
   */
  window.GreenNextAnalytics.trackConversion = function(formType, enquiryId) {
    window.GreenNextAnalytics.track('form_submission_success', {
      form_type        : formType,
      cta_name         : 'Form Submitted: ' + formType,
      conversion_status: 'Converted',
      enquiry_id_prefix: enquiryId ? enquiryId.substring(0, 12) : '', // Only prefix, not full ID
    });
    flush(); // Immediate flush on conversion
  };

  // ─── EXPOSE SCROLL DEPTH TRACKER ─────────────────────────────────────────────

  var scrollMilestones = { 25: false, 50: false, 75: false, 90: false };
  window.addEventListener('scroll', function() {
    var scrollPct = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1)) * 100
    );
    [25, 50, 75, 90].forEach(function(milestone) {
      if (!scrollMilestones[milestone] && scrollPct >= milestone) {
        scrollMilestones[milestone] = true;
        window.GreenNextAnalytics.track('scroll_depth', {
          cta_name: 'Scroll ' + milestone + '%',
          scroll_depth_pct: milestone,
        });
      }
    });
  }, { passive: true });

})();
