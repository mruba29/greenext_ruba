// Visual layer for GreenNext "Nexus Intelligence"
// Vector architectures, telemetry dashboards, maps, and workflow diagrams.
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
      <div class="process-step reveal reveal-delay-${Math.min(i + 1, 5)}">
        <div class="process-step-icon">${icon(s.icon || 'spark')}<span class="process-step-num">${i + 1}</span></div>
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
      <div class="mini-flow-node reveal reveal-delay-${Math.min(i + 1, 5)}">
        <div class="mini-flow-icon">${icon(n.icon)}</div>
        <span class="mini-flow-label">${n.label}</span>
      </div>
      ${i < nodes.length - 1 ? '<span class="mini-flow-arrow">&rarr;</span>' : ''}
    `).join('')}
  </div>`;
}

export function architectureDiagram() {
  const layers = [
    {
      num: '01',
      title: 'Compute & Accelerated Storage',
      desc: 'High-density GPU/CPU node topologies, NVMe-over-Fabrics arrays, and dedicated AI cluster fabrics.',
      icon: 'server',
      tags: ['80kW+ Density', 'NVMe-oF Fabric', 'Accelerator Topology'],
    },
    {
      num: '02',
      title: 'Networking & Connectivity',
      desc: 'Non-blocking spine-leaf network architecture, ultra-low jitter routing, and carrier-neutral optical backbones.',
      icon: 'network',
      tags: ['Sub-ms Latency', 'Carrier-Neutral', 'Redundant Dark Fiber'],
    },
    {
      num: '03',
      title: 'Monitoring & Observability',
      desc: 'Continuous real-time telemetry streaming from PDU, rack thermal sensors, and optical transceivers.',
      icon: 'cpu',
      tags: ['Sub-second Telemetry', 'Sensor Mesh', 'Thermal Mapping'],
    },
    {
      num: '04',
      title: 'Automation & Orchestration',
      desc: 'Policy-governed closed-loop management, dynamic cooling loop balancing, and programmatic failovers.',
      icon: 'spark',
      tags: ['Closed-Loop Tuning', 'Automated Containment', 'Failover Scripts'],
    },
    {
      num: '05',
      title: 'Data Platforms & Analytics',
      desc: 'Operational data pipelines collecting multi-facility performance baselines for longitudinal efficiency gains.',
      icon: 'database',
      tags: ['Long-Term Baselines', 'Efficiency Auditing', 'Multi-Facility Sync'],
    },
    {
      num: '06',
      title: 'Security-Conscious Design',
      desc: 'Multi-perimeter biometric access controls, isolated out-of-band management fabrics, and continuous compliance.',
      icon: 'shield',
      tags: ['Zero-Trust Architecture', 'Biometric Perimeter', 'Air-Gapped OOBM'],
    },
  ];

  return `
  <div class="arch-topology-wrapper reveal">
    <div class="arch-topology-grid">
      ${layers.map((layer, i) => `
        <div class="arch-card reveal reveal-delay-${(i % 3) + 1}">
          <div class="arch-card-header">
            <span class="arch-card-num">${layer.num}</span>
            <div class="arch-card-icon">${icon(layer.icon)}</div>
          </div>
          <h3 class="arch-card-title">${layer.title}</h3>
          <p class="arch-card-desc">${layer.desc}</p>
          <div class="arch-card-tags">
            ${layer.tags.map(t => `<span class="arch-card-tag">${t}</span>`).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  </div>`;
}

export function dashboardMock() {
  const telemetry = [
    {
      category: 'Infrastructure Health',
      value: '99.99%',
      sub: 'All Nodes Nominal',
      status: 'nominal',
      icon: 'shield',
    },
    {
      category: 'Resource Utilization',
      value: '78.4%',
      sub: 'Optimal Cluster Load',
      status: 'nominal',
      icon: 'server',
    },
    {
      category: 'Energy Monitoring',
      value: '1.14 PUE',
      sub: 'High Efficiency Baseline',
      status: 'nominal',
      icon: 'bolt',
    },
    {
      category: 'Network Performance',
      value: '0.42 ms',
      sub: 'Sub-ms Cluster Transit',
      status: 'nominal',
      icon: 'network',
    },
    {
      category: 'Operational Events',
      value: 'Zero Breaches',
      sub: '24/7 Monitored Stream',
      status: 'nominal',
      icon: 'cpu',
    },
    {
      category: 'Optimization Status',
      value: '+14.2%',
      sub: 'Containment Tuned',
      status: 'nominal',
      icon: 'spark',
    },
  ];

  return `
  <div class="dashboard-mock reveal reveal-scale">
    <div class="dashboard-mock-header">
      <div style="display:flex;align-items:center;gap:var(--space-2);">
        <span class="dashboard-mock-dot"></span>
        <span style="font-weight:700;color:#FFFFFF;letter-spacing:0.04em;text-transform:uppercase;font-size:11px;">Nexus Telemetry Console</span>
      </div>
      <span class="dashboard-demo-badge">SAMPLE DATA &bull; DEMONSTRATION INTERFACE</span>
    </div>

    <div class="dashboard-mock-grid">
      ${telemetry.map(t => `
        <div class="dashboard-telemetry-card">
          <div class="dashboard-telemetry-top">
            <span class="dashboard-telemetry-icon">${icon(t.icon)}</span>
            <span class="dashboard-status-indicator"><span class="dashboard-status-dot dashboard-status-dot--good"></span> Nominal</span>
          </div>
          <div class="dashboard-telemetry-val">${t.value}</div>
          <div class="dashboard-telemetry-cat">${t.category}</div>
          <div class="dashboard-telemetry-sub">${t.sub}</div>
        </div>
      `).join('')}
    </div>

    <div class="dashboard-telemetry-footer">
      <div class="dashboard-telemetry-spark-row">
        <div style="flex:1;">
          <div style="font-size:11px;color:var(--color-cool-grey);margin-bottom:4px;">Dynamic Interconnect Load &amp; Thermal Distribution (Simulated Telemetry Stream)</div>
          <svg viewBox="0 0 320 40" class="dashboard-spark" style="width:100%;height:32px;">
            <polyline points="0,30 30,24 60,26 90,14 120,18 150,10 180,14 210,8 240,12 270,6 300,10 320,8" fill="none" stroke="#00D4FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      <div class="dashboard-telemetry-disclaimer">
        * Displayed telemetry reflects simulated operational monitoring parameters for demonstration and architectural scoping purposes.
      </div>
    </div>
  </div>`;
}

// Map positions
const MAP_POSITIONS = {
  mangalore: { x: 10, y: 14, labelSide: 'right' },
  trichy: { x: 40, y: 42, labelSide: 'right' },
  coimbatore: { x: 18, y: 46, labelSide: 'right', featured: true },
  madurai: { x: 46, y: 68, labelSide: 'right' },
};

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
      <path d="${pathD}" fill="none" stroke="#00D4FF" stroke-width="1.6" stroke-dasharray="4 4" class="locations-map-path" opacity="0.65"/>
      ${pts.map(p => {
        const s = scale(p);
        const labelX = p.labelSide === 'left' ? s.cx - 12 : s.cx + 12;
        const anchor = p.labelSide === 'left' ? 'end' : 'start';
        return `
        <g class="locations-map-marker${p.featured ? ' locations-map-marker--featured' : ''}" data-city="${p.slug}">
          <circle cx="${s.cx}" cy="${s.cy}" r="12" class="locations-map-pulse"/>
          <circle cx="${s.cx}" cy="${s.cy}" r="8" fill="rgba(0, 212, 255, 0.22)"/>
          <circle cx="${s.cx}" cy="${s.cy}" r="4.5" class="locations-map-dot"/>
          <text x="${labelX}" y="${s.cy + 3}" text-anchor="${anchor}" class="locations-map-label">${p.name.toUpperCase()}</text>
        </g>`;
      }).join('')}
    </svg>
  </div>`;
}

export { icon };
