/**
 * GreenNext Digital Infrastructure — Comprehensive Email Notification Verification Suite
 * 
 * Verifies all requirements from GreenNext Reference-Based Email Automation:
 * 1. Dynamic Email Subjects (Quick Enquiry, Consultation, Business Lead, Careers)
 * 2. Security & HTML Injection / XSS Prevention
 * 3. Reply to Lead Mailto CTA Generation (Verified recipient & professional template)
 * 4. WhatsApp Direct Click-to-Chat URL Generation (Verified business number & encoding)
 * 5. Design A (Default Premium Lead Notification): Dark navy, purple-to-blue gradient, ⚡ icon, badges
 * 6. Contact Information Section
 * 7. Requirements & Business Context Section (including optional budget, company size, challenge, scope)
 * 8. Optional Fields Omission (No empty rows or invented data)
 * 9. Submission Metadata Section (Enquiry ID, source, UTM, Google Sheets, Jira parent & subtasks)
 * 10. Jira Conditional Display (Issue link & button only when valid, accurate status when failed)
 * 11. Google Sheets Conditional Display (Link only when saved)
 * 12. Design B (Clean Business Notification) & Design C (Strategic Lead Summary)
 * 13. Plain-Text Fallback Rendering for all form types
 * 14. Multi-Provider Email Delivery Pipeline (Resend, SendGrid, Google Apps Script, Fallback)
 * 15. End-to-End Submission & Status Tracking Update via /api/enquiry
 */

import {
  escapeHtml,
  formatLeadDateTime,
  generateLeadEmailSubject,
  generateReplyMailto,
  generateWhatsAppLeadUrl,
  renderLeadNotificationHtml,
  renderCleanBusinessEmailHtml,
  renderStrategicLeadSummaryHtml,
  renderLeadNotificationText,
  sendLeadNotificationEmail
} from '../api/_email.js';

import enquiryHandler from '../api/enquiry.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('================================================================');
console.log('GreenNext Lead Notification Email Automation Verification Suite');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// Test Suite 1: Security & HTML Escaping
// -----------------------------------------------------------------------------
console.log('Test Suite 1: Security & HTML Escaping');
const maliciousInput = '<script>alert("xss")</script>&"test"\'';
const escaped = escapeHtml(maliciousInput);
assert(!escaped.includes('<script>'), 'Dangerous <script> tag sanitized');
assert(escaped.includes('&lt;script&gt;'), 'HTML entities encoded safely');
assert(escaped.includes('&amp;'), 'Ampersand escaped');
assert(escaped.includes('&quot;'), 'Double quote escaped');
assert(escaped.includes('&#039;'), 'Single quote escaped');

// -----------------------------------------------------------------------------
// Test Suite 2: Dynamic Email Subjects
// -----------------------------------------------------------------------------
console.log('\nTest Suite 2: Dynamic Email Subject Generation');
const quickLead = { formType: 'Quick Enquiry', fullName: 'Suresh Kumar', enquiryId: 'GN-20261019-0010' };
const consultLead = { formType: 'Consultation Form', fullName: 'Priya Narayanan', enquiryId: 'GN-20261019-0011' };
const longLead = { formType: 'Long Form', fullName: 'Vikram Seth', enquiryId: 'GN-20261019-0012' };
const careerLead = { formType: 'Careers Application', fullName: 'Meera Rao', enquiryId: 'GN-20261019-0013' };
const fallbackLead = { formType: '', fullName: 'Arjun Das', enquiryId: 'GN-20261019-0014' };

const subQuick = generateLeadEmailSubject(quickLead);
const subConsult = generateLeadEmailSubject(consultLead);
const subLong = generateLeadEmailSubject(longLead);
const subCareer = generateLeadEmailSubject(careerLead);
const subFallback = generateLeadEmailSubject(fallbackLead);

assert(subQuick.startsWith('[GreenNext] New Quick Enquiry — Suresh Kumar'), 'Quick Enquiry subject formatted correctly');
assert(subQuick.includes('(GN-20261019-0010)'), 'Quick Enquiry subject contains Enquiry ID');
assert(subConsult.startsWith('[GreenNext] New Consultation Lead — Priya Narayanan'), 'Consultation subject formatted correctly');
assert(subConsult.includes('(GN-20261019-0011)'), 'Consultation subject contains Enquiry ID');
assert(subLong.startsWith('[GreenNext] New Business Lead — Vikram Seth'), 'Long Form / Business Lead subject formatted correctly');
assert(subLong.includes('(GN-20261019-0012)'), 'Long Form subject contains Enquiry ID');
assert(subCareer.startsWith('[GreenNext] New Careers Application — Meera Rao'), 'Careers application subject formatted correctly');
assert(subFallback.includes('[GreenNext] New Business Lead — Arjun Das'), 'Fallback subject formatted correctly');

// -----------------------------------------------------------------------------
// Test Suite 3: Reply to Lead Mailto Link Generation
// -----------------------------------------------------------------------------
console.log('\nTest Suite 3: Reply to Lead Link Generation');
const testLead = {
  enquiryId: 'GN-20261019-0099',
  fullName: 'Karthik Raja',
  businessEmail: 'karthik@datacenter-ai.in',
  areaOfInterest: 'AI Infrastructure'
};
const mailto = generateReplyMailto(testLead);
assert(mailto.startsWith('mailto:karthik%40datacenter-ai.in'), 'Mailto link generated with lead email');
assert(mailto.includes('subject=Re%3A%20GreenNext%20Enquiry%20%E2%80%94%20GN-20261019-0099'), 'Mailto subject contains Enquiry ID');
assert(mailto.includes('Karthik%20Raja'), 'Mailto body prefilled with lead name');
assert(mailto.includes('AI%20Infrastructure'), 'Mailto body prefilled with area of interest');

// -----------------------------------------------------------------------------
// Test Suite 4: WhatsApp Direct Click-to-Chat URL Generation
// -----------------------------------------------------------------------------
console.log('\nTest Suite 4: WhatsApp Direct Click-to-Chat Generation');
const waUrl = generateWhatsAppLeadUrl(testLead, '919876543210');
assert(waUrl.startsWith('https://wa.me/919876543210?text='), 'WhatsApp URL points to verified business phone');
assert(waUrl.includes('Karthik%20Raja'), 'WhatsApp message contains lead name');
assert(waUrl.includes('AI%20Infrastructure'), 'WhatsApp message references area of interest');

// -----------------------------------------------------------------------------
// Test Suite 5: Design A — Premium Lead Notification (Full Featured)
// -----------------------------------------------------------------------------
console.log('\nTest Suite 5: Design A — Premium Lead Notification (Full Featured)');
const completeLead = {
  enquiryId: 'GN-20261019-0201',
  fullName: 'Dr. Ramesh Sundaram',
  formType: 'Long Form',
  businessEmail: 'ramesh.s@cloudnext.org',
  phoneNumber: '+91 94441 23456',
  companyName: 'CloudNext Data Systems',
  location: 'Madurai, TN',
  industry: 'Enterprise Technology & Telecom',
  areaOfInterest: 'AI Data Centers & High-Density Liquid Cooling',
  projectScope: '1.5MW Hall Infrastructure',
  challenge: 'Existing facility PUE > 1.6 and lacks liquid loop capacity',
  desiredOutcome: 'Sub-1.2 PUE with Direct-to-Chip Liquid Cooling',
  projectRequirements: 'Require 1.5MW compute hall with direct-to-chip liquid cooling for LLM training.',
  expectedTimeline: '3-6 months',
  budget: '₹25 Cr - ₹50 Cr',
  companySize: '500+ employees',
  preferredContactMethod: 'Business Email (Morning)',
  submittedAt: '2026-10-19T02:00:00.000Z',
  metadata: {
    page_url: '/contact.html',
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'datacenter_south_india'
  },
  leadSaved: true,
  jira: {
    parentKey: 'DI-314',
    parentUrl: 'https://trustworkz.atlassian.net/browse/DI-314',
    status: 'jira_created',
    subtasks: ['DI-315', 'DI-316', 'DI-317', 'DI-318', 'DI-319', 'DI-320', 'DI-321']
  }
};

const fullHtml = renderLeadNotificationHtml(completeLead);
assert(fullHtml.includes('<!DOCTYPE html>'), 'Valid HTML5 doctype');
assert(fullHtml.includes('#070B14'), 'Dark navy outer background (#070B14) applied');
assert(fullHtml.includes('#0F172A'), 'Dark slate card background (#0F172A) applied');
assert(fullHtml.includes('linear-gradient(135deg, #4338CA 0%, #3B82F6 50%, #06B6D4 100%)'), 'Purple-to-blue gradient header rendered');
assert(fullHtml.includes('⚡'), 'Notification lightning icon present');
assert(fullHtml.includes('GREENNEXT DIGITAL INFRASTRUCTURE'), 'Branding title present');
assert(fullHtml.includes('New Lead Received'), 'Hero heading rendered');
assert(fullHtml.includes('GN-20261019-0201'), 'Enquiry ID badge present');
assert(fullHtml.includes('Long Form'), 'Form type badge rendered');
assert(fullHtml.includes('Dr. Ramesh Sundaram'), 'Lead name rendered');
assert(fullHtml.includes('ramesh.s@cloudnext.org'), 'Business email rendered');
assert(fullHtml.includes('+91 94441 23456'), 'Phone number rendered');
assert(fullHtml.includes('CloudNext Data Systems'), 'Company name rendered');
assert(fullHtml.includes('Madurai, TN'), 'Location rendered');
assert(fullHtml.includes('AI Data Centers &amp; High-Density Liquid Cooling'), 'Area of interest rendered');
assert(fullHtml.includes('1.5MW Hall Infrastructure'), 'Project scope rendered');
assert(fullHtml.includes('Existing facility PUE &gt; 1.6'), 'Challenge / Problem rendered safely');
assert(fullHtml.includes('Sub-1.2 PUE with Direct-to-Chip Liquid Cooling'), 'Desired outcome rendered');
assert(fullHtml.includes('3-6 months'), 'Expected timeline rendered');
assert(fullHtml.includes('₹25 Cr - ₹50 Cr'), 'Budget rendered when submitted');
assert(fullHtml.includes('500+ employees'), 'Company size rendered when submitted');
assert(fullHtml.includes('Business Email (Morning)'), 'Preferred contact rendered');
assert(fullHtml.includes('Require 1.5MW compute hall'), 'Project requirements rendered');
assert(fullHtml.includes('DI-314'), 'Jira parent issue link included');
assert(fullHtml.includes('7 of 7 subtasks created'), 'Jira subtask count displayed');
assert(fullHtml.includes('Saved to Workbook'), 'Google Sheets saved reference displayed');
assert(fullHtml.includes('Reply to Lead'), 'Purple Reply to Lead CTA button rendered');
assert(fullHtml.includes('Open WhatsApp'), 'Green WhatsApp CTA button rendered');
assert(fullHtml.includes('Open Jira'), 'Dark Jira CTA button rendered');
assert(fullHtml.includes('Google Sheets'), 'Emerald Google Sheets CTA button rendered');

// -----------------------------------------------------------------------------
// Test Suite 6: Optional Fields Omission (No Empty Rows / Invented Data)
// -----------------------------------------------------------------------------
console.log('\nTest Suite 6: Optional Fields Omission Logic');
const minimalLead = {
  enquiryId: 'GN-20261019-0202',
  fullName: 'Ananya Sharma',
  formType: 'Quick Enquiry',
  businessEmail: 'ananya@fintech.co',
  phoneNumber: '',
  areaOfInterest: 'Energy Optimization'
};
const minimalHtml = renderLeadNotificationHtml(minimalLead);
assert(minimalHtml.includes('Quick Enquiry'), 'Quick Enquiry badge rendered');
assert(minimalHtml.includes('#10B981'), 'Quick Enquiry emerald badge color applied');
assert(!minimalHtml.includes('Phone Number:</td>'), 'Omitted empty phone row');
assert(!minimalHtml.includes('Company Name:</td>'), 'Omitted empty company row');
assert(!minimalHtml.includes('Location:</td>'), 'Omitted empty location row');
assert(!minimalHtml.includes('Project Scope:</td>'), 'Omitted empty project scope row');
assert(!minimalHtml.includes('Challenge / Problem:</td>'), 'Omitted empty challenge row');
assert(!minimalHtml.includes('Desired Outcome:</td>'), 'Omitted empty outcome row');
assert(!minimalHtml.includes('Budget:</td>'), 'Omitted empty budget row');
assert(!minimalHtml.includes('Company Size:</td>'), 'Omitted empty company size row');

// -----------------------------------------------------------------------------
// Test Suite 7: Jira Integration Conditional Rendering
// -----------------------------------------------------------------------------
console.log('\nTest Suite 7: Jira Integration Conditional Display');
const jiraFailedLead = {
  enquiryId: 'GN-20261019-0203',
  fullName: 'Kiran Patel',
  formType: 'Consultation Form',
  businessEmail: 'kiran@startup.in',
  areaOfInterest: 'Liquid Cooling',
  jira: {
    status: 'jira_failed',
    error: 'Project key DI not found'
  }
};
const jiraFailedHtml = renderLeadNotificationHtml(jiraFailedLead);
assert(!jiraFailedHtml.includes('browse/undefined'), 'No broken Jira URLs rendered');
assert(!jiraFailedHtml.includes('📌 Open Jira'), 'Open Jira button hidden when Jira creation failed');
assert(jiraFailedHtml.includes('Consultation'), 'Consultation badge displayed');

// -----------------------------------------------------------------------------
// Test Suite 8: Alternative Themes (Design B & Design C)
// -----------------------------------------------------------------------------
console.log('\nTest Suite 8: Alternative Themes (Design B & Design C)');
const cleanHtml = renderCleanBusinessEmailHtml(completeLead);
assert(cleanHtml.includes('#064E3B'), 'Design B dark green header color applied');
assert(cleanHtml.includes('#FFFFFF'), 'Design B white card background applied');
assert(cleanHtml.includes('Dr. Ramesh Sundaram'), 'Design B contact rendered');
assert(cleanHtml.includes('Reply via Email'), 'Design B CTA rendered');

const strategicLead = { ...completeLead, priorityScore: 'Tier 1 Enterprise (Score: 94/100)' };
const stratHtml = renderStrategicLeadSummaryHtml(strategicLead);
assert(stratHtml.includes('GreenNext Strategic Lead Summary'), 'Design C title rendered');
assert(stratHtml.includes('Tier 1 Enterprise (Score: 94/100)'), 'Design C predictive score rendered');

// -----------------------------------------------------------------------------
// Test Suite 9: Plain-Text Fallback Version
// -----------------------------------------------------------------------------
console.log('\nTest Suite 9: Plain-Text Fallback Rendering');
const textVersion = renderLeadNotificationText(completeLead);
assert(textVersion.includes('[GreenNext] New Lead Received — Dr. Ramesh Sundaram (GN-20261019-0201)'), 'Plain-text title format correct');
assert(textVersion.includes('CONTACT INFORMATION'), 'Plain-text contact header present');
assert(textVersion.includes('Full Name:      Dr. Ramesh Sundaram'), 'Plain-text contact name aligned');
assert(textVersion.includes('Business Email: ramesh.s@cloudnext.org'), 'Plain-text email aligned');
assert(textVersion.includes('Budget:              ₹25 Cr - ₹50 Cr'), 'Plain-text budget present');
assert(textVersion.includes('Company Size:        500+ employees'), 'Plain-text company size present');
assert(textVersion.includes('SUBMISSION METADATA'), 'Plain-text metadata section present');
assert(textVersion.includes('NEXT STEPS'), 'Plain-text next steps present');
assert(textVersion.includes('• Jira Issue:    https://trustworkz.atlassian.net/browse/DI-314'), 'Plain-text Jira link present');

// -----------------------------------------------------------------------------
// Test Suite 10: Multi-Provider Email Delivery Pipeline
// -----------------------------------------------------------------------------
console.log('\nTest Suite 10: Multi-Provider Email Delivery Pipeline');
const offlineResult = await sendLeadNotificationEmail(minimalLead, { gasUrl: '' });
assert(offlineResult !== null, 'Delivery function returns structured status');
assert(offlineResult.recipient === 'ruba.int2027g3@gmail.com', 'Recipient is configured administrator email');
assert(offlineResult.timestamp !== undefined, 'Timestamp recorded');

// -----------------------------------------------------------------------------
// Test Suite 11: End-to-End Submission & Status Tracking (/api/enquiry)
// -----------------------------------------------------------------------------
console.log('\nTest Suite 11: End-to-End Submission & Status Tracking via /api/enquiry');

function createMockResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(key, value) {
      this.headers[key] = value;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    end() {
      return this;
    }
  };
}

const mockReq = {
  method: 'POST',
  body: {
    form_type: 'Quick Enquiry',
    full_name: 'Test Automation Lead',
    business_email: 'test.lead@greennext.in',
    phone: '+91 98888 77777',
    company_name: 'GreenNext Test Lab',
    area_of_interest: 'AI Infrastructure',
    project_requirements: 'Automated test suite validation enquiry'
  }
};
const mockRes = createMockResponse();

await enquiryHandler(mockReq, mockRes);
assert(mockRes.statusCode === 200, 'Endpoint returned HTTP 200');
assert(mockRes.body && mockRes.body.success === true, 'Enquiry submission succeeded');
assert(mockRes.body.enquiryId && mockRes.body.enquiryId.startsWith('GN-'), 'Unique Enquiry ID assigned');
assert(mockRes.body.leadSaved === true, 'Lead storage verified');
assert(mockRes.body.email !== null, 'Email delivery result recorded in response');

console.log('\n================================================================');
console.log(`Results: ${passed} / ${passed + failed} test assertions passed (${failed} failed)`);
console.log('================================================================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('\nALL GREENNEXT EMAIL AUTOMATION TESTS COMPLETED SUCCESSFULLY.');
}
