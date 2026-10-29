import fs from 'fs';

// Leaf Design 1: Dynamic Forward-Angled AI Leaf
const leaf1 = (size = 40) => `
<svg viewBox="0 0 36 36" width="${size}" height="${size}" fill="none" xmlns="http://www.w3.org/2000/svg" class="gn-leaf-icon">
  <defs>
    <linearGradient id="gn-grad-1" x1="6" y1="30" x2="30" y2="6" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#00FF66"/>
      <stop offset="100%" stop-color="#39FF14"/>
    </linearGradient>
    <filter id="gn-glow-1" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="1.5" flood-color="#00FF66" flood-opacity="0.6"/>
    </filter>
  </defs>
  <!-- Translucent leaf glow body -->
  <path d="M8 28 C5.5 21 6.5 13 14 7 C19 3 24.5 3.5 29 5 C29.5 11 29 18 24 23 C18.5 28.5 12.5 29.5 8 28 Z"
        fill="rgba(0, 255, 102, 0.08)"
        stroke="url(#gn-grad-1)"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
        filter="url(#gn-glow-1)"/>
  <!-- Central circuit spine -->
  <path d="M8 28 C12 24.5 17 19 24 9.5"
        stroke="url(#gn-grad-1)"
        stroke-width="1.6"
        stroke-linecap="round"
        filter="url(#gn-glow-1)"/>
  <!-- Cyber Vein 1 -->
  <path d="M18 16.5 L24.5 14" stroke="#00FF66" stroke-width="1.2" stroke-linecap="round"/>
  <circle cx="24.5" cy="14" r="1.3" fill="#FFFFFF" stroke="#00FF66" stroke-width="0.8"/>
  <!-- Cyber Vein 2 -->
  <path d="M14 21 L9 18" stroke="#00FF66" stroke-width="1.2" stroke-linecap="round"/>
  <circle cx="9" cy="18" r="1.3" fill="#FFFFFF" stroke="#00FF66" stroke-width="0.8"/>
  <!-- Cyber Vein 3 -->
  <path d="M11.5 24.5 L17.5 24" stroke="#00FF66" stroke-width="1.2" stroke-linecap="round"/>
  <circle cx="17.5" cy="24" r="1.1" fill="#FFFFFF" stroke="#00FF66" stroke-width="0.8"/>
  <!-- Stem -->
  <path d="M8 28 C6 30.5 4.5 32 3 33" stroke="url(#gn-grad-1)" stroke-width="1.6" stroke-linecap="round"/>
</svg>
`;

// Leaf Design 2: Upright Minimalist Geometric AI Leaf
const leaf2 = (size = 40) => `
<svg viewBox="0 0 36 36" width="${size}" height="${size}" fill="none" xmlns="http://www.w3.org/2000/svg" class="gn-leaf-icon">
  <defs>
    <linearGradient id="gn-grad-2" x1="18" y1="32" x2="18" y2="4" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#00FF66"/>
      <stop offset="100%" stop-color="#39FF14"/>
    </linearGradient>
    <filter id="gn-glow-2" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="1.5" flood-color="#00FF66" flood-opacity="0.6"/>
    </filter>
  </defs>
  <!-- Leaf Contour -->
  <path d="M18 4 C11 9 6.5 17 9.5 24.5 C11.5 28 15 30.5 18 31 C21 30.5 24.5 28 26.5 24.5 C29.5 17 25 9 18 4 Z"
        fill="rgba(0, 255, 102, 0.07)"
        stroke="url(#gn-grad-2)"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
        filter="url(#gn-glow-2)"/>
  <!-- Central Spine -->
  <path d="M18 31 L18 8"
        stroke="url(#gn-grad-2)"
        stroke-width="1.6"
        stroke-linecap="round"
        filter="url(#gn-glow-2)"/>
  <!-- Veins Left -->
  <path d="M18 24 L13 20" stroke="#00FF66" stroke-width="1.2" stroke-linecap="round"/>
  <circle cx="13" cy="20" r="1.2" fill="#FFFFFF" stroke="#00FF66" stroke-width="0.8"/>
  <path d="M18 17 L12.5 14" stroke="#00FF66" stroke-width="1.2" stroke-linecap="round"/>
  <circle cx="12.5" cy="14" r="1.2" fill="#FFFFFF" stroke="#00FF66" stroke-width="0.8"/>
  <!-- Veins Right -->
  <path d="M18 20.5 L23 16.5" stroke="#00FF66" stroke-width="1.2" stroke-linecap="round"/>
  <circle cx="23" cy="16.5" r="1.2" fill="#FFFFFF" stroke="#00FF66" stroke-width="0.8"/>
  <path d="M18 13.5 L23.5 10.5" stroke="#00FF66" stroke-width="1.2" stroke-linecap="round"/>
  <circle cx="23.5" cy="10.5" r="1.2" fill="#FFFFFF" stroke="#00FF66" stroke-width="0.8"/>
  <!-- Stem -->
  <path d="M18 31 L18 34" stroke="url(#gn-grad-2)" stroke-width="1.8" stroke-linecap="round"/>
</svg>
`;

// Leaf Design 3: Ultra-sleek Modern Diagonal Leaf (High-tech, aerodynamic, perfectly balanced)
const leaf3 = (size = 40) => `
<svg viewBox="0 0 36 36" width="${size}" height="${size}" fill="none" xmlns="http://www.w3.org/2000/svg" class="gn-leaf-icon">
  <defs>
    <linearGradient id="gn-grad-3" x1="4" y1="32" x2="32" y2="4" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#00FF66"/>
      <stop offset="100%" stop-color="#39FF14"/>
    </linearGradient>
    <filter id="gn-glow-3" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="1.6" flood-color="#00FF66" flood-opacity="0.55"/>
    </filter>
  </defs>
  <!-- Outer glowing leaf outline -->
  <path d="M7 29 C5 22 7 14 13 8 C18 3 24 3 29 4.5 C29.5 9.5 29.5 16 25 21.5 C19.5 27.5 13 29.5 7 29 Z"
        fill="rgba(0, 255, 102, 0.08)"
        stroke="url(#gn-grad-3)"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
        filter="url(#gn-glow-3)"/>
  <!-- Neural circuit spine running from stem to tip -->
  <path d="M7 29 C12 25 17 19.5 23 11"
        stroke="url(#gn-grad-3)"
        stroke-width="1.5"
        stroke-linecap="round"
        filter="url(#gn-glow-3)"/>
  <!-- Circuit node branches -->
  <path d="M17 17.5 L24 15" stroke="#00FF66" stroke-width="1.2" stroke-linecap="round"/>
  <circle cx="24" cy="15" r="1.3" fill="#FFFFFF" stroke="#00FF66" stroke-width="0.8"/>
  
  <path d="M13.5 21.5 L8.5 18.5" stroke="#00FF66" stroke-width="1.2" stroke-linecap="round"/>
  <circle cx="8.5" cy="18.5" r="1.3" fill="#FFFFFF" stroke="#00FF66" stroke-width="0.8"/>

  <path d="M10.5 25.5 L16.5 25" stroke="#00FF66" stroke-width="1.2" stroke-linecap="round"/>
  <circle cx="16.5" cy="25" r="1.1" fill="#FFFFFF" stroke="#00FF66" stroke-width="0.8"/>

  <!-- Glowing apex node -->
  <circle cx="29" cy="4.5" r="1.3" fill="#FFFFFF" stroke="#39FF14" stroke-width="0.8"/>
  
  <!-- Sleek base stem -->
  <path d="M7 29 C5 31 3.5 32.5 2.5 33.5" stroke="url(#gn-grad-3)" stroke-width="1.6" stroke-linecap="round"/>
</svg>
`;

const html = `<!DOCTYPE html>
<html>
<head>
<title>GreenNext Leaf Options</title>
<style>
  body {
    background: #0B1220;
    color: white;
    font-family: Montserrat, -apple-system, sans-serif;
    padding: 50px;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    margin-top: 30px;
  }
  .card {
    background: rgba(17, 24, 39, 0.7);
    border: 1px solid rgba(0, 255, 102, 0.2);
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .card h3 { margin-bottom: 20px; font-size: 16px; color: #AAB7CB; }
  .logo-box {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px;
    border-radius: 12px;
    width: 100%;
    margin-bottom: 16px;
  }
  .navy { background: #0B1220; border: 1px solid rgba(0, 255, 102, 0.15); }
  .black { background: #030705; border: 1px solid rgba(0, 255, 102, 0.15); }
  .trans { background: transparent; }
  .brand-text {
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.025em;
    color: #FFFFFF;
    line-height: 1.1;
  }
  .brand-text span { color: #00FF66; }
  .tagline {
    font-size: 8.5px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #AAB7CB;
    margin-top: 3px;
  }
</style>
</head>
<body>
  <h1>GreenNext Brand Identity — Glowing Leaf Variations</h1>
  <div class="grid">
    <div class="card">
      <h3>Option 1: Dynamic Angled Leaf</h3>
      <div class="logo-box navy">
        ${leaf1(38)}
        <div>
          <div class="brand-text">Green<span>Next</span></div>
          <div class="tagline">Powering Intelligence. Engineering Tomorrow.</div>
        </div>
      </div>
      <div class="logo-box black">
        ${leaf1(38)}
        <div>
          <div class="brand-text">Green<span>Next</span></div>
          <div class="tagline">Powering Intelligence. Engineering Tomorrow.</div>
        </div>
      </div>
      <div style="display:flex;gap:16px;align-items:center;margin-top:10px;">
        ${leaf1(32)}
        ${leaf1(24)}
        ${leaf1(16)}
      </div>
    </div>

    <div class="card">
      <h3>Option 2: Upright AI Circuit Leaf</h3>
      <div class="logo-box navy">
        ${leaf2(38)}
        <div>
          <div class="brand-text">Green<span>Next</span></div>
          <div class="tagline">Powering Intelligence. Engineering Tomorrow.</div>
        </div>
      </div>
      <div class="logo-box black">
        ${leaf2(38)}
        <div>
          <div class="brand-text">Green<span>Next</span></div>
          <div class="tagline">Powering Intelligence. Engineering Tomorrow.</div>
        </div>
      </div>
      <div style="display:flex;gap:16px;align-items:center;margin-top:10px;">
        ${leaf2(32)}
        ${leaf2(24)}
        ${leaf2(16)}
      </div>
    </div>

    <div class="card">
      <h3>Option 3: Aerodynamic Neural Leaf (Recommended)</h3>
      <div class="logo-box navy">
        ${leaf3(38)}
        <div>
          <div class="brand-text">Green<span>Next</span></div>
          <div class="tagline">Powering Intelligence. Engineering Tomorrow.</div>
        </div>
      </div>
      <div class="logo-box black">
        ${leaf3(38)}
        <div>
          <div class="brand-text">Green<span>Next</span></div>
          <div class="tagline">Powering Intelligence. Engineering Tomorrow.</div>
        </div>
      </div>
      <div style="display:flex;gap:16px;align-items:center;margin-top:10px;">
        ${leaf3(32)}
        ${leaf3(24)}
        ${leaf3(16)}
      </div>
    </div>
  </div>
</body>
</html>
`;

fs.writeFileSync('C:/Users/ruba2/.gemini/antigravity-ide/brain/5f0a0fc1-13e4-4a57-a532-c9b04ff05115/scratch/test-leaf-options.html', html);
console.log('Saved test-leaf-options.html');
