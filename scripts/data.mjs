// Central content/data registry for GreenNext "Nexus Intelligence"
// Powering Intelligence. Engineering Tomorrow.

export const capabilities = [
  {
    slug: 'ai-infrastructure',
    name: 'AI Infrastructure',
    icon: 'server',
    img: 'assets/img/circuit-board.webp',
    featured: true,
    cardDesc: 'Purpose-engineered compute clusters, high-bandwidth interconnects, and dedicated thermal headroom for AI training and inference.',
    eyebrow: 'AI-READY COMPUTING',
    headline: 'High-Density AI Infrastructure Built for Real Workloads',
    description: 'GreenNext designs accelerated infrastructure foundations built around the distinct power, thermal, and interconnect demands of modern machine learning clusters.',
    heroPrimary: { text: 'Discuss AI Infrastructure', href: '#enquiry' },
    formBucket: 'general',
    features: [
      { icon: 'server', title: 'Accelerated Node Architecture', desc: 'Rack architectures engineered to handle 40kW to 80kW+ per enclosure without thermal degradation.' },
      { icon: 'network', title: 'Deterministic Interconnect', desc: 'Ultra-low latency, non-blocking fabric backbones ensuring synchronization across distributed nodes.' },
      { icon: 'shield', title: 'Workload Reliability', desc: 'Multi-layer electrical redundancy and active thermal balancing safeguarding long-running model runs.' },
    ],
  },
  {
    slug: 'data-center-solutions',
    name: 'Data Center Engineering',
    icon: 'database',
    img: 'assets/img/server-room.webp',
    featured: true,
    cardDesc: 'Comprehensive facility master planning, precision power topologies, advanced cooling containment, and operational resilience.',
    eyebrow: 'DATA CENTER ENGINEERING',
    headline: 'Mission-Critical Facilities Engineered for Enterprise Density',
    description: 'GreenNext delivers end-to-end data center engineering—from capacity planning and structural design to precision thermal management and high-uptime operations.',
    heroPrimary: { text: 'Explore Facility Engineering', href: '#enquiry' },
    formBucket: 'data-center',
    features: [
      { icon: 'database', title: 'Facility Master Planning', desc: 'Modular architectural blueprints balancing spatial density, future expansion, and structural integrity.' },
      { icon: 'bolt', title: 'Power Topology Design', desc: 'Dual-feed electrical distribution, high-efficiency UPS arrays, and clean power conditioning.' },
      { icon: 'shield', title: 'Tier-Grade Availability', desc: 'Fault-tolerant concurrent maintainability engineered to support 24/7 mission-critical operations.' },
    ],
  },
  {
    slug: 'intelligent-automation',
    name: 'Intelligent Operations',
    icon: 'cpu',
    img: 'assets/img/control-room.webp',
    featured: true,
    cardDesc: 'Continuous telemetry capture, multi-layer event correlation, and data-driven operational decision support across all physical layers.',
    eyebrow: 'INTELLIGENT OPERATIONS',
    headline: 'Unified Infrastructure Telemetry & Operational Visibility',
    description: 'Transform raw data center signals into actionable operational visibility with continuous multi-sensor telemetry, anomaly detection, and automated controls.',
    heroPrimary: { text: 'Explore Intelligent Operations', href: '#enquiry' },
    formBucket: 'general',
    features: [
      { icon: 'cpu', title: 'Real-Time Telemetry Mesh', desc: 'Sub-second sensor streaming capturing power, thermal distribution, and air velocity across every rack.' },
      { icon: 'spark', title: 'Cross-Domain Correlation', desc: 'Identify root-cause linkages between compute workload bursts and localized thermal rise in real time.' },
      { icon: 'shield', title: 'Closed-Loop Optimization', desc: 'Trigger verified corrective cooling and workload rebalancing within policy-governed safety margins.' },
    ],
  },
  {
    slug: 'energy-efficiency',
    name: 'Energy-Aware Infrastructure',
    icon: 'bolt',
    img: 'assets/img/solar-panels.webp',
    featured: true,
    cardDesc: 'Granular power analytics, intelligent aisle containment, variable liquid loops, and carbon-conscious planning to reduce PUE.',
    eyebrow: 'ENERGY-AWARE INFRASTRUCTURE',
    headline: 'Resource Efficiency & Cooling Optimization at Scale',
    description: 'GreenNext engineers sustainable digital infrastructure where computational throughput and environmental stewardship advance in tandem.',
    heroPrimary: { text: 'Optimize Energy Architecture', href: '#enquiry' },
    formBucket: 'energy',
    features: [
      { icon: 'bolt', title: 'Granular Power Monitoring', desc: 'Branch-circuit monitoring down to individual PDU outlets, uncovering parasitic energy losses.' },
      { icon: 'spark', title: 'Advanced Containment', desc: 'Hot/cold aisle containment coupled with variable-speed liquid cooling loops to reduce cooling overhead.' },
      { icon: 'shield', title: 'Sustained PUE Reduction', desc: 'Continuous optimization algorithms driving lower Power Usage Effectiveness without risking reliability.' },
    ],
  },
  {
    slug: 'digital-infrastructure',
    name: 'Digital Infrastructure Strategy',
    icon: 'network',
    img: 'assets/img/city-skyline-night.webp',
    featured: true,
    cardDesc: 'Strategic infrastructure roadmaps, carrier-neutral regional connectivity, and modular scalability frameworks for the digital enterprise.',
    eyebrow: 'DIGITAL INFRASTRUCTURE STRATEGY',
    headline: 'Future-Ready Architecture & Modernization Roadmaps',
    description: 'GreenNext builds the digital backbone that connects enterprise compute, high-speed regional optical networks, and mission-critical cloud on-ramps.',
    heroPrimary: { text: 'Consult on Strategy', href: '#enquiry' },
    formBucket: 'general',
    features: [
      { icon: 'network', title: 'Carrier-Neutral Interconnects', desc: 'Diverse physical optical pathways connecting regional facilities with tier-one national telecom backbones.' },
      { icon: 'shield', title: 'Multi-Site Resilience', desc: 'Synchronous and asynchronous replication architectures ensuring uninterrupted disaster recovery.' },
      { icon: 'server', title: 'Phased Modernization', desc: 'Modular architectural roadmaps that allow seamless modernization without costly operational disruption.' },
    ],
  },
];

export const capabilityPillars = [
  {
    icon: 'server',
    title: 'AI-Ready Computing',
    desc: 'High-density rack configurations, accelerator topologies, and low-latency fabrics designed to eliminate training and inference bottlenecks.',
  },
  {
    icon: 'cpu',
    title: 'Intelligent Operations',
    desc: 'Multi-layer operational observability and telemetry capture that transform raw data center signals into proactive decision support.',
  },
  {
    icon: 'bolt',
    title: 'Energy-Aware Design',
    desc: 'Precision thermal containment, high-efficiency electrical distribution, and continuous PUE tuning engineered for sustainable scale.',
  },
  {
    icon: 'network',
    title: 'Scalable Digital Foundations',
    desc: 'Carrier-neutral optical interconnects and modular physical infrastructure frameworks that expand seamlessly alongside enterprise demand.',
  },
];

export const operationalWorkflowSteps = [
  {
    icon: 'cpu',
    title: 'Observe',
    desc: 'Capture multi-point telemetry across power distribution units, thermal sensor meshes, rack airflow, and network switches in real time.',
  },
  {
    icon: 'spark',
    title: 'Understand',
    desc: 'Correlate telemetry streams against baseline operating parameters to reveal multi-layer dependencies between heat load and compute spikes.',
  },
  {
    icon: 'shield',
    title: 'Predict',
    desc: 'Identify emerging thermal gradients and load imbalances before they cross operational thresholds or impact workload performance.',
  },
  {
    icon: 'bolt',
    title: 'Optimize',
    desc: 'Tune cooling delivery, airflow containment, and power distribution paths to match dynamic compute demand with minimal energy waste.',
  },
  {
    icon: 'server',
    title: 'Improve',
    desc: 'Feed performance benchmarks back into engineering models for continuous infrastructure longevity, efficiency, and reliability gains.',
  },
];

export const industries = [
  {
    slug: 'healthcare',
    name: 'Healthcare',
    icon: 'heart',
    cardDesc: 'Compliant compute partitions, imaging archive infrastructure, and high-availability digital health foundations.',
    description: 'Healthcare organizations depend on infrastructure that guarantees absolute continuity and regulatory compliance. GreenNext engineers segregated compute enclaves, ultra-reliable power conditioning, and low-latency networking for diagnostic AI, medical imaging workloads, and electronic health record systems.',
    challenge: 'Strict regulatory compliance (HIPAA/DISHA), massive medical PACS imaging datasets, and zero-tolerance latency for real-time diagnostic inferencing.',
    capability: 'Isolated high-density compute enclaves with hardware encryption, resilient backup power conditioning, and low-latency clinical interconnects.',
    outcome: 'Sub-second diagnostic imaging access and continuous compliant EHR availability across regional clinical networks.',
  },
  {
    slug: 'finance',
    name: 'Banking & Financial Services',
    icon: 'bank',
    cardDesc: 'Deterministic low-latency networks, segregated security tiers, and high-availability transaction processing.',
    description: 'Financial institutions demand microsecond-level determinism, strict logical isolation, and continuous uptime. GreenNext provides fault-tolerant data center foundations, multi-site disaster recovery synchronization, and audited physical security tiers for core transaction routing and high-frequency risk modeling.',
    challenge: 'Microsecond transaction determinism, strict logical/physical isolation mandates, and multi-tier regulatory compliance.',
    capability: 'Fault-tolerant Tier-grade power paths, non-blocking optical fabrics, and dedicated private cage topologies with multi-factor audit trails.',
    outcome: 'Deterministic sub-millisecond execution for core banking routing with active-active disaster recovery across South India corridors.',
  },
  {
    slug: 'manufacturing',
    name: 'Manufacturing',
    icon: 'factory',
    cardDesc: 'Edge aggregation hubs, real-time telemetry processing, and industrial automation infrastructure.',
    description: 'Modern smart factories require real-time shop-floor data aggregation and edge computing resilience. GreenNext delivers ruggedized regional infrastructure, low-latency machine telemetry ingestion, and continuous compute availability to power industrial AI and predictive maintenance operations.',
    challenge: 'Harsh edge telemetry aggregation, factory-floor real-time computer vision processing, and costly distributed plant downtime risks.',
    capability: 'Ruggedized regional aggregation pods, continuous sensor stream ingestion, and high-uptime compute ready for predictive maintenance models.',
    outcome: 'Zero sensor frame loss and predictable downtime prevention across distributed production lines.',
  },
  {
    slug: 'technology',
    name: 'Technology & SaaS',
    icon: 'chip',
    cardDesc: 'Elastic rack scalability, multi-gigabit carrier connectivity, and dedicated AI development clusters.',
    description: 'Rapidly scaling technology enterprises need compute environments that expand without architectural rebuilds. GreenNext provides high-density colocation, carrier-neutral optical connectivity, and direct-to-rack cooling ready for intensive software builds, testing, and AI workloads.',
    challenge: 'Rapidly fluctuating build and CI/CD compute spikes, heavy GPU inference demands, and variable multi-tenant bandwidth draw.',
    capability: 'Elastic 40kW-80kW rack densities, carrier-neutral optical connectivity, and hardware-agnostic cluster expansion without rebuilds.',
    outcome: 'Rapid cluster provisioning and linear operational scaling without thermal throttling during peak development cycles.',
  },
  {
    slug: 'government',
    name: 'Government & Public Services',
    icon: 'landmark',
    cardDesc: 'Sovereign digital architectures, audited perimeter security, and uninterrupted civic service backbones.',
    description: 'Public sector digital platforms require data sovereignty, verified access controls, and absolute reliability. GreenNext designs high-resilience facility foundations, dual-grid power continuity, and isolated network architectures to protect sensitive citizen databases and mission-critical government services.',
    challenge: 'Strict sovereign data residency, massive civic service concurrency surges, and mission-critical disaster recovery resilience.',
    capability: 'Sovereign on-shore digital infrastructure, dual-grid utility feeds, physically audited perimeter cages, and isolated government gateway fabrics.',
    outcome: 'Uninterrupted public service delivery and citizen data sovereignty during peak civic registration events.',
  },
  {
    slug: 'education',
    name: 'Education & Research',
    icon: 'graduation',
    cardDesc: 'High-performance computing (HPC) nodes, academic research clusters, and scalable scientific storage.',
    description: 'Research universities and academic laboratories handle intensive simulation models and massive scientific datasets. GreenNext builds cost-effective high-performance computing (HPC) environments, petabyte-scale storage arrays, and low-jitter research fabrics that accelerate institutional innovation.',
    challenge: 'Budget-constrained high-performance compute (HPC) demands, petabyte-scale simulation data storage, and bursty research workloads.',
    capability: 'Shared accelerated computing pools, low-jitter InfiniBand/Ethernet backplanes, and cost-effective multi-tiered archival storage arrays.',
    outcome: '3x faster academic research simulation completions with cost-predictable multi-department resource quotas.',
  },
  {
    slug: 'retail',
    name: 'Retail & E-commerce',
    icon: 'cart',
    cardDesc: 'Burst-ready capacity management, distributed edge caching, and zero-downtime transaction clusters.',
    description: 'Omnichannel retail operations cannot afford downtime during seasonal shopping surges. GreenNext provides geographically distributed infrastructure, elastic compute reservation, and high-throughput transaction backbones that guarantee sub-second customer checkouts during peak traffic spikes.',
    challenge: 'Massive unpredictable seasonal traffic surges, distributed inventory sync latency, and zero tolerance for checkout cart failures.',
    capability: 'Geographically distributed edge caching nodes, dynamic auto-scaling compute reservation, and high-throughput transactional database backbones.',
    outcome: 'Sub-second transaction response times and 100% checkout availability during peak regional festival shopping events.',
  },
  {
    slug: 'enterprise',
    name: 'Enterprise Operations',
    icon: 'briefcase',
    cardDesc: 'Hybrid infrastructure backbones, multi-site disaster recovery corridors, and centralized operations control.',
    description: 'Diversified corporate conglomerates require unified infrastructure standards across distributed regional offices. GreenNext engineers multi-city active-passive replication corridors, centralized operational telemetry, and robust compliance baselines that support long-term corporate agility.',
    challenge: 'Fragmented legacy data centers, decentralized office networking, escalating operational PUE, and complex disaster recovery plans.',
    capability: 'Unified multi-city active-passive replication corridors, centralized operational telemetry dashboards, and modern containment retrofits.',
    outcome: 'Consolidated operational visibility, reduced parasitic energy spend, and automated cross-region failover assurance.',
  },
];

export const solutions = [
  {
    slug: 'ai-data-centers',
    name: 'AI Data Centers',
    icon: 'database',
    img: 'assets/img/server-room.webp',
    featured: true,
    cardDesc: 'Purpose-built facilities engineered around the power, thermal, and space demands of accelerated AI computing.',
    eyebrow: 'AI DATA CENTERS',
    headline: 'High-Density Facilities Built Specifically for Accelerated AI',
    description: 'GreenNext designs AI-ready data center facilities engineered around the dense power delivery, direct liquid cooling loops, and ultra-high bandwidth demands of modern ML clusters.',
    heroPrimary: { text: 'Explore AI Facilities', href: '#enquiry' },
    formBucket: 'data-center',
    features: [
      { icon: 'database', title: 'High-Density Rack Topologies', desc: 'Engineered for 40kW to 80kW+ per rack with advanced thermal containment and structural floor design.' },
      { icon: 'bolt', title: 'Clean Power Integration', desc: 'Direct busway power distribution paired with high-efficiency double-conversion UPS systems.' },
      { icon: 'shield', title: 'Uninterrupted Workload SLA', desc: 'Redundant cooling loops and automated power transfer preventing model corruption during utility shifts.' },
    ],
  },
  {
    slug: 'smart-infrastructure',
    name: 'Smart Infrastructure',
    icon: 'network',
    img: 'assets/img/circuit-board.webp',
    featured: true,
    cardDesc: 'Adaptive infrastructure platforms that continuously sense, analyze, and optimize digital workloads.',
    eyebrow: 'SMART INFRASTRUCTURE',
    headline: 'Adaptive Infrastructure That Evolves With Your Enterprise',
    description: 'GreenNext smart infrastructure blends distributed sensor networks, intelligent telemetry analytics, and agile software control into a responsive physical foundation.',
    heroPrimary: { text: 'Discuss Smart Infrastructure', href: '#enquiry' },
    formBucket: 'general',
    features: [
      { icon: 'network', title: 'Dynamic Environmental Tuning', desc: 'Airflow and coolant flow dynamically match compute utilization spikes across every physical zone.' },
      { icon: 'cpu', title: 'Multi-Sensor Aggregation', desc: 'Collect and normalize thousands of sensor readings into a unified operational telemetry stream.' },
      { icon: 'shield', title: 'Architectural Agility', desc: 'Modular physical architecture allowing fast hardware refreshes without civil reconstruction.' },
    ],
  },
  {
    slug: 'energy-optimization',
    name: 'Energy Optimization',
    icon: 'bolt',
    img: 'assets/img/wind-turbines.webp',
    featured: true,
    cardDesc: 'Systemic energy reduction solutions that minimize data center PUE through precision thermal engineering.',
    eyebrow: 'ENERGY OPTIMIZATION',
    headline: 'Continuous Energy Optimization Without SLA Compromise',
    description: 'GreenNext reduces data center energy consumption through precision hot/cold aisle isolation, liquid-to-air cooling retrofits, and renewable microgrid integration.',
    heroPrimary: { text: 'Request Energy Audit', href: '#enquiry' },
    formBucket: 'energy',
    features: [
      { icon: 'bolt', title: 'Aisle Containment Solutions', desc: 'Physical separation of supply and exhaust air, eliminating hot air recirculation and lowering fan draw.' },
      { icon: 'spark', title: 'Variable Liquid Cooling Loops', desc: 'Direct-to-chip cooling loops delivering cooling fluid directly to heat-generating processors.' },
      { icon: 'shield', title: 'Verified PUE Baselines', desc: 'Transparent reporting based on physical energy meters, tracking efficiency improvements month-over-month.' },
    ],
  },
  {
    slug: 'automation-solutions',
    name: 'Automation Solutions',
    icon: 'cpu',
    img: 'assets/img/control-room.webp',
    featured: true,
    cardDesc: 'Operational automation frameworks that eliminate manual overhead and streamline infrastructure management.',
    eyebrow: 'AUTOMATION SOLUTIONS',
    headline: 'Intelligent Automation for Confident Day-to-Day Operations',
    description: 'Automate routine facility monitoring, threshold alerts, and incident dispatching to let engineering teams focus on mission-critical digital initiatives.',
    heroPrimary: { text: 'Automate Operations', href: '#enquiry' },
    formBucket: 'general',
    features: [
      { icon: 'cpu', title: 'Automated Health Diagnostics', desc: 'Continuous programmatic health checks inspecting power supplies, optical links, and fans.' },
      { icon: 'spark', title: 'Threshold-Based Alerts', desc: 'Configurable multi-channel alert policies notifying engineering desks before thresholds are breached.' },
      { icon: 'shield', title: 'Granular Safety Guardrails', desc: 'Strict role-based access control and manual approval gates on all critical infrastructure actions.' },
    ],
  },
];

export const locations = [
  {
    slug: 'madurai',
    name: 'Madurai',
    img: 'assets/img/madurai-temple.webp',
    tagline: 'Southern Technology Corridor Hub',
    cardDesc: 'Expanding southern digital ecosystem with strong electrical grid access, strategic regional positioning, and growing technology talent.',
    description: 'GreenNext supports enterprises across Madurai and southern Tamil Nadu with carrier-neutral infrastructure planning, high-density AI data center architecture, and energy-aware facility design.',
  },
  {
    slug: 'coimbatore',
    name: 'Coimbatore',
    img: 'assets/img/coimbatore-tech-park.png',
    tagline: 'Industrial & Technology Center',
    cardDesc: 'Premier industrial heartland and technology park corridor requiring high-density AI clusters, automation, and resilient data center foundations.',
    description: 'GreenNext brings enterprise infrastructure engineering, automated facility telemetry, and cooling optimization to Coimbatore’s advanced manufacturing, software, and healthcare enterprises.',
  },
  {
    slug: 'trichy',
    name: 'Trichy',
    img: 'assets/img/greenery-building.webp',
    tagline: 'Central Infrastructure Corridor',
    cardDesc: 'Central connectivity crossroads offering geographical diversity, strong educational pipelines, and strategic disaster recovery replication.',
    description: 'GreenNext delivers resilient data center engineering, localized connectivity solutions, and energy-efficient digital infrastructure to institutions and enterprises throughout Trichy.',
  },
  {
    slug: 'mangalore',
    name: 'Mangalore',
    img: 'assets/img/city-skyline-night.webp',
    tagline: 'Coastal Connectivity Gateway',
    cardDesc: 'Strategic coastal corridor with international landing point proximity, renewable power potential, and expanding software development hubs.',
    description: 'GreenNext supports enterprises across Mangalore and coastal Karnataka with high-availability infrastructure architecture, low-latency connectivity, and sustainable data center engineering.',
  },
];

export const heroImg = 'assets/img/datacenter-hero.jpg';
export const tagline = 'Powering Intelligence. Engineering Tomorrow.';

// Reusable lead-form field sets, keyed by "bucket".
export const formConfigs = {
  general: {
    heading: "Let's Engineer Your Next Infrastructure Milestone",
    description: 'Discuss your compute density, workload scale, cooling targets, or regional deployment timeline with a GreenNext enterprise architect.',
    submitLabel: 'Submit Consultation Request',
    extraFields: [
      { type: 'select', name: 'area_of_interest', label: 'Area of Interest', required: true,
        options: ['AI Data Centers', 'AI Infrastructure', 'Energy Efficiency & Cooling', 'Intelligent Automation', 'Digital Infrastructure', 'Regional Corridors (Madurai, Coimbatore, Trichy, Mangalore)', 'Other'] },
    ],
    messageLabel: 'Project Requirements / Workload Scope',
  },
  'data-center': {
    heading: 'Plan Your Data Center Infrastructure',
    description: 'Share your facility requirements, rack density targets, or expansion plans for a confidential technical consultation.',
    submitLabel: 'Request Infrastructure Consultation',
    extraFields: [
      { type: 'select', name: 'infrastructure_requirement', label: 'Infrastructure Requirement', required: true,
        options: ['New AI Data Center Planning', 'Existing Facility Modernization', 'High-Density Rack Retrofit', 'Colocation & White Space', 'Technical Advisory'] },
      { type: 'select', name: 'data_center_requirement', label: 'Compute Density Target', required: true,
        options: ['Standard Density (< 10kW/rack)', 'Medium Density (10–25kW/rack)', 'High-Density AI (30–60kW/rack)', 'Extreme Density (> 60kW/rack)'] },
    ],
    messageLabel: 'Facility Specifications & Timeline',
  },
  energy: {
    heading: 'Optimize Facility Energy & Cooling',
    description: 'Discuss power optimization, aisle containment, and liquid cooling solutions with our thermal engineering specialists.',
    submitLabel: 'Request Energy Optimization Review',
    extraFields: [
      { type: 'select', name: 'current_infrastructure', label: 'Current Infrastructure Type', required: true,
        options: ['On-Premise Enterprise Facility', 'Colocation Deployment', 'Edge Data Centers', 'Planning New Build', 'Other'] },
      { type: 'select', name: 'energy_requirement', label: 'Optimization Focus Area', required: true,
        options: ['Facility PUE Audit', 'Aisle Containment Retrofit', 'Liquid / Direct-to-Chip Cooling', 'Renewable Energy Integration', 'Continuous Monitoring Telemetry'] },
    ],
    messageLabel: 'Energy & Thermal Target Details',
  },
  consultation: {
    heading: 'Schedule an Enterprise Consultation',
    description: 'Connect directly with a GreenNext senior infrastructure architect for a structured review of your technical and operational roadmap.',
    submitLabel: 'Schedule Consultation',
    isLongForm: true,
    extraFields: [
      { type: 'select', name: 'industry', label: 'Industry', required: true,
        options: ['Healthcare', 'Banking & Financial Services', 'Manufacturing', 'Technology & SaaS', 'Government & Public Services', 'Education & Research', 'Retail & E-commerce', 'Enterprise Operations', 'Other'] },
      { type: 'select', name: 'area_of_interest', label: 'Primary Focus', required: true,
        options: ['AI Data Centers', 'AI Compute Architecture', 'Energy Efficiency & Cooling', 'Intelligent Automation', 'Regional Network Strategy', 'Full Infrastructure Review'] },
      { type: 'select', name: 'timeline', label: 'Expected Timeline', required: true,
        options: ['Immediate (< 3 months)', '3–6 Months', '6–12 Months', 'Strategic Planning'] },
      { type: 'select', name: 'contact_method', label: 'Preferred Consultation Method', required: true,
        options: ['Google Meet (Online Video)', 'Business Email', 'Phone Call', 'In-Person (Verified Regional Locations)'] },
    ],
    messageLabel: 'Project Requirements & Current Architecture',
  },
};

export const careersFormConfig = {
  heading: 'Join GreenNext Engineering',
  description: 'Help engineer the next generation of intelligent, sustainable AI infrastructure across South India’s premier technology corridors.',
  submitLabel: 'Submit Application',
};

export const nav = {
  main: [
    { label: 'Home', href: 'index.html' },
    {
      label: 'Infrastructure', href: 'capabilities/index.html',
      children: [
        { label: 'AI Infrastructure', href: 'capabilities/ai-infrastructure.html', icon: 'server' },
        { label: 'Data Center Engineering', href: 'capabilities/data-center-solutions.html', icon: 'database' },
        { label: 'Intelligent Operations', href: 'capabilities/intelligent-automation.html', icon: 'cpu' },
        { label: 'Energy-Aware Infrastructure', href: 'capabilities/energy-efficiency.html', icon: 'bolt' },
        { label: 'Digital Infrastructure Strategy', href: 'capabilities/digital-infrastructure.html', icon: 'network' },
      ],
    },
    {
      label: 'Solutions', href: 'solutions/index.html',
      children: [
        { label: 'AI Data Centers', href: 'solutions/ai-data-centers.html', icon: 'database' },
        { label: 'Smart Infrastructure', href: 'solutions/smart-infrastructure.html', icon: 'network' },
        { label: 'Energy Optimization', href: 'solutions/energy-optimization.html', icon: 'bolt' },
        { label: 'Automation Solutions', href: 'solutions/automation-solutions.html', icon: 'cpu' },
      ],
    },
    {
      label: 'Industries', href: 'industries/index.html',
      children: [
        { label: 'Healthcare', href: 'industries/healthcare.html', icon: 'heart' },
        { label: 'Banking & Financial Services', href: 'industries/finance.html', icon: 'bank' },
        { label: 'Manufacturing', href: 'industries/manufacturing.html', icon: 'factory' },
        { label: 'Technology & SaaS', href: 'industries/technology.html', icon: 'chip' },
        { label: 'Government & Public Services', href: 'industries/government.html', icon: 'landmark' },
        { label: 'Education & Research', href: 'industries/education.html', icon: 'graduation' },
        { label: 'Retail & E-commerce', href: 'industries/retail.html', icon: 'cart' },
        { label: 'Enterprise Operations', href: 'industries/enterprise.html', icon: 'briefcase' },
      ],
    },
    {
      label: 'Locations', href: 'locations/index.html',
      children: [
        { label: 'Madurai', href: 'locations/madurai.html', icon: 'pin' },
        { label: 'Coimbatore', href: 'locations/coimbatore.html', icon: 'pin' },
        { label: 'Trichy', href: 'locations/trichy.html', icon: 'pin' },
        { label: 'Mangalore', href: 'locations/mangalore.html', icon: 'pin' },
      ],
    },
    {
      label: 'Intelligence', href: 'index.html#intelligence-dashboard',
      children: [
        { label: 'Operations Workflow', href: 'index.html#operations-workflow', icon: 'cpu' },
        { label: 'Telemetry Dashboard', href: 'index.html#intelligence-dashboard', icon: 'database' },
        { label: 'Technology & Architecture', href: 'index.html#technology-architecture', icon: 'network' },
        { label: 'Intelligent Operations', href: 'capabilities/intelligent-automation.html', icon: 'spark' },
      ],
    },
    {
      label: 'About', href: 'about.html',
      children: [
        { label: 'Company Overview', href: 'about.html#company-overview', icon: 'building' },
        { label: 'Architecture Philosophy', href: 'about.html#our-approach', icon: 'cpu' },
        { label: 'Sustainable Engineering', href: 'sustainability.html', icon: 'bolt' },
        { label: 'Core Principles', href: 'about.html#why-greennext', icon: 'spark' },
      ],
    },
    {
      label: 'Contact', href: 'contact.html',
    },
  ],
};

export const footerData = {
  columns: [
    {
      title: 'Company',
      links: [
        { label: 'Company Overview', href: 'about.html#company-overview' },
        { label: 'Architecture Philosophy', href: 'about.html#our-approach' },
        { label: 'Sustainable Engineering', href: 'sustainability.html' },
        { label: 'Core Principles', href: 'about.html#why-greennext' },
        { label: 'Careers Portal', href: 'careers.html' },
        { label: 'Contact Advisory', href: 'contact.html' },
      ],
    },
    {
      title: 'Infrastructure',
      links: [
        { label: 'AI Infrastructure', href: 'capabilities/ai-infrastructure.html' },
        { label: 'Data Center Engineering', href: 'capabilities/data-center-solutions.html' },
        { label: 'Intelligent Operations', href: 'capabilities/intelligent-automation.html' },
        { label: 'Energy-Aware Infrastructure', href: 'capabilities/energy-efficiency.html' },
        { label: 'Digital Infrastructure Strategy', href: 'capabilities/digital-infrastructure.html' },
      ],
    },
    {
      title: 'Solutions',
      links: [
        { label: 'AI Data Centers', href: 'solutions/ai-data-centers.html' },
        { label: 'Smart Infrastructure', href: 'solutions/smart-infrastructure.html' },
        { label: 'Energy Optimization', href: 'solutions/energy-optimization.html' },
        { label: 'Automation Solutions', href: 'solutions/automation-solutions.html' },
      ],
    },
    {
      title: 'Locations',
      links: [
        { label: 'Madurai Hub', href: 'locations/madurai.html' },
        { label: 'Coimbatore Hub', href: 'locations/coimbatore.html' },
        { label: 'Trichy Hub', href: 'locations/trichy.html' },
        { label: 'Mangalore Hub', href: 'locations/mangalore.html' },
      ],
    },
  ],
};

export const finalCTA = {
  heading: 'Let’s Engineer Your Next Infrastructure Milestone',
  description: 'Talk with our senior engineering team about your infrastructure priorities, compute density goals, and long-term technology roadmap.',
  primary: { text: 'Schedule a Consultation', href: 'contact.html' },
  secondary: { text: 'Send an Enquiry', href: 'contact.html#quick-enquiry' },
};
