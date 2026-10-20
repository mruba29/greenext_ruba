/**
 * GreenNext — Enterprise Forms & Google Sheets Integration Controller
 *
 * Connects Long Form (Talk to an Expert) and Short Form (Quick Enquiry)
 * with Google Apps Script Web App and local /api/enquiry proxy.
 *
 * Implements:
 * - Robust client-side validation
 * - Prevention of duplicate clicks / submissions
 * - Real loading spinner & button states
 * - Error banner display with entered data preservation
 * - Google Sheets row storage with unique Enquiry ID
 * - Thank-You modal activation on verified success only
 */
(function () {
  'use strict';

  // 1. Preselect "Area of Interest" from URL query string if present
  var params = new URLSearchParams(window.location.search);
  var interest = params.get('interest');
  if (interest) {
    document.querySelectorAll('select[name="area_of_interest"]').forEach(function (select) {
      var match = Array.prototype.find.call(select.options, function (o) {
        return o.value.toLowerCase() === interest.toLowerCase();
      });
      if (match) select.value = match.value;
    });
  }

  // 2. Helper to display the Thank-You modal with dynamic lead name and Enquiry ID
  function showThankYouModal(leadData) {
    var thankYouModal = document.getElementById('gn-thankyou-modal');
    if (!thankYouModal) return;

    var nameEl = thankYouModal.querySelector('.gn-thankyou-name');
    if (nameEl && leadData && leadData.fullName) {
      nameEl.textContent = leadData.fullName;
    }

    // Insert or update Enquiry ID badge in modal
    var existingBadge = thankYouModal.querySelector('.modal-enquiry-badge');
    if (existingBadge) {
      existingBadge.remove();
    }
    if (leadData && leadData.enquiryId) {
      var badge = document.createElement('div');
      badge.className = 'modal-enquiry-badge';
      badge.style.cssText = 'display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:9999px;background:rgba(14,138,95,0.1);border:1px solid rgba(14,138,95,0.25);color:var(--color-primary);font-size:12px;font-weight:700;margin-top:8px;margin-bottom:12px;';
      badge.innerHTML = '<span>Ref ID:</span> <code>' + leadData.enquiryId + '</code>';
      var headerEl = thankYouModal.querySelector('.gn-modal-header');
      if (headerEl) {
        headerEl.appendChild(badge);
      }
    }

    thankYouModal.classList.add('active');
    thankYouModal.setAttribute('aria-hidden', 'false');
  }

  // 3. Helper to render or clear inline error banners
  function showErrorBanner(card, message) {
    if (!card) return;
    clearErrorBanner(card);

    var banner = document.createElement('div');
    banner.className = 'form-error-banner';
    banner.setAttribute('role', 'alert');
    banner.innerHTML =
      '<svg class="form-error-banner-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
      '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>' +
      '</svg>' +
      '<div><strong>Submission Notice:</strong> ' + message + '</div>';

    var form = card.querySelector('form');
    if (form) {
      form.parentNode.insertBefore(banner, form);
    }
  }

  function clearErrorBanner(card) {
    if (!card) return;
    var existing = card.querySelector('.form-error-banner');
    if (existing) existing.remove();
  }

  // 4. Validation Helpers
  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);
  }

  function isValidPhone(val) {
    var digits = (val || '').replace(/\D/g, '');
    return digits.length >= 7 && digits.length <= 15;
  }

  // 5. Connect all Lead & Enquiry forms
  var allForms = document.querySelectorAll('.lead-form, .quick-enquiry-form, .careers-form, .floating-lead-form');

  allForms.forEach(function (form) {
    var card = form.closest('.lead-form-card, .quick-enquiry-card, .footer-enquiry-card, .gn-modal');
    var submitBtn = form.querySelector('button[type="submit"]');
    var isShortForm = form.classList.contains('quick-enquiry-form');
    var isCareersForm = form.classList.contains('careers-form');
    var isFloatingLeadForm = form.classList.contains('floating-lead-form');

    // Live validation feedback on touch/input
    form.addEventListener('input', function (e) {
      if (e.target.matches('input, select, textarea')) {
        e.target.classList.add('touched');
        if (e.target.checkValidity()) {
          e.target.classList.remove('has-error');
        }
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearErrorBanner(card);

      // Check for duplicate submission in flight
      if (form.getAttribute('data-submitting') === 'true') {
        return;
      }

      var fields = form.querySelectorAll('input, select, textarea');
      var valid = true;
      var firstInvalid = null;
      var validationMsg = null;

      // Check HTML5 constraints
      fields.forEach(function (field) {
        field.classList.add('touched');
        if (!field.checkValidity()) {
          valid = false;
          field.classList.add('has-error');
          if (!firstInvalid) firstInvalid = field;
        } else {
          field.classList.remove('has-error');
        }
      });

      // Additional business logic validations
      if (isShortForm) {
        var nameInput = form.querySelector('[name="name"]');
        var contactInput = form.querySelector('[name="contact"]');
        var interestInput = form.querySelector('[name="area_of_interest"]');

        if (!nameInput || !nameInput.value.trim() || nameInput.value.trim().length < 2) {
          valid = false;
          if (nameInput) nameInput.classList.add('has-error');
          validationMsg = 'Please enter your name (at least 2 characters).';
          if (!firstInvalid) firstInvalid = nameInput;
        } else if (!contactInput || !contactInput.value.trim()) {
          valid = false;
          if (contactInput) contactInput.classList.add('has-error');
          validationMsg = 'Please enter a valid work email or phone number.';
          if (!firstInvalid) firstInvalid = contactInput;
        } else if (contactInput.value.includes('@') && !isValidEmail(contactInput.value.trim())) {
          valid = false;
          contactInput.classList.add('has-error');
          validationMsg = 'Please provide a valid email format (e.g. name@company.com).';
          if (!firstInvalid) firstInvalid = contactInput;
        } else if (!contactInput.value.includes('@') && !isValidPhone(contactInput.value.trim())) {
          valid = false;
          contactInput.classList.add('has-error');
          validationMsg = 'Please provide a valid phone number (min 7 digits).';
          if (!firstInvalid) firstInvalid = contactInput;
        } else if (!interestInput || !interestInput.value) {
          valid = false;
          if (interestInput) interestInput.classList.add('has-error');
          validationMsg = 'Please select an area of interest.';
          if (!firstInvalid) firstInvalid = interestInput;
        }
      } else if (isFloatingLeadForm) {
        // Compact Floating Lead Form validation
        var flNameInput = form.querySelector('[name="full_name"]');
        var flEmailInput = form.querySelector('[name="business_email"]');
        var flPhoneInput = form.querySelector('[name="phone"]');
        var flInterestInput = form.querySelector('[name="area_of_interest"]');
        var flConsentCheckbox = form.querySelector('input[name="consent"]');

        if (!flNameInput || !flNameInput.value.trim() || flNameInput.value.trim().length < 2) {
          valid = false;
          if (flNameInput) flNameInput.classList.add('has-error');
          validationMsg = 'Please enter your full name (at least 2 characters).';
          if (!firstInvalid) firstInvalid = flNameInput;
        } else if (!flEmailInput || !isValidEmail(flEmailInput.value.trim())) {
          valid = false;
          if (flEmailInput) flEmailInput.classList.add('has-error');
          validationMsg = 'Please enter a valid work email address.';
          if (!firstInvalid) firstInvalid = flEmailInput;
        } else if (!flPhoneInput || !isValidPhone(flPhoneInput.value.trim())) {
          valid = false;
          if (flPhoneInput) flPhoneInput.classList.add('has-error');
          validationMsg = 'Please enter a valid phone number (at least 7 digits).';
          if (!firstInvalid) firstInvalid = flPhoneInput;
        } else if (!flInterestInput || !flInterestInput.value) {
          valid = false;
          if (flInterestInput) flInterestInput.classList.add('has-error');
          validationMsg = 'Please select a requirement or service.';
          if (!firstInvalid) firstInvalid = flInterestInput;
        } else if (flConsentCheckbox && !flConsentCheckbox.checked) {
          valid = false;
          validationMsg = 'Please agree to the privacy policy to proceed.';
          if (!firstInvalid) firstInvalid = flConsentCheckbox;
        }
      } else if (!isCareersForm) {
        // Long Form (Talk to an Expert / Consultation)
        var fullNameInput = form.querySelector('[name="full_name"]');
        var emailInput = form.querySelector('[name="business_email"]');
        var phoneInput = form.querySelector('[name="phone"]');
        var consentCheckbox = form.querySelector('input[name="consent"]');

        if (emailInput && !isValidEmail(emailInput.value.trim())) {
          valid = false;
          emailInput.classList.add('has-error');
          validationMsg = 'Please enter a valid business email address.';
          if (!firstInvalid) firstInvalid = emailInput;
        } else if (phoneInput && !isValidPhone(phoneInput.value.trim())) {
          valid = false;
          phoneInput.classList.add('has-error');
          validationMsg = 'Please enter a valid phone number (at least 7 digits).';
          if (!firstInvalid) firstInvalid = phoneInput;
        } else if (consentCheckbox && !consentCheckbox.checked) {
          valid = false;
          validationMsg = 'Please check the consent box to proceed with your enquiry.';
          if (!firstInvalid) firstInvalid = consentCheckbox;
        }
      }

      if (!valid) {
        if (firstInvalid) firstInvalid.focus();
        showErrorBanner(card, validationMsg || 'Please complete all required fields correctly before submitting.');
        return;
      }

      // Lock form against multiple submissions
      form.setAttribute('data-submitting', 'true');

      if (submitBtn) {
        submitBtn.disabled = true;
        if (!submitBtn.getAttribute('data-original-text')) {
          submitBtn.setAttribute('data-original-text', submitBtn.innerHTML);
        }
        submitBtn.innerHTML = '<span class="btn-spinner"></span> <span>Submitting Enquiry...</span>';
      }

      // Build payload matching all 16 Google Sheet columns + hidden metadata
      var formData = new FormData(form);
      var defaultFormType = isFloatingLeadForm ? 'Floating Lead Form' : (isShortForm ? 'Short Form' : (isCareersForm ? 'Careers Application' : 'Long Form'));
      var searchParams = new URLSearchParams(window.location.search);

      var payload = {
        form_type: defaultFormType,
        page_source: window.location.pathname,
        submitted_at_client: new Date().toISOString(),
        page_url: window.location.href,
        page_title: document.title,
        referrer: document.referrer || 'Direct',
        utm_source: searchParams.get('utm_source') || '',
        utm_medium: searchParams.get('utm_medium') || '',
        utm_campaign: searchParams.get('utm_campaign') || '',
        utm_term: searchParams.get('utm_term') || '',
        utm_content: searchParams.get('utm_content') || ''
      };

      formData.forEach(function (value, key) {
        payload[key] = value;
      });

      var leadName = payload.full_name || payload.name || 'Valued Partner';

      // Determine backend target:
      // Priority 1: /api/enquiry (Vercel serverless function & local proxy — triggers Jira + Email Automation)
      // Priority 2: Direct Google Apps Script Web App (only for pure static file:// environments without backend)
      var apiEndpoint = (window.GreenNextConfig && window.GreenNextConfig.API_ENDPOINT) || '/api/enquiry';
      var gasUrl = window.GreenNextConfig && window.GreenNextConfig.GOOGLE_APPS_SCRIPT_URL;
      var isHttp = window.location.protocol.indexOf('http') === 0;
      var targetUrl = isHttp ? apiEndpoint : (gasUrl || apiEndpoint);

      // For direct Google Apps Script Web App calls:
      // We must use 'text/plain;charset=utf-8' so browsers do NOT trigger CORS OPTIONS preflights,
      // which Google Apps Script web apps do not handle.
      var isDirectGas = Boolean(gasUrl && targetUrl === gasUrl);
      var fetchHeaders = isDirectGas
        ? { 'Content-Type': 'text/plain;charset=utf-8' }
        : { 'Content-Type': 'application/json' };

      fetch(targetUrl, {
        method: 'POST',
        headers: fetchHeaders,
        body: JSON.stringify(payload),
        redirect: 'follow'
      })
        .then(function (res) {
          if (!res.ok && !isDirectGas) {
            throw new Error('Server returned status ' + res.status);
          }
          return res.json().catch(function () {
            // If response cannot be parsed as JSON, treat as error unless status is ok
            if (res.ok) return { success: true };
            throw new Error('Unable to parse server response.');
          });
        })
        .then(function (data) {
          if (data && data.success === false) {
            throw new Error(data.message || 'The server rejected this submission.');
          }

          var assignedId = (data && data.enquiryId) || ('GN-' + Date.now().toString(36).toUpperCase());

          // Success: finalize form
          form.removeAttribute('data-submitting');
          sessionStorage.setItem('gn_enquiry_submitted', assignedId);

          if (card) {
            card.classList.add('submitted');
            var successMsg = card.querySelector('.form-success');
            if (successMsg) {
              successMsg.style.display = 'flex';

              // Display assigned reference ID
              var idBadge = successMsg.querySelector('.form-enquiry-id-badge');
              if (!idBadge) {
                idBadge = document.createElement('div');
                idBadge.className = 'form-enquiry-id-badge';
                successMsg.appendChild(idBadge);
              }
              idBadge.textContent = 'Enquiry ID: ' + assignedId;

              var heading = successMsg.querySelector('h3');
              if (heading) {
                heading.setAttribute('tabindex', '-1');
                heading.focus();
              }
            }
          }

          // If this submission was from the floating lead modal, dismiss it
          var floatingLeadModal = document.getElementById('gn-floating-lead-modal');
          if (floatingLeadModal && floatingLeadModal.classList.contains('active')) {
            floatingLeadModal.classList.remove('active');
            floatingLeadModal.setAttribute('aria-hidden', 'true');
          }

          // Trigger thank-you modal
          showThankYouModal({
            fullName: leadName,
            enquiryId: assignedId
          });

          // Analytics: track conversion (privacy-safe — no personal data sent)
          if (window.GreenNextAnalytics && window.GreenNextAnalytics.trackConversion) {
            var analyticsFormType = isFloatingLeadForm ? 'Floating Lead Form' : (isShortForm ? 'Short Form' : (isCareersForm ? 'Careers' : 'Long Form'));
            window.GreenNextAnalytics.trackConversion(analyticsFormType, assignedId);
          }

          // Reset inputs on confirmed success
          form.reset();
        })
        .catch(function (err) {
          console.error('GreenNext form submission error:', err);
          // Unlock form and preserve entered data for easy retry
          form.removeAttribute('data-submitting');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = submitBtn.getAttribute('data-original-text') || 'Submit Enquiry';
          }

          var userMsg = (err && err.message)
            ? err.message
            : 'Unable to transmit enquiry at this time. Your entered information is preserved. Please retry or connect via WhatsApp.';

          showErrorBanner(card, userMsg);
        });
    });
  });
})();
