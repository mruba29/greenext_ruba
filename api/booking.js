/**
 * GreenNext Digital Infrastructure — Consultation Booking & Scheduling API
 * 
 * Endpoints:
 * - GET  /api/booking?date=YYYY-MM-DD       -> Retrieve real available time slots
 * - GET  /api/booking?action=ics&ref=...    -> Download iCalendar (.ics) file
 * - POST /api/booking                       -> Create consultation, reserve slot, update Airtable, Jira, Sheets, Email
 * - POST /api/booking?action=cancel         -> Cancel consultation
 */

import {
  getAvailableSlotsForDate,
  createConsultationBooking,
  cancelConsultationBooking,
  generateIcsContent,
  getCalendarConfig,
} from './_calendar.js';
import { saveLeadToAirtable } from './_airtable.js';
import { createJiraLeadTask } from './_jira.js';
import { sendLeadNotificationEmail } from './_email.js';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const GAS_URL = process.env.GOOGLE_APPS_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbzoSXPulFt49lQ1ibWJX2CFNw7iiuT4YBAShuiEcckEovty7FauYnspHCuHQmSqFZk/exec';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function isValidPhone(phone) {
  const digits = (phone || '').replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

export default async function handler(req, res) {
  // 1. CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const url = new URL(req.url, 'http://localhost');
  const action = url.searchParams.get('action');

  // 2. Download .ics iCalendar file
  if (req.method === 'GET' && action === 'ics') {
    const ref = url.searchParams.get('ref');
    if (!ref) {
      res.status(400).send('Booking reference required');
      return;
    }

    try {
      const cwd = process.cwd();
      const raw = await readFile(join(cwd, 'data', 'bookings.json'), 'utf8').catch(() => '[]');
      const list = JSON.parse(raw);
      const booking = list.find((b) => b.bookingReference === ref);

      if (!booking) {
        res.status(404).send('Booking not found');
        return;
      }

      const ics = generateIcsContent({
        uid: `${booking.bookingReference}@greennext.in`,
        summary: `GreenNext Consultation: ${booking.consultationType} — ${booking.companyName}`,
        description: `GreenNext Consultation\\nMode: ${booking.meetingMode}\\nVideo: ${booking.meetLink}\\nContact: ${booking.fullName}`,
        location: booking.meetingMode.includes('In-Person') ? booking.location : booking.meetLink,
        startIso: booking.startIso,
        endIso: booking.endIso,
        attendeeEmail: booking.businessEmail,
        organizerEmail: 'leads@greennext.in',
      });

      res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${ref}.ics"`);
      res.status(200).send(ics);
      return;
    } catch (e) {
      res.status(500).send('Failed to generate calendar file');
      return;
    }
  }

  // 3. GET /api/booking -> Check available slots
  if (req.method === 'GET') {
    const dateStr = url.searchParams.get('date');

    if (!dateStr) {
      // If no date supplied, return service health & default date (today or tomorrow)
      const now = new Date();
      const todayStr = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
      const slots = await getAvailableSlotsForDate(todayStr);
      res.status(200).json({
        service: 'GreenNext Calendar Scheduling API',
        status: 'online',
        today: todayStr,
        config: {
          timezone: 'Asia/Kolkata',
          durationMinutes: 45,
          calendarConfigured: getCalendarConfig().isConfigured,
        },
        slots,
      });
      return;
    }

    const availability = await getAvailableSlotsForDate(dateStr);
    res.status(200).json(availability);
    return;
  }

  // 4. Handle cancellation
  if (req.method === 'POST' && action === 'cancel') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    const ref = body.bookingReference || url.searchParams.get('ref');
    const result = await cancelConsultationBooking(ref);
    res.status(result.success ? 200 : 400).json(result);
    return;
  }

  // 5. POST /api/booking -> Create new confirmed consultation
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) {
      res.status(400).json({ success: false, message: 'Invalid JSON request payload' });
      return;
    }
  }
  body = body || {};

  const fullName = (body.full_name || body.name || '').trim();
  const businessEmail = (body.business_email || body.email || '').trim();
  const phoneNumber = (body.phone || body.phone_number || '').trim();
  const companyName = (body.company_name || body.company || 'Enterprise Partner').trim();
  const location = (body.location || body.city || 'Chennai / Coimbatore Regional Hub').trim();
  const consultationType = (body.consultation_type || 'AI Architecture Review').trim();
  const meetingMode = (body.meeting_mode || 'Online (Google Meet)').trim();
  const projectRequirements = (body.project_requirements || body.requirements || 'Initial technical infrastructure review').trim();
  const bookingDate = (body.booking_date || body.date || '').trim();
  const startTime = (body.start_time || body.time || '').trim();

  // Server-side validation
  if (!fullName || fullName.length < 2) {
    res.status(400).json({ success: false, message: 'Please provide a valid full name (at least 2 characters).' });
    return;
  }
  if (!businessEmail || !isValidEmail(businessEmail)) {
    res.status(400).json({ success: false, message: 'A valid business email address is required.' });
    return;
  }
  if (!phoneNumber || !isValidPhone(phoneNumber)) {
    res.status(400).json({ success: false, message: 'A valid contact phone number is required (min 7 digits).' });
    return;
  }
  if (!bookingDate || !/^\d{4}-\d{2}-\d{2}$/.test(bookingDate)) {
    res.status(400).json({ success: false, message: 'Please select a valid consultation date (YYYY-MM-DD).' });
    return;
  }
  if (!startTime || !/^\d{2}:\d{2}$/.test(startTime)) {
    res.status(400).json({ success: false, message: 'Please select an available consultation time slot.' });
    return;
  }

  // Calculate end time (45 mins duration)
  const [hh, mm] = startTime.split(':').map((n) => parseInt(n, 10));
  const endMinutes = mm + 45;
  const endHh = endMinutes >= 60 ? hh + 1 : hh;
  const endMm = endMinutes >= 60 ? endMinutes - 60 : endMinutes;
  const endTime = `${String(endHh).padStart(2, '0')}:${String(endMm).padStart(2, '0')}`;

  // Unique sequential Booking Reference
  const yyyymmdd = bookingDate.replace(/-/g, '');
  const randSeq = Math.floor(1000 + Math.random() * 9000);
  const bookingReference = `GN-BK-${yyyymmdd}-${randSeq}`;

  // Step 1: Calendar Reservation & Conflict Verification
  const calendarBookingResult = await createConsultationBooking({
    enquiryId: bookingReference,
    fullName,
    businessEmail,
    phoneNumber,
    companyName,
    location,
    consultationType,
    meetingMode,
    projectRequirements,
    bookingDate,
    startTime,
    endTime,
  });

  if (!calendarBookingResult.success) {
    res.status(409).json(calendarBookingResult);
    return;
  }

  const { meetLink, calendarEventId, startIso, endIso } = calendarBookingResult;

  // Step 2: Airtable Lead Database Persistence
  const airtablePayload = {
    enquiryId: bookingReference,
    fullName,
    businessEmail,
    phoneNumber,
    companyName,
    location,
    industry: body.industry || 'Technology / AI Infrastructure',
    formType: `Consultation (${consultationType})`,
    projectRequirements: `[${meetingMode}] ${consultationType} on ${bookingDate} at ${startTime} IST\n\nNotes: ${projectRequirements}`,
    expectedTimeline: `${bookingDate} at ${startTime} IST`,
    budget: body.budget || '',
    leadStatus: 'New',
    createdAt: new Date().toISOString(),
    metadata: {
      page_url: body.page_url || '/contact#booking',
      utm_source: body.utm_source || 'direct_booking',
      utm_medium: body.utm_medium || '',
      utm_campaign: body.utm_campaign || '',
    },
    // Booking specific fields
    calendarEventId,
    meetLink,
    meetingMode,
    bookingTimezone: 'Asia/Kolkata',
    bookingStatus: 'Confirmed',
  };

  let airtableResult = null;
  try {
    airtableResult = await saveLeadToAirtable(airtablePayload);
  } catch (err) {
    airtableResult = { success: false, error: err.message };
  }

  // Step 3: Jira Task Creation (Enterprise Workflow in Project DI)
  const jiraPayload = {
    enquiryId: bookingReference,
    fullName,
    formType: `Consultation (${consultationType})`,
    companyName,
    businessEmail,
    phoneNumber,
    location,
    industry: body.industry || 'Technology',
    areaOfInterest: consultationType,
    projectRequirements: `CONFIRMED CONSULTATION BOOKING\n\nDate: ${bookingDate}\nTime: ${startTime} – ${endTime} IST\nMode: ${meetingMode}\nGoogle Meet: ${meetLink}\nCalendar Event: ${calendarEventId}\nClient Notes: ${projectRequirements}`,
    expectedTimeline: `${bookingDate} ${startTime} IST`,
    preferredContactMethod: meetingMode.includes('Online') ? 'Google Meet' : 'In-Person',
    submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    metadata: airtablePayload.metadata,
  };

  let jiraResult = null;
  try {
    jiraResult = await createJiraLeadTask(jiraPayload);
  } catch (jErr) {
    jiraResult = { success: false, error: jErr.message };
  }

  // Step 4: Transactional Confirmation Email
  let emailResult = null;
  try {
    jiraPayload.jira = jiraResult;
    jiraPayload.calendar = { bookingReference, bookingDate, startTime, endTime, meetLink, meetingMode };
    emailResult = await sendLeadNotificationEmail(jiraPayload);
  } catch (emErr) {
    emailResult = { success: false, error: emErr.message };
  }

  // Step 5: Google Sheets Backup Logging
  if (GAS_URL) {
    try {
      await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'consultation_booked',
          bookingReference,
          fullName,
          companyName,
          businessEmail,
          phoneNumber,
          consultationType,
          meetingMode,
          bookingDate,
          startTime,
          endTime,
          meetLink,
          calendarEventId,
          jiraKey: jiraResult?.parentKey || '—',
          airtableRecordId: airtableResult?.recordId || '—',
          timestamp: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(6000),
      }).catch(() => null);
    } catch (e) {}
  }

  // Step 6: Return rich confirmation response to client
  res.status(200).json({
    success: true,
    message: 'Consultation booking confirmed successfully.',
    bookingReference,
    calendarEventId,
    consultationType,
    meetingMode,
    bookingDate,
    startTime,
    endTime,
    timezone: 'Asia/Kolkata',
    meetLink,
    googleCalendarUrl: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`GreenNext Consultation: ${consultationType}`)}&dates=${bookingDate.replace(/-/g, '')}T${startTime.replace(':', '')}00Z/${bookingDate.replace(/-/g, '')}T${endTime.replace(':', '')}00Z&details=${encodeURIComponent(`GreenNext Advisory Session\nRef: ${bookingReference}\nMeeting Link: ${meetLink}`)}&location=${encodeURIComponent(meetingMode.includes('In-Person') ? location : meetLink)}`,
    icsDownloadUrl: `/api/booking?action=ics&ref=${bookingReference}`,
    airtable: airtableResult,
    jira: jiraResult,
    email: emailResult,
  });
}
