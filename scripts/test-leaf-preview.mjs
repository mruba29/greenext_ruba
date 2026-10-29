import fs from 'fs';

// Let's create an HTML preview for the leaf logo variations
const svgLeaf = (idSuffix = '1', size = 36) => `
<svg class="gn-leaf-svg" viewBox="0 0 36 36" width="${size}" height="${size}" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="GreenNext Leaf">
  <defs>
    <linearGradient id="gn-leaf-stroke-${idSuffix}" x1="6" y1="30" x2="30" y2="6" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#00FF66"/>
      <stop offset="60%" stop-color="#00FF66"/>
      <stop offset="100%" stop-color="#39FF14"/>
    </linearGradient>
    <linearGradient id="gn-leaf-fill-${idSuffix}" x1="6" y1="30" x2="30" y2="6" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#00FF66" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#39FF14" stop-opacity="0.04"/>
    </linearGradient>
    <filter id="gn-glow-${idSuffix}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="1.8" flood-color="#00FF66" flood-opacity="0.55"/>
    </filter>
  </defs>
  <!-- Main Leaf Outer Contour with subtle glow and translucent cybernetic fill -->
  <path d="M7 29 C5.5 23 6 15 13 8 C18 3 24 3.5 29 5 C29.5 10 29.5 17 24 23 C19 28.5 12 30 7 29 Z" 
        fill="url(#gn-leaf-fill-${idSuffix})" 
        stroke="url(#gn-leaf-stroke-${idSuffix})" 
        stroke-width="1.8" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        filter="url(#gn-glow-${idSuffix})"/>
  
  <!-- Cybernetic Neural/Central Spine -->
  <path d="M7 29 C11 25 16 19 23 10" 
        stroke="url(#gn-leaf-stroke-${idSuffix})" 
        stroke-width="1.6" 
        stroke-linecap="round"
        filter="url(#gn-glow-${idSuffix})"/>
  
  <!-- Circuit Vein 1: Top Right with Terminal Node -->
  <path d="M18 16 C21 15.5 24 14.5 26 13" 
        stroke="url(#gn-leaf-stroke-${idSuffix})" 
        stroke-width="1.3" 
        stroke-linecap="round"/>
  <circle cx="26" cy="13" r="1.3" fill="#FFFFFF" stroke="#00FF66" stroke-width="0.8"/>

  <!-- Circuit Vein 2: Center Left with Terminal Node -->
  <path d="M14 20 C11 19 9 17 8 14" 
        stroke="url(#gn-leaf-stroke-${idSuffix})" 
        stroke-width="1.3" 
        stroke-linecap="round"/>
  <circle cx="8" cy="14" r="1.3" fill="#FFFFFF" stroke="#00FF66" stroke-width="0.8"/>

  <!-- Circuit Vein 3: Lower Right with Terminal Node -->
  <path d="M11 24 C14 24.5 17 25 20 23.5" 
        stroke="url(#gn-leaf-stroke-${idSuffix})" 
        stroke-width="1.3" 
        stroke-linecap="round"/>
  <circle cx="20" cy="23.5" r="1.2" fill="#FFFFFF" stroke="#00FF66" stroke-width="0.8"/>

  <!-- Stem Base Accent -->
  <path d="M7 29 C5.5 31 4 32.5 3 33" 
        stroke="url(#gn-leaf-stroke-${idSuffix})" 
        stroke-width="1.5" 
        stroke-linecap="round"/>
</svg>
`;

const html = `<!DOCTYPE html>
<html>
<head>
<title>Leaf Logo Test</title>
<style>
  body {
    background: #0B1220;
    color: white;
    font-family: Montserrat, sans-serif;
    padding: 40px;
  }
  .test-row {
    display: flex;
    align-items: center;
    gap: 40px;
    margin-bottom: 40px;
  }
  .brand-logo {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    padding: 12px 20px;
    border-radius: 12px;
  }
  .bg-navy { background: #0B1220; border: 1px solid rgba(0,255,102,0.2); }
  .bg-black { background: #030705; border: 1px solid rgba(0,255,102,0.2); }
  .bg-trans { background: transparent; }
  .bg-light { background: #FFFFFF; color: #0B1220; }
  .brand-name {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #FFFFFF;
    line-height: 1.1;
    display: flex;
    flex-direction: column;
  }
  .brand-name span.next { color: #00FF66; }
  .brand-tagline {
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #AAB7CB;
    margin-top: 3px;
  }
</style>
</head>
<body>
  <h2>GreenNext Glowing Leaf Brand Identity Preview</h2>
  
  <div class="test-row">
    <div class="brand-logo bg-navy">
      ${svgLeaf('1', 40)}
      <div class="brand-name">
        <div>Green<span class="next">Next</span></div>
        <div class="brand-tagline">Powering Intelligence. Engineering Tomorrow.</div>
      </div>
    </div>

    <div class="brand-logo bg-black">
      ${svgLeaf('2', 40)}
      <div class="brand-name">
        <div>Green<span class="next">Next</span></div>
        <div class="brand-tagline">Powering Intelligence. Engineering Tomorrow.</div>
      </div>
    </div>
  </div>

  <div class="test-row">
    <h3>Favicon Sizes (32px, 24px, 16px):</h3>
    ${svgLeaf('3', 32)}
    ${svgLeaf('4', 24)}
    ${svgLeaf('5', 16)}
  </div>
</body>
</html>
`;

fs.writeFileSync('C:/Users/ruba2/.gemini/antigravity-ide/brain/5f0a0fc1-13e4-4a57-a532-c9b04ff05115/scratch/test-leaf.html', html);
console.log('Saved test-leaf.html');
