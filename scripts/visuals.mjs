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

export function systemArchitectureDiagram() {
  const steps = [
    {
      num: '01',
      title: 'Infrastructure & Sensors',
      desc: 'Power distribution meters, thermal probes, airflow sensors, PDU telemetry, and server BMC data streams.',
      icon: 'server',
      tags: ['80kW+ Racks', 'PDU Telemetry', 'Thermal Mesh']
    },
    {
      num: '02',
      title: 'Data Collection',
      desc: 'Ultra-reliable industrial sensor bus, regional edge gateways, and sub-second 250ms telemetry streaming.',
      icon: 'network',
      tags: ['250ms Stream', 'Edge Gateways', 'Sensor Bus']
    },
    {
      num: '03',
      title: 'Data Processing',
      desc: 'Multi-layer signal normalization, noise filtering, anomaly detection, and cross-domain event correlation.',
      icon: 'cpu',
      tags: ['Signal Filter', 'Noise Reduction', 'Event Correlation']
    },
    {
      num: '04',
      title: 'KPI Calculations & Analytics',
      desc: 'Real-time calculation of PUE, CER, WUE, CUE, availability, and predictive capacity runways.',
      icon: 'spark',
      tags: ['PUE / CUE / WUE', 'Predictive Runway', 'Thermal Curve']
    },
    {
      num: '05',
      title: 'Monitoring Dashboard',
      desc: 'Unified operations console, historical trend visualizers, and role-based engineering alert centers.',
      icon: 'database',
      tags: ['Single Pane', 'Role Alerts', 'Historical Trends']
    },
    {
      num: '06',
      title: 'Operational Decisions',
      desc: 'Closed-loop airflow adjustments, predictive dispatch alerts, workload balancing, and maintenance scheduling.',
      icon: 'shield',
      tags: ['Closed-Loop Action', 'Predictive Dispatch', 'Zero Downtime']
    }
  ];

  return `
  <div class="system-arch-wrapper reveal">
    <div class="system-arch-flow">
      ${steps.map((s, i) => `
        <div class="system-arch-node reveal reveal-delay-${(i % 3) + 1}">
          <div class="system-arch-node-top">
            <span class="system-arch-step-num">STAGE ${s.num}</span>
            <div class="system-arch-node-icon">${icon(s.icon)}</div>
          </div>
          <h3 class="system-arch-node-title">${s.title}</h3>
          <p class="system-arch-node-desc">${s.desc}</p>
          <div class="system-arch-node-tags">
            ${s.tags.map(t => `<span class="system-arch-tag">${t}</span>`).join('')}
          </div>
        </div>
        ${i < steps.length - 1 ? '<div class="system-arch-connector" aria-hidden="true"><span class="system-arch-arrow">&rarr;</span></div>' : ''}
      `).join('')}
    </div>
    <div class="system-arch-notice">
      <span>* Continuous closed-loop data architecture connecting edge telemetry to policy-governed facility optimization.</span>
    </div>
  </div>`;
}

export function dashboardMock() {
  const kpis = [
    {
      id: 'pue',
      name: 'Power Usage Effectiveness (PUE)',
      formula: 'Total Facility Energy / IT Equipment Energy',
      unit: 'Ratio',
      value: '1.18',
      target: '< 1.25',
      status: 'Optimal',
      icon: 'bolt',
      trend: '1.24 → 1.18',
    },
    {
      id: 'avail',
      name: 'Data Center Availability',
      formula: '((Total Time - Downtime) / Total Time) × 100',
      unit: '%',
      value: '99.999%',
      target: '≥ 99.999%',
      status: 'Tier-Grade',
      icon: 'shield',
      trend: 'Continuous 30D',
    },
    {
      id: 'util',
      name: 'IT Equipment Utilization',
      formula: '(Actual IT Load / Total Rated IT Capacity) × 100',
      unit: '%',
      value: '78.4%',
      target: '70% – 85%',
      status: 'Nominal',
      icon: 'server',
      trend: '72% → 78.4%',
    },
    {
      id: 'cer',
      name: 'Cooling Efficiency Ratio (CER)',
      formula: 'Cooling Output (kW thermal) / Cooling Electrical (kW)',
      unit: 'COP',
      value: '4.12',
      target: '> 3.5 COP',
      status: 'Optimal',
      icon: 'cpu',
      trend: '3.8 → 4.12',
    },
    {
      id: 'wue',
      name: 'Water Usage Effectiveness (WUE)',
      formula: 'Annual Water Consumption (Liters) / IT Energy (kWh)',
      unit: 'L/kWh',
      value: '0.08',
      target: '< 0.20 L/kWh',
      status: 'Optimal',
      icon: 'leaf',
      trend: '0.12 → 0.08',
    },
    {
      id: 'cue',
      name: 'Carbon Usage Effectiveness (CUE)',
      formula: 'Total CO2 Emissions (kg CO2eq) / IT Energy (kWh)',
      unit: 'kg CO2eq/kWh',
      value: '0.22',
      target: '< 0.35 kg/kWh',
      status: 'Optimal',
      icon: 'spark',
      trend: '0.28 → 0.22',
    },
    {
      id: 'ref',
      name: 'Renewable Energy Factor (REF)',
      formula: '(Renewable Energy Consumed / Total Facility Energy) × 100',
      unit: '%',
      value: '62.5%',
      target: '> 50%',
      status: 'Nominal',
      icon: 'bolt',
      trend: '52% → 62.5%',
    },
    {
      id: 'mttr',
      name: 'Mean Time to Repair (MTTR)',
      formula: 'Total Maintenance Duration / Number of Incidents',
      unit: 'Hours',
      value: '0.45 hrs',
      target: '< 1.0 hr',
      status: 'Optimal',
      icon: 'shield',
      trend: '0.62 → 0.45',
    },
    {
      id: 'cap',
      name: 'Capacity Utilization',
      formula: '(Active Allocated Capacity / Total Commissioned) × 100',
      unit: '%',
      value: '81.2%',
      target: '75% – 90%',
      status: 'Nominal',
      icon: 'database',
      trend: '76% → 81.2%',
    },
    {
      id: 'cost',
      name: 'Energy Cost per Workload',
      formula: 'Total Energy Expense (INR) / Total Workload Units',
      unit: '₹ / kFLOP-h',
      value: '₹0.042',
      target: 'Downward Trend',
      status: 'Optimal',
      icon: 'network',
      trend: '₹0.051 → ₹0.042',
    },
  ];

  return `
  <div class="dashboard-mock reveal reveal-scale">
    <div class="dashboard-mock-header">
      <div style="display:flex;align-items:center;gap:var(--space-2);">
        <span class="dashboard-mock-dot"></span>
        <span style="font-weight:700;color:#FFFFFF;letter-spacing:0.04em;text-transform:uppercase;font-size:11px;">GreenNext 10-KPI Telemetry Engine</span>
      </div>
      <div style="display:flex;align-items:center;gap:var(--space-2);">
        <span class="dashboard-demo-badge">DEMONSTRATION INTERFACE &bull; SIMULATED TELEMETRY</span>
      </div>
    </div>

    <div class="dashboard-kpis-grid">
      ${kpis.map(k => `
        <div class="dashboard-telemetry-card">
          <div class="dashboard-telemetry-top">
            <span class="dashboard-telemetry-icon">${icon(k.icon)}</span>
            <span class="dashboard-status-indicator">
              <span class="dashboard-status-dot dashboard-status-dot--good"></span>
              ${k.status}
            </span>
          </div>
          <div class="dashboard-telemetry-val" style="color:#00FF66;font-family:var(--font-family-mono);font-size:1.6rem;font-weight:700;">${k.value}</div>
          <div class="dashboard-telemetry-cat" style="font-size:12px;font-weight:600;color:#FFFFFF;margin-top:2px;">${k.name}</div>
          <div style="font-size:10px;color:#AAB7CB;margin-top:4px;font-family:var(--font-family-mono);line-height:1.3;">
            <strong style="color:#00FF66;">Target:</strong> ${k.target} &bull; <span style="color:#E8EDF5;">${k.trend}</span>
          </div>
          <div style="font-size:9px;color:rgba(170,183,203,0.7);margin-top:4px;line-height:1.2;font-style:italic;">
            Formula: ${k.formula}
          </div>
        </div>
      `).join('')}
    </div>

    <div class="dashboard-telemetry-footer" style="margin-top:var(--space-6);padding-top:var(--space-4);border-top:1px solid rgba(0,255,102,0.15);">
      <div class="dashboard-telemetry-spark-row" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--space-3);">
        <div style="flex:1;min-width:260px;">
          <div style="font-size:11px;color:#AAB7CB;margin-bottom:4px;">Multi-Facility Power Load &amp; Thermal Distribution (Simulated Dynamic Stream)</div>
          <svg viewBox="0 0 320 32" class="dashboard-spark" style="width:100%;height:28px;">
            <polyline points="0,24 30,18 60,20 90,10 120,14 150,8 180,12 210,6 240,10 270,5 300,8 320,6" fill="none" stroke="#00FF66" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div style="display:flex;gap:var(--space-2);">
          <a href="intelligence/index.html" class="btn btn-primary btn-sm"><span>Full Telemetry Center</span> &rarr;</a>
        </div>
      </div>
      <div class="dashboard-telemetry-disclaimer" style="margin-top:var(--space-3);font-size:10px;color:rgba(170,183,203,0.8);line-height:1.4;">
        * Notice: Telemetry parameters shown reflect simulated demonstration baselines for architectural scoping and evaluation. Live customer telemetry is ingested securely under enterprise service agreements.
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
          <circle cx="${s.cx}" cy="${s.cy}" r="8" fill="rgba(46, 204, 113, 0.22)"/>
          <circle cx="${s.cx}" cy="${s.cy}" r="4.5" class="locations-map-dot"/>
          <text x="${labelX}" y="${s.cy + 3}" text-anchor="${anchor}" class="locations-map-label">${p.name.toUpperCase()}</text>
        </g>`;
      }).join('')}
    </svg>
  </div>`;
}

/**
 * Tree of Thought (ToT) Framework Visual
 * Structured into 4 synergistic workflow layers: Roots, Trunk, Branches, Leaves.
 */
export function treeOfThoughtVisual() {
  const totLayers = [
    {
      level: 'LEAVES',
      badge: 'Layer 04 • Enterprise Applications & Regional Outcomes',
      title: 'Leaves — Regional Economic Impact & Accelerated Workloads',
      icon: 'spark',
      accent: '#2ECC71',
      desc: 'The flourishing summit where AI models and accelerated computing deliver real-world transformation across South India’s premier industrial, educational, and commercial sectors.',
      workflowSteps: [
        'Enterprise LLM Inference',
        'Smart Manufacturing IoT (Coimbatore)',
        'Clinical Diagnostic AI (Madurai)',
        'Academic HPC Simulations (Trichy)',
        'Maritime Port Logistics (Mangalore)'
      ],
      metrics: ['Sub-millisecond Latencies', '40% Lower Operational TCO', 'Verified Regional ESG Value']
    },
    {
      level: 'BRANCHES',
      badge: 'Layer 03 • Autonomous Intelligence & Telemetry Mesh',
      title: 'Branches — Operational AI, Predictive Telemetry & Automation Flows',
      icon: 'cpu',
      accent: '#27AE60',
      desc: 'The dynamic operational nervous system: continuously observes 50,000+ telemetry data points per facility, forecasts thermal gradients 20 minutes in advance, and automates closed-loop tuning.',
      workflowSteps: [
        '250ms Sensor Streaming',
        'Neural Thermal Balancing (NTOE)',
        'Dynamic Workload Steering',
        'Closed-Loop Valve Actuation',
        'Cryptographic Audit Log'
      ],
      metrics: ['20-Min Predictive Heat Alerts', 'Sub-second Event Correlation', 'Zero-Interruption Closed-Loop Tuning']
    },
    {
      level: 'TRUNK',
      badge: 'Layer 02 • Core Mission-Critical Facility & Compute',
      title: 'Trunk — Extreme-Density Tier-III/IV Physical Infrastructure',
      icon: 'server',
      accent: '#0A2540',
      desc: 'The unyielding structural pillar engineered for extreme compute densities (40kW to 80kW+ per rack), direct-to-chip liquid cooling loops, 2N power redundancy, and deterministic non-blocking fabrics.',
      workflowSteps: [
        '2N UPS Busway Feeds',
        'Direct-to-Chip Cold Plates',
        '800G Non-Blocking Fabric',
        'High-Density 40–80kW Cabinets',
        'Automated Power Transfer'
      ],
      metrics: ['99.95% Availability SLA', '80kW+ per Rack Headroom', 'Tier-III/IV Fault Tolerance']
    },
    {
      level: 'ROOTS',
      badge: 'Layer 01 • Ground & Renewable Energy Foundations',
      title: 'Roots — Sustainable Power, Microgrid Ingestion & Earth Loops',
      icon: 'leaf',
      accent: '#1E824C',
      desc: 'Deep integration into South India’s abundant green power: solar arrays in Madurai & Trichy, wind corridors in Coimbatore, zero-potable-water geo-thermal heat sinks, and dedicated dual HT substation feeds.',
      workflowSteps: [
        'Solar Microgrid Ingestion',
        'Regional Wind Generation',
        'Geo-Thermal Heat Sinks',
        'Dual Dedicated HT Feeds',
        'Real-Time Carbon Tracking'
      ],
      metrics: ['60% Carbon Footprint Reduction', '40% Energy Savings', 'PUE Baseline < 1.15']
    }
  ];

  return `
  <div class="tot-framework reveal">
    <div class="tot-framework-header">
      <div class="tot-framework-badge">
        <span class="tot-badge-dot"></span>
        <span>ARCHITECTURAL METHODOLOGY // TREE OF THOUGHT</span>
      </div>
      <h3 class="tot-framework-title">Four Synergistic Infrastructure Layers</h3>
      <p class="tot-framework-desc">
        How GreenNext grounds high-density AI computing in sustainable regional energy, orchestrates it with autonomous operations, and delivers verified enterprise value.
      </p>
    </div>

    <div class="tot-layers-stack">
      ${totLayers.map((layer, i) => `
        <div class="tot-layer-card tot-layer-card--${layer.level.toLowerCase()} reveal reveal-delay-${i + 1}">
          <div class="tot-layer-left">
            <div class="tot-level-tag">
              <span class="tot-level-icon">${icon(layer.icon)}</span>
              <span class="tot-level-name">${layer.level}</span>
            </div>
            <div class="tot-level-badge">${layer.badge}</div>
          </div>
          <div class="tot-layer-body">
            <h4 class="tot-layer-heading">${layer.title}</h4>
            <p class="tot-layer-desc">${layer.desc}</p>
            
            <div class="tot-workflow-container">
              <span class="tot-workflow-label">Workflow Layer:</span>
              <div class="tot-workflow-flow">
                ${layer.workflowSteps.map((step, sIdx) => `
                  <span class="tot-workflow-step">
                    <span class="tot-workflow-step-num">${sIdx + 1}</span>
                    <span>${step}</span>
                  </span>
                  ${sIdx < layer.workflowSteps.length - 1 ? '<span class="tot-workflow-arrow">&rarr;</span>' : ''}
                `).join('')}
              </div>
            </div>

            <div class="tot-metrics-pills">
              ${layer.metrics.map(m => `<span class="tot-metric-pill">✓ ${m}</span>`).join('')}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>`;
}

/**
 * Regional Industrial Impact Matrix Visual
 * Highlights Madurai = IT Growth, Coimbatore = Industry Hub, Trichy = Education, Mangalore = Trade.
 */
export function regionalImpactMatrixVisual() {
  const regions = [
    {
      city: 'Madurai',
      focus: 'IT Growth & Software Expansion Corridor',
      subtitle: 'Southern Technology Epicenter',
      icon: 'spark',
      tag: 'IT Growth Hub',
      desc: 'Madurai’s emerging technology parks, software development centers, and healthcare IT corridors demand scalable compute partitions and low-latency optical links to Chennai and Bangalore.',
      impactStat: '+38% Annual Tech Talent Expansion',
      sectors: ['Enterprise SaaS', 'Diagnostic Healthcare AI', 'Civic Digital Services']
    },
    {
      city: 'Coimbatore',
      focus: 'Premier Industrial & Smart Manufacturing Hub',
      subtitle: 'Advanced Automation Heartland',
      icon: 'factory',
      tag: 'Industrial Hub',
      desc: 'Coimbatore’s dense cluster of precision engineering, automotive manufacturing, and textile robotics requires ruggedized edge aggregation nodes and real-time computer vision inference.',
      impactStat: 'Zero Sensor Frame Loss Across Distributed Plants',
      sectors: ['Smart Manufacturing', 'Industrial Robotics', 'Predictive Maintenance']
    },
    {
      city: 'Trichy',
      focus: 'Central Education & Scientific Research Corridor',
      subtitle: 'Academic Supercomputing Crossroads',
      icon: 'graduation',
      tag: 'Education Hub',
      desc: 'Surrounded by premier universities and research institutes, Trichy provides shared accelerated computing pools, InfiniBand research fabrics, and regional disaster recovery replication.',
      impactStat: '3x Faster Academic Simulation Runs',
      sectors: ['Scientific Research', 'University HPC', 'Geographic DR Replication']
    },
    {
      city: 'Mangalore',
      focus: 'Coastal Trade & Maritime Connectivity Gateway',
      subtitle: 'International Commercial Port Corridor',
      icon: 'cart',
      tag: 'Trade & Maritime Hub',
      desc: 'Positioned at international shipping lanes and coastal subsea cable landings, Mangalore powers real-time maritime port automation, trade finance exchanges, and multi-tenant banking clouds.',
      impactStat: 'Sub-Millisecond Coastal Financial Routing',
      sectors: ['Maritime Port Logistics', 'Cross-Border Trade', 'Banking & Financial Clouds']
    }
  ];

  return `
  <div class="regional-impact-matrix reveal">
    <div class="regional-impact-grid">
      ${regions.map((reg, i) => `
        <div class="regional-impact-card reveal reveal-delay-${i + 1}">
          <div class="regional-impact-header">
            <div class="regional-impact-icon">${icon(reg.icon)}</div>
            <span class="regional-impact-tag">${reg.tag}</span>
          </div>
          <h3 class="regional-impact-city">${reg.city}</h3>
          <h4 class="regional-impact-focus">${reg.focus}</h4>
          <p class="regional-impact-desc">${reg.desc}</p>
          <div class="regional-impact-stat">
            <span class="regional-impact-stat-label">Regional Outcome:</span>
            <strong>${reg.impactStat}</strong>
          </div>
          <div class="regional-impact-sectors">
            ${reg.sectors.map(s => `<span class="regional-impact-sector-badge">${s}</span>`).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  </div>`;
}

export { icon };

