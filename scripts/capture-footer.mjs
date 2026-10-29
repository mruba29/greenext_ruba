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

    await client.send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        try {
          sessionStorage.setItem('gn_welcome_shown', 'true');
        } catch(e) {}
      `
    });

    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    await client.send('Page.navigate', { url: 'http://localhost:3000/index.html' });
    await sleep(1300);

    // Capture Hero clean
    const heroShot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'branding_hero_clean_1440.png'), Buffer.from(heroShot.data, 'base64'));

    // Scroll to footer specifically
    await client.send('Runtime.evaluate', {
      expression: `
        var footer = document.querySelector('footer.site-footer');
        if (footer) footer.scrollIntoView({ behavior: 'instant', block: 'end' });
      `
    });
    await sleep(600);

    const footerShot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'branding_footer_clean_1440.png'), Buffer.from(footerShot.data, 'base64'));
    console.log('Saved clean hero and footer screenshots');

    client.close();
  } catch (err) {
    console.error(err);
  } finally {
    chromeProc.kill('SIGKILL');
  }
}

run();
