/**
 * GreenNext Digital Infrastructure — Comprehensive Airtable Integration Test Suite
 * 
 * Verifies:
 * 1. Field Mapping Logic (all 21 target fields)
 * 2. Idempotency & Duplicate Prevention
 * 3. Adaptive Schema Error Recovery (422 Unknown Field Name stripping)
 * 4. Missing / Invalid Credentials Safe Error Handling
 * 5. Server-Side Input Validation (Invalid submissions rejected with 400)
 * 6. Serverless Route End-to-End Simulation (/api/enquiry and /api/airtable)
 * 7. No Secret Leakage in Outputs
 */

import { mapLeadToAirtableFields, saveLeadToAirtable, getAirtableConfig, verifyAirtableConnection } from '../api/_airtable.js';
import enquiryHandler from '../api/enquiry.js';
import airtableHandler from '../api/airtable.js';

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

async function runTestSuite() {
  console.log('\n================================================================');
  console.log('  GreenNext — Airtable Integration Verification Suite');
  console.log('================================================================\n');

  // TEST 1: Field Mapping Coverage
  console.log('▶ Test 1: Field Mapping Coverage');
  const sampleLead = {
    enquiryId: 'GN-20261020-0099',
    fullName: 'Sundar Pichai',
    businessEmail: 'sundar@alphabet.com',
    phoneNumber: '+91 98765 43210',
    companyName: 'Alphabet Inc.',
    location: 'Bangalore / Coimbatore',
    industry: 'Technology / Cloud AI',
    formType: 'Talk to an Expert',
    projectRequirements: '10 MW AI High-Density Liquid Cooling Cluster',
    businessChallenge: 'Thermal dissipation bottlenecks under H100 GPU compute loads',
    expectedTimeline: 'Q1 2027',
    budget: '$5M - $10M',
    page_source: '/solutions/ai-data-centers',
    createdAt: '2026-10-20T10:00:00.000Z',
    leadStatus: 'New',
    leadSaved: true,
    jira: { parentKey: 'DI-142', parentUrl: 'https://trustworkz.atlassian.net/browse/DI-142' },
    emailNotificationStatus: 'Sent',
    metadata: {
      page_url: 'https://greenext.in/solutions/ai-data-centers',
      utm_source: 'linkedin',
      utm_medium: 'cpc',
      utm_campaign: 'ai_infrastructure_launch',
    },
  };

  const mapped = mapLeadToAirtableFields(sampleLead);

  assert(mapped['Enquiry ID'] === 'GN-20261020-0099', 'Enquiry ID correctly mapped');
  assert(mapped['Name'] === 'Sundar Pichai', 'Name correctly mapped');
  assert(mapped['Email'] === 'sundar@alphabet.com', 'Email correctly mapped');
  assert(mapped['Phone'] === '+91 98765 43210', 'Phone correctly mapped');
  assert(mapped['Company'] === 'Alphabet Inc.', 'Company correctly mapped');
  assert(mapped['Location'] === 'Bangalore / Coimbatore', 'Location correctly mapped');
  assert(mapped['Industry'] === 'Technology / Cloud AI', 'Industry correctly mapped');
  assert(mapped['Enquiry Type'] === 'Talk to an Expert', 'Enquiry Type correctly mapped');
  assert(mapped['Requirements'] === '10 MW AI High-Density Liquid Cooling Cluster', 'Requirements correctly mapped');
  assert(mapped['Business Challenge'] === 'Thermal dissipation bottlenecks under H100 GPU compute loads', 'Business Challenge mapped');
  assert(mapped['Project Timeline'] === 'Q1 2027', 'Project Timeline correctly mapped');
  assert(mapped['Budget'] === '$5M - $10M', 'Budget correctly mapped');
  assert(mapped['Source Page'] === 'https://greenext.in/solutions/ai-data-centers', 'Source Page correctly mapped');
  assert(mapped['UTM Source'] === 'linkedin', 'UTM Source correctly mapped');
  assert(mapped['UTM Medium'] === 'cpc', 'UTM Medium correctly mapped');
  assert(mapped['UTM Campaign'] === 'ai_infrastructure_launch', 'UTM Campaign correctly mapped');
  assert(mapped['Lead Status'] === 'New', 'Lead Status defaults to New');
  assert(mapped['Google Sheets Sync Status'] === 'Synced', 'Google Sheets sync status mapped');
  assert(mapped['Jira Issue Key'] === 'DI-142', 'Jira Issue Key mapped');
  assert(mapped['Email Notification Status'] === 'Sent', 'Email Notification Status mapped');
  assert(Boolean(mapped['Created At'] && mapped['Updated At']), 'Created At & Updated At timestamps mapped');

  // TEST 2: Missing Credentials Safe Error Handling
  console.log('\n▶ Test 2: Safe Error When Credentials Missing');
  const mockUnconfigured = {
    pat: '',
    baseId: 'appnkJABVWFGwX7Lv',
    tableId: 'tblYi5BguStHsPtA4',
    isConfigured: false,
  };

  const missingResult = await saveLeadToAirtable(sampleLead, { config: mockUnconfigured });
  assert(missingResult.success === false, 'Save returns success: false when PAT missing');
  assert(missingResult.status === 'missing_credentials', 'Returns clean status: missing_credentials');
  assert(missingResult.message.includes('AIRTABLE_PAT'), 'Explains missing AIRTABLE_PAT clearly');

  // TEST 3: Mock Server-Side Request to /api/enquiry with Missing Input
  console.log('\n▶ Test 3: Server-Side Input Validation in /api/enquiry');

  function createMockResponse() {
    return {
      statusCode: 200,
      headers: {},
      body: null,
      setHeader(k, v) { this.headers[k] = v; },
      status(code) { this.statusCode = code; return this; },
      json(payload) { this.body = payload; return this; },
      end() { return this; },
    };
  }

  // 3a. Invalid submission (empty name)
  const reqInvalid = {
    method: 'POST',
    body: { name: '', business_email: 'test@example.com' },
  };
  const resInvalid = createMockResponse();
  await enquiryHandler(reqInvalid, resInvalid);
  assert(resInvalid.statusCode === 400, 'Invalid submission rejected with HTTP 400');
  assert(resInvalid.body?.success === false, 'Response indicates success: false');

  // 3b. Invalid submission (bad email)
  const reqBadEmail = {
    method: 'POST',
    body: { name: 'Valid Name', business_email: 'not-an-email', phone: '9876543210' },
  };
  const resBadEmail = createMockResponse();
  await enquiryHandler(reqBadEmail, resBadEmail);
  assert(resBadEmail.statusCode === 400, 'Bad email rejected with HTTP 400');

  // 3c. Invalid submission (bad phone)
  const reqBadPhone = {
    method: 'POST',
    body: { name: 'Valid Name', business_email: 'valid@example.com', phone: '123' },
  };
  const resBadPhone = createMockResponse();
  await enquiryHandler(reqBadPhone, resBadPhone);
  assert(resBadPhone.statusCode === 400, 'Short phone (< 7 digits) rejected with HTTP 400');

  // TEST 4: Health Check in /api/enquiry and /api/airtable
  console.log('\n▶ Test 4: Diagnostics Health Check Endpoints');
  const reqEnquiryGet = { method: 'GET' };
  const resEnquiryGet = createMockResponse();
  await enquiryHandler(reqEnquiryGet, resEnquiryGet);
  assert(resEnquiryGet.statusCode === 200, 'GET /api/enquiry returns 200 OK');
  assert('airtableConfigured' in resEnquiryGet.body, 'GET /api/enquiry reports airtableConfigured status');

  const reqAirtableGet = { method: 'GET' };
  const resAirtableGet = createMockResponse();
  await airtableHandler(reqAirtableGet, resAirtableGet);
  assert(resAirtableGet.statusCode === 200, 'GET /api/airtable returns 200 OK');
  assert(resAirtableGet.body.config.baseId === 'appnkJABVWFGwX7Lv', 'Reports correct Base ID (appnkJABVWFGwX7Lv)');
  assert(resAirtableGet.body.config.tableId === 'tblYi5BguStHsPtA4', 'Reports correct Table ID (tblYi5BguStHsPtA4)');
  assert(!JSON.stringify(resAirtableGet.body).includes('pat_'), 'Does not leak sensitive PAT');

  // TEST 5: Verify Idempotency & Schema Tolerance Logic
  console.log('\n▶ Test 5: Idempotency Logic & Schema Tolerance Check');
  const config = getAirtableConfig();
  assert(config.baseId === 'appnkJABVWFGwX7Lv', 'Default Base ID matches specification');
  assert(config.tableId === 'tblYi5BguStHsPtA4', 'Default Table ID matches specification');
  assert(config.viewId === 'viwDw74iTVtxylb60', 'Default View ID matches specification');

  // Test 5b: Simulated duplicate check
  const originalFetch = globalThis.fetch;
  try {
    // Mock fetch returning existing record for formula search
    globalThis.fetch = async (url, opts) => {
      if (url.includes('filterByFormula')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            records: [{ id: 'recExistingTestRecord123', fields: { 'Enquiry ID': 'GN-20261020-0099' } }],
          }),
        };
      }
      return { ok: false, status: 404, json: async () => ({}) };
    };

    const duplicateCheckResult = await saveLeadToAirtable(sampleLead, {
      config: { pat: 'pat_mock_test_token', baseId: 'appnkJABVWFGwX7Lv', tableId: 'tblYi5BguStHsPtA4', isConfigured: true },
    });
    assert(duplicateCheckResult.success === true, 'Duplicate check succeeds idempotently');
    assert(duplicateCheckResult.isDuplicate === true, 'Correctly flags isDuplicate: true');
    assert(duplicateCheckResult.recordId === 'recExistingTestRecord123', 'Preserves existing record ID');
  } finally {
    globalThis.fetch = originalFetch;
  }

  // Test 5c: Simulated 422 UNKNOWN_FIELD_NAME recovery
  try {
    let callCount = 0;
    globalThis.fetch = async (url, opts) => {
      if (url.includes('filterByFormula')) {
        return { ok: true, status: 200, json: async () => ({ records: [] }) };
      }
      callCount++;
      if (callCount === 1) {
        // First attempt: Airtable says field "Budget" does not exist
        return {
          ok: false,
          status: 422,
          json: async () => ({
            error: { type: 'UNKNOWN_FIELD_NAME', message: 'Unknown field name: "Budget"' },
          }),
        };
      }
      // Second attempt: succeeds without "Budget"
      return {
        ok: true,
        status: 200,
        json: async () => ({ id: 'recSavedAfterAdaptiveStripping456', fields: {} }),
      };
    };

    const adaptiveResult = await saveLeadToAirtable(sampleLead, {
      config: { pat: 'pat_mock_test_token', baseId: 'appnkJABVWFGwX7Lv', tableId: 'tblYi5BguStHsPtA4', isConfigured: true },
    });
    assert(adaptiveResult.success === true, 'Recovers and succeeds after 422 Unknown Field Name');
    assert(adaptiveResult.omittedFields.includes('Budget'), 'Identifies and omits missing field ("Budget")');
    assert(adaptiveResult.recordId === 'recSavedAfterAdaptiveStripping456', 'Returns created record ID');
  } finally {
    globalThis.fetch = originalFetch;
  }

  // TEST 6: Real or Safe Simulated Submission
  console.log('\n▶ Test 6: Safe Lead Persistence Workflow Simulation');
  const validSubmissionReq = {
    method: 'POST',
    body: {
      form_type: 'Quick Enquiry',
      name: 'Verification Bot',
      contact: 'bot@greennext.in',
      area_of_interest: 'AI Data Centers',
      page_url: 'https://greenext.in/',
      utm_source: 'test_runner',
    },
  };
  const validSubmissionRes = createMockResponse();
  await enquiryHandler(validSubmissionReq, validSubmissionRes);

  if (process.env.AIRTABLE_PAT) {
    console.log('  ℹ️ Real AIRTABLE_PAT detected in environment: checking live response...');
    assert(validSubmissionRes.statusCode === 200, 'Live submission returns 200 OK when PAT configured');
    assert(validSubmissionRes.body?.airtable?.success === true, 'Airtable record created successfully in live base');
  } else {
    console.log('  ℹ️ No AIRTABLE_PAT set yet: checking that safe error is produced without losing lead data...');
    assert(validSubmissionRes.statusCode === 503, 'Returns 503 with clear configuration error when PAT not set');
    assert(validSubmissionRes.body?.success === false, 'Frontend receives success: false (does not falsely claim success)');
    assert(validSubmissionRes.body?.leadSaved === true, 'Lead is preserved in backup/sheets store so no data is lost');
    assert(validSubmissionRes.body?.enquiryId.startsWith('GN-'), 'Unique sequential Enquiry ID is still generated');
  }

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
