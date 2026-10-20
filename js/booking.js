/**
 * GreenNext — Calendar Scheduling & Consultation Booking Client Controller
 */
(function () {
  'use strict';

  var bookingForm = document.getElementById('gn-booking-form');
  var bookingCard = document.getElementById('gn-booking-card');
  if (!bookingForm || !bookingCard) return;

  var dateInput = document.getElementById('booking_date');
  var slotsGrid = document.getElementById('booking_slots_grid');
  var slotsLoading = document.getElementById('booking_slots_loading');
  var selectedSlotInput = document.getElementById('selected_time_slot');
  var consultationTypeInput = document.getElementById('consultation_type_input');
  var meetingModeInput = document.getElementById('meeting_mode_input');

  // 1. Initialize next available business day as default date
  function getNextBusinessDay() {
    var d = new Date();
    d.setDate(d.getDate() + 1); // Tomorrow
    while (d.getDay() === 0 || d.getDay() === 6) {
      d.setDate(d.getDate() + 1); // Skip weekends
    }
    return d.toISOString().split('T')[0];
  }

  var defaultDate = getNextBusinessDay();
  if (dateInput && !dateInput.value) {
    dateInput.value = defaultDate;
    // Set min date to tomorrow
    dateInput.min = defaultDate;
  }

  // 2. Fetch live available slots for a selected date
  function fetchSlots(dateStr) {
    if (!slotsGrid) return;

    if (slotsLoading) slotsLoading.style.display = 'block';
    slotsGrid.innerHTML = '';

    fetch('/api/booking?date=' + encodeURIComponent(dateStr))
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (slotsLoading) slotsLoading.style.display = 'none';

        if (!data || !data.success || !Array.isArray(data.slots) || data.slots.length === 0) {
          slotsGrid.innerHTML = '<div style="grid-column:1/-1;font-size:13px;color:var(--color-text-muted);padding:8px 0;">' +
            (data.message || 'No available consultation slots on this date. Please choose another weekday.') +
            '</div>';
          return;
        }

        data.slots.forEach(function (slot) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'booking-slot-btn';
          btn.textContent = slot.startTime + ' IST';
          btn.setAttribute('data-slot', slot.startTime);
          btn.setAttribute('data-end', slot.endTime);

          if (!slot.available) {
            btn.disabled = true;
            btn.title = 'Slot reserved';
          } else {
            btn.addEventListener('click', function () {
              document.querySelectorAll('.booking-slot-btn').forEach(function (b) {
                b.classList.remove('selected');
              });
              btn.classList.add('selected');
              if (selectedSlotInput) {
                selectedSlotInput.value = slot.startTime;
              }
            });
          }

          slotsGrid.appendChild(btn);
        });

        // Automatically select the first available slot
        var firstAvail = slotsGrid.querySelector('.booking-slot-btn:not(:disabled)');
        if (firstAvail) {
          firstAvail.click();
        }
      })
      .catch(function () {
        if (slotsLoading) slotsLoading.style.display = 'none';
        slotsGrid.innerHTML = '<div style="grid-column:1/-1;font-size:13px;color:var(--color-error);padding:8px 0;">Unable to load calendar availability. Please try again.</div>';
      });
  }

  if (dateInput) {
    dateInput.addEventListener('change', function () {
      if (dateInput.value) {
        fetchSlots(dateInput.value);
      }
    });
    // Initial fetch
    fetchSlots(dateInput.value || defaultDate);
  }

  // 3. Consultation Type selection
  document.querySelectorAll('.consultation-type-option').forEach(function (card) {
    card.addEventListener('click', function () {
      document.querySelectorAll('.consultation-type-option').forEach(function (c) {
        c.classList.remove('selected');
      });
      card.classList.add('selected');
      var val = card.getAttribute('data-type');
      if (consultationTypeInput) consultationTypeInput.value = val;
    });
  });

  // 4. Meeting Mode selection
  document.querySelectorAll('.booking-mode-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.booking-mode-btn').forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      var mode = btn.getAttribute('data-mode');
      if (meetingModeInput) meetingModeInput.value = mode;

      var locField = document.getElementById('booking_location_group');
      if (locField) {
        locField.style.display = mode.indexOf('In-Person') !== -1 ? 'block' : 'none';
      }
    });
  });

  // 5. Submit booking handler
  bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (bookingForm.getAttribute('data-submitting') === 'true') return;

    var fullName = (document.getElementById('booking_full_name') || {}).value || '';
    var email = (document.getElementById('booking_email') || {}).value || '';
    var phone = (document.getElementById('booking_phone') || {}).value || '';
    var company = (document.getElementById('booking_company') || {}).value || '';
    var location = (document.getElementById('booking_location') || {}).value || 'Regional Hub';
    var requirements = (document.getElementById('booking_requirements') || {}).value || '';
    var bookingDate = (dateInput || {}).value;
    var startTime = (selectedSlotInput || {}).value;
    var consultationType = (consultationTypeInput || {}).value || 'AI Architecture Review';
    var meetingMode = (meetingModeInput || {}).value || 'Online (Google Meet)';

    var errorBanner = document.getElementById('booking_error_banner');
    if (errorBanner) errorBanner.style.display = 'none';

    if (!fullName || fullName.trim().length < 2) {
      showError('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      showError('Please enter a valid work email address.');
      return;
    }
    if (!phone || phone.replace(/\D/g, '').length < 7) {
      showError('Please enter a valid phone number (at least 7 digits).');
      return;
    }
    if (!bookingDate) {
      showError('Please select a consultation date.');
      return;
    }
    if (!startTime) {
      showError('Please select an available time slot.');
      return;
    }

    function showError(msg) {
      if (errorBanner) {
        errorBanner.textContent = msg;
        errorBanner.style.display = 'block';
      } else {
        alert(msg);
      }
    }

    var submitBtn = bookingForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="btn-spinner"></span> <span>Reserving Calendar Slot...</span>';
    }
    bookingForm.setAttribute('data-submitting', 'true');

    var payload = {
      full_name: fullName.trim(),
      business_email: email.trim(),
      phone: phone.trim(),
      company_name: company.trim(),
      location: location.trim(),
      consultation_type: consultationType,
      meeting_mode: meetingMode,
      project_requirements: requirements.trim(),
      booking_date: bookingDate,
      start_time: startTime,
      page_url: window.location.href,
    };

    fetch('/api/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, status: res.status, data: data };
        });
      })
      .then(function (result) {
        bookingForm.removeAttribute('data-submitting');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Confirm Consultation Booking</span> &rarr;';
        }

        if (!result.ok || !result.data.success) {
          showError(result.data.message || 'Unable to complete booking. Please select another slot.');
          if (result.status === 409) {
            fetchSlots(bookingDate); // Refresh slots if conflict occurred
          }
          return;
        }

        // Show confirmation screen
        var confirmPanel = document.getElementById('booking_confirmation_panel');
        if (confirmPanel) {
          bookingForm.style.display = 'none';
          confirmPanel.style.display = 'block';

          var refBadge = confirmPanel.querySelector('.booking-ref-value');
          if (refBadge) refBadge.textContent = result.data.bookingReference;

          var dateVal = confirmPanel.querySelector('.booking-confirm-datetime');
          if (dateVal) dateVal.textContent = result.data.bookingDate + ' at ' + result.data.startTime + ' IST';

          var typeVal = confirmPanel.querySelector('.booking-confirm-type');
          if (typeVal) typeVal.textContent = result.data.consultationType + ' (' + result.data.meetingMode + ')';

          var gcalBtn = confirmPanel.querySelector('.btn-add-gcal');
          if (gcalBtn && result.data.googleCalendarUrl) {
            gcalBtn.href = result.data.googleCalendarUrl;
          }

          var icsBtn = confirmPanel.querySelector('.btn-download-ics');
          if (icsBtn && result.data.icsDownloadUrl) {
            icsBtn.href = result.data.icsDownloadUrl;
          }

          var meetLinkEl = confirmPanel.querySelector('.booking-meet-link');
          if (meetLinkEl && result.data.meetLink) {
            meetLinkEl.href = result.data.meetLink;
            meetLinkEl.textContent = result.data.meetLink;
          }

          confirmPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      })
      .catch(function (err) {
        bookingForm.removeAttribute('data-submitting');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Confirm Consultation Booking</span> &rarr;';
        }
        showError('Network error connecting to booking engine. Please try again.');
      });
  });
})();
