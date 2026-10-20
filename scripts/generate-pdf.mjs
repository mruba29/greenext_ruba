import { spawn } from 'node:child_process';
import http from 'node:http';
import { writeFileSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const HTML_FILE = resolve(process.cwd(), 'GREENNEXT_WEB_ANALYTICS_PERFORMANCE_REPORT.html');
const OUTPUT_PDF = resolve(process.cwd(), 'GREENNEXT_WEB_ANALYTICS_PERFORMANCE_REPORT.pdf');
const DESKTOP_PDF = 'C:\\Users\\ruba2\\OneDrive\\Documents\\Desktop\\GREENNEXT_WEB_ANALYTICS_PERFORMANCE_REPORT.pdf';
const PORT = 9333;

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function fetchJson(url) {
  return new Promise((res, rej) => {
    http.get(url, (r) => {
      let data = '';
      r.on('data', chunk => data += chunk);
      r.on('end', () => {
        try { res(JSON.parse(data)); } catch (e) { rej(e); }
      });
    }).on('error', rej);
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
    await new Promise((res, rej) => {
      this.ws.onopen = res;
      this.ws.onerror = rej;
    });

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { res, rej } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) rej(new Error(msg.error.message));
        else res(msg.result);
      }
    };
  }

  send(method, params = {}) {
    return new Promise((res, rej) => {
      const id = this.id++;
      this.callbacks.set(id, { res, rej });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function run() {
  console.log('Launching Headless Chrome for PDF export...');
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    '--disable-gpu',
    `--remote-debugging-port=${PORT}`,
    '--no-first-run',
    '--no-default-browser-check'
  ], { stdio: 'ignore' });

  try {
    await sleep(2000);
    const targets = await fetchJson(`http://127.0.0.1:${PORT}/json/list`);
    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    const client = new CdpClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    const fileUrl = 'file:///' + HTML_FILE.replace(/\\/g, '/');
    console.log('Navigating to:', fileUrl);
    await client.send('Page.navigate', { url: fileUrl });
    await sleep(1500);

    console.log('Generating PDF via Chrome CDP Page.printToPDF...');
    const pdfResult = await client.send('Page.printToPDF', {
      printBackground: true,
      paperWidth: 8.27,  // A4 inches
      paperHeight: 11.69,
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
      preferCSSPageSize: true
    });

    const buffer = Buffer.from(pdfResult.data, 'base64');
    writeFileSync(OUTPUT_PDF, buffer);
    console.log(`PDF saved in project: ${OUTPUT_PDF} (${buffer.length} bytes)`);

    try {
      copyFileSync(OUTPUT_PDF, DESKTOP_PDF);
      console.log(`PDF also copied directly to Desktop: ${DESKTOP_PDF}`);
    } catch (e) {
      console.warn('Could not copy to Desktop directly:', e.message);
    }

    client.close();
  } finally {
    chromeProcess.kill('SIGKILL');
  }
}

run().catch(err => {
  console.error('PDF generation error:', err);
  process.exit(1);
});
