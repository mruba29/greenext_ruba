// Comprehensive validation suite for GreenNext Traffic Intelligence, Traffic Analysis, and Session Intelligence
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

console.log('================================================================');
console.log('GreenNext Analytics & Enquiry Backend Validation Suite');
console.log('================================================================\n');

// 1. Mock Google Apps Script environment
function createMockGasContext() {
  const sheetsStore = new Map();

  class MockRange {
    constructor(sheet, startRow, startCol, numRows, numCols) {
      this.sheet = sheet;
      this.startRow = startRow;
      this.startCol = startCol;
      this.numRows = numRows;
      this.numCols = numCols;
    }
    setFontWeight() { return this; }
    setBackground() { return this; }
    setFontColor() { return this; }
    setWrap() { return this; }
    getValues() {
      const rows = [];
      for (let r = this.startRow - 1; r < this.startRow - 1 + this.numRows; r++) {
        const row = this.sheet.rows[r] || [];
        const slice = [];
        for (let c = this.startCol - 1; c < this.startCol - 1 + this.numCols; c++) {
          slice.push(row[c] !== undefined ? row[c] : '');
        }
        rows.push(slice);
      }
      return rows;
    }
    setValues(matrix) {
      for (let r = 0; r < matrix.length; r++) {
        const targetR = this.startRow - 1 + r;
        if (!this.sheet.rows[targetR]) this.sheet.rows[targetR] = [];
        for (let c = 0; c < matrix[r].length; c++) {
          const targetC = this.startCol - 1 + c;
          this.sheet.rows[targetR][targetC] = matrix[r][c];
        }
      }
      return this;
    }
    clearContent() {
      for (let r = this.startRow - 1; r < this.startRow - 1 + this.numRows; r++) {
        if (this.sheet.rows[r]) {
          for (let c = this.startCol - 1; c < this.startCol - 1 + this.numCols; c++) {
            this.sheet.rows[r][c] = '';
          }
        }
      }
      return this;
    }
  }

  class MockSheet {
    constructor(name) {
      this.name = name;
      this.rows = [];
    }
    getName() { return this.name; }
    getLastRow() { return this.rows.length; }
    getLastColumn() {
      return this.rows.reduce((max, r) => Math.max(max, r ? r.length : 0), 0);
    }
    appendRow(row) {
      this.rows.push([...row]);
      return this;
    }
    getDataRange() {
      const numRows = Math.max(1, this.rows.length);
      const numCols = Math.max(1, this.getLastColumn());
      return new MockRange(this, 1, 1, numRows, numCols);
    }
    getRange(startRow, startCol, numRows = 1, numCols = 1) {
      return new MockRange(this, startRow, startCol, numRows, numCols);
    }
    setFrozenRows() {}
    autoResizeColumn() {}
    setColumnWidth() {}
  }

  class MockSpreadsheet {
    getSheetByName(name) {
      return sheetsStore.get(name) || null;
    }
    insertSheet(name) {
      if (sheetsStore.has(name)) return sheetsStore.get(name);
      const s = new MockSheet(name);
      sheetsStore.set(name, s);
      return s;
    }
  }

  const activeSpreadsheet = new MockSpreadsheet();
  const dispatchedEmails = [];

  const sandbox = {
    SpreadsheetApp: {
      openById: () => activeSpreadsheet,
      getActiveSpreadsheet: () => activeSpreadsheet,
    },
    LockService: {
      getScriptLock: () => ({
        tryLock: () => true,
        releaseLock: () => {},
      }),
    },
    Utilities: {
      formatDate: (date, tz, fmt) => {
        // Deterministic IST formatter
        const d = new Date(date);
        const pad = (n) => String(n).padStart(2, '0');
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istDate = new Date(d.getTime() + (d.getTimezoneOffset() * 60 * 1000) + istOffset);
        const y = istDate.getFullYear();
        const m = pad(istDate.getMonth() + 1);
        const day = pad(istDate.getDate());
        const h = pad(istDate.getHours());
        const min = pad(istDate.getMinutes());
        const s = pad(istDate.getSeconds());

        if (fmt === 'yyyyMMdd') return `${y}${m}${day}`;
        if (fmt === 'yyyy-MM-dd HH:mm:ss') return `${y}-${m}-${day} ${h}:${min}:${s}`;
        return d.toISOString();
      },
    },
    ContentService: {
      MimeType: { JSON: 'application/json' },
      createTextOutput: (str) => ({
        content: str,
        getContent: function() { return this.content; },
        setMimeType: function() { return this; },
      }),
    },
    MailApp: {
      sendEmail: (opts) => dispatchedEmails.push(opts),
    },
    Logger: {
      log: () => {},
    },
    console: console,
    Math: Math,
    Date: Date,
    parseInt: parseInt,
    parseFloat: parseFloat,
    String: String,
    Boolean: Boolean,
    Array: Array,
    Object: Object,
    JSON: JSON,
    RegExp: RegExp,
  };

  const context = vm.createContext(sandbox);

  // Load Code.gs and Analytics.gs into context
  const codeGs = readFileSync(join(ROOT, 'google-apps-script', 'Code.gs'), 'utf8');
  const analyticsGs = readFileSync(join(ROOT, 'google-apps-script', 'Analytics.gs'), 'utf8');

  vm.runInContext(codeGs, context, { filename: 'Code.gs' });
  vm.runInContext(analyticsGs, context, { filename: 'Analytics.gs' });

  return { context, sheetsStore, dispatchedEmails };
}

// -----------------------------------------------------------------------------
// TEST RUNNER
// -----------------------------------------------------------------------------
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName}`);
  }
}

// -----------------------------------------------------------------------------
// SUITE 1: Enquiry Form Integration (Code.gs)
// -----------------------------------------------------------------------------
console.log('Test Suite 1: Google Apps Script Enquiry Handling');
{
  const { context, sheetsStore } = createMockGasContext();

  // Test 1: GET health check
  const resGet = JSON.parse(vm.runInContext('doGet({ parameter: {} }).content', context));
  assert(resGet.success === true, 'Enquiry doGet health check returns success: true');
  assert(resGet.service.includes('Enquiry API'), 'doGet identifies as Enquiry API');
  assert(sheetsStore.has('Enquiries'), 'Enquiries worksheet initialized on doGet');

  // Test 2: Formula injection sanitization
  const resPostFormula = JSON.parse(vm.runInContext(`
    doPost({
      postData: {
        contents: JSON.stringify({
          form_type: 'Long Form',
          full_name: '=CMD|\\'/C calc\\\'!A0',
          business_email: 'security@enterprise.com',
          phone: '+91 98765 43210',
          project_requirements: '@HYPERLINK("http://attacker.com")',
          consent: true
        })
      }
    }).content
  `, context));

  assert(resPostFormula.success === true, 'Malicious formula payload handled and stored');
  const enquirySheet = sheetsStore.get('Enquiries');
  const lastRow = enquirySheet.rows[enquirySheet.rows.length - 1];
  assert(lastRow[3].startsWith("'="), 'Formula in Full Name escaped with leading quote');
  assert(lastRow[6].startsWith("'+"), 'Leading + in phone escaped with leading quote');
  assert(lastRow[10].startsWith("'@"), 'Formula in requirements escaped with leading quote');
  assert(lastRow[0].startsWith('GN-'), 'Enquiry ID correctly generated with GN- prefix');

  // Test 3: Short form submission
  const resShortForm = JSON.parse(vm.runInContext(`
    doPost({
      postData: {
        contents: JSON.stringify({
          form_type: 'Short Form',
          name: 'Priya Sundaram',
          contact: 'priya@greennext.in',
          area_of_interest: 'Liquid Cooling'
        })
      }
    }).content
  `, context));
  assert(resShortForm.success === true, 'Short Form submission succeeded');

  // Test 4: Validation rejection on empty/invalid fields
  const resInvalid = JSON.parse(vm.runInContext(`
    doPost({
      postData: {
        contents: JSON.stringify({
          form_type: 'Long Form',
          full_name: 'A',
          business_email: 'not-an-email',
          phone: '123'
        })
      }
    }).content
  `, context));
  assert(resInvalid.success === false, 'Invalid long form payload correctly rejected');

  // Test 5: Reusable Global Floating Lead Form submission with hidden metadata
  const resFloatingLead = JSON.parse(vm.runInContext(`
    doPost({
      postData: {
        contents: JSON.stringify({
          form_type: 'Floating Lead Form',
          full_name: 'Vikram Raghavan',
          business_email: 'vikram@cognitiveracks.com',
          phone: '+91 94432 12345',
          area_of_interest: 'AI Infrastructure',
          project_requirements: 'Require 40kW rack density planning for Q1 expansion.',
          page_url: 'https://greennext.in/capabilities/ai-infrastructure.html',
          page_title: 'AI Infrastructure | GreenNext',
          referrer: 'https://linkedin.com',
          utm_source: 'linkedin',
          utm_medium: 'cpc',
          utm_campaign: 'enterprise_q4',
          consent: true
        })
      }
    }).content
  `, context));
  assert(resFloatingLead.success === true, 'Floating Lead Form submission succeeded');
  assert(resFloatingLead.enquiryId.startsWith('GN-'), 'Floating Lead Form assigned valid GN- ID');

  const flRow = enquirySheet.rows[enquirySheet.rows.length - 1];
  assert(flRow[2] === 'Floating Lead Form', 'Form Type recorded as Floating Lead Form');
  assert(flRow[3] === 'Vikram Raghavan', 'Full Name stored accurately');
  assert(flRow[4] === 'vikram@cognitiveracks.com', 'Business email stored');
  assert(flRow[9] === 'AI Infrastructure', 'Area of Interest / Service stored');
  assert(flRow[13].includes('URL: https://greennext.in/capabilities/ai-infrastructure.html'), 'Page URL metadata stored in Message column');
  assert(flRow[13].includes('UTM: linkedin/cpc'), 'UTM source/medium metadata stored in Message column');

  // Test 6: Server-side Duplicate Submission Prevention
  const resDuplicate = JSON.parse(vm.runInContext(`
    doPost({
      postData: {
        contents: JSON.stringify({
          form_type: 'Floating Lead Form',
          full_name: 'Vikram Raghavan',
          business_email: 'vikram@cognitiveracks.com',
          phone: '+91 94432 12345',
          area_of_interest: 'AI Infrastructure',
          project_requirements: 'Require 40kW rack density planning for Q1 expansion.',
          consent: true
        })
      }
    }).content
  `, context));
  assert(resDuplicate.success === true, 'Duplicate response returns success true');
  assert(resDuplicate.duplicate === true, 'Duplicate flag correctly set by server duplicate protection');
  assert(resDuplicate.enquiryId === resFloatingLead.enquiryId, 'Duplicate submission references existing Enquiry ID');

  // Test 7: Floating Lead Form rejection on missing service
  const resFloatingInvalid = JSON.parse(vm.runInContext(`
    doPost({
      postData: {
        contents: JSON.stringify({
          form_type: 'Floating Lead Form',
          full_name: 'Vikram Raghavan',
          business_email: 'vikram@cognitiveracks.com',
          phone: '+91 94432 12345',
          area_of_interest: ''
        })
      }
    }).content
  `, context));
  assert(resFloatingInvalid.success === false, 'Floating Lead Form rejects missing service/interest');

  // Test 8: Sequential ID progression verification across prior submissions
  assert(resPostFormula.enquiryId.endsWith('-0001'), 'Lead 1 assigned sequential ID ending in -0001');
  assert(resShortForm.enquiryId.endsWith('-0002'), 'Lead 2 assigned sequential ID ending in -0002');
  assert(resFloatingLead.enquiryId.endsWith('-0003'), 'Lead 3 assigned sequential ID ending in -0003');
  assert(resDuplicate.enquiryId.endsWith('-0003'), 'Duplicate lead returned existing -0003 ID without consuming next sequence');

  // Test 9: Next new unique lead receives -0004
  const resNextLead = JSON.parse(vm.runInContext(`
    doPost({
      postData: {
        contents: JSON.stringify({
          form_type: 'Long Form',
          full_name: 'Dr. Aruna Natarajan',
          business_email: 'aruna@deepgreentech.in',
          company_name: 'DeepGreen Technologies',
          phone: '+91 98401 55667',
          location: 'Coimbatore',
          industry: 'Clean Energy',
          area_of_interest: 'Energy Optimization',
          project_requirements: 'Require microgrid synchronization and telemetry dashboard.',
          consent: true
        })
      }
    }).content
  `, context));
  assert(resNextLead.success === true, 'Next unique lead submission succeeded');
  assert(resNextLead.enquiryId.endsWith('-0004'), 'Next unique lead accurately assigned sequential ID ending in -0004');
  const nextLeadRow = enquirySheet.rows[enquirySheet.rows.length - 1];
  assert(nextLeadRow[0] === resNextLead.enquiryId, 'Lead ID persisted in Column 1 of Enquiries sheet');
  assert(nextLeadRow[15] === 'New', 'Integration status initialized to New');

  // Test 10: Careers Application separate workflow
  const resCareers = JSON.parse(vm.runInContext(`
    doPost({
      postData: {
        contents: JSON.stringify({
          form_type: 'Careers Application',
          full_name: 'Karthik Balan',
          business_email: 'karthik.balan@alumni.iitm.ac.in',
          phone: '+91 98840 99881',
          position: 'Infrastructure & Operations',
          resume: 'https://storage.googleapis.com/resumes/karthik_balan.pdf',
          linkedin: 'https://linkedin.com/in/karthikbalan-ops'
        })
      }
    }).content
  `, context));
  assert(resCareers.success === true, 'Careers Application submission succeeded');
  assert(resCareers.enquiryId.endsWith('-0005'), 'Careers Application assigned sequential ID ending in -0005');
  const careersRow = enquirySheet.rows[enquirySheet.rows.length - 1];
  assert(careersRow[2] === 'Careers Application', 'Form Type recorded as Careers Application (separate workflow)');
  assert(careersRow[9] === 'Infrastructure & Operations', 'Target position captured in Area of Interest');
  assert(careersRow[10].includes('karthik_balan.pdf'), 'Resume URL stored in requirements column');
  assert(careersRow[12].includes('linkedin.com'), 'LinkedIn profile stored in contact method column');
}

// -----------------------------------------------------------------------------
// SUITE 2: Traffic Analysis Event Ingestion (Analytics.gs)
// -----------------------------------------------------------------------------
console.log('\nTest Suite 2: Traffic Analysis Raw Event Tracking');
{
  const { context, sheetsStore } = createMockGasContext();

  const eventsBatch = [
    {
      event_type: 'page_view',
      session_id: 'gns_test_01',
      page_url: '/',
      page_title: 'GreenNext - Sustainable AI Infrastructure',
      referrer_source: 'Organic Search',
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'ai_launch_2026',
      device_category: 'Desktop',
      browser_category: 'Chrome',
      os_name: 'Windows',
      landing_page: '/',
      session_start_ts: Date.now() - 60000,
      client_ts: Date.now() - 60000,
    },
    {
      event_type: 'cta_click',
      session_id: 'gns_test_01',
      page_url: '/',
      cta_name: 'Explore AI Data Centers',
      device_category: 'Desktop',
      client_ts: Date.now() - 40000,
    },
    {
      event_type: 'whatsapp_cta_click',
      session_id: 'gns_test_01',
      page_url: '/',
      cta_name: 'Chat on WhatsApp',
      device_category: 'Desktop',
      client_ts: Date.now() - 20000,
    }
  ];

  const resPost = JSON.parse(vm.runInContext(`
    doPost({
      postData: {
        contents: JSON.stringify({ events: ${JSON.stringify(eventsBatch)} })
      }
    }).content
  `, context));

  assert(resPost.success === true, 'Batch events ingestion returned success: true');
  assert(resPost.received === 3, 'Batch received count matches payload size (3)');
  assert(resPost.written === 3, 'Batch written count matches (3)');

  const trafficSheet = sheetsStore.get('Traffic Analysis');
  assert(trafficSheet !== null, 'Traffic Analysis sheet initialized');
  // 1 header row + 3 event rows = 4 rows
  assert(trafficSheet.rows.length === 4, 'Traffic Analysis has exactly 3 data rows appended');
  assert(trafficSheet.rows[0].length === 16, 'Traffic Analysis header matches 16-column schema');
  assert(trafficSheet.rows[1][3] === 'page_view', 'First event type recorded as page_view');
  assert(trafficSheet.rows[3][3] === 'whatsapp_cta_click', 'Third event type recorded as whatsapp_cta_click');
}

// -----------------------------------------------------------------------------
// SUITE 3: Session Intelligence Monotonic Accumulation (Analytics.gs)
// -----------------------------------------------------------------------------
console.log('\nTest Suite 3: Session Intelligence Multi-Batch Accumulation');
{
  const { context, sheetsStore } = createMockGasContext();
  const sessionId = 'gns_multibatch_session';
  const now = Date.now();

  // Batch 1: User arrives on Homepage
  vm.runInContext(`
    doPost({
      postData: {
        contents: JSON.stringify({
          events: [{
            event_type: 'page_view',
            session_id: '${sessionId}',
            page_url: '/',
            landing_page: '/',
            referrer_source: 'Organic Search',
            device_category: 'Desktop',
            session_start_ts: ${now - 120000},
            client_ts: ${now - 120000}
          }]
        })
      }
    })
  `, context);

  const sessionSheet = sheetsStore.get('Session Intelligence');
  assert(sessionSheet.rows.length === 2, 'Session Intelligence created initial row for new visitor');
  assert(sessionSheet.rows[0].length === 20, 'Session Intelligence header matches 20-column schema');
  assert(sessionSheet.rows[1][0] === sessionId, 'Session ID matches in column 1');
  assert(sessionSheet.rows[1][8] === '1', 'Initial Total Page Views is 1');
  assert(sessionSheet.rows[1][17] === 'Not Converted', 'Initial conversion status is Not Converted');

  // Batch 2: User clicks 3 CTAs
  vm.runInContext(`
    doPost({
      postData: {
        contents: JSON.stringify({
          events: [
            { event_type: 'cta_click', session_id: '${sessionId}', page_url: '/', cta_name: 'Read Architecture', client_ts: ${now - 90000} },
            { event_type: 'cta_click', session_id: '${sessionId}', page_url: '/', cta_name: 'View Specs', client_ts: ${now - 80000} },
            { event_type: 'whatsapp_cta_click', session_id: '${sessionId}', page_url: '/', cta_name: 'WhatsApp Desk', client_ts: ${now - 70000} }
          ]
        })
      }
    })
  `, context);

  assert(sessionSheet.rows.length === 2, 'No duplicate session row created on second batch (in-place upsert)');
  assert(sessionSheet.rows[1][8] === '1', 'Total Page Views PRESERVED at 1 (not wiped by CTA batch)');
  assert(sessionSheet.rows[1][12] === '3', 'CTA Click Count accumulated to 3');
  assert(sessionSheet.rows[1][13] === 'Yes', 'WhatsApp CTA Clicked flag set to Yes');

  // Batch 3: User navigates to AI Data Centers solution page
  vm.runInContext(`
    doPost({
      postData: {
        contents: JSON.stringify({
          events: [{
            event_type: 'page_view',
            session_id: '${sessionId}',
            page_url: '/solutions/ai-data-centers.html',
            client_ts: ${now - 50000}
          }]
        })
      }
    })
  `, context);

  assert(sessionSheet.rows[1][8] === '2', 'Total Page Views incremented to 2');
  assert(sessionSheet.rows[1][7] === '/ → /solutions/ai-data-centers.html', 'Pages Viewed path joined accurately');
  assert(sessionSheet.rows[1][6] === '/solutions/ai-data-centers.html', 'Last Viewed Page updated');

  // Batch 4: User begins filling Long Form
  vm.runInContext(`
    doPost({
      postData: {
        contents: JSON.stringify({
          events: [{
            event_type: 'form_start',
            form_type: 'Long Form',
            session_id: '${sessionId}',
            page_url: '/solutions/ai-data-centers.html',
            client_ts: ${now - 30000}
          }]
        })
      }
    })
  `, context);

  assert(sessionSheet.rows[1][14] === 'Yes', 'Long Form Started set to Yes');

  // Batch 5: Form submission succeeds (Conversion!)
  vm.runInContext(`
    doPost({
      postData: {
        contents: JSON.stringify({
          events: [{
            event_type: 'form_submission_success',
            form_type: 'Long Form',
            conversion_status: 'Converted',
            session_id: '${sessionId}',
            page_url: '/solutions/ai-data-centers.html',
            client_ts: ${now - 10000}
          }]
        })
      }
    })
  `, context);

  assert(sessionSheet.rows[1][16] === 'Yes', 'Form Submitted Successfully flag set to Yes');
  assert(sessionSheet.rows[1][17] === 'Converted', 'Conversion Status set to Converted');

  // Batch 6: 60s Heartbeat arrives — verify ALL previous metrics remain intact
  vm.runInContext(`
    doPost({
      postData: {
        contents: JSON.stringify({
          events: [{
            event_type: 'session_heartbeat',
            session_id: '${sessionId}',
            session_age_seconds: 120,
            client_ts: ${now}
          }]
        })
      }
    })
  `, context);

  assert(sessionSheet.rows[1][8] === '2', 'Page views preserved across heartbeat');
  assert(sessionSheet.rows[1][12] === '3', 'CTA clicks preserved across heartbeat');
  assert(sessionSheet.rows[1][13] === 'Yes', 'WhatsApp flag preserved across heartbeat');
  assert(sessionSheet.rows[1][16] === 'Yes', 'Conversion preserved across heartbeat');
  assert(sessionSheet.rows[1][17] === 'Converted', 'Conversion Status remains Converted');
  assert(parseInt(sessionSheet.rows[1][4], 10) >= 110, 'Session Duration accurately calculated in seconds');
}

// -----------------------------------------------------------------------------
// SUITE 4: Traffic Intelligence KPI Calculation & Period Splits (Analytics.gs)
// -----------------------------------------------------------------------------
console.log('\nTest Suite 4: Traffic Intelligence Insights & KPI Calculations');
{
  const { context, sheetsStore } = createMockGasContext();
  const now = new Date('2026-10-14T10:00:00.000Z');

  // Seed 25 realistic events spanning current week, previous week, conversions, devices, locations
  const tSheet = vm.runInContext(`getOrInitAnalyticsSheet(getSpreadsheet(), SHEET_TRAFFIC, COLS_TRAFFIC, '#0E3A2B')`, context);

  const pad = (n) => String(n).padStart(2, '0');
  function makeTs(daysAgo) {
    const d = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
  }

  // 16 columns matching COLS_TRAFFIC
  const sampleEvents = [
    // Current period (last 7 days): 8 page views, 4 CTAs, 2 WhatsApp, 2 Long Form starts, 1 Long Form Conv, 1 Short Form start + Conv
    ['EVT-01', makeTs(1), 's1', 'page_view', '/', 'Home', 'Google Search', 'google', 'organic', '', 'Desktop', 'Chrome', '/', '', '', ''],
    ['EVT-02', makeTs(1), 's1', 'cta_click', '/', 'Home', 'Google Search', 'google', 'organic', '', 'Desktop', 'Chrome', '/', 'Talk to Expert', '', ''],
    ['EVT-03', makeTs(2), 's2', 'page_view', '/solutions/ai-data-centers.html', 'AI Data Centers', 'Direct', '', '', '', 'Mobile', 'Safari', '/solutions/ai-data-centers.html', '', '', ''],
    ['EVT-04', makeTs(2), 's2', 'whatsapp_cta_click', '/solutions/ai-data-centers.html', 'AI Data Centers', 'Direct', '', '', '', 'Mobile', 'Safari', '', 'WhatsApp Desk', '', ''],
    ['EVT-05', makeTs(2), 's3', 'page_view', '/locations/coimbatore.html', 'Coimbatore Facility', 'Direct', '', '', '', 'Desktop', 'Edge', '/locations/coimbatore.html', '', '', ''],
    ['EVT-06', makeTs(3), 's4', 'page_view', '/about.html', 'About Us', 'LinkedIn', 'linkedin', 'social', 'brand', 'Mobile', 'Chrome', '/about.html', '', '', ''],
    ['EVT-07', makeTs(3), 's4', 'form_start', '/about.html', 'About Us', 'LinkedIn', 'linkedin', 'social', 'brand', 'Mobile', 'Chrome', '', '', 'Short Form', ''],
    ['EVT-08', makeTs(3), 's4', 'form_submission_success', '/about.html', 'About Us', 'LinkedIn', 'linkedin', 'social', 'brand', 'Mobile', 'Chrome', '', '', 'Short Form', 'Converted'],
    ['EVT-09', makeTs(4), 's5', 'page_view', '/capabilities/digital-infrastructure.html', 'Digital Infra', 'Direct', '', '', '', 'Desktop', 'Chrome', '', '', '', ''],
    ['EVT-10', makeTs(4), 's5', 'form_start', '/capabilities/digital-infrastructure.html', 'Digital Infra', 'Direct', '', '', '', 'Desktop', 'Chrome', '', '', 'Long Form', ''],
    ['EVT-11', makeTs(4), 's5', 'form_submission_success', '/capabilities/digital-infrastructure.html', 'Digital Infra', 'Direct', '', '', '', 'Desktop', 'Chrome', '', '', 'Long Form', 'Converted'],
    ['EVT-12', makeTs(5), 's6', 'page_view', '/solutions/ai-data-centers.html', 'AI Data Centers', 'Direct', '', '', '', 'Mobile', 'Safari', '', '', '', ''],
    ['EVT-13', makeTs(5), 's6', 'cta_click', '/solutions/ai-data-centers.html', 'AI Data Centers', 'Direct', '', '', '', 'Mobile', 'Safari', '', 'Request Blueprint', '', ''],
    ['EVT-14', makeTs(6), 's7', 'page_view', '/', 'Home', 'Google Search', '', '', '', 'Desktop', 'Firefox', '/', '', '', ''],
    ['EVT-15', makeTs(6), 's7', 'whatsapp_cta_click', '/', 'Home', 'Google Search', '', '', '', 'Desktop', 'Firefox', '', 'WhatsApp Desk', '', ''],
    ['EVT-15b', makeTs(6), 's7', 'page_view', '/capabilities/ai-infrastructure.html', 'AI Infra', 'Google Search', '', '', '', 'Desktop', 'Firefox', '', '', '', ''],

    // Previous period (8-14 days ago): 4 page views
    ['EVT-16', makeTs(9),  's8', 'page_view', '/', 'Home', 'Direct', '', '', '', 'Desktop', 'Chrome', '/', '', '', ''],
    ['EVT-17', makeTs(10), 's8', 'page_view', '/solutions/energy-optimization.html', 'Energy', 'Direct', '', '', '', 'Desktop', 'Chrome', '', '', '', ''],
    ['EVT-18', makeTs(11), 's9', 'page_view', '/contact.html', 'Contact', 'Direct', '', '', '', 'Mobile', 'Safari', '', '', '', ''],
    ['EVT-19', makeTs(12), 's10', 'page_view', '/careers.html', 'Careers', 'Direct', '', '', '', 'Desktop', 'Chrome', '', '', '', ''],
  ];

  sampleEvents.forEach(row => tSheet.appendRow(row));

  // Run insight regeneration
  vm.runInContext(`regenerateIntelligence(getSpreadsheet(), getOrInitAnalyticsSheet(getSpreadsheet(), SHEET_TRAFFIC, COLS_TRAFFIC, '#0E3A2B'), new Date('${now.toISOString()}'))`, context);

  const iSheet = sheetsStore.get('Traffic Intelligence');
  assert(iSheet !== null, 'Traffic Intelligence sheet initialized');
  assert(iSheet.rows.length >= 8, `Traffic Intelligence generated ${iSheet.rows.length - 1} structured insights`);

  // Verify headers
  assert(iSheet.rows[0].length === 11, 'Traffic Intelligence matches 11-column schema');

  // Verify Page Views insight (Current 7d vs Prev 7d)
  const pvInsight = iSheet.rows.find(r => r[2] === 'Page Views');
  assert(Boolean(pvInsight), 'Found Page Views insight row');
  assert(pvInsight[5] === '8', 'Calculated 8 page views in current 7-day period');
  assert(pvInsight[6] === '4', 'Calculated 4 page views in previous 7-day period');
  assert(pvInsight[3].includes('+100%'), 'Calculated +100% week-over-week page view growth');

  // Verify Top Pages insight
  const topPagesInsight = iSheet.rows.find(r => r[2] === 'Top Pages');
  assert(Boolean(topPagesInsight), 'Found Top Pages insight');
  assert(topPagesInsight[5].includes('/'), 'Identifies / among top pages');

  // Verify Device Distribution
  const devInsight = iSheet.rows.find(r => r[2] === 'Device Distribution');
  assert(Boolean(devInsight), 'Found Device Distribution insight');
  assert(devInsight[3].includes('Mobile:'), 'Contains mobile percentage breakdown');

  // Verify CTA Engagement (WhatsApp inclusion + conversion rate accuracy)
  const ctaInsight = iSheet.rows.find(r => r[2] === 'CTA Engagement');
  assert(Boolean(ctaInsight), 'Found CTA Engagement insight');
  assert(ctaInsight[3].includes('WhatsApp clicks: 2'), 'Correctly counted 2 WhatsApp CTA clicks');
  assert(ctaInsight[3].includes('Form conversions: 2'), 'Correctly counted 2 total form conversions');

  // Verify Form Funnel (Separate Long Form vs Short Form)
  const funnelInsight = iSheet.rows.find(r => r[2] === 'Form Funnel');
  assert(Boolean(funnelInsight), 'Found Form Funnel insight');
  assert(funnelInsight[3].includes('Long Form: 1 starts → 1 submissions (100.0%)'), 'Long form funnel isolated without short form contamination');
  assert(funnelInsight[3].includes('Short Form: 1 starts → 1 submissions (100.0%)'), 'Short form funnel isolated');

  // Verify Location Engagement
  const locInsight = iSheet.rows.find(r => r[2] === 'Location Engagement');
  assert(Boolean(locInsight), 'Found Location Engagement insight');
  assert(locInsight[3].includes('/locations/coimbatore.html'), 'Detected Coimbatore location visits');

  // Test GET API query for insights
  const apiRes = JSON.parse(vm.runInContext(`handleAnalyticsGet({ parameter: { view: 'insights' } }).content`, context));
  assert(apiRes.success === true, 'GET ?view=insights returns success: true');
  assert(apiRes.insights.length >= 7, 'GET ?view=insights returns formatted array of insights for dashboards');
}

// -----------------------------------------------------------------------------
// SUITE 5: Coexistence and Dispatching (Code.gs + Analytics.gs)
// -----------------------------------------------------------------------------
console.log('\nTest Suite 5: Dual-Script Coexistence & Dispatching');
{
  const { context, sheetsStore } = createMockGasContext();

  // Test: Dispatch enquiry POST to unified endpoint
  const enqRes = JSON.parse(vm.runInContext(`
    doPost({
      postData: {
        contents: JSON.stringify({
          form_type: 'Long Form',
          full_name: 'Coexistence Test Lead',
          business_email: 'coexist@greennext.in',
          phone: '+91 99887 76655',
          project_requirements: 'Verify seamless routing without collision',
          consent: true
        })
      }
    }).content
  `, context));

  assert(enqRes.success === true, 'Enquiry routed properly to handleEnquiryPost');
  assert(sheetsStore.get('Enquiries').rows.length === 2, 'Enquiry written to Enquiries sheet');

  // Test: Dispatch analytics POST to unified endpoint
  const anaRes = JSON.parse(vm.runInContext(`
    doPost({
      postData: {
        contents: JSON.stringify({
          events: [{
            event_type: 'page_view',
            session_id: 'gns_coexist_01',
            page_url: '/',
            client_ts: Date.now()
          }]
        })
      }
    }).content
  `, context));

  assert(anaRes.success === true, 'Analytics routed properly to handleAnalyticsPost');
  assert(sheetsStore.get('Traffic Analysis').rows.length === 2, 'Event written to Traffic Analysis sheet (NOT Enquiries sheet)');
}

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`Results: ${passedTests} / ${totalTests} tests passed (${failedTests} failed)`);
console.log('================================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY.');
}
