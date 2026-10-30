/**
 * GreenNext Digital Infrastructure — Email & Communication Templates API
 * 
 * Vercel Serverless Function & Local Development Route
 * 
 * Features:
 * - Persistent CRUD for standardized email templates (data/templates.json).
 * - Automatic seeding of 5+ enterprise templates on first access.
 * - Validation for approved template placeholders and HTML payload.
 * - Test email dispatcher using configured email provider (Resend, SendGrid, GAS).
 * - Safe sanitization and error reporting.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { sendCustomEmail, escapeHtml } from './_email.js';

const DATA_FILE = join(process.cwd(), 'data', 'templates.json');

// List of officially supported & approved template placeholders
export const APPROVED_PLACEHOLDERS = [
  'customer_name',
  'customer_email',
  'company_name',
  'enquiry_type',
  'requirements',
  'consultation_date',
  'consultation_time',
  'proposal_link',
  'submission_time'
];

export const VALID_CATEGORIES = [
  'Welcome Emails',
  'Lead Notifications',
  'Consultation Confirmations',
  'Follow-up Emails',
  'Proposal Emails',
  'Thank-you Emails'
];

export const DEFAULT_TEMPLATES = [
  {
    id: "tpl_welcome_default",
    name: "Client Welcome & Solutions Overview",
    category: "Welcome Emails",
    status: "Active",
    subject: "Welcome to GreenNext!",
    body: "<p>Hello {{customer_name}},</p>\n\n<p>Welcome to <strong>GreenNext</strong>. We are thrilled to partner with you as you explore next-generation digital infrastructure tailored for advanced AI workloads.</p>\n\n<p>At GreenNext, we engineer high-density, energy-efficient AI data centers designed specifically for compute-intensive workloads. Our core capabilities include:</p>\n\n<ul>\n  <li><strong>AI-Ready Compute Architecture:</strong> High-density rack layouts engineered for GPU clusters and deep learning accelerators.</li>\n  <li><strong>Direct-to-Chip & Liquid Immersion Cooling:</strong> Advanced thermal management delivering industry-leading sub-1.15 PUE.</li>\n  <li><strong>Intelligent Operations:</strong> Autonomous telemetry, predictive maintenance, and real-time power optimization.</li>\n  <li><strong>Sustainable Microgrids:</strong> Renewable energy integration with 24/7 carbon-intelligent workload orchestration.</li>\n</ul>\n\n<p>Our solutions architecture team is prepared to help you design an infrastructure ecosystem tailored to {{company_name}}'s strategic roadmap.</p>\n\n<div style=\"text-align: center; margin: 30px 0;\">\n  <a href=\"https://greennext.in/solutions/\" class=\"cta-button\" style=\"background-color: #00FF66; color: #0B1220; padding: 12px 24px; text-decoration: none; font-weight: 700; border-radius: 6px; display: inline-block;\">Explore Our Solutions</a>\n</div>\n\n<p>If you have any questions or wish to discuss an upcoming deployment, please reach out directly at <a href=\"mailto:contact@greennext.in\" style=\"color: #00FF66;\">contact@greennext.in</a> or call us at +91 98765 43210.</p>\n\n<p>Best regards,<br>\n<strong>GreenNext Engineering Team</strong><br>\n<span style=\"font-size: 0.85em; color: #8AA497;\">AI Data Center Digital Infrastructure</span></p>",
    placeholders: ["customer_name", "company_name"],
    createdAt: "2026-10-29T20:00:00.000Z",
    updatedAt: "2026-10-29T20:00:00.000Z"
  },
  {
    id: "tpl_lead_notification_default",
    name: "Internal Lead Dispatch Notification",
    category: "Lead Notifications",
    status: "Active",
    subject: "New Lead Received — GreenNext",
    body: "<p><strong>Team GreenNext,</strong></p>\n\n<p>A new prospective client enquiry has been submitted through the digital portal. Please review the submission details below and initiate the response protocol within 2 business hours.</p>\n\n<div style=\"background: #111C35; border: 1px solid rgba(0, 255, 102, 0.2); border-radius: 8px; padding: 20px; margin: 20px 0;\">\n  <h3 style=\"color: #00FF66; margin-top: 0; font-size: 16px;\">Lead Information</h3>\n  <table style=\"width: 100%; border-collapse: collapse; font-size: 14px;\">\n    <tr><td style=\"padding: 6px 0; color: #8AA497; width: 180px;\"><strong>Customer Name:</strong></td><td style=\"color: #FFFFFF;\">{{customer_name}}</td></tr>\n    <tr><td style=\"padding: 6px 0; color: #8AA497;\"><strong>Business Email:</strong></td><td style=\"color: #FFFFFF;\"><a href=\"mailto:{{customer_email}}\" style=\"color: #00FF66;\">{{customer_email}}</a></td></tr>\n    <tr><td style=\"padding: 6px 0; color: #8AA497;\"><strong>Company Name:</strong></td><td style=\"color: #FFFFFF;\">{{company_name}}</td></tr>\n    <tr><td style=\"padding: 6px 0; color: #8AA497;\"><strong>Enquiry Type:</strong></td><td style=\"color: #00FF66; font-weight: 600;\">{{enquiry_type}}</td></tr>\n    <tr><td style=\"padding: 6px 0; color: #8AA497;\"><strong>Submission Timestamp:</strong></td><td style=\"color: #FFFFFF;\">{{submission_time}}</td></tr>\n  </table>\n  \n  <div style=\"margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255, 255, 255, 0.1);\">\n    <strong style=\"color: #8AA497;\">Infrastructure Requirements:</strong>\n    <p style=\"color: #FFFFFF; background: rgba(0, 0, 0, 0.25); padding: 12px; border-radius: 6px; margin: 8px 0 0 0; font-family: monospace; font-size: 13px;\">{{requirements}}</p>\n  </div>\n</div>\n\n<div style=\"text-align: center; margin: 25px 0;\">\n  <a href=\"https://greennext.in/dashboard\" class=\"cta-button\" style=\"background-color: #00FF66; color: #0B1220; padding: 12px 24px; text-decoration: none; font-weight: 700; border-radius: 6px; display: inline-block;\">View Lead in CRM</a>\n</div>\n\n<p style=\"font-size: 12px; color: #8AA497;\">Notice: This is an internal notification intended strictly for the GreenNext advisory & engineering operations team.</p>",
    placeholders: ["customer_name", "customer_email", "company_name", "enquiry_type", "submission_time", "requirements"],
    createdAt: "2026-10-29T20:00:00.000Z",
    updatedAt: "2026-10-29T20:00:00.000Z"
  },
  {
    id: "tpl_consultation_confirm_default",
    name: "Consultation Booking Confirmation",
    category: "Consultation Confirmations",
    status: "Active",
    subject: "Your GreenNext Consultation Is Confirmed",
    body: "<p>Dear {{customer_name}},</p>\n\n<p>Your technical consultation with GreenNext's senior infrastructure architecture team has been successfully verified and confirmed.</p>\n\n<div style=\"background: #111C35; border-left: 4px solid #00FF66; padding: 18px 22px; border-radius: 0 8px 8px 0; margin: 22px 0;\">\n  <h3 style=\"color: #FFFFFF; margin: 0 0 12px 0; font-size: 16px;\">Verified Booking Details</h3>\n  <p style=\"margin: 5px 0; color: #E8EDF5;\"><strong>Consultation Date:</strong> {{consultation_date}}</p>\n  <p style=\"margin: 5px 0; color: #E8EDF5;\"><strong>Consultation Time:</strong> {{consultation_time}} (IST)</p>\n  <p style=\"margin: 5px 0; color: #E8EDF5;\"><strong>Client Organization:</strong> {{company_name}}</p>\n  <p style=\"margin: 5px 0; color: #E8EDF5;\"><strong>Meeting Room:</strong> <a href=\"https://meet.google.com/gnx-infra-arch\" style=\"color: #00FF66; font-weight: 600;\">https://meet.google.com/gnx-infra-arch</a></p>\n</div>\n\n<p><strong>Session Discussion Focus:</strong></p>\n<ul>\n  <li>Workload density review & thermal management options.</li>\n  <li>Sub-1.15 PUE cooling topology and power delivery.</li>\n  <li>Site readiness, electrical infrastructure, and modular installation roadmap.</li>\n</ul>\n\n<div style=\"text-align: center; margin: 30px 0;\">\n  <a href=\"https://greennext.in/api/booking?action=calendar&client={{customer_email}}\" class=\"cta-button\" style=\"background-color: #00FF66; color: #0B1220; padding: 12px 24px; text-decoration: none; font-weight: 700; border-radius: 6px; display: inline-block;\">Add to Calendar</a>\n</div>\n\n<p>Need to reschedule or include additional stakeholders? Reply directly to this email or contact us at <a href=\"mailto:advisory@greennext.in\" style=\"color: #00FF66;\">advisory@greennext.in</a>.</p>\n\n<p>Warm regards,<br>\n<strong>GreenNext Advisory & Solutions Group</strong><br>\n<span style=\"font-size: 0.85em; color: #8AA497;\">Direct Line: +91 98765 43210</span></p>",
    placeholders: ["customer_name", "customer_email", "company_name", "consultation_date", "consultation_time"],
    createdAt: "2026-10-29T20:00:00.000Z",
    updatedAt: "2026-10-29T20:00:00.000Z"
  },
  {
    id: "tpl_followup_default",
    name: "Enquiry Follow-up & Architecture Discussion",
    category: "Follow-up Emails",
    status: "Active",
    subject: "Following Up on Your GreenNext Enquiry",
    body: "<p>Dear {{customer_name}},</p>\n\n<p>I hope this email finds you well. I am following up on your recent enquiry regarding <strong>{{enquiry_type}}</strong> solutions for {{company_name}}.</p>\n\n<p>As AI training and inference workloads accelerate, standard colocation facilities often struggle with thermal density and power draw. GreenNext addresses this challenge with modular, purpose-built AI infrastructure featuring:</p>\n\n<ul>\n  <li>Rack power densities from 40 kW up to 130 kW per cabinet.</li>\n  <li>Hybrid and full liquid immersion cooling systems engineered for GPU clusters.</li>\n  <li>Sub-1.15 guaranteed PUE with predictive cooling automation.</li>\n</ul>\n\n<p>We would welcome the opportunity to discuss your infrastructure roadmap and explore how GreenNext can support {{company_name}}'s compute performance goals.</p>\n\n<div style=\"text-align: center; margin: 30px 0;\">\n  <a href=\"https://greennext.in/book-consultation.html\" class=\"cta-button\" style=\"background-color: #00FF66; color: #0B1220; padding: 12px 24px; text-decoration: none; font-weight: 700; border-radius: 6px; display: inline-block;\">Schedule a Consultation</a>\n</div>\n\n<p>If you have already finalized your roadmap or require technical documentation, please let me know and I will gladly provide the necessary specifications.</p>\n\n<p>Best regards,<br>\n<strong>Chief Infrastructure Strategist</strong><br>\nGreenNext Digital Infrastructure<br>\n<a href=\"mailto:strategy@greennext.in\" style=\"color: #00FF66;\">strategy@greennext.in</a> | +91 98765 43210</p>",
    placeholders: ["customer_name", "company_name", "enquiry_type"],
    createdAt: "2026-10-29T20:00:00.000Z",
    updatedAt: "2026-10-29T20:00:00.000Z"
  },
  {
    id: "tpl_proposal_default",
    name: "Infrastructure Proposal Delivery",
    category: "Proposal Emails",
    status: "Active",
    subject: "Your GreenNext Infrastructure Proposal",
    body: "<p>Hello {{customer_name}},</p>\n\n<p>Following our architectural discussions regarding <strong>{{company_name}} — {{enquiry_type}}</strong>, we are pleased to deliver your comprehensive infrastructure engineering proposal.</p>\n\n<div style=\"background: #111C35; border: 1px solid rgba(0, 255, 102, 0.2); border-radius: 8px; padding: 20px; margin: 20px 0;\">\n  <h3 style=\"color: #00FF66; margin-top: 0; font-size: 16px;\">Proposal Summary</h3>\n  <ul style=\"color: #E8EDF5; margin: 0; padding-left: 20px;\">\n    <li><strong>Infrastructure Specification:</strong> High-density modular deployment tailored to your specified compute matrix.</li>\n    <li><strong>Power & Cooling Topology:</strong> Closed-loop liquid cooling with redundant N+1 power distribution.</li>\n    <li><strong>Efficiency Target:</strong> Projected operational PUE of &le; 1.14 with automated microgrid optimization.</li>\n    <li><strong>Delivery Milestone:</strong> Turnkey modular commissioning schedule.</li>\n  </ul>\n</div>\n\n<p>You can securely access and download your detailed proposal document using the link below:</p>\n\n<div style=\"text-align: center; margin: 30px 0;\">\n  <a href=\"{{proposal_link}}\" class=\"cta-button\" style=\"background-color: #00FF66; color: #0B1220; padding: 14px 28px; text-decoration: none; font-weight: 700; border-radius: 6px; display: inline-block; font-size: 15px;\">Review Full Proposal Document</a>\n</div>\n\n<p><em>Security Notice: This document is encrypted and restricted to authorized stakeholders at {{company_name}}.</em></p>\n\n<p><strong>Next Steps:</strong></p>\n<ol>\n  <li>Review the proposal specifications and commercial terms.</li>\n  <li>Schedule a 30-minute technical review call to address questions.</li>\n  <li>Finalize SLA framework and site readiness roadmap.</li>\n</ol>\n\n<p>Please feel free to reach out directly should you need any adjustments or immediate clarifications.</p>\n\n<p>Sincerely,<br>\n<strong>VP of Infrastructure Solutions</strong><br>\nGreenNext Enterprise Operations<br>\n<a href=\"mailto:solutions@greennext.in\" style=\"color: #00FF66;\">solutions@greennext.in</a></p>",
    placeholders: ["customer_name", "company_name", "enquiry_type", "proposal_link"],
    createdAt: "2026-10-29T20:00:00.000Z",
    updatedAt: "2026-10-29T20:00:00.000Z"
  },
  {
    id: "tpl_thankyou_default",
    name: "Post-Consultation Thank You & Next Steps",
    category: "Thank-you Emails",
    status: "Active",
    subject: "Thank You for Connecting with GreenNext",
    body: "<p>Dear {{customer_name}},</p>\n\n<p>Thank you for taking the time to meet with the GreenNext team today to discuss your AI data center initiatives.</p>\n\n<p>We enjoyed learning more about {{company_name}} and your project requirements: <em>\"{{requirements}}\"</em>.</p>\n\n<p>Our solutions architecture team is currently compiling your technical evaluation matrix and preliminary site feasibility report. We will follow up shortly with our tailored recommendations.</p>\n\n<p>In the interim, feel free to explore our digital intelligence resources or reach out with any additional documentation.</p>\n\n<div style=\"text-align: center; margin: 30px 0;\">\n  <a href=\"https://greennext.in/intelligence/\" class=\"cta-button\" style=\"background-color: #00FF66; color: #0B1220; padding: 12px 24px; text-decoration: none; font-weight: 700; border-radius: 6px; display: inline-block;\">Explore GreenNext Intelligence</a>\n</div>\n\n<p>Warm regards,<br>\n<strong>The GreenNext Team</strong><br>\n<a href=\"https://greennext.in\">https://greennext.in</a></p>",
    placeholders: ["customer_name", "company_name", "requirements"],
    createdAt: "2026-10-29T20:00:00.000Z",
    updatedAt: "2026-10-29T20:00:00.000Z"
  }
];

export async function getTemplates() {
  try {
    const raw = await readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    // File missing or unreadable, initialize with defaults
  }

  await saveTemplates(DEFAULT_TEMPLATES);
  return DEFAULT_TEMPLATES;
}

export async function saveTemplates(templates) {
  await mkdir(join(process.cwd(), 'data'), { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(templates, null, 2), 'utf8');
}

export function extractPlaceholders(text) {
  if (!text) return [];
  const matches = text.match(/\{\{([a-zA-Z0-9_]+)\}\}/g) || [];
  return [...new Set(matches.map(m => m.replace(/[\{\}]/g, '').trim()))];
}

export function validatePlaceholders(placeholders) {
  const invalid = [];
  placeholders.forEach(p => {
    if (!APPROVED_PLACEHOLDERS.includes(p)) {
      invalid.push(p);
    }
  });
  return invalid;
}

export function renderWithPlaceholders(content, data = {}) {
  if (!content) return '';
  return content.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (match, key) => {
    return data[key] !== undefined && data[key] !== null ? String(data[key]) : match;
  });
}

/**
 * Wrap rendered template HTML in standard GreenNext branded email envelope
 */
export function wrapInBrandedEmailShell(htmlContent, subject = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #070B14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E8EDF5; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #070B14; min-height: 100vh; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 620px; background-color: #0B1220; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
          <!-- Header Bar with GreenNext Logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #0B1220 0%, #111C35 100%); padding: 28px 32px; border-bottom: 2px solid #00FF66;">
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #FFFFFF;">
                      Green<span style="color: #00FF66;">Next</span>
                    </span>
                    <span style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #8AA497; margin-top: 4px;">
                      AI Data Center Digital Infrastructure
                    </span>
                  </td>
                  <td align="right">
                    <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #00FF66; background: rgba(0, 255, 102, 0.12); border: 1px solid rgba(0, 255, 102, 0.3); padding: 4px 10px; border-radius: 20px;">
                      Enterprise Communication
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Body Content Area -->
          <tr>
            <td style="padding: 32px; line-height: 1.65; font-size: 15px; color: #E8EDF5;">
              ${htmlContent}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #070B14; padding: 24px 32px; border-top: 1px solid rgba(255, 255, 255, 0.08); font-size: 12px; color: #8AA497; text-align: center; line-height: 1.6;">
              <p style="margin: 0 0 6px 0; font-weight: 700; color: #E8EDF5;">GreenNext Digital Infrastructure Private Limited</p>
              <p style="margin: 0 0 10px 0; color: #8AA497;">AI Data Center Architecture &bull; Direct Liquid Cooling &bull; Autonomous Infrastructure</p>
              <p style="margin: 0 0 12px 0; color: #547063;">
                Bangalore &bull; Coimbatore &bull; Singapore &bull; 
                <a href="mailto:contact@greennext.in" style="color: #00FF66; text-decoration: none;">contact@greennext.in</a> &bull; 
                <a href="tel:+919876543210" style="color: #00FF66; text-decoration: none;">+91 98765 43210</a>
              </p>
              <!-- Social & Web Links -->
              <p style="margin: 0 0 10px 0; font-size: 11px;">
                <a href="https://greennext.in" style="color: #00FF66; text-decoration: none; margin: 0 6px;">Website</a> &bull;
                <a href="https://linkedin.com/company/greennext-infra" style="color: #00FF66; text-decoration: none; margin: 0 6px;">LinkedIn</a> &bull;
                <a href="https://x.com/greennext_ai" style="color: #00FF66; text-decoration: none; margin: 0 6px;">X (Twitter)</a> &bull;
                <a href="https://github.com/mruba29/greenext_ruba" style="color: #00FF66; text-decoration: none; margin: 0 6px;">GitHub</a>
              </p>
              <p style="margin: 0; font-size: 10px; color: #547063;">
                &copy; 2026 GreenNext. All rights reserved. Confidential enterprise communication.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    // -------------------------------------------------------------------------
    // GET /api/templates
    // -------------------------------------------------------------------------
    if (req.method === 'GET') {
      const templates = await getTemplates();
      const q = (req.query?.q || '').toLowerCase().trim();
      const category = (req.query?.category || '').trim();
      const status = (req.query?.status || '').trim();

      let filtered = templates;

      if (category && category !== 'All') {
        filtered = filtered.filter(t => t.category === category);
      }

      if (status && status !== 'All') {
        filtered = filtered.filter(t => (t.status || 'Active').toLowerCase() === status.toLowerCase());
      }

      if (q) {
        filtered = filtered.filter(t => 
          (t.name && t.name.toLowerCase().includes(q)) ||
          (t.subject && t.subject.toLowerCase().includes(q)) ||
          (t.category && t.category.toLowerCase().includes(q)) ||
          (t.body && t.body.toLowerCase().includes(q))
        );
      }

      return res.status(200).json({
        success: true,
        count: filtered.length,
        total: templates.length,
        categories: VALID_CATEGORIES,
        approvedPlaceholders: APPROVED_PLACEHOLDERS,
        templates: filtered
      });
    }

    // -------------------------------------------------------------------------
    // DELETE /api/templates?id=...
    // -------------------------------------------------------------------------
    if (req.method === 'DELETE') {
      const templateId = (req.query?.id || req.body?.id || '').trim();
      if (!templateId) {
        return res.status(400).json({ success: false, error: 'Template ID is required for deletion' });
      }

      const templates = await getTemplates();
      const initialLength = templates.length;
      const updated = templates.filter(t => t.id !== templateId);

      if (updated.length === initialLength) {
        return res.status(404).json({ success: false, error: 'Template not found' });
      }

      await saveTemplates(updated);
      return res.status(200).json({
        success: true,
        message: 'Template deleted successfully',
        deletedId: templateId
      });
    }

    // -------------------------------------------------------------------------
    // POST /api/templates (Create, Update, Duplicate, Test Email)
    // -------------------------------------------------------------------------
    if (req.method === 'POST') {
      const body = req.body || {};
      const action = body.action || (body.id ? 'update' : 'create');

      // 1. Send Test Email
      if (action === 'test_email') {
        const recipient = (body.recipient_email || body.to || '').trim();
        if (!recipient || !recipient.includes('@')) {
          return res.status(400).json({
            success: false,
            error: 'A valid recipient email address is required for sending a test email'
          });
        }

        const templateSubject = body.subject || 'GreenNext Communication Test';
        const templateBody = body.body || '<p>This is a test notification from GreenNext.</p>';
        const sampleData = body.sample_data || {
          customer_name: 'Aravind Raman',
          customer_email: recipient,
          company_name: 'AICore Technologies',
          enquiry_type: 'AI Data Center Sizing',
          requirements: '120kW high-density rack deployment with direct-to-chip liquid cooling for H100 cluster.',
          consultation_date: 'November 12, 2026',
          consultation_time: '03:30 PM',
          proposal_link: 'https://greennext.in/proposals/sample-proposal.pdf',
          submission_time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
        };

        const renderedSubject = renderWithPlaceholders(templateSubject, sampleData);
        const renderedBody = renderWithPlaceholders(templateBody, sampleData);
        const fullHtml = wrapInBrandedEmailShell(renderedBody, renderedSubject);

        const emailResult = await sendCustomEmail({
          to: recipient,
          subject: renderedSubject,
          html: fullHtml
        });

        if (!emailResult.success && emailResult.provider === 'none') {
          return res.status(200).json({
            success: false,
            configured: false,
            message: 'Email service is not yet configured with live credentials in this environment.',
            setupInstructions: 'To send live test emails, configure RESEND_API_KEY, SENDGRID_API_KEY, or GOOGLE_APPS_SCRIPT_URL in your .env or Vercel Environment Variables. Simulation preview is available.',
            preview: {
              to: recipient,
              subject: renderedSubject,
              html: fullHtml
            }
          });
        }

        return res.status(200).json({
          success: emailResult.success,
          provider: emailResult.provider,
          messageId: emailResult.messageId || null,
          recipient,
          error: emailResult.error || null,
          message: emailResult.success ? `Test email dispatched successfully to ${recipient} via ${emailResult.provider}` : `Email delivery failed: ${emailResult.error}`
        });
      }

      // 2. Duplicate Template
      if (action === 'duplicate') {
        const sourceId = (body.id || body.templateId || '').trim();
        if (!sourceId) {
          return res.status(400).json({ success: false, error: 'Source template ID is required to duplicate' });
        }

        const templates = await getTemplates();
        const source = templates.find(t => t.id === sourceId);
        if (!source) {
          return res.status(404).json({ success: false, error: 'Source template not found' });
        }

        const newId = 'tpl_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
        const duplicate = {
          ...source,
          id: newId,
          name: `${source.name} (Copy)`,
          status: 'Draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        templates.unshift(duplicate);
        await saveTemplates(templates);

        return res.status(201).json({
          success: true,
          message: `Template "${duplicate.name}" created as draft copy`,
          template: duplicate
        });
      }

      // 3. Delete Template via POST
      if (action === 'delete') {
        const targetId = (body.id || body.templateId || '').trim();
        if (!targetId) {
          return res.status(400).json({ success: false, error: 'Template ID is required to delete' });
        }

        const templates = await getTemplates();
        const filtered = templates.filter(t => t.id !== targetId);
        if (filtered.length === templates.length) {
          return res.status(404).json({ success: false, error: 'Template not found' });
        }

        await saveTemplates(filtered);
        return res.status(200).json({
          success: true,
          message: 'Template deleted successfully',
          deletedId: targetId
        });
      }

      // 4. Create or Update Template
      const name = (body.name || '').trim();
      const subject = (body.subject || '').trim();
      const bodyContent = (body.body || '').trim();
      const category = (body.category || 'Welcome Emails').trim();
      const status = (body.status === 'Draft' || body.status === 'draft') ? 'Draft' : 'Active';

      if (!name) {
        return res.status(400).json({ success: false, error: 'Template name is required' });
      }
      if (!subject) {
        return res.status(400).json({ success: false, error: 'Email subject is required' });
      }
      if (!bodyContent) {
        return res.status(400).json({ success: false, error: 'Email body content is required' });
      }

      // Placeholder detection and validation
      const subjectPlaceholders = extractPlaceholders(subject);
      const bodyPlaceholders = extractPlaceholders(bodyContent);
      const allPlaceholders = [...new Set([...subjectPlaceholders, ...bodyPlaceholders])];
      const invalidPlaceholders = validatePlaceholders(allPlaceholders);

      const templates = await getTemplates();
      const now = new Date().toISOString();

      if (action === 'update' || body.id) {
        const existingIndex = templates.findIndex(t => t.id === body.id);
        if (existingIndex === -1) {
          return res.status(404).json({ success: false, error: 'Template ID not found for update' });
        }

        const updated = {
          ...templates[existingIndex],
          name,
          category,
          status,
          subject,
          body: bodyContent,
          placeholders: allPlaceholders,
          updatedAt: now
        };

        templates[existingIndex] = updated;
        await saveTemplates(templates);

        return res.status(200).json({
          success: true,
          message: 'Template updated successfully',
          template: updated,
          warnings: invalidPlaceholders.length > 0 ? `Unrecognized placeholders: ${invalidPlaceholders.map(p => '{{' + p + '}}').join(', ')}` : null
        });
      }

      // Create new template
      const newId = 'tpl_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
      const newTemplate = {
        id: newId,
        name,
        category,
        status,
        subject,
        body: bodyContent,
        placeholders: allPlaceholders,
        createdAt: now,
        updatedAt: now
      };

      templates.unshift(newTemplate);
      await saveTemplates(templates);

      return res.status(201).json({
        success: true,
        message: 'Template created successfully',
        template: newTemplate,
        warnings: invalidPlaceholders.length > 0 ? `Unrecognized placeholders: ${invalidPlaceholders.map(p => '{{' + p + '}}').join(', ')}` : null
      });
    }

    return res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
  } catch (err) {
    console.error('[Templates API Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while processing template: ' + err.message
    });
  }
}

