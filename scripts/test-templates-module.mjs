/**
 * GreenNext Digital Infrastructure — Templates Module Test Suite
 * 
 * Verifies:
 * 1. Default templates seeding & schema compliance
 * 2. Five required email templates (Welcome, Lead, Consultation, Follow-up, Proposal)
 * 3. Search and category filters
 * 4. Template creation & validation
 * 5. Template editing & update persistence
 * 6. Template duplication & status transition
 * 7. Template deletion
 * 8. Safe placeholder extraction and substitution
 * 9. Email safety & test email dispatch behavior
 * 10. Dashboard HTML & Vercel routing configuration
 */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import handler, {
  APPROVED_PLACEHOLDERS,
  VALID_CATEGORIES,
  extractPlaceholders,
  validatePlaceholders,
  renderWithPlaceholders,
  wrapInBrandedEmailShell
} from '../api/templates.js';

let totalTests = 0;
let passedTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ ${testName}`);
  } else {
    console.error(`  ✗ FAILED: ${testName}`);
  }
}

// Mock Request & Response helpers
function createMockReq({ method = 'GET', query = {}, body = {} } = {}) {
  return {
    method,
    query,
    body,
    headers: {}
  };
}

function createMockRes() {
  return {
    statusCode: 200,
    headers: {},
    bodyData: null,
    setHeader(key, value) {
      this.headers[key.toLowerCase()] = value;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.bodyData = data;
      return this;
    },
    end(data) {
      this.bodyData = data;
      return this;
    }
  };
}

async function runTests() {
  console.log('================================================================');
  console.log('GreenNext Email & Communication Templates Module Test Suite');
  console.log('================================================================\n');

  // ---------------------------------------------------------------------------
  // Suite 1: Template Placeholders & Utility Engine
  // ---------------------------------------------------------------------------
  console.log('Test Suite 1: Template Engine & Approved Placeholders');
  assert(APPROVED_PLACEHOLDERS.includes('customer_name'), 'Approved placeholders include customer_name');
  assert(APPROVED_PLACEHOLDERS.includes('customer_email'), 'Approved placeholders include customer_email');
  assert(APPROVED_PLACEHOLDERS.includes('company_name'), 'Approved placeholders include company_name');
  assert(APPROVED_PLACEHOLDERS.includes('enquiry_type'), 'Approved placeholders include enquiry_type');
  assert(APPROVED_PLACEHOLDERS.includes('requirements'), 'Approved placeholders include requirements');
  assert(APPROVED_PLACEHOLDERS.includes('consultation_date'), 'Approved placeholders include consultation_date');
  assert(APPROVED_PLACEHOLDERS.includes('consultation_time'), 'Approved placeholders include consultation_time');
  assert(APPROVED_PLACEHOLDERS.includes('proposal_link'), 'Approved placeholders include proposal_link');

  const sampleText = 'Hello {{customer_name}}, proposal for {{company_name}}: {{proposal_link}}';
  const extracted = extractPlaceholders(sampleText);
  assert(extracted.length === 3, 'extractPlaceholders accurately extracts 3 tags');
  assert(extracted.includes('customer_name') && extracted.includes('proposal_link'), 'extracted contains expected keys');

  const invalidExtracted = validatePlaceholders(['customer_name', 'unknown_tag_xyz']);
  assert(invalidExtracted.length === 1 && invalidExtracted[0] === 'unknown_tag_xyz', 'validatePlaceholders flags unapproved tags');

  const rendered = renderWithPlaceholders('Welcome {{customer_name}} from {{company_name}}', {
    customer_name: 'Dr. Vikram',
    company_name: 'NeuralGrid'
  });
  assert(rendered === 'Welcome Dr. Vikram from NeuralGrid', 'renderWithPlaceholders properly substitutes values');

  const shell = wrapInBrandedEmailShell('<p>Test Content</p>', 'Test Subject');
  assert(shell.includes('Green<span style="color: #00FF66;">Next</span>'), 'Email shell includes GreenNext logo');
  assert(shell.includes('#070B14') && shell.includes('#00FF66'), 'Email shell uses brand electric green & obsidian palette');

  // ---------------------------------------------------------------------------
  // Suite 2: GET /api/templates & Default Seed Templates
  // ---------------------------------------------------------------------------
  console.log('\nTest Suite 2: Default Templates Seeding & Verification');
  const reqGet = createMockReq({ method: 'GET' });
  const resGet = createMockRes();
  await handler(reqGet, resGet);

  assert(resGet.statusCode === 200, 'GET /api/templates returns HTTP 200');
  assert(resGet.bodyData && resGet.bodyData.success === true, 'Response payload has success: true');
  assert(Array.isArray(resGet.bodyData.templates) && resGet.bodyData.templates.length >= 5, 'At least 5 templates returned');

  const templatesList = resGet.bodyData.templates;

  // Verify Required Template 1: Welcome Email
  const welcomeTpl = templatesList.find(t => t.category === 'Welcome Emails');
  assert(welcomeTpl !== undefined, 'Template 1: Welcome Email exists');
  assert(welcomeTpl.subject === 'Welcome to GreenNext', 'Welcome Email has exact subject "Welcome to GreenNext"');
  assert(welcomeTpl.body.includes('{{customer_name}}'), 'Welcome Email includes {{customer_name}}');
  assert(welcomeTpl.body.includes('Explore Our Solutions'), 'Welcome Email has Explore Our Solutions CTA');

  // Verify Required Template 2: New Lead Notification (Internal)
  const leadTpl = templatesList.find(t => t.category === 'Lead Notifications');
  assert(leadTpl !== undefined, 'Template 2: New Lead Notification exists');
  assert(leadTpl.subject.includes('New Lead Received — GreenNext'), 'Lead Notification has subject "New Lead Received — GreenNext"');
  assert(leadTpl.body.includes('{{customer_name}}') && leadTpl.body.includes('{{requirements}}'), 'Lead Notification includes customer name and requirements');
  assert(leadTpl.body.includes('View Lead'), 'Lead Notification includes View Lead CTA');

  // Verify Required Template 3: Consultation Confirmation
  const consultTpl = templatesList.find(t => t.category === 'Consultation Confirmations');
  assert(consultTpl !== undefined, 'Template 3: Consultation Confirmation exists');
  assert(consultTpl.subject === 'Your GreenNext Consultation Is Confirmed', 'Consultation Confirmation has exact subject');
  assert(consultTpl.body.includes('{{consultation_date}}') && consultTpl.body.includes('{{consultation_time}}'), 'Consultation Confirmation includes date and time placeholders');
  assert(consultTpl.body.includes('Add to Calendar'), 'Consultation Confirmation includes Add to Calendar CTA');

  // Verify Required Template 4: Follow-up Email
  const followupTpl = templatesList.find(t => t.category === 'Follow-up Emails');
  assert(followupTpl !== undefined, 'Template 4: Follow-up Email exists');
  assert(followupTpl.subject === 'Following Up on Your GreenNext Enquiry', 'Follow-up Email has exact subject');
  assert(followupTpl.body.includes('Schedule a Consultation') || followupTpl.body.includes('Schedule'), 'Follow-up Email includes consultation scheduling CTA');

  // Verify Required Template 5: Proposal Email
  const proposalTpl = templatesList.find(t => t.category === 'Proposal Emails');
  assert(proposalTpl !== undefined, 'Template 5: Proposal Email exists');
  assert(proposalTpl.subject === 'Your GreenNext Infrastructure Proposal', 'Proposal Email has exact subject');
  assert(proposalTpl.body.includes('{{proposal_link}}'), 'Proposal Email includes secure proposal_link placeholder');

  // ---------------------------------------------------------------------------
  // Suite 3: Search and Category Filtering
  // ---------------------------------------------------------------------------
  console.log('\nTest Suite 3: Search and Category Filtering');
  const reqFilterCat = createMockReq({ method: 'GET', query: { category: 'Proposal Emails' } });
  const resFilterCat = createMockRes();
  await handler(reqFilterCat, resFilterCat);
  assert(resFilterCat.bodyData.templates.every(t => t.category === 'Proposal Emails'), 'Category filter returns only Proposal Emails');

  const reqSearch = createMockReq({ method: 'GET', query: { q: 'Immersion Cooling' } });
  const resSearch = createMockRes();
  await handler(reqSearch, resSearch);
  assert(resSearch.bodyData.templates.length > 0, 'Keyword search matches template body content');

  // ---------------------------------------------------------------------------
  // Suite 4: CRUD Operations (Create, Update, Duplicate, Delete)
  // ---------------------------------------------------------------------------
  console.log('\nTest Suite 4: Persistent CRUD Operations');
  
  // Validation: Missing fields
  const reqInvalid = createMockReq({ method: 'POST', body: { name: '' } });
  const resInvalid = createMockRes();
  await handler(reqInvalid, resInvalid);
  assert(resInvalid.statusCode === 400, 'POST rejects missing required name with HTTP 400');

  // Create template
  const newTplPayload = {
    action: 'create',
    name: 'Automated CI Test Template',
    category: 'Welcome Emails',
    status: 'Draft',
    subject: 'Automated Test Notification for {{company_name}}',
    body: '<p>Hello {{customer_name}}, this is a persistent test template.</p>'
  };
  const reqCreate = createMockReq({ method: 'POST', body: newTplPayload });
  const resCreate = createMockRes();
  await handler(reqCreate, resCreate);
  assert(resCreate.statusCode === 201, 'POST create returns HTTP 201 Created');
  const createdId = resCreate.bodyData.template.id;
  assert(createdId && createdId.startsWith('tpl_'), 'Created template assigned valid tpl_ ID');
  assert(resCreate.bodyData.template.status === 'Draft', 'Status accurately set to Draft');

  // Update template
  const updatePayload = {
    action: 'update',
    id: createdId,
    name: 'Automated CI Test Template (Updated)',
    category: 'Welcome Emails',
    status: 'Active',
    subject: 'Updated Subject for {{customer_name}}',
    body: '<p>Updated body content with {{customer_name}} and {{proposal_link}}.</p>'
  };
  const reqUpdate = createMockReq({ method: 'POST', body: updatePayload });
  const resUpdate = createMockRes();
  await handler(reqUpdate, resUpdate);
  assert(resUpdate.statusCode === 200, 'POST update returns HTTP 200');
  assert(resUpdate.bodyData.template.name === 'Automated CI Test Template (Updated)', 'Template name successfully updated');
  assert(resUpdate.bodyData.template.status === 'Active', 'Template status updated to Active');
  assert(resUpdate.bodyData.template.placeholders.includes('proposal_link'), 'Updated placeholders detected');

  // Duplicate template
  const reqDuplicate = createMockReq({ method: 'POST', body: { action: 'duplicate', id: createdId } });
  const resDuplicate = createMockRes();
  await handler(reqDuplicate, resDuplicate);
  assert(resDuplicate.statusCode === 201, 'POST duplicate returns HTTP 201 Created');
  const duplicateId = resDuplicate.bodyData.template.id;
  assert(resDuplicate.bodyData.template.name.includes('(Copy)'), 'Duplicated template appends (Copy)');
  assert(resDuplicate.bodyData.template.status === 'Draft', 'Duplicated template defaults to Draft status');

  // Delete duplicate template
  const reqDelete = createMockReq({ method: 'POST', body: { action: 'delete', id: duplicateId } });
  const resDelete = createMockRes();
  await handler(reqDelete, resDelete);
  assert(resDelete.statusCode === 200, 'POST delete duplicate returns HTTP 200');

  // Delete created test template
  const reqDeleteCreated = createMockReq({ method: 'POST', body: { action: 'delete', id: createdId } });
  const resDeleteCreated = createMockRes();
  await handler(reqDeleteCreated, resDeleteCreated);
  assert(resDeleteCreated.statusCode === 200, 'POST delete created test template returns HTTP 200');

  // ---------------------------------------------------------------------------
  // Suite 5: Test Email Dispatch & Safety
  // ---------------------------------------------------------------------------
  console.log('\nTest Suite 5: Test Email Dispatch & Configuration Handling');
  
  // Rejects invalid recipient
  const reqBadEmail = createMockReq({
    method: 'POST',
    body: {
      action: 'test_email',
      recipient_email: 'not-an-email',
      subject: 'Test',
      body: '<p>Test</p>'
    }
  });
  const resBadEmail = createMockRes();
  await handler(reqBadEmail, resBadEmail);
  assert(resBadEmail.statusCode === 400, 'Rejects invalid recipient email address with HTTP 400');

  // Valid test email dispatch
  const reqTestEmail = createMockReq({
    method: 'POST',
    body: {
      action: 'test_email',
      recipient_email: 'test-recipient@greennext.in',
      subject: 'Test Subject with {{company_name}}',
      body: '<p>Dear {{customer_name}}, this is a verified test.</p>'
    }
  });
  const resTestEmail = createMockRes();
  await handler(reqTestEmail, resTestEmail);
  assert(resTestEmail.statusCode === 200, 'Test email dispatch request completes with HTTP 200');
  assert(resTestEmail.bodyData !== null, 'Test email dispatch returns structured feedback payload');
  if (resTestEmail.bodyData.configured === false) {
    assert(resTestEmail.bodyData.setupInstructions.length > 0, 'Returns setup instructions when no live email provider is active');
  } else {
    assert(resTestEmail.bodyData.provider !== 'none', 'Returns active email delivery provider');
  }

  // ---------------------------------------------------------------------------
  // Suite 6: Frontend File Integrity & Vercel Routing
  // ---------------------------------------------------------------------------
  console.log('\nTest Suite 6: Frontend File Integrity & Vercel Routing');
  const templatesHtml = await readFile(join(process.cwd(), 'templates.html'), 'utf8');
  assert(templatesHtml.includes('Email &amp; Communication Templates') || templatesHtml.includes('Email & Communication Templates'), 'templates.html contains correct page heading');
  assert(templatesHtml.includes('#00FF66') && templatesHtml.includes('#0B1220'), 'templates.html incorporates Electric Green & Midnight Navy brand tokens');
  assert(templatesHtml.includes('id="editor-modal"') && templatesHtml.includes('id="preview-modal"'), 'templates.html includes editor and preview modals');
  assert(templatesHtml.includes('id="btn-view-desktop"') && templatesHtml.includes('id="btn-view-mobile"'), 'templates.html provides desktop and mobile responsive preview controls');
  assert(templatesHtml.includes('id="test-email-modal"'), 'templates.html contains secure test email dialog');

  const vercelJson = JSON.parse(await readFile(join(process.cwd(), 'vercel.json'), 'utf8'));
  const hasTemplatesRewrite = vercelJson.rewrites.some(r => r.source === '/templates' && r.destination === '/templates.html');
  assert(hasTemplatesRewrite, 'vercel.json contains rewrite route for /templates -> /templates.html');

  // Summary
  console.log('\n================================================================');
  console.log(`Results: ${passedTests} / ${totalTests} tests passed (${totalTests - passedTests} failed)`);
  console.log('================================================================\n');

  if (totalTests !== passedTests) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

