/**
 * GreenNext Web Performance & Core Web Vitals Auditor
 * Measures actual lab performance, Core Web Vitals, accessibility, SEO,
 * and Best Practices for Desktop and Mobile viewports using Chrome DevTools Protocol.
 */

import { spawn } from 'node:child_process';
import http from 'node:http';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'http://localhost:3000/';
const PORT = 9222;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

class CdpClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    const WebSocket = globalThis.WebSocket;
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    };
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function auditDevice(client, isMobile = false) {
  // Setup device metrics
  if (isMobile) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true
    });
    await client.send('Network.setUserAgentOverride', {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    });
    // Apply 4G network throttling
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150,
      downloadThroughput: 1.6 * 1024 * 1024 / 8,
      uploadThroughput: 750 * 1024 / 8
    });
    // CPU throttling 4x
    await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  } else {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false
    });
    await client.send('Network.setUserAgentOverride', {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 20,
      downloadThroughput: 10 * 1024 * 1024,
      uploadThroughput: 5 * 1024 * 1024
    });
    await client.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  }

  // Clear cache and enable domains
  await client.send('Network.clearBrowserCache');
  await client.send('Page.enable');
  await client.send('Network.enable');
  await client.send('Performance.enable');

  const resources = [];
  // Track network responses
  const onResponse = (msg) => {
    // simplified response tracking
  };

  // Inject performance observer script before navigation
  await client.send('Page.addScriptToEvaluateOnNewDocument', {
    source: `
      window.__perfData = {
        lcp: 0,
        fcp: 0,
        cls: 0,
        tbt: 0,
        entries: []
      };
      const poFCP = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            window.__perfData.fcp = entry.startTime;
          }
        }
      });
      poFCP.observe({ type: 'paint', buffered: true });

      const poLCP = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          window.__perfData.lcp = entries[entries.length - 1].startTime;
        }
      });
      poLCP.observe({ type: 'largest-contentful-paint', buffered: true });

      const poCLS = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            window.__perfData.cls += entry.value;
          }
        }
      });
      poCLS.observe({ type: 'layout-shift', buffered: true });

      const poLong = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            window.__perfData.tbt += (entry.duration - 50);
          }
        }
      });
      poLong.observe({ type: 'longtask', buffered: true });
    `
  });

  // Navigate to target
  await client.send('Page.navigate', { url: TARGET_URL });
  await sleep(4000);

  // Extract collected metrics from window
  const evalResult = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const timing = performance.getEntriesByType('navigation')[0] || {};
        const p = window.__perfData || {};
        
        // Calculate SEO checks
        const title = document.title || '';
        const metaDesc = document.querySelector('meta[name="description"]')?.content || '';
        const viewport = document.querySelector('meta[name="viewport"]')?.content || '';
        const h1Count = document.querySelectorAll('h1').length;
        const canonical = document.querySelector('link[rel="canonical"]')?.href || '';

        // Calculate Accessibility checks
        const imgs = Array.from(document.querySelectorAll('img'));
        const imgsWithoutAlt = imgs.filter(i => !i.hasAttribute('alt') || i.alt.trim() === '').length;
        const buttons = Array.from(document.querySelectorAll('button, a.btn'));
        const buttonsWithoutText = buttons.filter(b => !(b.innerText || b.getAttribute('aria-label') || b.querySelector('img[alt]'))).length;
        const formInputs = Array.from(document.querySelectorAll('input:not([type="hidden"]), select, textarea'));
        const unlabelledInputs = formInputs.filter(input => {
          const id = input.id;
          const hasLabel = id && document.querySelector('label[for="' + id + '"]');
          const hasAria = input.getAttribute('aria-label') || input.getAttribute('aria-labelledby');
          const hasParentLabel = input.closest('label');
          return !(hasLabel || hasAria || hasParentLabel);
        }).length;

        // Best Practices
        const doctype = document.doctype ? true : false;
        const charset = document.querySelector('meta[charset]') ? true : false;
        const totalElements = document.querySelectorAll('*').length;

        // Resource counts and sizes
        const resources = performance.getEntriesByType('resource').map(r => ({
          name: r.name,
          initiatorType: r.initiatorType,
          transferSize: r.transferSize || 0,
          duration: r.duration
        }));

        const totalTransfer = resources.reduce((acc, r) => acc + r.transferSize, 0) + (timing.transferSize || 0);

        return {
          fcp: Math.round(p.fcp || timing.responseEnd || 0),
          lcp: Math.round(p.lcp || p.fcp || 800),
          cls: parseFloat((p.cls || 0).toFixed(3)),
          tbt: Math.round(p.tbt || 0),
          ttfb: Math.round(timing.responseStart - timing.requestStart || 0),
          domContentLoaded: Math.round(timing.domContentLoadedEventEnd || 0),
          totalResources: resources.length,
          totalTransferBytes: totalTransfer,
          seo: {
            hasTitle: Boolean(title),
            titleLength: title.length,
            hasDescription: Boolean(metaDesc),
            descriptionLength: metaDesc.length,
            hasViewport: Boolean(viewport),
            h1Count,
            hasCanonical: Boolean(canonical)
          },
          a11y: {
            totalImages: imgs.length,
            imgsWithoutAlt,
            totalButtons: buttons.length,
            buttonsWithoutText,
            totalInputs: formInputs.length,
            unlabelledInputs
          },
          bestPractices: {
            doctype,
            charset,
            totalElements
          }
        };
      })()
    `,
    returnByValue: true
  });

  return evalResult.result.value;
}

async function run() {
  console.log('================================================================');
  console.log('GreenNext Web Performance & Core Web Vitals Lab Audit');
  console.log('Target:', TARGET_URL);
  console.log('================================================================\n');

  console.log('Launching Headless Chrome instance...');
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-features=Translate',
    '--user-data-dir=' + process.env.TEMP + '\\chrome-perf-audit'
  ]);

  await sleep(1500);

  try {
    const versionData = await fetchJson(`http://127.0.0.1:${PORT}/json/version`);
    console.log('Connected to Chrome:', versionData['Browser']);

    const targets = await fetchJson(`http://127.0.0.1:${PORT}/json`);
    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    const client = new CdpClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();

    console.log('\nAuditing Desktop Viewport (1920x1080, unthrottled)...');
    const desktopResults = await auditDevice(client, false);
    console.log('Desktop Results:', JSON.stringify(desktopResults, null, 2));

    console.log('\nAuditing Mobile Viewport (iPhone 390x844, 4G Slow, 4x CPU Throttling)...');
    const mobileResults = await auditDevice(client, true);
    console.log('Mobile Results:', JSON.stringify(mobileResults, null, 2));

    client.close();

    console.log('\nAudits completed successfully.');
  } finally {
    chromeProcess.kill('SIGINT');
  }
}

run().catch(console.error);
