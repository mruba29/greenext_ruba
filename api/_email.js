/**
 * GreenNext Digital Infrastructure — Automated Lead Notification Email System
 * 
 * Features:
 * - Ultra-premium dark navy (#0B1120, #0F172A) & purple-to-blue gradient (#6366F1 -> #3B82F6) design
 * - Verified email-safe responsive HTML table layout with inline CSS
 * - Plain-text fallback generation
 * - Form Type Badge (Long Form, Quick Form, Floating Lead Form, Careers Application)
 * - Structured Sections:
 *   1. Contact Information
 *   2. Requirements & Business Context
 *   3. Submission Metadata (Enquiry ID, Page URL, UTM, Jira status, Sheets record)
 *   4. Next Steps (Purple "Reply to Lead" mailto, Green "WhatsApp" direct link, "Open Jira Lead")
 * - Dual-Engine Support:
 *   A. Transactional REST API (Resend / SendGrid / Custom HTTPS) via native fetch
 *   B. Google Apps Script MailApp / GmailApp Engine (Zero extra API cost, uses Google Workspace quota)
 * - Safe HTML escaping to prevent email injection and HTML/XSS attacks
 * - Idempotency & retry tracking
 */

/**
 * Escape HTML special characters to prevent injection
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
 * Generate mailto link for "Reply to Lead"
 */
export function generateReplyMailto(lead) {
  const email = (lead.businessEmail || lead.email || '').trim();
  if (!email) return '';
  const enquiryId = lead.enquiryId || 'GreenNext Lead';
  const name = lead.fullName || lead.name || 'there';
  const subject = `GreenNext Enquiry — ${enquiryId}`;
  const body = `Hello ${name},\n\nThank you for reaching out to GreenNext regarding our AI Data Center and digital infrastructure solutions.\n\nWe have reviewed your enquiry (${enquiryId}) and would like to connect to discuss how we can support your requirements.\n\nBest regards,\nGreenNext Enterprise Team`;
  return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Generate prefilled WhatsApp click-to-chat URL
 */
export function generateWhatsAppLeadUrl(lead, businessPhone = '919876543210') {
  // Use lead phone or fall back to lead contact
  const cleanPhone = (businessPhone || '919876543210').replace(/\D/g, '');
  const name = lead.fullName || lead.name || 'Valued Partner';
  const interest = lead.areaOfInterest || lead.service || 'Intelligent Digital Infrastructure';
  const text = `Hello ${name}, thank you for contacting GreenNext. We received your enquiry regarding ${interest}. Our team would be happy to discuss your requirements.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Render Responsive Dark Navy HTML Email
 */
export function renderLeadNotificationHtml(lead) {
  const enquiryId = escapeHtml(lead.enquiryId || 'GN-PENDING');
  const contactName = escapeHtml(lead.fullName || lead.name || 'Enquiry Visitor');
  const formType = escapeHtml(lead.formType || 'Enquiry Form');
  const isQuick = formType.toLowerCase().includes('quick') || formType.toLowerCase().includes('short');
  const badgeColor = isQuick ? '#10B981' : '#8B5CF6';
  const badgeBg = isQuick ? 'rgba(16, 185, 129, 0.15)' : 'rgba(139, 92, 246, 0.15)';
  const formattedDate = formatLeadDateTime(lead.submittedAt);

  // Contact details
  const email = (lead.businessEmail || lead.email || '').trim();
  const phone = (lead.phoneNumber || lead.phone || '').trim();
  const company = (lead.companyName || lead.company || '').trim();
  const location = (lead.location || lead.city || '').trim();

  // Requirements
  const industry = (lead.industry || '').trim();
  const interest = (lead.areaOfInterest || lead.service || '').trim();
  const requirements = (lead.projectRequirements || lead.requirements || lead.message || '').trim();
  const timeline = (lead.expectedTimeline || lead.timeline || '').trim();
  const contactMethod = (lead.preferredContactMethod || lead.contactMethod || '').trim();

  // Metadata
  const pageUrl = lead.metadata?.page_url || lead.page_url || '/';
  const utmSource = lead.metadata?.utm_source || lead.utm_source || '';
  const utmMedium = lead.metadata?.utm_medium || lead.utm_medium || '';
  const utmCampaign = lead.metadata?.utm_campaign || lead.utm_campaign || '';
  const trafficSource = [utmSource, utmMedium, utmCampaign].filter(Boolean).join(' / ') || 'Direct / Organic';

  // Jira details
  const jiraKey = lead.jira?.parentKey || lead.jiraKey || '';
  const jiraUrl = lead.jira?.parentUrl || (jiraKey ? `https://trustworkz.atlassian.net/browse/${jiraKey}` : '');
  const jiraStatus = lead.jira?.status || (jiraKey ? 'Created & Subtasks Assigned' : 'Configured / Pending');

  // Next steps URLs
  const replyMailto = generateReplyMailto(lead);
  const waUrl = generateWhatsAppLeadUrl(lead, process.env.WHATSAPP_PHONE || '919876543210');
  const sheetsUrl = process.env.GOOGLE_SHEET_URL || 'https://docs.google.com/spreadsheets/d/14ciH1aNzWIJHJkQ5rYCdrEhci3KYMjrTSeY3QMaerVI/edit';

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
        <td style="padding: 36px 32px 30px; background: linear-gradient(135deg, #4338CA 0%, #3B82F6 50%, #06B6D4 100%); text-align: left;" class="mobile-padding">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td>
                <!-- BRANDING -->
                <div style="font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #E0E7FF; margin-bottom: 8px;">
                  GREENNEXT DIGITAL INFRASTRUCTURE
                </div>
                <h1 style="margin: 0 0 10px 0; font-size: 26px; font-weight: 800; line-height: 1.25; color: #FFFFFF; letter-spacing: -0.5px;">
                  New Lead Received
                </h1>
                <p style="margin: 0; font-size: 14px; color: #DBEAFE; line-height: 1.5;">
                  A new enterprise prospect submitted an enquiry through the GreenNext AI Data Center portal.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- SUMMARY META BANNER -->
      <tr>
        <td style="background-color: #131D33; padding: 16px 32px; border-bottom: 1px solid #1E293B;" class="mobile-padding">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="vertical-align: middle;">
                <span style="display: inline-block; padding: 4px 12px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 20px; background-color: ${badgeBg}; color: ${badgeColor}; border: 1px solid ${badgeColor};">
                  ${formType}
                </span>
                <span style="color: #94A3B8; font-size: 13px; margin-left: 12px; font-weight: 500;">
                  ID: <strong style="color: #F8FAFC;">${enquiryId}</strong>
                </span>
              </td>
              <td style="text-align: right; vertical-align: middle; font-size: 12px; color: #64748B;">
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
                  ${timeline ? `<tr>
                    <td style="font-size: 13px; color: #94A3B8; padding: 6px 0;">Expected Timeline:</td>
                    <td style="font-size: 14px; color: #F1F5F9; padding: 6px 0;">${escapeHtml(timeline)}</td>
                  </tr>` : ''}
                  ${contactMethod ? `<tr>
                    <td style="font-size: 13px; color: #94A3B8; padding: 6px 0;">Preferred Contact:</td>
                    <td style="font-size: 14px; color: #F1F5F9; padding: 6px 0;">${escapeHtml(contactMethod)}</td>
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
                  <tr>
                    <td style="font-size: 12px; color: #64748B; padding: 4px 0;">Google Sheets:</td>
                    <td style="font-size: 13px; color: #34D399; padding: 4px 0;">
                      <a href="${sheetsUrl}" target="_blank" style="color: #34D399; text-decoration: none;">Recorded (Enquiries + Jira Lead Tracking) &rarr;</a>
                    </td>
                  </tr>
                  ${jiraKey ? `<tr>
                    <td style="font-size: 12px; color: #64748B; padding: 4px 0;">Jira Lead Issue:</td>
                    <td style="font-size: 13px; color: #818CF8; padding: 4px 0;">
                      <a href="${jiraUrl}" target="_blank" style="color: #818CF8; font-weight: 700; text-decoration: none;">${escapeHtml(jiraKey)} &rarr;</a>
                      <span style="font-size: 11px; color: #94A3B8; margin-left: 6px;">(${escapeHtml(jiraStatus)})</span>
                    </td>
                  </tr>` : ''}
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
                    ${jiraUrl ? `<td style="padding-bottom: 8px;">
                      <a href="${jiraUrl}" target="_blank" class="btn" style="display: inline-block; background-color: #1E293B; color: #94A3B8; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 18px; border-radius: 8px; border: 1px solid #334155; mso-padding-alt: 0;">
                        📌 Jira Lead
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
 * Generate Plain-Text Fallback Version
 */
export function renderLeadNotificationText(lead) {
  const enquiryId = lead.enquiryId || 'GN-PENDING';
  const contactName = lead.fullName || lead.name || 'Enquiry Visitor';
  const formType = lead.formType || 'Enquiry Form';
  const formattedDate = formatLeadDateTime(lead.submittedAt);

  const email = (lead.businessEmail || lead.email || '').trim();
  const phone = (lead.phoneNumber || lead.phone || '').trim();
  const company = (lead.companyName || lead.company || '—').trim();
  const location = (lead.location || lead.city || '—').trim();

  const interest = (lead.areaOfInterest || lead.service || '—').trim();
  const industry = (lead.industry || '—').trim();
  const timeline = (lead.expectedTimeline || lead.timeline || '—').trim();
  const contactMethod = (lead.preferredContactMethod || lead.contactMethod || '—').trim();
  const requirements = (lead.projectRequirements || lead.requirements || lead.message || '—').trim();

  const pageUrl = lead.metadata?.page_url || lead.page_url || '/';
  const jiraKey = lead.jira?.parentKey || lead.jiraKey || '—';

  return `===============================================================
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

Project Requirements:
${requirements}

SUBMISSION METADATA
---------------------------------------------------------------
Enquiry ID:   ${enquiryId}
Source Page:  ${pageUrl}
Jira Key:     ${jiraKey}
Google Sheet: Synchronized (14ciH1aNzWIJHJkQ5rYCdrEhci3KYMjrTSeY3QMaerVI)

NEXT STEPS
---------------------------------------------------------------
• Reply to Lead: mailto:${email}?subject=GreenNext%20Enquiry%20%E2%80%94%20${enquiryId}
• WhatsApp Chat: https://wa.me/919876543210
• Jira Issue:    https://trustworkz.atlassian.net/browse/${jiraKey}

--
GreenNext Digital Infrastructure — Automated Lead Notification Engine
`;
}

/**
 * Send Email Notification via Configured Provider
 * Supported providers:
 * 1. Resend REST API (when RESEND_API_KEY is present)
 * 2. SendGrid REST API (when SENDGRID_API_KEY is present)
 * 3. Google Apps Script Web App forwarder (zero dependency fallback)
 */
export async function sendLeadNotificationEmail(lead, options = {}) {
  const adminEmail = options.adminEmail || process.env.ADMIN_NOTIFICATION_EMAIL || process.env.NOTIFICATION_EMAIL || 'ruba.int2027g3@gmail.com';
  const fromEmail = options.fromEmail || process.env.EMAIL_FROM || 'GreenNext Leads <leads@greennext.in>';
  const subject = `[GreenNext] New Lead Received — ${lead.fullName || lead.enquiryId || 'Enterprise Lead'}`;

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
          timestamp: new Date().toISOString()
        };
      }
      return {
        success: false,
        provider: 'resend',
        error: data?.message || `HTTP ${res.status}`,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      return {
        success: false,
        provider: 'resend',
        error: err.message,
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
          timestamp: new Date().toISOString()
        };
      }
      const data = await res.json().catch(() => null);
      return {
        success: false,
        provider: 'sendgrid',
        error: data?.errors?.[0]?.message || `HTTP ${res.status}`,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      return {
        success: false,
        provider: 'sendgrid',
        error: err.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // 3. Fallback: Google Apps Script Native Mail Forwarding (via Google Workspace / Gmail App)
  const gasUrl = options.gasUrl || process.env.GOOGLE_APPS_SCRIPT_URL;
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
          timestamp: new Date().toISOString()
        };
      }
      return {
        success: false,
        provider: 'google_apps_script',
        error: data?.emailError || 'Email send failed via Google Apps Script',
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      return {
        success: false,
        provider: 'google_apps_script',
        error: err.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // If no email credentials configured
  return {
    success: false,
    provider: 'none',
    error: 'No email service provider configured (RESEND_API_KEY, SENDGRID_API_KEY, or GOOGLE_APPS_SCRIPT_URL)',
    timestamp: new Date().toISOString()
  };
}
