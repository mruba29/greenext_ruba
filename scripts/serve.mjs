// Minimal static file server for local preview. No external dependencies.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Load local environment variables (.env.local or .env)
try { process.loadEnvFile('.env.local'); } catch (e) {
  try { process.loadEnvFile('.env'); } catch (e2) {}
}

import enquiryHandler from '../api/enquiry.js';
import jiraHandler from '../api/jira.js';
import analyticsHandler from '../api/analytics.js';

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
    // -------------------------------------------------------------------------
    // API ROUTE: /api/analytics (Analytics Event Batch Receiver & Intelligence)
    // -------------------------------------------------------------------------
    if (path === '/api/analytics') {
      res.status = (code) => { res.statusCode = code; return res; };
      res.json = (data) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data, null, 2));
      };

      if (req.method === 'POST') {
        let bodyRaw = '';
        for await (const chunk of req) { bodyRaw += chunk; }
        try {
          req.body = JSON.parse(bodyRaw);
        } catch (e) {
          req.body = {};
        }
      }

      // Parse query string for GET requests
      const urlObj = new URL(req.url, `http://localhost:${PORT}`);
      req.query = Object.fromEntries(urlObj.searchParams.entries());

      await analyticsHandler(req, res);
      return;
    }

    // -------------------------------------------------------------------------
    // API ROUTE: /api/jira (Diagnostics & Health Check)
    // -------------------------------------------------------------------------
    if (path === '/api/jira') {
      res.status = (code) => { res.statusCode = code; return res; };
      res.json = (data) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data, null, 2));
      };
      await jiraHandler(req, res);
      return;
    }

    // -------------------------------------------------------------------------
    // API ROUTE: /api/enquiry (Google Sheets Storage & Jira Issue Automation)
    // -------------------------------------------------------------------------
    if (path === '/api/enquiry') {
      res.status = (code) => { res.statusCode = code; return res; };
      res.json = (data) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data, null, 2));
      };

      if (req.method === 'POST') {
        let bodyRaw = '';
        for await (const chunk of req) {
          bodyRaw += chunk;
        }
        try {
          req.body = JSON.parse(bodyRaw);
        } catch (e) {
          req.body = {};
        }
      }

      await enquiryHandler(req, res);
      return;
    }

    let filePath = join(ROOT, path);
    if (path === '/dashboard') filePath = join(ROOT, 'analytics.html');

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
