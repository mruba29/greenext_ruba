/**
 * GreenNext — Enterprise Modals Controller
 * Handles time-based welcome modal, returning visitor greeting,
 * respectful exit intent detection, and dynamic WhatsApp bindings.
 */
(function () {
  var config = window.GreenNextConfig || {
    WELCOME_DELAY_MS: 1000,
    EXIT_INTENT_MIN_PAGE_TIME_MS: 10000,
  };

  var pageLoadTime = Date.now();
  var isWelcomeActive = false;

  /* ============================================================
     1. TIME-BASED GREETING CALCULATOR
     ============================================================ */
  function getGreetingData() {
    var hour = new Date().getHours();
    var greeting = '';
    var timeSlot = '';

    if (hour >= 5 && hour < 12) {
      greeting = 'Good Morning!';
      timeSlot = 'Morning';
    } else if (hour >= 12 && hour < 17) {
      greeting = 'Good Afternoon!';
      timeSlot = 'Afternoon';
    } else if (hour >= 17 && hour < 21) {
      greeting = 'Good Evening!';
      timeSlot = 'Evening';
    } else {
      greeting = 'Good Night!';
      timeSlot = 'Night';
    }

    return {
      greeting: greeting,
      timeSlot: timeSlot,
      formattedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  /* ============================================================
     2. WELCOME MODAL LOGIC (FIRST VISIT & RETURNING VISITOR)
     ============================================================ */
  function initWelcomeModal() {
    var modalBackdrop = document.getElementById('gn-welcome-modal');
    if (!modalBackdrop) return;

    // Check session storage — show only once per session
    if (sessionStorage.getItem('gn_welcome_shown')) {
      return;
    }

    var hasVisitedBefore = false;
    try {
      hasVisitedBefore = localStorage.getItem('gn_visited_before') === 'true';
    } catch (e) {
      // storage unavailable / incognito fallback
    }

    var greetingData = getGreetingData();
    var titleEl = modalBackdrop.querySelector('.gn-welcome-title');
    var badgeEl = modalBackdrop.querySelector('.gn-welcome-badge-text');
    var bodyEl = modalBackdrop.querySelector('.gn-welcome-body-text');

    if (hasVisitedBefore) {
      if (titleEl) titleEl.textContent = 'Welcome Back to GreenNext';
      if (badgeEl) badgeEl.textContent = greetingData.greeting + ' • Returning Visitor';
      if (bodyEl) {
        bodyEl.textContent = 'Ready to explore smarter infrastructure? Continue reviewing our AI-ready regional facilities across Madurai, Coimbatore, Trichy, and Mangalore.';
      }
    } else {
      if (titleEl) titleEl.textContent = greetingData.greeting + ' Welcome to GreenNext';
      if (badgeEl) badgeEl.textContent = greetingData.greeting + ' (' + greetingData.formattedTime + ')';
      if (bodyEl) {
        bodyEl.textContent = 'Discover intelligent infrastructure designed for a smarter, more sustainable future.';
      }
    }

    // Delay presentation politely
    setTimeout(function () {
      openModal(modalBackdrop);
      isWelcomeActive = true;
      sessionStorage.setItem('gn_welcome_shown', 'true');
      try {
        localStorage.setItem('gn_visited_before', 'true');
      } catch (e) {}
    }, config.WELCOME_DELAY_MS || 1000);
  }

  /* ============================================================
     3. EXIT INTENT EXPERIENCE
     ============================================================ */
  function initExitIntent() {
    var exitModal = document.getElementById('gn-exit-modal');
    if (!exitModal) return;

    // Check if exit intent was already shown this session or if form was submitted
    if (sessionStorage.getItem('gn_exit_shown') || sessionStorage.getItem('gn_form_submitted')) {
      return;
    }

    function isUserTypingInForm() {
      var active = document.activeElement;
      if (!active) return false;
      var tag = active.tagName.toLowerCase();
      return tag === 'input' || tag === 'textarea' || tag === 'select';
    }

    function onMouseLeave(e) {
      // Guard: must have spent minimum time on page (e.g. 10s)
      if (Date.now() - pageLoadTime < config.EXIT_INTENT_MIN_PAGE_TIME_MS) return;

      // Guard: welcome modal must not be open
      if (isWelcomeActive) return;

      // Guard: user already saw it or submitted a form
      if (sessionStorage.getItem('gn_exit_shown') || sessionStorage.getItem('gn_form_submitted')) {
        document.removeEventListener('mouseleave', onMouseLeave);
        return;
      }

      // Guard: user is actively typing in a form
      if (isUserTypingInForm()) return;

      // Detect mouse leaving through top of viewport
      if (e.clientY <= 15) {
        openModal(exitModal);
        sessionStorage.setItem('gn_exit_shown', 'true');
        document.removeEventListener('mouseleave', onMouseLeave);
      }
    }

    // Only attach desktop mouseleave listener
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      document.addEventListener('mouseleave', onMouseLeave);
    }
  }

  /* ============================================================
     4. GENERIC MODAL CONTROLS (OPEN, CLOSE, ACCESSIBILITY)
     ============================================================ */
  function openModal(backdrop) {
    if (!backdrop) return;
    backdrop.classList.add('active');
    backdrop.setAttribute('aria-hidden', 'false');

    var focusable = backdrop.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();
  }

  function closeModal(backdrop) {
    if (!backdrop) return;
    backdrop.classList.remove('active');
    backdrop.setAttribute('aria-hidden', 'true');
    if (backdrop.id === 'gn-welcome-modal') {
      isWelcomeActive = false;
    }
  }

  // Bind close buttons and overlay dismiss
  document.querySelectorAll('.gn-modal-backdrop').forEach(function (backdrop) {
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) {
        closeModal(backdrop);
      }
    });

    backdrop.querySelectorAll('[data-dismiss="modal"]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        closeModal(backdrop);
      });
    });
  });

  // Escape key closes active modal
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var active = document.querySelector('.gn-modal-backdrop.active');
      if (active) closeModal(active);
    }
  });

  /* ============================================================
     5. REUSABLE GLOBAL FLOATING LEAD MODAL CONTROLLER
     ============================================================ */
  function getUtmParameters() {
    var params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_term: params.get('utm_term') || '',
      utm_content: params.get('utm_content') || ''
    };
  }

  function populateLeadMetadata(modalEl) {
    if (!modalEl) return;
    var form = modalEl.querySelector('form');
    if (!form) return;

    var utm = getUtmParameters();
    var setHidden = function (name, val) {
      var input = form.querySelector('input[name="' + name + '"]');
      if (input) input.value = val || '';
    };

    setHidden('page_url', window.location.href);
    setHidden('page_title', document.title);
    setHidden('referrer', document.referrer || 'Direct');
    setHidden('utm_source', utm.utm_source);
    setHidden('utm_medium', utm.utm_medium);
    setHidden('utm_campaign', utm.utm_campaign);
    setHidden('utm_term', utm.utm_term);
    setHidden('utm_content', utm.utm_content);
  }

  function openLeadModal(serviceName) {
    var modal = document.getElementById('gn-floating-lead-modal');
    if (!modal) return;

    if (serviceName) {
      var select = modal.querySelector('select[name="area_of_interest"]');
      if (select) {
        var match = Array.prototype.find.call(select.options, function (o) {
          return o.value.toLowerCase().includes(serviceName.toLowerCase()) ||
                 serviceName.toLowerCase().includes(o.value.toLowerCase());
        });
        if (match) select.value = match.value;
      }
    }

    populateLeadMetadata(modal);
    openModal(modal);
  }
  window.openGreenNextLeadModal = openLeadModal;

  function initLeadModalTriggers() {
    var leadModal = document.getElementById('gn-floating-lead-modal');
    if (!leadModal) return;

    document.querySelectorAll('[data-open-lead-modal="true"], .open-lead-modal').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        // If user is already on contact.html and clicking an anchor to the in-page form, allow natural scroll
        var path = window.location.pathname;
        var isContactPage = path.endsWith('contact.html') || path.endsWith('/contact') || path.endsWith('/contact.html');
        var href = btn.getAttribute('href') || '';
        if (isContactPage && (href.includes('#enquiry') || href.includes('#quick-enquiry'))) {
          return;
        }

        e.preventDefault();
        var service = btn.getAttribute('data-service') || '';
        openLeadModal(service);
      });
    });
  }

  /* ============================================================
     6. WHATSAPP CLICK BINDINGS
     ============================================================ */
  function initWhatsAppLinks() {
    document.querySelectorAll('[data-whatsapp="true"]').forEach(function (el) {
      var customMsg = el.getAttribute('data-whatsapp-msg');
      var url = window.getGreenNextWhatsAppUrl(customMsg);
      el.setAttribute('href', url);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    });

    var floatingWa = document.getElementById('floating-whatsapp');
    if (floatingWa) {
      floatingWa.setAttribute('href', window.getGreenNextWhatsAppUrl());
      floatingWa.setAttribute('target', '_blank');
      floatingWa.setAttribute('rel', 'noopener noreferrer');
    }
  }

  // Initialize on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initWelcomeModal();
      initExitIntent();
      initLeadModalTriggers();
      initWhatsAppLinks();
    });
  } else {
    initWelcomeModal();
    initExitIntent();
    initLeadModalTriggers();
    initWhatsAppLinks();
  }
})();
