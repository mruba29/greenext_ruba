/**
 * GreenNext Digital Infrastructure — Comprehensive Email Notification Verification Suite
 */

import {
  escapeHtml,
  formatLeadDateTime,
  generateReplyMailto,
  generateWhatsAppLeadUrl,
  renderLeadNotificationHtml,
  renderLeadNotificationText,
  sendLeadNotificationEmail
} from '../api/_email.js';

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
console.log('GreenNext Lead Notification Email Automation Test Suite');
console.log('================================================================\n');

// Test 1: HTML Escaping Security
console.log('Test Suite 1: Security & HTML Escaping');
const maliciousInput = '<script>alert("xss")</script>&"test"\'';
const escaped = escapeHtml(maliciousInput);
assert(!escaped.includes('<script>'), 'Dangerous <script> tag sanitized');
assert(escaped.includes('&lt;script&gt;'), 'HTML entities encoded safely');
assert(escaped.includes('&amp;'), 'Ampersand escaped');
assert(escaped.includes('&quot;'), 'Double quote escaped');
assert(escaped.includes('&#039;'), 'Single quote escaped');

// Test 2: Reply to Lead Mailto Link Generation
console.log('\nTest Suite 2: Reply to Lead Link Generation');
const testLead = {
  enquiryId: 'GN-20261019-0099',
  fullName: 'Karthik Raja',
  businessEmail: 'karthik@datacenter-ai.in',
  areaOfInterest: 'AI Infrastructure'
};
const mailto = generateReplyMailto(testLead);
assert(mailto.startsWith('mailto:karthik%40datacenter-ai.in'), 'Mailto link generated with lead email');
assert(mailto.includes('subject=GreenNext%20Enquiry%20%E2%80%94%20GN-20261019-0099'), 'Mailto subject contains Enquiry ID');
assert(mailto.includes('Karthik%20Raja'), 'Mailto body prefilled with lead name');

// Test 3: WhatsApp Click-to-Chat Link Generation
console.log('\nTest Suite 3: WhatsApp Click-to-Chat Generation');
const waUrl = generateWhatsAppLeadUrl(testLead, '919876543210');
assert(waUrl.startsWith('https://wa.me/919876543210?text='), 'WhatsApp URL points to verified business phone');
assert(waUrl.includes('Karthik%20Raja'), 'WhatsApp message contains lead name');
assert(waUrl.includes('AI%20Infrastructure'), 'WhatsApp message references area of interest');

// Test 4: Long Form HTML Template Rendering
console.log('\nTest Suite 4: Responsive Dark Navy HTML Template Rendering (Long Form)');
const longFormLead = {
  enquiryId: 'GN-20261019-0101',
  fullName: 'Dr. Ramesh Sundaram',
  formType: 'Long Form',
  businessEmail: 'ramesh.s@cloudnext.org',
  phoneNumber: '+91 94441 23456',
  companyName: 'CloudNext Data Systems',
  location: 'Madurai, TN',
  industry: 'Enterprise Technology & Telecom',
  areaOfInterest: 'AI Data Centers & High-Density Liquid Cooling',
  projectRequirements: 'Require 1.5MW compute hall with direct-to-chip liquid cooling for LLM training.',
  expectedTimeline: '3-6 months',
  preferredContactMethod: 'Business Email',
  submittedAt: '2026-10-19T02:00:00.000Z',
  metadata: {
    page_url: '/contact.html',
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'datacenter_south_india'
  },
  jira: {
    parentKey: 'DI-314',
    parentUrl: 'https://trustworkz.atlassian.net/browse/DI-314',
    status: 'jira_created'
  }
};
const longHtml = renderLeadNotificationHtml(longFormLead);
assert(longHtml.includes('<!DOCTYPE html>'), 'Valid HTML5 doctype');
assert(longHtml.includes('#070B14'), 'Dark navy outer background (#070B14) applied');
assert(longHtml.includes('#0F172A'), 'Dark slate card background (#0F172A) applied');
assert(longHtml.includes('linear-gradient(135deg, #4338CA 0%, #3B82F6 50%, #06B6D4 100%)'), 'Purple-to-blue gradient header rendered');
assert(longHtml.includes('GREENNEXT DIGITAL INFRASTRUCTURE'), 'Branding title present');
assert(longHtml.includes('New Lead Received'), 'Hero heading rendered');
assert(longHtml.includes('GN-20261019-0101'), 'Enquiry ID badge present');
assert(longHtml.includes('Long Form'), 'Form type badge rendered');
assert(longHtml.includes('Dr. Ramesh Sundaram'), 'Lead name rendered');
assert(longHtml.includes('ramesh.s@cloudnext.org'), 'Business email rendered');
assert(longHtml.includes('+91 94441 23456'), 'Phone number rendered');
assert(longHtml.includes('CloudNext Data Systems'), 'Company name rendered');
assert(longHtml.includes('Madurai, TN'), 'Location rendered');
assert(longHtml.includes('AI Data Centers &amp; High-Density Liquid Cooling'), 'Area of interest rendered');
assert(longHtml.includes('Require 1.5MW compute hall'), 'Project requirements rendered');
assert(longHtml.includes('DI-314'), 'Jira parent issue link included');
assert(longHtml.includes('Reply to Lead'), 'Purple Reply to Lead CTA button rendered');
assert(longHtml.includes('Open WhatsApp'), 'Green WhatsApp CTA button rendered');

// Test 5: Short Form & Optional Field Handling
console.log('\nTest Suite 5: Short Form & Missing Fields Omission');
const shortLead = {
  enquiryId: 'GN-20261019-0102',
  fullName: 'Ananya Sharma',
  formType: 'Quick Form',
  businessEmail: 'ananya@fintech.co',
  phoneNumber: '',
  areaOfInterest: 'Energy Optimization'
};
const shortHtml = renderLeadNotificationHtml(shortLead);
assert(shortHtml.includes('Quick Form'), 'Quick Form badge displayed');
assert(shortHtml.includes('#10B981'), 'Quick Form green badge color applied');
assert(!shortHtml.includes('Phone Number:</td>'), 'Omitted empty phone row');
assert(!shortHtml.includes('Company Name:</td>'), 'Omitted empty company row');
assert(!shortHtml.includes('Location:</td>'), 'Omitted empty location row');

// Test 6: Plain-Text Fallback Version
console.log('\nTest Suite 6: Plain-Text Fallback Rendering');
const textVersion = renderLeadNotificationText(longFormLead);
assert(textVersion.includes('[GreenNext] New Lead Received — Dr. Ramesh Sundaram (GN-20261019-0101)'), 'Plain-text title format correct');
assert(textVersion.includes('CONTACT INFORMATION'), 'Plain-text contact header present');
assert(textVersion.includes('Full Name:      Dr. Ramesh Sundaram'), 'Plain-text contact name aligned');
assert(textVersion.includes('Business Email: ramesh.s@cloudnext.org'), 'Plain-text email aligned');
assert(textVersion.includes('SUBMISSION METADATA'), 'Plain-text metadata section present');
assert(textVersion.includes('NEXT STEPS'), 'Plain-text next steps present');

// Test 7: Provider Fallback & Error Handling
console.log('\nTest Suite 7: Provider Safety & Offline Handling');
const emailResult = await sendLeadNotificationEmail(shortLead, { gasUrl: '' });
assert(emailResult !== null, 'sendLeadNotificationEmail returns structured status');
assert(emailResult.timestamp !== undefined, 'Timestamp recorded');

console.log('\n================================================================');
console.log(`Results: ${passed} / ${passed + failed} test assertions passed (${failed} failed)`);
console.log('================================================================');

if (failed > 0) {
  process.exit(1);
}
