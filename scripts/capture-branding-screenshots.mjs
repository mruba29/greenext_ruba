import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\ruba2\\.gemini\\antigravity-ide\\brain\\5f0a0fc1-13e4-4a57-a532-c9b04ff05115';
const PORT = 9333;

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
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
    this.ws = new globalThis.WebSocket(this.wsUrl);
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

async function run() {
  console.log('Launching Headless Chrome for Clean Branding Verification...');
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--hide-scrollbars',
    '--window-size=1440,900'
  ], { detached: false });

  await sleep(1500);

  try {
    const list = await fetchJson(`http://127.0.0.1:${PORT}/json`);
    const target = list.find(t => t.type === 'page') || list[0];
    const client = new CdpClient(target.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('DOM.enable');

    // Pre-evaluate script to prevent automatic welcome popup during UI testing
    await client.send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        try {
          sessionStorage.setItem('gn_welcome_shown', 'true');
        } catch(e) {}
      `
    });

    // 1. Desktop Viewport (1440x900) - Header & Hero Clean
    console.log('Capturing Clean Desktop Header & Hero (1440x900)...');
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    await client.send('Page.navigate', { url: 'http://localhost:3000/index.html' });
    await sleep(900);
    const desktopShot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'branding_desktop_clean_1440.png'), Buffer.from(desktopShot.data, 'base64'));
    console.log('Saved branding_desktop_clean_1440.png');

    // 2. Tablet Viewport (820x1180) - iPad Air size
    console.log('Capturing Clean Tablet Header & Nav (820x1180)...');
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 820,
      height: 1180,
      deviceScaleFactor: 2,
      mobile: true
    });
    await sleep(400);
    const tabletShot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'branding_tablet_clean_820.png'), Buffer.from(tabletShot.data, 'base64'));
    console.log('Saved branding_tablet_clean_820.png');

    // 3. Mobile Viewport (390x844) - iPhone 14 size
    console.log('Capturing Clean Mobile Header & Nav (390x844)...');
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true
    });
    await sleep(400);
    const mobileShot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'branding_mobile_clean_390.png'), Buffer.from(mobileShot.data, 'base64'));
    console.log('Saved branding_mobile_clean_390.png');

    // 4. Footer Viewport (Scroll to bottom)
    console.log('Capturing Clean Footer with Brand Logo...');
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    await client.send('Runtime.evaluate', { expression: 'window.scrollTo(0, document.body.scrollHeight)' });
    await sleep(500);
    const footerShot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'branding_footer_clean_1440.png'), Buffer.from(footerShot.data, 'base64'));
    console.log('Saved branding_footer_clean_1440.png');

    client.close();
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    chromeProc.kill('SIGKILL');
  }
}

run();
