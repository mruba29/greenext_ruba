import { readFileSync, writeFileSync } from 'node:fs';

const md = readFileSync('GREENNEXT_WEB_ANALYTICS_PERFORMANCE_REPORT.md', 'utf8');

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GreenNext — Web Analytics & Performance Audit Report</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #00C97A;
      --bg: #07150E;
      --surface: #0B2117;
      --text: #F1F7F4;
      --muted: #8AA497;
      --border: rgba(0, 201, 122, 0.2);
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #070D14;
      color: #E2E8F0;
      margin: 0;
      padding: 40px 20px;
      line-height: 1.6;
    }
    .report-card {
      max-width: 960px;
      margin: 0 auto;
      background: #0F172A;
      border: 1px solid #1E293B;
      border-radius: 16px;
      padding: 48px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
    }
    .header-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #00C97A;
      padding-bottom: 24px;
      margin-bottom: 32px;
    }
    .brand-title {
      font-family: 'Outfit', sans-serif;
      font-size: 1.8rem;
      font-weight: 800;
      color: #FFFFFF;
      margin: 0;
    }
    .brand-title span {
      color: #00C97A;
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 700;
      background: rgba(0, 201, 122, 0.15);
      color: #00C97A;
      border: 1px solid rgba(0, 201, 122, 0.3);
    }
    .report-body {
      white-space: pre-wrap;
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 0.95rem;
      line-height: 1.65;
      color: #CBD5E1;
    }
    .btn-pdf {
      position: fixed;
      bottom: 28px;
      right: 28px;
      background: #00C97A;
      color: #07150E;
      font-weight: 800;
      font-size: 1rem;
      border: none;
      border-radius: 9999px;
      padding: 14px 28px;
      cursor: pointer;
      box-shadow: 0 10px 25px rgba(0, 201, 122, 0.4);
      display: flex;
      align-items: center;
      gap: 10px;
      z-index: 1000;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn-pdf:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 30px rgba(0, 201, 122, 0.6);
    }
    @media print {
      body {
        background: #FFFFFF;
        color: #000000;
        padding: 0;
      }
      .report-card {
        box-shadow: none;
        border: none;
        max-width: 100%;
        padding: 16px;
      }
      .btn-pdf {
        display: none;
      }
      .report-body {
        color: #000000;
      }
    }
  </style>
</head>
<body>
  <button class="btn-pdf" onclick="window.print()">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
    Download as PDF (Print)
  </button>

  <div class="report-card">
    <div class="header-bar">
      <div>
        <h1 class="brand-title">Green<span>Next</span></h1>
        <div style="font-size: 0.85rem; color: #94A3B8; margin-top: 4px;">Web Analytics &amp; Performance Audit Report</div>
      </div>
      <div class="badge">Official Audit Document</div>
    </div>
    <div class="report-body">${escapeHtml(md)}</div>
  </div>
</body>
</html>
`;

writeFileSync('GREENNEXT_WEB_ANALYTICS_PERFORMANCE_REPORT.html', html, 'utf8');
console.log('Report HTML generated at GREENNEXT_WEB_ANALYTICS_PERFORMANCE_REPORT.html');
