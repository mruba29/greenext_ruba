// Minimal static file server for local preview. No external dependencies.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const PORT = process.env.PORT || 3000;

// Live Google Apps Script Web App URL (forwarded from POST /api/enquiry)
const GAS_URL = process.env.GOOGLE_APPS_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbzY7QqSNPMyK05FraOoGMtUvD5lXLnuwVlE5D1rPmQiV1nf8qyyiknvlzi_w9c_HJ6G/exec';

// Analytics Google Apps Script Web App URL (Traffic Analysis / Intelligence / Session Intelligence)
// NOTE: This URL is set after you deploy Analytics.gs as a separate Web App.
// Until deployed, analytics events are accepted and silently dropped (no error shown to visitors).
const ANALYTICS_GAS_URL = process.env.ANALYTICS_GAS_URL || null;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
};

const server = createServer(async (req, res) => {
  // Enable CORS headers for API requests
  const setCors = () => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  };

  try {
    let path = decodeURIComponent(req.url.split('?')[0]);

    // Handle CORS preflight for API routes
    if (req.method === 'OPTIONS' && (path === '/api/enquiry' || path === '/api/analytics')) {
      setCors();
      res.writeHead(204);
      res.end();
      return;
    }

    // -------------------------------------------------------------------------
    // API ROUTE: /api/analytics (Analytics Event Batch Receiver)
    // -------------------------------------------------------------------------
    if (path === '/api/analytics') {
      setCors();

      if (req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success          : true,
          status           : 'online',
          service          : 'GreenNext Analytics API',
          gasConfigured    : Boolean(ANALYTICS_GAS_URL),
          endpoint         : '/api/analytics',
        }));
        return;
      }

      if (req.method === 'POST') {
        let bodyRaw = '';
        for await (const chunk of req) { bodyRaw += chunk; }

        let body = {};
        try { body = JSON.parse(bodyRaw); } catch (err) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Invalid JSON.' }));
          return;
        }

        // Forward to Analytics GAS endpoint if configured
        if (ANALYTICS_GAS_URL) {
          try {
            const gasRes  = await fetch(ANALYTICS_GAS_URL, {
              method  : 'POST',
              headers : { 'Content-Type': 'text/plain;charset=utf-8' },
              body    : JSON.stringify(body),
              redirect: 'follow',
            });
            const gasJson = await gasRes.json().catch(() => ({}));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(gasJson));
          } catch (fwdErr) {
            console.error('Analytics GAS forward error:', fwdErr.message);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Analytics endpoint unreachable.' }));
          }
        } else {
          // Analytics GAS not yet configured — silently accept and log locally
          const events = Array.isArray(body.events) ? body.events : [body];
          console.log('[Analytics] Received', events.length, 'events (GAS not configured — logging only)');
          events.slice(0, 5).forEach(function(e) {
            if (e && e.event_type) console.log('  ↳', e.event_type, '|', e.page_url || '', '|', e.session_id || '');
          });
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, received: events.length, written: 0, note: 'GAS not configured' }));
        }
        return;
      }
    }

    // -------------------------------------------------------------------------
    // API ROUTE: /api/enquiry (Google Apps Script Proxy / Local Storage)
    // -------------------------------------------------------------------------
    if (path === '/api/enquiry') {
      setCors();

      // GET: Health & audit retrieval for verification
      if (req.method === 'GET') {
        const enquiriesFile = join(ROOT, 'data', 'enquiries.json');
        const raw = await readFile(enquiriesFile, 'utf8').catch(() => '[]');
        let list = [];
        try { list = JSON.parse(raw); } catch (e) { list = []; }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          status: 'online',
          service: 'GreenNext Enquiry API',
          gasConfigured: Boolean(GAS_URL),
          totalEnquiries: list.length,
          enquiries: list,
        }, null, 2));
        return;
      }

      // POST: Receive enquiry from website
      if (req.method === 'POST') {
        let bodyRaw = '';
        for await (const chunk of req) {
          bodyRaw += chunk;
        }

        let body = {};
        try {
          body = JSON.parse(bodyRaw);
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Invalid JSON payload received.' }));
          return;
        }

        // Check if live Google Apps Script endpoint is configured
        const gasUrl = GAS_URL;
        if (gasUrl) {
          try {
            const gasRes = await fetch(gasUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify(body),
              redirect: 'follow',
            });
            const gasJson = await gasRes.json().catch(() => ({}));
            res.writeHead(gasRes.status, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(gasJson));
            return;
          } catch (forwardErr) {
            console.error('Error forwarding to Google Apps Script:', forwardErr);
            // Fall through to local recording if forward fails
          }
        }

        // Server-Side Validation
        const formType = body.form_type || (body.is_short_form ? 'Short Form' : 'Long Form');
        const fullName = (body.full_name || body.name || '').trim();
        const contact = (body.contact || body.business_email || body.phone || '').trim();

        if (!fullName || fullName.length < 2) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Please provide a valid name (at least 2 characters).' }));
          return;
        }

        if (formType === 'Short Form') {
          if (!contact || contact.length < 5) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Please provide a valid email or phone number.' }));
            return;
          }
          if (!body.area_of_interest) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Please select an area of interest.' }));
            return;
          }
        } else {
          // Long Form validation
          const email = (body.business_email || body.email || '').trim();
          const phone = (body.phone || body.phone_number || '').trim();
          const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
          if (!email || !emailRe.test(email)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'A valid business email address is required.' }));
            return;
          }
          const digits = phone.replace(/\D/g, '');
          if (!phone || digits.length < 7) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'A valid contact phone number is required (min 7 digits).' }));
            return;
          }
        }

        // Sanitize strings to prevent CSV/Spreadsheet formula injection
        const sanitize = (val) => {
          if (val === null || val === undefined) return '';
          let str = String(val).trim();
          if (!str) return '';
          if (str.length > 4000) str = str.substring(0, 4000);
          const first = str.charAt(0);
          if (['=', '+', '-', '@', '\t', '\r'].includes(first)) return "'" + str;
          return str;
        };

        const now = new Date();
        const yyyymmdd = now.toISOString().slice(0, 10).replace(/-/g, '');
        const randId = Math.floor(1000 + Math.random() * 9000);
        const enquiryId = `GN-${yyyymmdd}-${randId}`;
        const submittedAt = now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false });

        let businessEmail = sanitize(body.business_email || body.email || '');
        let phoneNumber = sanitize(body.phone || body.phone_number || '');
        if (formType === 'Short Form' && contact) {
          if (contact.includes('@')) {
            if (!businessEmail) businessEmail = sanitize(contact);
          } else {
            if (!phoneNumber) phoneNumber = sanitize(contact);
          }
        }

        const enquiryRecord = {
          enquiryId,
          submittedAt,
          formType: sanitize(formType),
          fullName: sanitize(fullName),
          businessEmail,
          companyName: sanitize(body.company_name || body.company || '—'),
          phoneNumber,
          location: sanitize(body.location || body.city || '—'),
          industry: sanitize(body.industry || '—'),
          areaOfInterest: sanitize(body.area_of_interest || body.interest || '—'),
          projectRequirements: sanitize(body.project_requirements || body.requirements || '—'),
          expectedTimeline: sanitize(body.timeline || body.expected_timeline || '—'),
          preferredContactMethod: sanitize(body.contact_method || body.preferred_contact_method || '—'),
          message: sanitize(body.message || '—'),
          consent: 'Granted',
          status: 'New',
        };

        // Persist to local JSON storage
        const dataDir = join(ROOT, 'data');
        const enquiriesFile = join(dataDir, 'enquiries.json');
        try {
          const { mkdir, writeFile } = await import('node:fs/promises');
          await mkdir(dataDir, { recursive: true });
          const raw = await readFile(enquiriesFile, 'utf8').catch(() => '[]');
          let list = [];
          try { list = JSON.parse(raw); } catch (e) { list = []; }
          list.push(enquiryRecord);
          await writeFile(enquiriesFile, JSON.stringify(list, null, 2), 'utf8');
        } catch (fsErr) {
          console.error('Error writing enquiry to data/enquiries.json:', fsErr);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Enquiry submitted successfully',
          enquiryId,
        }));
        return;
      }
    }

    let filePath = join(ROOT, path);

    let s = await stat(filePath).catch(() => null);
    if (s && s.isDirectory()) filePath = join(filePath, 'index.html');
    else if (!s) {
      // Allow /about instead of /about.html
      const withHtml = filePath + '.html';
      if (await stat(withHtml).catch(() => null)) filePath = withHtml;
      else {
        const notFoundPath = join(ROOT, '404.html');
        const notFoundData = await readFile(notFoundPath).catch(() => null);
        if (notFoundData) {
          res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(notFoundData);
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found: ' + path);
        }
        return;
      }
    }

    const data = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 Internal Server Error: ' + err.message);
  }
});

server.listen(PORT, () => {
  console.log(`GreenNext preview server running at http://localhost:${PORT}`);
});
