/**
 * GreenNext Digital Infrastructure — Automated Lead Notification Email System
 * 
 * Features:
 * - Ultra-premium dark navy (#070B14, #0F172A) & purple-to-blue gradient (#4338CA -> #3B82F6 -> #06B6D4) design
 * - Design A (Default): Premium Lead Notification Card
 * - Design B: Clean Business Notification (White/Light, dark-green GreenNext header)
 * - Design C: Strategic Lead Summary (Dark-green header, metrics & operational steps)
 * - Verified email-safe responsive HTML table layout with inline CSS
 * - Complete Plain-text fallback generation
 * - Dynamic Subject Lines per form type (Quick Enquiry, Consultation, Business Lead, Careers)
 * - Form Type Badges (Quick Enquiry, Consultation, Long Form, Floating Lead Form, Careers Application)
 * - Structured Sections:
 *   1. Contact Information
 *   2. Requirements & Business Context (with optional budget, company size, timeline, etc.)
 *   3. Submission Metadata (Enquiry ID, Page URL, UTM, verified Jira status, Sheets record)
 *   4. Next Steps (Purple "Reply to Lead" mailto, Green "WhatsApp" direct link, "Open Jira Lead", "View Sheets")
 * - Multi-Provider Delivery Engine:
 *   1. Resend REST API (RESEND_API_KEY)
 *   2. SendGrid REST API (SENDGRID_API_KEY)
 *   3. Google Apps Script MailApp / GmailApp Forwarder (GOOGLE_APPS_SCRIPT_URL)
 *   4. Simulated Test Mode with full delivery audit trail
 * - Safe HTML entity escaping and email injection prevention
 */

/**
 * Escape HTML special characters to prevent injection / XSS attacks
 */
export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Format timestamp into IST (Asia/Kolkata) readable format
 */
export function formatLeadDateTime(dateInput) {
  const d = dateInput ? new Date(dateInput) : new Date();
  try {
    return d.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }) + ' IST';
  } catch (e) {
    return d.toISOString();
  }
}

/**
 * Generate dynamic, descriptive email subjects based on form type and lead name
 */
export function generateLeadEmailSubject(lead) {
  const formType = (lead.formType || lead.form_type || '').toLowerCase();
  const name = (lead.fullName || lead.name || '').trim();
  const enquiryId = lead.enquiryId ? ` (${lead.enquiryId})` : '';

  if (formType.includes('quick') || formType.includes('short')) {
    return `[GreenNext] New Quick Enquiry — ${name || 'Prospective Lead'}${enquiryId}`;
  }
  if (formType.includes('consultation')) {
    return `[GreenNext] New Consultation Lead — ${name || 'Enterprise Client'}${enquiryId}`;
  }
  if (formType.includes('career') || formType.includes('job') || formType.includes('application')) {
    return `[GreenNext] New Careers Application — ${name || 'Candidate'}${enquiryId}`;
  }
  if (formType.includes('floating')) {
    return `[GreenNext] New Floating Lead — ${name || 'Prospective Lead'}${enquiryId}`;
  }
  // Default Long Form / Business Lead
  return `[GreenNext] New Business Lead — ${name || lead.enquiryId || 'Enterprise Lead'}${name && lead.enquiryId ? ` (${lead.enquiryId})` : ''}`;
}

/**
 * Generate mailto link for "Reply to Lead"
 * Opens the administrator's default email client with verified recipient and professional prefilled response
 */
export function generateReplyMailto(lead) {
  const email = (lead.businessEmail || lead.email || '').trim();
  if (!email) return '';
  const enquiryId = lead.enquiryId || 'GreenNext Lead';
  const name = lead.fullName || lead.name || 'there';
  const interest = lead.areaOfInterest || lead.service || 'AI Data Center & Sustainable Infrastructure';
  const subject = `Re: GreenNext Enquiry — ${enquiryId}`;
  const body = `Hello ${name},\n\nThank you for reaching out to GreenNext regarding our ${interest} solutions.\n\nWe have received your enquiry (${enquiryId}) and our technical and solutions engineering team would be delighted to schedule a discussion to review your requirements.\n\nPlease let us know your availability for a brief introductory call.\n\nBest regards,\nGreenNext Enterprise Team\nhttps://greennext.in`;
  return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Generate prefilled WhatsApp click-to-chat URL using verified business phone
 */
export function generateWhatsAppLeadUrl(lead, businessPhone = null) {
  const configuredPhone = businessPhone || process.env.WHATSAPP_PHONE || '919876543210';
  const cleanPhone = configuredPhone.replace(/\D/g, '');
  const name = lead.fullName || lead.name || 'Valued Partner';
  const interest = lead.areaOfInterest || lead.service || 'AI Infrastructure';
  const text = `Hello ${name}, thank you for contacting GreenNext. We received your enquiry regarding ${interest}. Our team would be happy to discuss your requirements.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Determine badge color & style based on form type
 */
function getFormTypeBadgeConfig(formTypeRaw) {
  const ft = (formTypeRaw || '').toLowerCase();
  if (ft.includes('quick') || ft.includes('short')) {
    return { label: 'Quick Enquiry', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)', border: '#10B981' };
  }
  if (ft.includes('consultation')) {
    return { label: 'Consultation', color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.15)', border: '#06B6D4' };
  }
  if (ft.includes('floating')) {
    return { label: 'Floating Lead', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)', border: '#F59E0B' };
  }
  if (ft.includes('career')) {
    return { label: 'Careers Application', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)', border: '#3B82F6' };
  }
  return { label: formTypeRaw || 'Long Form', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.15)', border: '#8B5CF6' };
}

/**
 * Design A — Premium Lead Notification (Default Reference Design)
 * Dark navy (#070B14, #0F172A), purple-to-blue gradient header, ⚡ lightning icon,
 * structured contact/requirements/metadata tables, conditional Jira and Sheets actions.
 */
export function renderLeadNotificationHtml(lead) {
  const enquiryId = escapeHtml(lead.enquiryId || 'GN-PENDING');
  const contactName = escapeHtml(lead.fullName || lead.name || 'Enquiry Visitor');
  const formType = escapeHtml(lead.formType || lead.form_type || 'Enquiry Form');
  const badge = getFormTypeBadgeConfig(lead.formType || lead.form_type);
  const formattedDate = formatLeadDateTime(lead.submittedAt);

  // Contact details
  const email = (lead.businessEmail || lead.email || '').trim();
  const phone = (lead.phoneNumber || lead.phone || '').trim();
  const company = (lead.companyName || lead.company || '').trim();
  const location = (lead.location || lead.city || '').trim();

  // Requirements & Business Context
  const industry = (lead.industry || '').trim();
  const interest = (lead.areaOfInterest || lead.service_interest || lead.service || lead.position || '').trim();
  const projectScope = (lead.projectScope || lead.project_scope || '').trim();
  const challenge = (lead.challenge || lead.problem || '').trim();
  const desiredOutcome = (lead.desiredOutcome || lead.desired_outcome || '').trim();
  const requirements = (lead.projectRequirements || lead.requirements || lead.message || lead.resume || '').trim();
  const timeline = (lead.expectedTimeline || lead.timeline || '').trim();
  const budget = (lead.budget || lead.estimated_budget || '').trim();
  const companySize = (lead.companySize || lead.company_size || '').trim();
  const preferredContact = (lead.preferredContactMethod || lead.contact_method || lead.preferred_contact_time || lead.linkedin || '').trim();

  // Submission Metadata
  const pageUrl = lead.metadata?.page_url || lead.page_url || '/';
  const utmSource = lead.metadata?.utm_source || lead.utm_source || '';
  const utmMedium = lead.metadata?.utm_medium || lead.utm_medium || '';
  const utmCampaign = lead.metadata?.utm_campaign || lead.utm_campaign || '';
  const trafficSource = [utmSource, utmMedium].filter(Boolean).join(' / ') || 'Direct / Organic';

  // Google Sheets verified status
  const isSheetSaved = Boolean(lead.leadSaved || lead.leadSavedInSheets || lead.sheetSaved);
  const sheetsWorkbookId = '14ciH1aNzWIJHJkQ5rYCdrEhci3KYMjrTSeY3QMaerVI';
  const sheetsUrl = process.env.GOOGLE_SHEET_URL || `https://docs.google.com/spreadsheets/d/${sheetsWorkbookId}/edit`;

  // Jira Integration details (Display only verified real results)
  const jiraKey = lead.jira?.parentKey || lead.jiraKey || '';
  const jiraBaseUrl = (process.env.JIRA_BASE_URL || 'https://trustworkz.atlassian.net').replace(/\/+$/, '');
  const jiraUrl = lead.jira?.parentUrl || (jiraKey ? `${jiraBaseUrl}/browse/${jiraKey}` : '');
  const isJiraSuccess = Boolean(jiraKey && lead.jira?.status !== 'jira_failed');
  const subtaskCount = lead.jira?.subtasks ? lead.jira.subtasks.length : (lead.jira?.subtaskMap ? Object.keys(lead.jira.subtaskMap).length : 0);
  const subtaskStatus = subtaskCount > 0 ? `${subtaskCount} of 7 subtasks created` : (isJiraSuccess ? 'Subtasks configured' : 'Pending');

  // Next steps URLs
  const replyMailto = generateReplyMailto(lead);
  const waUrl = generateWhatsAppLeadUrl(lead);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>GreenNext — New Lead Received: ${enquiryId}</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #070B14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; max-width: 100% !important; }
      .mobile-padding { padding-left: 16px !important; padding-right: 16px !important; }
      .mobile-stack { display: block !important; width: 100% !important; }
      .btn { display: block !important; width: 100% !important; text-align: center !important; margin-bottom: 10px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 24px 0; background-color: #070B14; -webkit-font-smoothing: antialiased;">
  <center>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; margin: 0 auto; background-color: #0F172A; border-radius: 16px; overflow: hidden; border: 1px solid #1E293B; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4);" class="container">
      
      <!-- HERO GRADIENT HEADER -->
      <tr>
        <td style="padding: 34px 32px 28px; background: linear-gradient(135deg, #4338CA 0%, #3B82F6 50%, #06B6D4 100%); text-align: left;" class="mobile-padding">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td>
                <!-- ICON + BRANDING -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 8px;">
                  <tr>
                    <td style="vertical-align: middle; padding-right: 8px;">
                      <span style="display: inline-block; background: rgba(255, 255, 255, 0.2); border-radius: 6px; width: 24px; height: 24px; line-height: 24px; text-align: center; font-size: 14px;">⚡</span>
                    </td>
                    <td style="vertical-align: middle; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #E0E7FF;">
                      GREENNEXT DIGITAL INFRASTRUCTURE
                    </td>
                  </tr>
                </table>
                <h1 style="margin: 0 0 8px 0; font-size: 26px; font-weight: 800; line-height: 1.25; color: #FFFFFF; letter-spacing: -0.5px;">
                  New Lead Received
                </h1>
                <p style="margin: 0; font-size: 14px; color: #DBEAFE; line-height: 1.5;">
                  A new prospective lead has been submitted through the GreenNext AI Data Center portal.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- SUMMARY META BANNER -->
      <tr>
        <td style="background-color: #131D33; padding: 14px 32px; border-bottom: 1px solid #1E293B;" class="mobile-padding">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="vertical-align: middle;">
                <span style="display: inline-block; padding: 4px 12px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 20px; background-color: ${badge.bg}; color: ${badge.color}; border: 1px solid ${badge.border};">
                  ${badge.label}
                </span>
                <span style="color: #94A3B8; font-size: 13px; margin-left: 12px; font-weight: 500;">
                  ID: <strong style="color: #F8FAFC; font-family: monospace;">${enquiryId}</strong>
                </span>
              </td>
              <td style="text-align: right; vertical-align: middle; font-size: 12px; color: #94A3B8;">
                ${formattedDate}
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- MAIN CONTENT WRAPPER -->
      <tr>
        <td style="padding: 28px 32px;" class="mobile-padding">

          <!-- SECTION 1: CONTACT INFORMATION -->
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
            <tr>
              <td style="padding-bottom: 10px; border-bottom: 1px solid #1E293B;">
                <h2 style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #818CF8;">
                  Contact Information
                </h2>
              </td>
            </tr>
            <tr>
              <td style="padding-top: 14px;">
                <table role="presentation" border="0" cellpadding="6" cellspacing="0" width="100%">
                  <tr>
                    <td width="38%" style="font-size: 13px; color: #94A3B8; padding: 6px 0;">Full Name:</td>
                    <td style="font-size: 14px; font-weight: 600; color: #F1F5F9; padding: 6px 0;">${contactName}</td>
                  </tr>
                  ${email ? `<tr>
                    <td style="font-size: 13px; color: #94A3B8; padding: 6px 0;">Business Email:</td>
                    <td style="font-size: 14px; color: #38BDF8; padding: 6px 0;">
                      <a href="mailto:${escapeHtml(email)}" style="color: #38BDF8; text-decoration: none; font-weight: 600;">${escapeHtml(email)}</a>
                    </td>
                  </tr>` : ''}
                  ${phone ? `<tr>
                    <td style="font-size: 13px; color: #94A3B8; padding: 6px 0;">Phone Number:</td>
                    <td style="font-size: 14px; color: #F1F5F9; font-weight: 600; padding: 6px 0;">${escapeHtml(phone)}</td>
                  </tr>` : ''}
                  ${company ? `<tr>
                    <td style="font-size: 13px; color: #94A3B8; padding: 6px 0;">Company Name:</td>
                    <td style="font-size: 14px; color: #F1F5F9; padding: 6px 0;">${escapeHtml(company)}</td>
                  </tr>` : ''}
                  ${location ? `<tr>
                    <td style="font-size: 13px; color: #94A3B8; padding: 6px 0;">Location:</td>
                    <td style="font-size: 14px; color: #F1F5F9; padding: 6px 0;">${escapeHtml(location)}</td>
                  </tr>` : ''}
                </table>
              </td>
            </tr>
          </table>

          <!-- SECTION 2: REQUIREMENTS & BUSINESS CONTEXT -->
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
            <tr>
              <td style="padding-bottom: 10px; border-bottom: 1px solid #1E293B;">
                <h2 style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #818CF8;">
                  Requirements &amp; Business Context
                </h2>
              </td>
            </tr>
            <tr>
              <td style="padding-top: 14px;">
                <table role="presentation" border="0" cellpadding="6" cellspacing="0" width="100%">
                  ${interest ? `<tr>
                    <td width="38%" style="font-size: 13px; color: #94A3B8; padding: 6px 0;">Area of Interest:</td>
                    <td style="font-size: 14px; font-weight: 600; color: #A7F3D0; padding: 6px 0;">${escapeHtml(interest)}</td>
                  </tr>` : ''}
                  ${industry ? `<tr>
                    <td style="font-size: 13px; color: #94A3B8; padding: 6px 0;">Industry Vertical:</td>
                    <td style="font-size: 14px; color: #F1F5F9; padding: 6px 0;">${escapeHtml(industry)}</td>
                  </tr>` : ''}
                  ${projectScope ? `<tr>
                    <td style="font-size: 13px; color: #94A3B8; padding: 6px 0;">Project Scope:</td>
                    <td style="font-size: 14px; color: #F1F5F9; padding: 6px 0;">${escapeHtml(projectScope)}</td>
                  </tr>` : ''}
                  ${challenge ? `<tr>
                    <td style="font-size: 13px; color: #94A3B8; padding: 6px 0;">Challenge / Problem:</td>
                    <td style="font-size: 14px; color: #F1F5F9; padding: 6px 0;">${escapeHtml(challenge)}</td>
                  </tr>` : ''}
                  ${desiredOutcome ? `<tr>
                    <td style="font-size: 13px; color: #94A3B8; padding: 6px 0;">Desired Outcome:</td>
                    <td style="font-size: 14px; color: #F1F5F9; padding: 6px 0;">${escapeHtml(desiredOutcome)}</td>
                  </tr>` : ''}
                  ${timeline ? `<tr>
                    <td style="font-size: 13px; color: #94A3B8; padding: 6px 0;">Expected Timeline:</td>
                    <td style="font-size: 14px; color: #F1F5F9; padding: 6px 0;">${escapeHtml(timeline)}</td>
                  </tr>` : ''}
                  ${budget ? `<tr>
                    <td style="font-size: 13px; color: #94A3B8; padding: 6px 0;">Budget:</td>
                    <td style="font-size: 14px; color: #F1F5F9; padding: 6px 0;">${escapeHtml(budget)}</td>
                  </tr>` : ''}
                  ${companySize ? `<tr>
                    <td style="font-size: 13px; color: #94A3B8; padding: 6px 0;">Company Size:</td>
                    <td style="font-size: 14px; color: #F1F5F9; padding: 6px 0;">${escapeHtml(companySize)}</td>
                  </tr>` : ''}
                  ${preferredContact ? `<tr>
                    <td style="font-size: 13px; color: #94A3B8; padding: 6px 0;">Preferred Contact:</td>
                    <td style="font-size: 14px; color: #F1F5F9; padding: 6px 0;">${escapeHtml(preferredContact)}</td>
                  </tr>` : ''}
                  ${requirements ? `<tr>
                    <td colspan="2" style="padding-top: 10px;">
                      <div style="font-size: 12px; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Project Requirements / Message:</div>
                      <div style="background-color: #070B14; border: 1px solid #1E293B; border-radius: 8px; padding: 12px 14px; font-size: 13px; line-height: 1.6; color: #E2E8F0;">
                        ${escapeHtml(requirements).replace(/\n/g, '<br>')}
                      </div>
                    </td>
                  </tr>` : ''}
                </table>
              </td>
            </tr>
          </table>

          <!-- SECTION 3: SUBMISSION METADATA -->
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px;">
            <tr>
              <td style="padding-bottom: 10px; border-bottom: 1px solid #1E293B;">
                <h2 style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #818CF8;">
                  Submission Metadata
                </h2>
              </td>
            </tr>
            <tr>
              <td style="padding-top: 14px;">
                <table role="presentation" border="0" cellpadding="4" cellspacing="0" width="100%">
                  <tr>
                    <td width="38%" style="font-size: 12px; color: #64748B; padding: 4px 0;">Enquiry ID:</td>
                    <td style="font-size: 13px; color: #E2E8F0; font-family: monospace; padding: 4px 0;">${enquiryId}</td>
                  </tr>
                  <tr>
                    <td style="font-size: 12px; color: #64748B; padding: 4px 0;">Source Page:</td>
                    <td style="font-size: 13px; color: #E2E8F0; padding: 4px 0;">${escapeHtml(pageUrl)}</td>
                  </tr>
                  <tr>
                    <td style="font-size: 12px; color: #64748B; padding: 4px 0;">Traffic Source:</td>
                    <td style="font-size: 13px; color: #E2E8F0; padding: 4px 0;">${escapeHtml(trafficSource)}</td>
                  </tr>
                  ${utmCampaign ? `<tr>
                    <td style="font-size: 12px; color: #64748B; padding: 4px 0;">UTM Campaign:</td>
                    <td style="font-size: 13px; color: #E2E8F0; padding: 4px 0;">${escapeHtml(utmCampaign)}</td>
                  </tr>` : ''}
                  <tr>
                    <td style="font-size: 12px; color: #64748B; padding: 4px 0;">Google Sheets:</td>
                    <td style="font-size: 13px; color: ${isSheetSaved ? '#34D399' : '#94A3B8'}; padding: 4px 0;">
                      ${isSheetSaved 
                        ? `<a href="${sheetsUrl}" target="_blank" style="color: #34D399; text-decoration: none;">Saved to Workbook &rarr;</a>` 
                        : 'Local Store / Offline'}
                    </td>
                  </tr>
                  ${isJiraSuccess ? `<tr>
                    <td style="font-size: 12px; color: #64748B; padding: 4px 0;">Jira Parent Issue:</td>
                    <td style="font-size: 13px; color: #818CF8; padding: 4px 0;">
                      <a href="${jiraUrl}" target="_blank" style="color: #818CF8; font-weight: 700; text-decoration: none;">${escapeHtml(jiraKey)} &rarr;</a>
                      <span style="font-size: 11px; color: #94A3B8; margin-left: 6px;">(${escapeHtml(subtaskStatus)})</span>
                    </td>
                  </tr>` : ''}
                  <tr>
                    <td style="font-size: 12px; color: #64748B; padding: 4px 0;">Lead Status:</td>
                    <td style="font-size: 13px; color: #E2E8F0; padding: 4px 0;">
                      ${isJiraSuccess ? 'Assigned in Jira' : 'New Lead (Action Required)'}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- SECTION 4: CALL TO ACTION BUTTONS (NEXT STEPS) -->
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #070B14; border: 1px solid #1E293B; border-radius: 12px; padding: 20px;">
            <tr>
              <td style="padding-bottom: 14px; text-align: left;">
                <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #CBD5E1;">
                  Next Steps &amp; Direct Engagement
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    ${replyMailto ? `<td style="padding-right: 12px; padding-bottom: 8px;">
                      <a href="${replyMailto}" target="_blank" class="btn" style="display: inline-block; background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%); color: #FFFFFF; font-size: 14px; font-weight: 700; text-decoration: none; padding: 12px 22px; border-radius: 8px; border: 1px solid #818CF8; mso-padding-alt: 0;">
                        ✉️ Reply to Lead
                      </a>
                    </td>` : ''}
                    <td style="padding-right: 12px; padding-bottom: 8px;">
                      <a href="${waUrl}" target="_blank" class="btn" style="display: inline-block; background-color: #10B981; color: #FFFFFF; font-size: 14px; font-weight: 700; text-decoration: none; padding: 12px 22px; border-radius: 8px; border: 1px solid #34D399; mso-padding-alt: 0;">
                        💬 Open WhatsApp
                      </a>
                    </td>
                    ${isJiraSuccess && jiraUrl ? `<td style="padding-right: 12px; padding-bottom: 8px;">
                      <a href="${jiraUrl}" target="_blank" class="btn" style="display: inline-block; background-color: #1E293B; color: #94A3B8; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 18px; border-radius: 8px; border: 1px solid #334155; mso-padding-alt: 0;">
                        📌 Open Jira
                      </a>
                    </td>` : ''}
                    ${isSheetSaved ? `<td style="padding-bottom: 8px;">
                      <a href="${sheetsUrl}" target="_blank" class="btn" style="display: inline-block; background-color: #064E3B; color: #34D399; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 18px; border-radius: 8px; border: 1px solid #059669; mso-padding-alt: 0;">
                        📊 Google Sheets
                      </a>
                    </td>` : ''}
                  </tr>
                </table>
              </td>
            </tr>
          </table>

        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="padding: 24px 32px; background-color: #070B14; border-top: 1px solid #1E293B; text-align: center;" class="mobile-padding">
          <p style="margin: 0 0 6px 0; font-size: 12px; color: #64748B;">
            This automated enterprise notification was generated by GreenNext Lead Management Engine.
          </p>
          <p style="margin: 0; font-size: 11px; color: #475569;">
            &copy; 2026 GreenNext Digital Infrastructure. All rights reserved. Confidential &amp; Proprietary.
          </p>
        </td>
      </tr>

    </table>
  </center>
</body>
</html>`;
}

/**
 * Design B — Clean Business Notification (Light Theme)
 * White/light-grey background, dark-green header, structured data table.
 */
export function renderCleanBusinessEmailHtml(lead) {
  const enquiryId = escapeHtml(lead.enquiryId || 'GN-PENDING');
  const contactName = escapeHtml(lead.fullName || lead.name || 'Enquiry Visitor');
  const formType = escapeHtml(lead.formType || lead.form_type || 'Enquiry Form');
  const formattedDate = formatLeadDateTime(lead.submittedAt);

  const email = (lead.businessEmail || lead.email || '').trim();
  const phone = (lead.phoneNumber || lead.phone || '').trim();
  const company = (lead.companyName || lead.company || '').trim();
  const location = (lead.location || lead.city || '').trim();
  const interest = (lead.areaOfInterest || lead.service_interest || lead.service || '').trim();
  const requirements = (lead.projectRequirements || lead.requirements || lead.message || '').trim();

  const jiraKey = lead.jira?.parentKey || lead.jiraKey || '';
  const jiraBaseUrl = (process.env.JIRA_BASE_URL || 'https://trustworkz.atlassian.net').replace(/\/+$/, '');
  const jiraUrl = lead.jira?.parentUrl || (jiraKey ? `${jiraBaseUrl}/browse/${jiraKey}` : '');
  const replyMailto = generateReplyMailto(lead);
  const waUrl = generateWhatsAppLeadUrl(lead);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>GreenNext Lead Notification — ${enquiryId}</title>
</head>
<body style="margin: 0; padding: 20px 0; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <center>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden;">
      <tr>
        <td style="padding: 24px; background-color: #064E3B; color: #FFFFFF;">
          <div style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #A7F3D0; margin-bottom: 4px;">GREENNEXT DIGITAL INFRASTRUCTURE</div>
          <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #FFFFFF;">Lead Notification: ${formType}</h1>
          <div style="font-size: 13px; color: #D1FAE5; margin-top: 4px;">ID: ${enquiryId} | ${formattedDate}</div>
        </td>
      </tr>
      <tr>
        <td style="padding: 24px;">
          <table role="presentation" border="0" cellpadding="6" cellspacing="0" width="100%" style="font-size: 14px; color: #1E293B;">
            <tr><td width="35%" style="color: #64748B;">Contact Name:</td><td><strong>${contactName}</strong></td></tr>
            ${email ? `<tr><td style="color: #64748B;">Business Email:</td><td><a href="mailto:${escapeHtml(email)}" style="color: #059669;">${escapeHtml(email)}</a></td></tr>` : ''}
            ${phone ? `<tr><td style="color: #64748B;">Phone:</td><td>${escapeHtml(phone)}</td></tr>` : ''}
            ${company ? `<tr><td style="color: #64748B;">Company:</td><td>${escapeHtml(company)}</td></tr>` : ''}
            ${location ? `<tr><td style="color: #64748B;">Location:</td><td>${escapeHtml(location)}</td></tr>` : ''}
            ${interest ? `<tr><td style="color: #64748B;">Area of Interest:</td><td><strong>${escapeHtml(interest)}</strong></td></tr>` : ''}
            ${requirements ? `<tr><td colspan="2" style="padding-top: 12px;"><div style="color: #64748B; font-size: 12px; margin-bottom: 4px;">PROJECT REQUIREMENTS:</div><div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 10px; border-radius: 6px;">${escapeHtml(requirements).replace(/\n/g, '<br>')}</div></td></tr>` : ''}
          </table>
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #E2E8F0;">
            ${replyMailto ? `<a href="${replyMailto}" style="display: inline-block; padding: 10px 18px; background-color: #064E3B; color: #FFFFFF; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 600; margin-right: 8px;">Reply via Email</a>` : ''}
            <a href="${waUrl}" style="display: inline-block; padding: 10px 18px; background-color: #10B981; color: #FFFFFF; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 600; margin-right: 8px;">WhatsApp</a>
            ${jiraUrl ? `<a href="${jiraUrl}" style="display: inline-block; padding: 10px 18px; background-color: #F1F5F9; color: #334155; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 600; border: 1px solid #CBD5E1;">View Jira (${escapeHtml(jiraKey)})</a>` : ''}
          </div>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>`;
}

/**
 * Design C — Strategic Lead Summary
 * Dark green header, operational next steps, Google Sheets reference, Jira issue link.
 */
export function renderStrategicLeadSummaryHtml(lead) {
  const enquiryId = escapeHtml(lead.enquiryId || 'GN-PENDING');
  const contactName = escapeHtml(lead.fullName || lead.name || 'Enquiry Visitor');
  const formType = escapeHtml(lead.formType || lead.form_type || 'Enquiry Form');
  const formattedDate = formatLeadDateTime(lead.submittedAt);
  const email = (lead.businessEmail || lead.email || '').trim();
  const phone = (lead.phoneNumber || lead.phone || '').trim();
  const company = (lead.companyName || lead.company || '').trim();
  const interest = (lead.areaOfInterest || lead.service_interest || lead.service || '').trim();
  const priorityScore = lead.priorityScore || lead.predictiveScore || null;
  const jiraKey = lead.jira?.parentKey || lead.jiraKey || '';
  const jiraBaseUrl = (process.env.JIRA_BASE_URL || 'https://trustworkz.atlassian.net').replace(/\/+$/, '');
  const jiraUrl = lead.jira?.parentUrl || (jiraKey ? `${jiraBaseUrl}/browse/${jiraKey}` : '');
  const sheetsUrl = process.env.GOOGLE_SHEET_URL || 'https://docs.google.com/spreadsheets/d/14ciH1aNzWIJHJkQ5rYCdrEhci3KYMjrTSeY3QMaerVI/edit';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>GreenNext Strategic Lead — ${enquiryId}</title>
</head>
<body style="margin: 0; padding: 20px 0; background-color: #0A141D; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <center>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #111E2E; border: 1px solid #1E3A5F; border-radius: 8px; color: #E2E8F0;">
      <tr>
        <td style="padding: 24px; background-color: #064E3B; color: #FFFFFF;">
          <h1 style="margin: 0; font-size: 20px;">GreenNext Strategic Lead Summary</h1>
          <div style="font-size: 13px; color: #A7F3D0; margin-top: 4px;">${formType} | ${enquiryId} | ${formattedDate}</div>
        </td>
      </tr>
      <tr>
        <td style="padding: 24px;">
          ${priorityScore ? `<div style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10B981; padding: 10px; border-radius: 6px; margin-bottom: 16px; color: #34D399; font-weight: 700;">Predictive Score: ${escapeHtml(priorityScore)}</div>` : ''}
          <div style="font-size: 16px; font-weight: 700; color: #FFFFFF; margin-bottom: 8px;">${contactName} — ${escapeHtml(company || 'Enterprise')}</div>
          <div style="font-size: 13px; color: #94A3B8; margin-bottom: 16px;">Email: ${escapeHtml(email)} | Phone: ${escapeHtml(phone || '—')} | Focus: ${escapeHtml(interest || 'Infrastructure')}</div>
          <div style="border-top: 1px solid #1E293B; padding-top: 14px; font-size: 13px;">
            <div>&bull; Google Sheets: <a href="${sheetsUrl}" target="_blank" style="color: #34D399;">View Record &rarr;</a></div>
            ${jiraKey ? `<div>&bull; Jira Issue: <a href="${jiraUrl}" target="_blank" style="color: #60A5FA;">${escapeHtml(jiraKey)} &rarr;</a></div>` : ''}
          </div>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>`;
}

/**
 * Generate Plain-Text Fallback Version
 */
export function renderLeadNotificationText(lead) {
  const enquiryId = lead.enquiryId || 'GN-PENDING';
  const contactName = lead.fullName || lead.name || 'Enquiry Visitor';
  const formType = lead.formType || lead.form_type || 'Enquiry Form';
  const formattedDate = formatLeadDateTime(lead.submittedAt);

  const email = (lead.businessEmail || lead.email || '').trim();
  const phone = (lead.phoneNumber || lead.phone || '').trim();
  const company = (lead.companyName || lead.company || '—').trim();
  const location = (lead.location || lead.city || '—').trim();

  const interest = (lead.areaOfInterest || lead.service_interest || lead.service || lead.position || '—').trim();
  const industry = (lead.industry || '—').trim();
  const projectScope = (lead.projectScope || lead.project_scope || '').trim();
  const challenge = (lead.challenge || lead.problem || '').trim();
  const timeline = (lead.expectedTimeline || lead.timeline || '—').trim();
  const budget = (lead.budget || lead.estimated_budget || '').trim();
  const companySize = (lead.companySize || lead.company_size || '').trim();
  const contactMethod = (lead.preferredContactMethod || lead.contact_method || '—').trim();
  const requirements = (lead.projectRequirements || lead.requirements || lead.message || lead.resume || '—').trim();

  const pageUrl = lead.metadata?.page_url || lead.page_url || '/';
  const jiraKey = lead.jira?.parentKey || lead.jiraKey || '—';
  const isSheetSaved = Boolean(lead.leadSaved || lead.leadSavedInSheets || lead.sheetSaved);

  let text = `===============================================================
[GreenNext] New Lead Received — ${contactName} (${enquiryId})
===============================================================
Form Type: ${formType}
Date: ${formattedDate}

CONTACT INFORMATION
---------------------------------------------------------------
Full Name:      ${contactName}
Business Email: ${email || '—'}
Phone Number:   ${phone || '—'}
Company Name:   ${company}
Location:       ${location}

REQUIREMENTS & BUSINESS CONTEXT
---------------------------------------------------------------
Area of Interest:    ${interest}
Industry:            ${industry}
Expected Timeline:   ${timeline}
Preferred Contact:   ${contactMethod}
`;

  if (projectScope) text += `Project Scope:       ${projectScope}\n`;
  if (challenge)    text += `Challenge:           ${challenge}\n`;
  if (budget)       text += `Budget:              ${budget}\n`;
  if (companySize)  text += `Company Size:        ${companySize}\n`;

  text += `
Project Requirements:
${requirements}

SUBMISSION METADATA
---------------------------------------------------------------
Enquiry ID:   ${enquiryId}
Source Page:  ${pageUrl}
Jira Key:     ${jiraKey}
Google Sheet: ${isSheetSaved ? 'Synchronized (Workbook 14ciH1aNzWIJHJkQ5rYCdrEhci3KYMjrTSeY3QMaerVI)' : 'Pending / Local'}

NEXT STEPS
---------------------------------------------------------------
• Reply to Lead: mailto:${email}?subject=Re%3A%20GreenNext%20Enquiry%20%E2%80%94%20${enquiryId}
• WhatsApp Chat: ${generateWhatsAppLeadUrl(lead)}
${jiraKey !== '—' ? `• Jira Issue:    https://trustworkz.atlassian.net/browse/${jiraKey}\n` : ''}
--
GreenNext Digital Infrastructure — Automated Lead Notification Engine
`;

  return text;
}

/**
 * Send Email Notification via Configured Provider
 * Supported providers:
 * 1. Resend REST API (when RESEND_API_KEY is present)
 * 2. SendGrid REST API (when SENDGRID_API_KEY is present)
 * 3. Google Apps Script Web App forwarder (zero external cost, uses Google Workspace quota)
 * 4. Simulation fallback (returns structured delivery audit when running in offline testing)
 */
export async function sendLeadNotificationEmail(lead, options = {}) {
  const adminEmail = (
    options.adminEmail ||
    process.env.ADMIN_NOTIFICATION_EMAIL ||
    process.env.NOTIFICATION_EMAIL ||
    process.env.JIRA_EMAIL ||
    'ruba.int2027g3@gmail.com'
  ).trim();

  const fromEmail = (options.fromEmail || process.env.EMAIL_FROM || 'GreenNext Leads <leads@greennext.in>').trim();
  const subject = options.subject || generateLeadEmailSubject(lead);

  const html = renderLeadNotificationHtml(lead);
  const text = renderLeadNotificationText(lead);

  // 1. Resend API Integration
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromEmail.includes('@') ? fromEmail : 'onboarding@resend.dev',
          to: [adminEmail],
          subject,
          html,
          text,
          tags: [{ name: 'enquiry_id', value: String(lead.enquiryId || '') }]
        }),
        signal: AbortSignal.timeout(10000)
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.id) {
        return {
          success: true,
          provider: 'resend',
          messageId: data.id,
          recipient: adminEmail,
          subject,
          timestamp: new Date().toISOString()
        };
      }
      return {
        success: false,
        provider: 'resend',
        error: data?.message || `HTTP ${res.status}`,
        recipient: adminEmail,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      return {
        success: false,
        provider: 'resend',
        error: err.message,
        recipient: adminEmail,
        timestamp: new Date().toISOString()
      };
    }
  }

  // 2. SendGrid API Integration
  if (process.env.SENDGRID_API_KEY) {
    try {
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: adminEmail }] }],
          from: { email: fromEmail.replace(/.*<([^>]+)>.*/, '$1').trim() || 'leads@greennext.in', name: 'GreenNext Leads' },
          subject,
          content: [
            { type: 'text/plain', value: text },
            { type: 'text/html', value: html }
          ]
        }),
        signal: AbortSignal.timeout(10000)
      });
      if (res.status >= 200 && res.status < 300) {
        const msgId = res.headers.get('x-message-id') || 'sg-' + Date.now();
        return {
          success: true,
          provider: 'sendgrid',
          messageId: msgId,
          recipient: adminEmail,
          subject,
          timestamp: new Date().toISOString()
        };
      }
      const data = await res.json().catch(() => null);
      return {
        success: false,
        provider: 'sendgrid',
        error: data?.errors?.[0]?.message || `HTTP ${res.status}`,
        recipient: adminEmail,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      return {
        success: false,
        provider: 'sendgrid',
        error: err.message,
        recipient: adminEmail,
        timestamp: new Date().toISOString()
      };
    }
  }

  // 3. Google Apps Script Native Mail Forwarding (via Google Workspace / MailApp)
  const gasUrl = options.gasUrl !== undefined ? options.gasUrl : (process.env.GOOGLE_APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbzoSXPulFt49lQ1ibWJX2CFNw7iiuT4YBAShuiEcckEovty7FauYnspHCuHQmSqFZk/exec');
  if (gasUrl) {
    try {
      const res = await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'send_lead_email',
          lead,
          adminEmail,
          subject,
          html,
          text
        }),
        signal: AbortSignal.timeout(12000)
      });
      const data = await res.json().catch(() => null);
      if (data && data.emailSent) {
        return {
          success: true,
          provider: 'google_apps_script',
          messageId: data.messageId || 'gas-' + Date.now(),
          recipient: adminEmail,
          subject,
          timestamp: new Date().toISOString()
        };
      }
      // If GAS doesn't have the send_lead_email action yet, record graceful fallback
      return {
        success: false,
        provider: 'google_apps_script',
        error: data?.emailError || data?.message || 'Email forward action not recognized by GAS deployment',
        recipient: adminEmail,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      return {
        success: false,
        provider: 'google_apps_script',
        error: err.message,
        recipient: adminEmail,
        timestamp: new Date().toISOString()
      };
    }
  }

  // 4. Fallback if no provider is configured
  return {
    success: false,
    provider: 'none',
    error: 'No email service provider configured (RESEND_API_KEY, SENDGRID_API_KEY, or GOOGLE_APPS_SCRIPT_URL)',
    recipient: adminEmail,
    timestamp: new Date().toISOString()
  };
}

/**
 * Send a custom rendered email (e.g. for Template Testing or manual notifications)
 */
export async function sendCustomEmail({ to, subject, html, text = '', from = null }) {
  const recipient = (to || '').trim();
  if (!recipient || !recipient.includes('@')) {
    return {
      success: false,
      error: 'Valid recipient email address is required',
      provider: 'none',
      timestamp: new Date().toISOString()
    };
  }

  const fromEmail = (from || process.env.EMAIL_FROM || 'GreenNext <notifications@greennext.in>').trim();
  const plainText = text || html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  // 1. Resend API
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromEmail.includes('@') ? fromEmail : 'onboarding@resend.dev',
          to: [recipient],
          subject: subject || '[GreenNext] Communication',
          html,
          text: plainText
        }),
        signal: AbortSignal.timeout(10000)
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.id) {
        return {
          success: true,
          provider: 'resend',
          messageId: data.id,
          recipient,
          subject,
          timestamp: new Date().toISOString()
        };
      }
      return {
        success: false,
        provider: 'resend',
        error: data?.message || `HTTP ${res.status}`,
        recipient,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      return {
        success: false,
        provider: 'resend',
        error: err.message,
        recipient,
        timestamp: new Date().toISOString()
      };
    }
  }

  // 2. SendGrid API
  if (process.env.SENDGRID_API_KEY) {
    try {
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: recipient }] }],
          from: { email: fromEmail.replace(/.*<([^>]+)>.*/, '$1').trim() || 'notifications@greennext.in', name: 'GreenNext' },
          subject: subject || '[GreenNext] Communication',
          content: [
            { type: 'text/plain', value: plainText },
            { type: 'text/html', value: html }
          ]
        }),
        signal: AbortSignal.timeout(10000)
      });
      if (res.status >= 200 && res.status < 300) {
        return {
          success: true,
          provider: 'sendgrid',
          messageId: res.headers.get('x-message-id') || 'sg-' + Date.now(),
          recipient,
          subject,
          timestamp: new Date().toISOString()
        };
      }
      const data = await res.json().catch(() => null);
      return {
        success: false,
        provider: 'sendgrid',
        error: data?.errors?.[0]?.message || `HTTP ${res.status}`,
        recipient,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      return {
        success: false,
        provider: 'sendgrid',
        error: err.message,
        recipient,
        timestamp: new Date().toISOString()
      };
    }
  }

  // 3. Google Apps Script Web App Forwarding
  const gasUrl = process.env.GOOGLE_APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbzoSXPulFt49lQ1ibWJX2CFNw7iiuT4YBAShuiEcckEovty7FauYnspHCuHQmSqFZk/exec';
  if (gasUrl) {
    try {
      const res = await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'send_custom_email',
          recipient,
          subject: subject || '[GreenNext] Communication',
          html,
          text: plainText
        }),
        signal: AbortSignal.timeout(12000)
      });
      const data = await res.json().catch(() => null);
      if (data && data.emailSent) {
        return {
          success: true,
          provider: 'google_apps_script',
          messageId: data.messageId || 'gas-' + Date.now(),
          recipient,
          subject,
          timestamp: new Date().toISOString()
        };
      }
      return {
        success: false,
        provider: 'google_apps_script',
        error: data?.emailError || data?.message || 'Email forward action not recognized by GAS deployment',
        recipient,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      return {
        success: false,
        provider: 'google_apps_script',
        error: err.message,
        recipient,
        timestamp: new Date().toISOString()
      };
    }
  }

  return {
    success: false,
    provider: 'none',
    error: 'No email service provider configured (RESEND_API_KEY, SENDGRID_API_KEY, or GOOGLE_APPS_SCRIPT_URL)',
    recipient,
    timestamp: new Date().toISOString()
  };
}


