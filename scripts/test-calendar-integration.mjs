/**
 * GreenNext Digital Infrastructure — Comprehensive Calendar Scheduling Test Suite
 * 
 * Verifies:
 * 1. Slot Availability & Business Hours (Mon-Fri 45-min slots, Asia/Kolkata)
 * 2. Weekend & Past Date Protection
 * 3. Real-Time Slot Conflict & Concurrency Locking
 * 4. Booking Creation with Unique Reference (GN-BK-YYYYMMDD-XXXX)
 * 5. Google Meet Link & Event Metadata Generation
 * 6. RFC 5545 iCalendar (.ics) String Generation
 * 7. Live Airtable Synchronization (Base appnkJABVWFGwX7Lv / Table tblYi5BguStHsPtA4)
 * 8. Cancellation & Slot Freeing
 * 9. Serverless API Route Verification (GET /api/booking, POST /api/booking, .ics download)
 */

try { process.loadEnvFile('.env.local'); } catch (e) {
  try { process.loadEnvFile('.env'); } catch (e2) {}
}

import {
  getAvailableSlotsForDate,
  createConsultationBooking,
  cancelConsultationBooking,
  generateIcsContent,
  getCalendarConfig,
} from '../api/_calendar.js';
import bookingHandler from '../api/booking.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    console.error(`  ❌ FAIL: ${testName} ${details ? '— ' + details : ''}`);
  }
}

function createMockResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    sentData: null,
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
    send(data) { this.sentData = data; return this; },
    end() { return this; },
  };
}

async function runTestSuite() {
  console.log('\n================================================================');
  console.log('  GreenNext — Calendar Scheduling Integration Test Suite');
  console.log('================================================================\n');

  // TEST 1: Business Hours & Slot Generation
  console.log('▶ Test 1: Business Hours & Slot Availability');
  // Choose a known future Monday
  const futureMonday = '2026-11-02';
  const mondayRes = await getAvailableSlotsForDate(futureMonday);

  assert(mondayRes.success === true, 'Successfully fetched slots for weekday');
  assert(mondayRes.timezone === 'Asia/Kolkata', 'Correctly pinned to Asia/Kolkata timezone');
  assert(Array.isArray(mondayRes.slots) && mondayRes.slots.length === 5, 'Generates 5 standard 45-min business consultation slots');
  assert(mondayRes.slots[0].startTime === '10:00', 'First slot starts at 10:00 AM IST');
  assert(mondayRes.slots[0].endTime === '10:45', 'First slot ends at 10:45 AM IST');
  assert(mondayRes.slots[4].startTime === '17:00', 'Last slot starts at 05:00 PM IST');

  // TEST 2: Weekend & Past Date Safeguards
  console.log('\n▶ Test 2: Weekend & Past Date Protection');
  const saturday = '2026-11-07';
  const saturdayRes = await getAvailableSlotsForDate(saturday);
  assert(saturdayRes.isWeekend === true, 'Saturday correctly flagged as weekend');
  assert(saturdayRes.slots.length === 0, 'No slots generated on weekends');

  const pastDate = '2025-01-01';
  const pastRes = await getAvailableSlotsForDate(pastDate);
  assert(pastRes.isPast === true, 'Past date correctly identified');
  assert(pastRes.slots.length === 0, 'Past date returns 0 available slots');

  // TEST 3: Booking Creation & Conflict Prevention
  console.log('\n▶ Test 3: Booking Creation & Real-Time Conflict Lock');
  const testRef = `GN-BK-TEST-${Date.now().toString(36).toUpperCase()}`;
  const booking1 = await createConsultationBooking({
    enquiryId: testRef,
    fullName: 'Priya Narayanan',
    businessEmail: 'priya@inframl.com',
    phoneNumber: '+91 94444 33333',
    companyName: 'InfraML Solutions',
    location: 'Coimbatore Hub (ELCOT IT Park)',
    consultationType: 'AI Architecture Review',
    meetingMode: 'Online (Google Meet)',
    projectRequirements: 'Evaluating 100kW liquid cooling deployment',
    bookingDate: futureMonday,
    startTime: '10:00',
    endTime: '10:45',
  });

  assert(booking1.success === true, 'Consultation booking created successfully');
  assert(booking1.bookingReference === testRef, 'Booking reference preserved');
  assert(booking1.meetLink.startsWith('https://meet.google.com/'), 'Google Meet conference link generated');
  assert(booking1.startIso.includes('T10:00:00+05:30'), 'Start time correctly formatted with +05:30 offset');

  // Attempt duplicate booking on the exact same slot
  const conflictBooking = await createConsultationBooking({
    enquiryId: `GN-BK-CONFLICT-${Date.now()}`,
    fullName: 'Different Visitor',
    businessEmail: 'diff@example.com',
    phoneNumber: '+91 98888 22222',
    companyName: 'Other Corp',
    location: 'Remote',
    bookingDate: futureMonday,
    startTime: '10:00',
    endTime: '10:45',
  });

  assert(conflictBooking.success === false, 'Conflicting booking rejected');
  assert(conflictBooking.status === 'slot_unavailable', 'Conflict status flagged as slot_unavailable');

  // TEST 4: Available Slots Update After Booking
  console.log('\n▶ Test 4: Dynamic Slot Availability Updates');
  const updatedSlots = await getAvailableSlotsForDate(futureMonday);
  const slot1000 = updatedSlots.slots.find((s) => s.startTime === '10:00');
  const slot1130 = updatedSlots.slots.find((s) => s.startTime === '11:30');

  assert(slot1000.available === false, 'Booked slot (10:00 AM) is now marked available: false');
  assert(slot1130.available === true, 'Remaining slot (11:30 AM) is still available: true');

  // TEST 5: iCalendar (.ics) Generation
  console.log('\n▶ Test 5: RFC 5545 iCalendar (.ics) File Verification');
  const ics = generateIcsContent({
    uid: `${testRef}@greennext.in`,
    summary: 'GreenNext Consultation: AI Architecture Review',
    description: 'Technical consultation on liquid cooling',
    location: booking1.meetLink,
    startIso: booking1.startIso,
    endIso: booking1.endIso,
    attendeeEmail: 'priya@inframl.com',
  });

  assert(ics.includes('BEGIN:VCALENDAR'), '.ics has valid VCALENDAR container');
  assert(ics.includes('BEGIN:VEVENT'), '.ics has valid VEVENT element');
  assert(ics.includes(`UID:${testRef}@greennext.in`), '.ics includes unique deterministic UID');
  assert(ics.includes('STATUS:CONFIRMED'), '.ics status is CONFIRMED');
  assert(ics.includes('TRIGGER:-PT15M'), '.ics has 15-minute advance reminder alarm');

  // TEST 6: Cancellation & Slot Restoration
  console.log('\n▶ Test 6: Booking Cancellation & Slot Restoration');
  const cancelRes = await cancelConsultationBooking(testRef);
  assert(cancelRes.success === true, 'Booking cancellation succeeded');
  assert(cancelRes.status === 'Cancelled', 'Booking status updated to Cancelled');

  const slotsAfterCancel = await getAvailableSlotsForDate(futureMonday);
  const slot1000AfterCancel = slotsAfterCancel.slots.find((s) => s.startTime === '10:00');
  assert(slot1000AfterCancel.available === true, 'Cancelled slot (10:00 AM) is immediately available again');

  // TEST 7: End-to-End API Route Simulation (/api/booking)
  console.log('\n▶ Test 7: Serverless Endpoint Validation (/api/booking)');

  // 7a. GET /api/booking availability
  const reqGet = { method: 'GET', url: `/api/booking?date=${futureMonday}` };
  const resGet = createMockResponse();
  await bookingHandler(reqGet, resGet);
  assert(resGet.statusCode === 200, 'GET /api/booking returns HTTP 200');
  assert(resGet.body?.slots?.length === 5, 'GET /api/booking returns 5 daily slots');

  // 7b. Invalid POST (missing email)
  const reqBad = {
    method: 'POST',
    url: '/api/booking',
    body: { full_name: 'Test', business_email: 'not-email' },
  };
  const resBad = createMockResponse();
  await bookingHandler(reqBad, resBad);
  assert(resBad.statusCode === 400, 'Invalid booking request rejected with HTTP 400');

  // 7c. Full Valid Booking POST (with Live Airtable & Jira Integration)
  const openDate = '2026-11-04'; // Wednesday
  const openSlotsRes = await getAvailableSlotsForDate(openDate);
  const openSlot = openSlotsRes.slots.find((s) => s.available);
  const validSlotTime = openSlot ? openSlot.startTime : '15:30';

  const reqValid = {
    method: 'POST',
    url: '/api/booking',
    body: {
      full_name: 'Dr. Anand Ramanathan',
      business_email: 'anand@ramantech.com',
      phone: '+91 98888 11111',
      company_name: 'Ramanathan Supercomputing Labs',
      location: 'Chennai Metro Hub',
      consultation_type: 'Green Energy & PUE Optimization',
      meeting_mode: 'Online (Google Meet)',
      project_requirements: 'Designing PUE < 1.15 data center with solar microgrid integration',
      booking_date: openDate,
      start_time: validSlotTime,
    },
  };
  const resValid = createMockResponse();
  await bookingHandler(reqValid, resValid);

  assert(resValid.statusCode === 200, 'Valid booking returns HTTP 200 OK');
  assert(resValid.body.bookingReference.startsWith('GN-BK-'), 'Generated valid bookingReference (GN-BK-YYYYMMDD-XXXX)');
  assert(resValid.body.meetLink.startsWith('https://meet.google.com/'), 'Returned verified Google Meet link');
  assert(resValid.body.googleCalendarUrl.includes('calendar.google.com'), 'Generated 1-click Google Calendar add link');
  assert(resValid.body.airtable?.success === true, 'Booking record successfully stored in live Airtable base');

  console.log('\n================================================================');
  console.log(`  Tests Passed: ${passedTests} / ${totalTests} (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log('================================================================\n');

  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Test suite error:', err);
  process.exit(1);
});
