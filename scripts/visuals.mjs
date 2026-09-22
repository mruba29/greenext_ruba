// Original inline SVG/CSS illustrations used across the site. No photography —
// see project notes: real data-center photography wasn't available to license,
// so the premium visual layer is built entirely from vector shapes + gradients.
import { icon } from './icons.mjs';

export function curveDivider({ flip = false, fill = 'var(--color-bg)' } = {}) {
  return `
  <div class="curve-divider${flip ? ' curve-divider--flip' : ''}" aria-hidden="true">
    <svg viewBox="0 0 1440 80" preserveAspectRatio="none"><path d="M0 40 C 360 90 1080 -10 1440 40 L1440 80 L0 80 Z" fill="${fill}"/></svg>
  </div>`;
}

export function blobDecor(cls = '') {
  return `<div class="blob-decor ${cls}" aria-hidden="true"></div>`;
}

export function processFlow(steps, { id = 'flow' } = {}) {
  return `
  <div class="process-flow" id="${id}">
    ${steps.map((s, i) => `
      <div class="process-step reveal reveal-delay-${Math.min(i + 1, 4)}">
        <div class="process-step-icon">${icon(s.icon)}<span class="process-step-num">${i + 1}</span></div>
        <h4 class="process-step-title">${s.title}</h4>
        <p class="process-step-desc">${s.desc}</p>
      </div>
      ${i < steps.length - 1 ? '<div class="process-connector"><span class="process-connector-dot"></span></div>' : ''}
    `).join('')}
  </div>`;
}

export function flowDiagram(nodes, { direction = 'vertical' } = {}) {
  return `
  <div class="flow-diagram flow-diagram--${direction}">
    ${nodes.map((n, i) => `
      <div class="flow-node reveal reveal-delay-${Math.min(i + 1, 4)}">
        <div class="flow-node-icon">${icon(n.icon)}</div>
        <span class="flow-node-label">${n.label}</span>
      </div>
      ${i < nodes.length - 1 ? '<div class="flow-arrow"><span class="flow-arrow-dot"></span></div>' : ''}
    `).join('')}
  </div>`;
}

export function miniFlowHorizontal(nodes) {
  return `
  <div class="mini-flow">
    ${nodes.map((n, i) => `
      <div class="mini-flow-node reveal reveal-delay-${Math.min(i + 1, 4)}">
        <div class="mini-flow-icon">${icon(n.icon)}</div>
        <span class="mini-flow-label">${n.label}</span>
      </div>
      ${i < nodes.length - 1 ? '<span class="mini-flow-arrow">&rarr;</span>' : ''}
    `).join('')}
  </div>`;
}

export function dashboardMock() {
  const rings = [
    { label: 'Server Utilization', value: 72 },
    { label: 'Cooling Efficiency', value: 88 },
    { label: 'AI Optimization', value: 94 },
  ];
  const statuses = [
    { label: 'Network Health', state: 'good' },
    { label: 'Energy Consumption', state: 'good' },
    { label: 'Infrastructure Status', state: 'good' },
  ];
  return `
  <div class="dashboard-mock reveal reveal-scale">
    <div class="dashboard-mock-header">
      <span class="dashboard-mock-dot"></span> Infrastructure Monitoring &mdash; illustrative interface
    </div>
    <div class="dashboard-mock-grid">
      ${rings.map(r => `
        <div class="dashboard-ring-card">
          <div class="dashboard-ring" style="--val:${r.value}"><span>${r.value}%</span></div>
          <span class="dashboard-ring-label">${r.label}</span>
        </div>`).join('')}
      <div class="dashboard-spark-card">
        <svg viewBox="0 0 160 50" class="dashboard-spark">
          <polyline points="0,40 20,32 40,35 60,20 80,24 100,10 120,16 140,6 160,12" fill="none" stroke="#00C97A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="dashboard-ring-label">Network Throughput</span>
      </div>
      ${statuses.map(s => `
        <div class="dashboard-status-card">
          <span class="dashboard-status-dot dashboard-status-dot--${s.state}"></span>
          <span class="dashboard-ring-label">${s.label}</span>
        </div>`).join('')}
    </div>
  </div>`;
}

// Approximate relative positions only — a stylized decorative map, not a
// surveyed/geographic one. Coordinates are in a 0-100 space, scaled below.
const MAP_POSITIONS = {
  mangalore: { x: 10, y: 14, labelSide: 'right' },
  trichy: { x: 40, y: 42, labelSide: 'right' },
  coimbatore: { x: 18, y: 46, labelSide: 'right', featured: true },
  madurai: { x: 46, y: 68, labelSide: 'right' },
};

// Stylized organic landmass silhouette (not a real coastline) sized to
// comfortably enclose the four marker positions above once scaled.
const LAND_PATH = 'M 70 8 C 108 4 138 22 142 54 C 146 84 128 104 132 132 '
  + 'C 136 162 158 182 150 212 C 142 244 118 258 116 286 '
  + 'C 114 308 96 322 70 320 C 46 318 34 300 32 276 '
  + 'C 30 250 10 234 12 204 C 14 176 34 164 30 136 '
  + 'C 26 108 4 92 14 62 C 22 38 42 12 70 8 Z';

export function locationsMapVisual(locations) {
  const pts = locations.map(l => ({ ...l, ...MAP_POSITIONS[l.slug] }));
  const scale = (p) => ({ cx: p.x * 3, cy: p.y * 3.4 });
  const pathD = pts.map((p, i) => { const s = scale(p); return `${i === 0 ? 'M' : 'L'} ${s.cx} ${s.cy}`; }).join(' ');

  return `
  <div class="locations-map reveal reveal-scale">
    <svg viewBox="0 0 190 330" class="locations-map-svg">
      <path d="${LAND_PATH}" class="locations-map-land"/>
      <path d="M 15 60 Q 60 40 100 70" class="locations-map-decor-line"/>
      <path d="M 30 250 Q 80 270 130 240" class="locations-map-decor-line"/>
      <path d="${pathD}" fill="none" stroke="var(--color-primary)" stroke-width="1.4" stroke-dasharray="4 4" class="locations-map-path" opacity="0.4"/>
      ${pts.map(p => {
        const s = scale(p);
        const labelX = p.labelSide === 'left' ? s.cx - 12 : s.cx + 12;
        const anchor = p.labelSide === 'left' ? 'end' : 'start';
        return `
        <g class="locations-map-marker${p.featured ? ' locations-map-marker--featured' : ''}" data-city="${p.slug}">
          <circle cx="${s.cx}" cy="${s.cy}" r="11" class="locations-map-pulse"/>
          <circle cx="${s.cx}" cy="${s.cy}" r="9" fill="rgba(0,201,122,0.16)"/>
          <circle cx="${s.cx}" cy="${s.cy}" r="4.5" class="locations-map-dot"/>
          <text x="${labelX}" y="${s.cy + 3}" text-anchor="${anchor}" class="locations-map-label">${p.name.toUpperCase()}</text>
        </g>`;
      }).join('')}
    </svg>
  </div>`;
}

export { icon };
