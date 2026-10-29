// Master B2B Enterprise Copy and SEO Content Registry for GreenNext
// Covers all 19 primary enterprise pages with verified accuracy, 3 conversion pathways,
// deep-dive technical copy, benefits, use cases, image metadata, and FAQs.

export const capabilitiesContent = {
  'ai-infrastructure': {
    seoTitle: 'AI Infrastructure & High-Density Compute Architecture',
    metaDesc: 'Engineer resilient, high-density AI infrastructure and compute foundations designed for LLM training, inference clusters, and accelerated enterprise computing.',
    eyebrow: 'ACCELERATED ENTERPRISE COMPUTING',
    headline: 'High-Density AI Infrastructure Engineered for Continuous Compute',
    description: 'GreenNext designs accelerated infrastructure foundations built around the distinct power, thermal, and interconnect demands of modern machine learning clusters.',
    heroPrimary: { text: 'Talk to an Expert', href: '#enquiry' },
    heroSecondary: { text: 'Quick Enquiry', href: '#quick-enquiry' },
    img: 'assets/img/circuit-board.webp',
    alt: 'High-density accelerated compute processor and motherboard architecture in enterprise data center',
    caption: 'Accelerated computing architecture designed for sustained GPU and TPU workloads.',
    deepDive: {
      eyebrow: 'Architectural Design',
      heading: 'Solving Thermal Density and High-Throughput Interconnect Bottlenecks',
      body: 'Standard enterprise data centers were designed for rack densities of 5kW to 10kW. Contemporary AI training and inference racks routinely demand 30kW to 80kW+, introducing severe thermal thresholds and power delivery strains. GreenNext develops AI-ready architectures from layer one, uniting high-bandwidth fabric, power topologies, and direct cooling pathways into a single operational framework.',
      bullets: [
        'Non-blocking, low-latency fabric designs supporting high-throughput inter-node communication',
        'Modular power distribution balancing multi-megawatt draw across high-density computing aisles',
        'Hybrid liquid-to-air cooling readiness preventing thermal throttling under peak cluster utilization',
        'Hardware-agnostic rack engineering supporting heterogeneous accelerator environments'
      ],
      ctaText: 'Schedule AI Architecture Review',
      ctaHref: 'contact.html',
    },
    benefits: [
      {
        icon: 'server',
        metric: 'High-Density Ready',
        title: 'Thermal Resilience',
        desc: 'Maintains sustained compute throughput by eliminating thermal hot-spots through proactive thermal zoning and liquid cooling paths.'
      },
      {
        icon: 'network',
        metric: 'Sub-Millisecond Fabric',
        title: 'Interconnect Efficiency',
        desc: 'Optimizes east-west cluster traffic across distributed nodes, ensuring accelerated training runs avoid bandwidth starvation.'
      },
      {
        icon: 'shield',
        metric: 'Tier-Grade Assurance',
        title: 'Workload Continuity',
        desc: 'Architected with redundant power feeds, automated failover routing, and continuous subsystem monitoring to safeguard critical model runs.'
      }
    ],
    useCases: [
      {
        tag: 'Large Language Models',
        title: 'Distributed Model Training & Fine-Tuning Clusters',
        desc: 'Supporting enterprise engineering teams training domain-specific LLMs requiring synchronized multi-node gradient exchange.',
        points: [
          'High-density rack configurations supporting multi-GPU appliances',
          'Dedicated low-jitter network backbones ensuring deterministic synchronization',
          'Dynamic power reservation aligning facility draw with job scheduling'
        ],
        impact: 'Predictable training cycle completion without thermal throttling or cluster-level network stalls.'
      },
      {
        tag: 'Real-Time Inference',
        title: 'High-Throughput Enterprise Inference Hubs',
        desc: 'Deploying mission-critical inference pipelines where sub-millisecond response and continuous uptime determine business transactions.',
        points: [
          'Zoned edge-to-core network topologies minimizing query transit times',
          'N+1 redundancy across power conditioning and precision cooling units',
          'Telemetry-driven workload balancing to route around localized infrastructure stress'
        ],
        impact: 'Sustained inference latency under high concurrency across regional user bases.'
      },
      {
        tag: 'Computer Vision & Analytics',
        title: 'Industrial Computer Vision and Sensor Pipelines',
        desc: 'Processing continuous video and telemetry feeds from distributed manufacturing and healthcare endpoints across South India.',
        points: [
          'High-throughput ingest storage tier coupled directly with inference compute',
          'Power-efficient workload scheduling shifting non-urgent batch analysis to off-peak periods',
          'Unified telemetry correlating ingest volume with processor thermal draw'
        ],
        impact: 'Zero data frame loss during massive concurrent camera ingest streams.'
      }
    ],
    faqs: [
      {
        q: 'How does GreenNext approach rack power densities above 40kW for AI workloads?',
        a: 'Our architectural frameworks incorporate targeted containment, direct-to-chip liquid cooling loops, and dedicated busway power delivery to safely handle elevated thermal and power densities without hot-spot accumulation.'
      },
      {
        q: 'Are your AI infrastructure designs vendor-locked to specific hardware manufacturers?',
        a: 'No. GreenNext designs hardware-agnostic physical and logical infrastructure foundations compatible with open compute standards (OCP) and tier-one accelerator platforms.'
      },
      {
        q: 'How do you prevent network bottlenecks during heavy distributed training?',
        a: 'We specify non-blocking leaf-spine architectures with dedicated compute fabric backplanes, prioritizing low-jitter and deterministic latency across all compute nodes.'
      },
      {
        q: 'Can existing facilities be retrofitted for modern AI compute densities?',
        a: 'Yes. We conduct comprehensive structural, electrical, and thermal assessments to determine feasibility, recommending staged retrofits such as rear-door heat exchangers and aisle containment.'
      }
    ],
    relatedLinks: [
      { label: 'Data Center Solutions', href: 'capabilities/data-center-solutions.html' },
      { label: 'Intelligent Automation', href: 'capabilities/intelligent-automation.html' },
      { label: 'Energy Efficiency', href: 'capabilities/energy-efficiency.html' },
      { label: 'AI Data Centers Solution', href: 'solutions/ai-data-centers.html' }
    ]
  },

  'data-center-solutions': {
    seoTitle: 'Enterprise Data Center Solutions & Resilient Facility Engineering',
    metaDesc: 'Turnkey data center engineering, modular deployment, facility modernization, and uptime architectures built for mission-critical enterprise workloads.',
    eyebrow: 'MISSION-CRITICAL FACILITY ENGINEERING',
    headline: 'Next-Generation Data Center Facilities Designed for Uncompromising Resilience',
    description: 'From site assessment to high-efficiency white space layout, GreenNext designs enterprise data centers that combine extreme reliability with environmental stewardship.',
    heroPrimary: { text: 'Talk to an Expert', href: '#enquiry' },
    heroSecondary: { text: 'Quick Enquiry', href: '#quick-enquiry' },
    img: 'assets/img/server-room.webp',
    alt: 'High-security server room aisle with precision cooling and cable management in modern data center',
    caption: 'Precision facility engineering engineered for 24/7 continuous enterprise uptime.',
    deepDive: {
      eyebrow: 'Facility Architecture',
      heading: 'Bridging Physical Security, Power Redundancy, and Thermal Integrity',
      body: 'A truly resilient data center is an interdependent ecosystem. Physical security barriers, uninterruptible power topologies, dual-fed electrical paths, and precision environmental control must operate seamlessly. GreenNext engineers data center spaces where every physical and electrical component is mapped against concurrent maintainability and future expansion.',
      bullets: [
        'Concurrent maintainability across electrical switchgear, UPS banks, and generator systems',
        'Optimized white space layouts maximizing airflow efficiency and aisle containment',
        'Multi-stage physical access control with biometric verification and comprehensive perimeter defense',
        'Modular pre-engineered deployment modules accelerating facility build timelines'
      ],
      ctaText: 'Consult on Facility Specifications',
      ctaHref: 'contact.html',
    },
    benefits: [
      {
        icon: 'shield',
        metric: 'Continuous Uptime',
        title: 'Concurrent Maintainability',
        desc: 'Systems designed so any power, cooling, or distribution component can be serviced without interrupting active computing loads.'
      },
      {
        icon: 'database',
        metric: 'Modular Growth',
        title: 'Capital-Efficient Scalability',
        desc: 'Deploy initial capacity today with pre-provisioned pathways to scale white space, power, and cooling as enterprise demand expands.'
      },
      {
        icon: 'bolt',
        metric: 'Optimized PUE',
        title: 'Thermal Architecture',
        desc: 'Advanced airflow dynamics and precision variable-speed containment reduce parasitic cooling load, conserving enterprise operating expenditure.'
      }
    ],
    useCases: [
      {
        tag: 'Enterprise Hybrid Cloud',
        title: 'Colocation & Private Data Center Modernization',
        desc: 'Upgrading legacy on-premise server rooms into modular, high-efficiency private data halls or hybrid colocation spaces.',
        points: [
          'Electrical redesign transitioning legacy UPS to modular double-conversion systems',
          'Implementation of cold-aisle containment systems reducing parasitic fan energy',
          'Centralized environmental sensor arrays providing rack-level thermal tracking'
        ],
        impact: 'Significant reduction in facility risk and immediate capacity expansion within existing square footage.'
      },
      {
        tag: 'Regional Disaster Recovery',
        title: 'Tier-Grade Regional Disaster Recovery Hubs',
        desc: 'Establishing synchronized backup and disaster recovery data centers across secondary technology hubs like Madurai and Trichy.',
        points: [
          'Geographically distributed sites outside prime flood and seismic zones',
          'Carrier-neutral redundant telecommunications fiber entry points',
          'Automated generator failover with verified on-site fuel autonomy protocols'
        ],
        impact: 'Guaranteed business continuity and deterministic recovery point objectives (RPO).'
      },
      {
        tag: 'Edge Data Centers',
        title: 'Modular Edge Facility Deployment',
        desc: 'Deploying prefabricated micro-data centers closer to industrial manufacturing floors and regional hospital networks.',
        points: [
          'Self-contained modular enclosures with integrated fire suppression and HVAC',
          'Autonomous environmental monitoring connected to central operations desks',
          'Rapid deployment cycles requiring minimal civil infrastructure works'
        ],
        impact: 'Immediate compute proximity for low-latency operational control.'
      }
    ],
    faqs: [
      {
        q: 'What tier standards do GreenNext data center architectures follow?',
        a: 'Our designs are modeled upon Tier III and Tier IV concurrent maintainability standards, ensuring dual-powered equipment and multiple independent distribution paths throughout.'
      },
      {
        q: 'How does GreenNext support brownfield data center upgrades without downtime?',
        a: 'We develop phased migration and upgrade strategies, deploying temporary bypass paths and modular power conditioning so critical workloads remain active throughout renovation.'
      },
      {
        q: 'Can modular data centers provide the same physical security as traditional brick-and-mortar facilities?',
        a: 'Yes. Our modular designs incorporate reinforced steel enclosures, multi-factor biometric access, tamper sensors, and 24/7 continuous CCTV coverage.'
      },
      {
        q: 'What is the typical deployment timeline for a modular enterprise facility?',
        a: 'Depending on civil readiness, modular data center deployments typically range between 12 to 24 weeks, substantially faster than conventional multi-year brick-and-mortar builds.'
      }
    ],
    relatedLinks: [
      { label: 'AI Infrastructure', href: 'capabilities/ai-infrastructure.html' },
      { label: 'Energy Efficiency', href: 'capabilities/energy-efficiency.html' },
      { label: 'Digital Infrastructure', href: 'capabilities/digital-infrastructure.html' },
      { label: 'Coimbatore Hub', href: 'locations/coimbatore.html' }
    ]
  },

  'intelligent-automation': {
    seoTitle: 'Intelligent Automation & AI-Driven Infrastructure Operations',
    metaDesc: 'Closed-loop data center automation, predictive hardware maintenance, automated thermal balancing, and telemetry-driven operational intelligence.',
    eyebrow: 'AUTONOMOUS OPERATIONS FRAMEWORK',
    headline: 'Shift From Reactive Alerting to Closed-Loop Intelligent Automation',
    description: 'Transform complex infrastructure management with machine learning algorithms that observe signals, predict failures, and dynamically optimize operations.',
    heroPrimary: { text: 'Talk to an Expert', href: '#enquiry' },
    heroSecondary: { text: 'Quick Enquiry', href: '#quick-enquiry' },
    img: 'assets/img/control-room.webp',
    alt: 'Multi-screen enterprise operations command center monitoring telemetry and intelligent automation alerts',
    caption: 'Continuous cross-layer telemetry feeding the six-stage autonomous operational workflow.',
    deepDive: {
      eyebrow: 'Operational Intelligence',
      heading: 'The Six-Stage Autonomous Loop: Monitor, Detect, Analyze, Decide, Automate, Report',
      body: 'Traditional infrastructure management relies on static alert thresholds that overwhelm operations teams with false alarms while missing subtle multi-variable anomalies. GreenNext implements an explainable six-stage operational loop. By synthesizing millions of environmental, electrical, and network data points in real time, our architecture isolates root causes and triggers verified responses before service disruption occurs.',
      bullets: [
        'Universal telemetry ingestion capturing voltage fluctuations, fan speeds, and packet jitter',
        'Machine-learned baseline profiles that filter environmental noise and detect true anomalies',
        'Contextual decision-support engines presenting clear, auditable operational options',
        'Configurable automated responses with granular safety bounds and instant manual override'
      ],
      ctaText: 'Explore Automation Workflow',
      ctaHref: 'contact.html',
    },
    benefits: [
      {
        icon: 'cpu',
        metric: 'Closed-Loop Control',
        title: 'Proactive Fault Remediation',
        desc: 'Detects component degradation—such as bearing vibration or power ripple—weeks before catastrophic hardware failure.'
      },
      {
        icon: 'spark',
        metric: 'Zero Alert Fatigue',
        title: 'Intelligent Noise Reduction',
        desc: 'Correlates related cascading alerts into a single actionable incident, eliminating alarm storms during power or network shifts.'
      },
      {
        icon: 'bolt',
        metric: 'Continuous Tuning',
        title: 'Dynamic Resource Optimization',
        desc: 'Continuously tunes chiller setpoints, variable fan speeds, and server power states to match changing real-time workload loads.'
      }
    ],
    useCases: [
      {
        tag: 'Thermal Management',
        title: 'Automated Micro-Climate Thermal Balancing',
        desc: 'Preventing server throttling during sudden computing bursts by dynamically adjusting floor damper actuators and fan wall speeds.',
        points: [
          'Rack-level differential temperature sensing mapped against real-time CPU utilization',
          'Predictive airflow routing compensating for hot-air recirculation before alarms trigger',
          'Automated thermal telemetry logging proving compliance with equipment operating ranges'
        ],
        impact: 'Stable operating temperatures across all server racks with reduced overall fan motor consumption.'
      },
      {
        tag: 'Power Conditioning',
        title: 'Intelligent Phase Balancing and Peak Load Shaving',
        desc: 'Managing power distribution units (PDUs) to prevent single-phase overload and maximize generator switchover efficiency.',
        points: [
          'Continuous phase current monitoring identifying unbalanced server power supplies',
          'Automated non-critical workload throttling during municipal power grid fluctuations',
          'Battery health diagnostics tracking impedance shifts during routine float cycles'
        ],
        impact: 'Maximized electrical distribution head-room and extended backup battery operational lifespan.'
      },
      {
        tag: 'Network Resilience',
        title: 'Automated Routing Around Congested Regional Links',
        desc: 'Maintaining inter-data-center replication speeds between coastal and inland regional nodes during fiber disruptions.',
        points: [
          'Continuous packet loss and jitter threshold monitoring across redundant WAN carriers',
          'Autonomous BGP route adjustment shifting critical replication traffic to optimal paths',
          'Post-incident forensic reporting documenting carrier latency metrics'
        ],
        impact: 'Undisrupted cross-regional database replication without requiring manual network engineering triage.'
      }
    ],
    faqs: [
      {
        q: 'Does GreenNext intelligent automation remove human operators from the decision loop?',
        a: 'No. Our framework follows a human-in-the-loop philosophy. High-confidence routine remediations can be automated, while critical operational shifts provide structured recommendations for human approval.'
      },
      {
        q: 'How does the automation system handle false positive sensor readings?',
        a: 'The system correlates signals across multiple independent sensor types (e.g., verifying a temperature spike against fan speed and CPU load) before confirming an anomaly.'
      },
      {
        q: 'Can this automation integrate with our existing DCIM and BMS platforms?',
        a: 'Yes. Our architecture communicates via open enterprise protocols including SNMP, BACnet, Modbus, MQTT, and RESTful APIs, unifying disparate building and IT monitoring systems.'
      },
      {
        q: 'Is audit logging maintained for all automated actions taken?',
        a: 'Every detection, decision, and automated execution is recorded in an immutable, timestamped audit log for compliance, safety review, and continual model refinement.'
      }
    ],
    relatedLinks: [
      { label: 'AI Infrastructure', href: 'capabilities/ai-infrastructure.html' },
      { label: 'Energy Efficiency', href: 'capabilities/energy-efficiency.html' },
      { label: 'Digital Infrastructure', href: 'capabilities/digital-infrastructure.html' },
      { label: 'Automation Solutions', href: 'solutions/automation-solutions.html' }
    ]
  },

  'energy-efficiency': {
    seoTitle: 'Sustainable Energy Efficiency & PUE Optimization Solutions',
    metaDesc: 'Enterprise data center energy optimization, renewable grid integration, intelligent cooling control, and verifiable operational sustainability.',
    eyebrow: 'RESPONSIBLE INFRASTRUCTURE ARCHITECTURE',
    headline: 'Engineering High-Performance Computing with Minimal Energy Footprint',
    description: 'We treat energy not as a fixed utility overhead, but as an active engineering discipline—connecting compute demand, power delivery, and cooling efficiency.',
    heroPrimary: { text: 'Talk to an Expert', href: '#enquiry' },
    heroSecondary: { text: 'Quick Enquiry', href: '#quick-enquiry' },
    img: 'assets/img/solar-panels.webp',
    alt: 'Industrial solar panel array powering sustainable enterprise digital infrastructure',
    caption: 'Renewable energy integration and closed-loop thermal control lowering operational PUE.',
    deepDive: {
      eyebrow: 'Energy Architecture',
      heading: 'The Direct Physical Link: Compute Demand Drives Power Draw, Power Drives Cooling Load',
      body: 'Every kilowatt-hour consumed by compute hardware translates into heat that must be extracted by cooling systems. If cooling efficiency is neglected, facilities consume nearly as much energy conditioning the room as running the processors. GreenNext breaks this cycle by optimizing every phase of the energy chain: high-efficiency UPS conversion, targeted aisle airflow, variable liquid loops, and solar-ready microgrids.',
      bullets: [
        'Double-conversion UPS systems operating at peak efficiency curves across variable loads',
        'Precision containment eliminating bypass air and cold air recirculation',
        'Direct-to-chip liquid cooling architectures dramatically reducing chiller compressor runtime',
        'On-site renewable solar generation and battery energy storage system (BESS) integration'
      ],
      ctaText: 'Request Energy Architecture Review',
      ctaHref: 'contact.html',
    },
    benefits: [
      {
        icon: 'bolt',
        metric: 'Lower PUE',
        title: 'Reduced Parasitic Load',
        desc: 'Minimizes wasted energy in transformer heat loss, fan turbulence, and over-cooling, directing maximum power to productive compute.'
      },
      {
        icon: 'spark',
        metric: 'Renewable Ready',
        title: 'Clean Energy Integration',
        desc: 'Architected to seamlessly integrate rooftop solar PV, local wind contracts, and battery energy storage for peak demand clipping.'
      },
      {
        icon: 'shield',
        metric: 'Auditable Data',
        title: 'Transparent Telemetry',
        desc: 'Continuous energy metering across all electrical subsystems providing auditable data for corporate sustainability disclosures.'
      }
    ],
    useCases: [
      {
        tag: 'Cooling Optimization',
        title: 'Chiller Plant Optimization & Free Cooling Integration',
        desc: 'Maximizing ambient air economizer hours during cooler seasonal periods in plateau regions like Coimbatore and Madurai.',
        points: [
          'Automated psychrometric monitoring evaluating wet-bulb and dry-bulb ambient conditions',
          'Dynamic switching between mechanical DX cooling and water-side economizer loops',
          'Variable primary flow pumping matching chiller staging directly to thermal heat output'
        ],
        impact: 'Substantial annual reduction in mechanical chiller runtime without exceeding thermal tolerances.'
      },
      {
        tag: 'Electrical Modernization',
        title: 'Modular High-Efficiency UPS & Busway Retrofits',
        desc: 'Eliminating legacy step-down transformer losses in enterprise server halls by transitioning to modular busways and transformerless UPS.',
        points: [
          'High-efficiency modular power modules scaling in lockstep with compute population',
          'Overhead busway power delivery minimizing copper cable line resistance and heat generation',
          'Harmonic mitigation maintaining near-unity power factor across variable server power supplies'
        ],
        impact: 'Measurable reduction in electrical distribution losses across the entire power distribution chain.'
      },
      {
        tag: 'Microgrid Integration',
        title: 'Solar PV & Battery Energy Storage (BESS) Microgrid',
        desc: 'Clipping high-tariff peak grid charges while providing localized green energy backup for critical enterprise workloads.',
        points: [
          'Smart inverters synchronizing on-site solar generation with utility grid feeds',
          'Battery storage discharging during regional peak demand tariff windows',
          'Automated load shedding isolating non-essential office circuits during power events'
        ],
        impact: 'Stabilized operational power costs and enhanced facility electrical resilience.'
      }
    ],
    faqs: [
      {
        q: 'What Power Usage Effectiveness (PUE) does GreenNext target in its facility designs?',
        a: 'While actual PUE depends on local climate, facility utilization, and cooling technology, our modern contained architectures are engineered to minimize parasitic overhead, striving for industry-leading efficiency across regional environments.'
      },
      {
        q: 'Does GreenNext claim specific guaranteed energy cost reductions?',
        a: 'No. We strictly adhere to factual engineering practices. All potential savings depend on verified baseline energy audits, utility tariff structures, and server utilization patterns. We provide engineering modeling, not unsupported guarantees.'
      },
      {
        q: 'How does liquid cooling compare to traditional air cooling for energy savings?',
        a: 'Liquid is over 1,000 times more effective at conducting heat than air by volume. Direct-to-chip liquid cooling eliminates high-RPM server fans and reduces chiller compressor load, delivering substantial cooling efficiency advantages for dense workloads.'
      },
      {
        q: 'Can existing data centers integrate renewable solar without disrupting uptime?',
        a: 'Yes. Grid-tied solar installations with automated transfer switches synchronize phase and frequency seamlessly, feeding power into the facility parallel to utility mains without risk of interruption.'
      }
    ],
    relatedLinks: [
      { label: 'Data Center Solutions', href: 'capabilities/data-center-solutions.html' },
      { label: 'AI Infrastructure', href: 'capabilities/ai-infrastructure.html' },
      { label: 'Sustainability Page', href: 'sustainability.html' },
      { label: 'Energy Optimization Solution', href: 'solutions/energy-optimization.html' }
    ]
  },

  'digital-infrastructure': {
    seoTitle: 'Enterprise Digital Infrastructure & Resilient Network Architecture',
    metaDesc: 'Carrier-neutral telecommunications, high-availability data backbones, edge connectivity, and structured cabling for modern enterprise campuses.',
    eyebrow: 'CONNECTED ENTERPRISE FOUNDATIONS',
    headline: 'High-Availability Digital Infrastructure Connecting Core to Edge',
    description: 'We engineer the structured connectivity, high-speed fiber backbones, and hybrid network architectures that keep distributed enterprise systems operating in lockstep.',
    heroPrimary: { text: 'Talk to an Expert', href: '#enquiry' },
    heroSecondary: { text: 'Quick Enquiry', href: '#quick-enquiry' },
    img: 'assets/img/city-skyline-night.webp',
    alt: 'Illuminated smart city skyline representing high-speed regional digital connectivity and enterprise networking',
    caption: 'Carrier-neutral connectivity backbones linking core facilities to distributed regional hubs.',
    deepDive: {
      eyebrow: 'Network Architecture',
      heading: 'Eliminating Single Points of Failure Across Fiber Ingress, Core Switching, and Edge Gateways',
      body: 'Digital infrastructure is only as resilient as its weakest connection. A severed underground fiber cable or an overloaded aggregation switch can isolate an entire computing cluster. GreenNext architectures feature physically diverse fiber entry points, multi-carrier BGP peering, redundant distribution pathways, and high-density structured cabling engineered for decades of reliable transmission.',
      bullets: [
        'Dual, physically separated Meet-Me-Rooms (MMRs) ensuring carrier neutrality and physical redundancy',
        'Automated SDN-based route failover maintaining seamless inter-site replication',
        'High-density optical fiber distribution supporting 100G, 400G, and 800G transition paths',
        'Comprehensive security zoning isolating management, storage, and customer computing traffic'
      ],
      ctaText: 'Discuss Network Architecture',
      ctaHref: 'contact.html',
    },
    benefits: [
      {
        icon: 'network',
        metric: 'Carrier Neutral',
        title: 'Diverse Connectivity',
        desc: 'Ensures enterprise autonomy by facilitating direct access to multiple tier-1 telecommunications providers within the same facility.'
      },
      {
        icon: 'shield',
        metric: 'Sub-Millisecond Edge',
        title: 'Deterministic Latency',
        desc: 'Engineers direct interconnection pathways between core facilities and regional branch locations, eliminating routing detours.'
      },
      {
        icon: 'server',
        metric: 'Future-Proof',
        title: 'Optical Scalability',
        desc: 'Pre-terminated high-density fiber trunks ready to scale from 100G to 800G line rates without requiring disruptive recabling.'
      }
    ],
    useCases: [
      {
        tag: 'Regional Interconnect',
        title: 'Multi-City Enterprise WAN Backbone',
        desc: 'Connecting manufacturing hubs in Coimbatore, commercial centers in Madurai, and logistics hubs in Mangalore with private optical circuits.',
        points: [
          'Encrypted point-to-point fiber interconnects with automated path failover',
          'Zoned bandwidth allocation guaranteeing quality of service (QoS) for enterprise ERP and voice',
          'Centralized SD-WAN orchestration simplifying branch office onboarding'
        ],
        impact: 'Predictable high-speed inter-facility communication with automated sub-second failover.'
      },
      {
        tag: 'Campus Structured Cabling',
        title: 'Enterprise Campus Optical & Copper Infrastructure',
        desc: 'Designing standardized, certified structured cabling systems for multi-building enterprise campuses and technology parks.',
        points: [
          'Color-coded modular patch panel topologies simplifying operational maintenance',
          'Class EA Category 6A copper distribution to workstations and access points',
          'Armored multi-strand single-mode fiber backbones connecting building distributor rooms'
        ],
        impact: 'Clean, manageable cabling infrastructure with clear labeling and 25-year structural longevity.'
      },
      {
        tag: 'Cloud On-Ramp',
        title: 'Direct Hybrid Cloud Direct-Connect Gateways',
        desc: 'Bypassing public internet routing to establish dedicated private interconnects between on-premise hardware and major cloud regions.',
        points: [
          'High-availability dual redundant BGP cross-connects into major cloud on-ramps',
          'Consistent throughput free from public internet congestion and route hijacking',
          'Reduced data egress latency for hybrid database synchronization'
        ],
        impact: 'Enhanced security posture and deterministic performance for sensitive enterprise data transfers.'
      }
    ],
    faqs: [
      {
        q: 'What is a carrier-neutral data center, and why is it important?',
        a: 'Carrier neutrality allows clients to choose between multiple telecommunication providers within one facility, preventing vendor lock-in, fostering competitive bandwidth pricing, and enabling true physical circuit redundancy.'
      },
      {
        q: 'How does GreenNext ensure physical cable pathway redundancy?',
        a: 'We design completely segregated pathways: dual building entry conduits spaced at opposite sides of the property, separate riser shafts, and dual overhead cable trays throughout data halls.'
      },
      {
        q: 'Can our infrastructure support 400G and 800G optical networking in the future?',
        a: 'Yes. We engineer cable plant infrastructures using high-quality OM5 multimode and OS2 single-mode optical fiber with low insertion loss, fully prepared for upcoming transceivers.'
      },
      {
        q: 'How does GreenNext handle network security at the physical layer?',
        a: 'All telecommunication conduits, Meet-Me-Rooms, and distribution racks feature strict access control, keycard-locked cabinets, tamper sensors, and 24/7 video surveillance.'
      }
    ],
    relatedLinks: [
      { label: 'AI Infrastructure', href: 'capabilities/ai-infrastructure.html' },
      { label: 'Data Center Solutions', href: 'capabilities/data-center-solutions.html' },
      { label: 'Smart Infrastructure', href: 'solutions/smart-infrastructure.html' },
      { label: 'Trichy Connectivity Hub', href: 'locations/trichy.html' }
    ]
  }
};

export const industriesContent = {
  healthcare: {
    seoTitle: 'Healthcare Digital Infrastructure & Medical Data Center Solutions',
    metaDesc: 'Secure, compliant digital infrastructure and low-latency computing engineered for hospital networks, medical imaging (PACS), and sensitive patient records.',
    eyebrow: 'HEALTHCARE & LIFE SCIENCES',
    headline: 'Mission-Critical Digital Infrastructure for Modern Healthcare Systems',
    description: 'Ensure 24/7 clinical availability, secure patient data sovereignty, and high-performance imaging storage with specialized healthcare infrastructure.',
    heroPrimary: { text: 'Talk to an Expert', href: '#enquiry' },
    heroSecondary: { text: 'Quick Enquiry', href: '#quick-enquiry' },
    img: 'assets/img/control-room.webp',
    alt: 'Healthcare IT systems and critical clinical monitoring infrastructure',
    caption: 'Zero-downtime infrastructure supporting electronic health records and diagnostic AI.',
    deepDive: {
      eyebrow: 'Clinical Continuity',
      heading: 'Protecting Patient Care with Continuous Power and Resilient Medical Records Access',
      body: 'In healthcare, infrastructure downtime directly impacts clinical outcomes. Modern hospital networks require instant retrieval of massive DICOM medical imaging files, real-time patient monitoring telemetry, and uninterrupted access to Electronic Health Records (EHR). GreenNext designs healthcare computing architectures that prioritize high availability, end-to-end data encryption, and strict regulatory compliance.',
      bullets: [
        'Continuous power conditioning ensuring medical imaging and telemetry servers never experience brownouts',
        'Segmented network architectures isolating clinical monitoring from public hospital Wi-Fi',
        'Tiered high-capacity storage accommodating multi-petabyte PACS archives with rapid retrieval',
        'On-premise edge computing nodes enabling local diagnostic AI inference without cloud latency'
      ],
      ctaText: 'Consult Healthcare Specialist',
      ctaHref: 'contact.html',
    },
    benefits: [
      {
        icon: 'heart',
        metric: '99.999% Design',
        title: 'Zero Clinical Interruption',
        desc: 'Concurrent maintainability ensures life-critical hospital data systems remain online during routine electrical and HVAC maintenance.'
      },
      {
        icon: 'shield',
        metric: 'HIPAA & DISHA Aligned',
        title: 'Patient Data Protection',
        desc: 'Physical and logical security frameworks engineered around strict health data privacy and sovereignty regulations.'
      },
      {
        icon: 'database',
        metric: 'High-Throughput PACS',
        title: 'Rapid Diagnostic Imaging',
        desc: 'Low-latency local storage backbones allow clinicians to load high-resolution MRI and CT scans in seconds at the point of care.'
      }
    ],
    useCases: [
      {
        tag: 'Regional Hospital Network',
        title: 'Centralized EHR & Disaster Recovery Across Hospital Clusters',
        desc: 'Synchronizing medical records across hospital branches in Madurai and Coimbatore with real-time failover capabilities.',
        points: [
          'Encrypted inter-hospital fiber links with continuous database mirroring',
          'Automated disaster recovery cutover preventing loss of active patient charts',
          'Strict role-based access control protecting confidential health records'
        ],
        impact: 'Seamless clinical records availability across multi-specialty regional branches.'
      },
      {
        tag: 'Diagnostic AI',
        title: 'On-Premise AI Inference for Pathology & Radiology',
        desc: 'Deploying high-density GPU computing clusters inside hospital data centers for automated diagnostic image analysis.',
        points: [
          'Localized compute processing sensitive scans without external internet transit',
          'Dedicated thermal containment handling high-wattage medical workstation nodes',
          'Deterministic network priority ensuring imaging queues never block urgent trauma scans'
        ],
        impact: 'Sub-minute diagnostic AI reporting assisting clinicians in critical emergency triage.'
      }
    ],
    faqs: [
      {
        q: 'How does GreenNext handle patient data confidentiality and regulatory compliance?',
        a: 'Our healthcare infrastructure designs enforce physical compartmentalization, biometric access, end-to-end hardware encryption, and isolated network VLANs aligned with national and international health data standards.'
      },
      {
        q: 'Can hospital systems continue operating if utility power fails completely?',
        a: 'Yes. Our architectures incorporate N+1 diesel generator sets with on-site fuel autonomy and zero-transfer-time double-conversion UPS systems to bridge all electrical interruptions.'
      },
      {
        q: 'How do you address the massive storage requirements of modern 3D medical imaging?',
        a: 'We design tiered storage architectures: fast NVMe flash for immediate 30-day clinical access, automated to high-density dense storage tiers for long-term legal archival retention.'
      }
    ],
    relatedLinks: [
      { label: 'Data Center Solutions', href: 'capabilities/data-center-solutions.html' },
      { label: 'AI Infrastructure', href: 'capabilities/ai-infrastructure.html' },
      { label: 'Madurai Healthcare Hub', href: 'locations/madurai.html' },
      { label: 'Enterprise Solutions', href: 'industries/enterprise.html' }
    ]
  },

  finance: {
    seoTitle: 'Financial Services Digital Infrastructure & Banking Data Centers',
    metaDesc: 'Low-latency transaction infrastructure, regulatory compliance, and resilient disaster recovery data centers for banks, fintech, and insurance institutions.',
    eyebrow: 'BANKING, FINANCIAL SERVICES & INSURANCE',
    headline: 'High-Integrity Digital Infrastructure for Financial Institutions',
    description: 'Power high-frequency transaction processing, core banking continuity, and financial compliance with fault-tolerant data center foundations.',
    heroPrimary: { text: 'Talk to an Expert', href: '#enquiry' },
    heroSecondary: { text: 'Quick Enquiry', href: '#quick-enquiry' },
    img: 'assets/img/circuit-board.webp',
    alt: 'High-security financial data processing server hardware and network infrastructure',
    caption: 'Ultra-low latency and sovereign data security designed for core banking operations.',
    deepDive: {
      eyebrow: 'Financial Resilience',
      heading: 'Protecting Core Banking Ledgers and High-Throughput Payment Gateways',
      body: 'Financial institutions operate under strict regulatory scrutiny, requiring deterministic latency, zero transaction loss, and robust business continuity. GreenNext delivers data center and digital infrastructure architectures built for core banking, fraud detection, and multi-region disaster recovery, adhering strictly to RBI compliance guidelines and international financial security standards.',
      bullets: [
        'Active-active synchronous data center mirroring ensuring zero transaction rollback during failovers',
        'Sub-millisecond low-latency switching fabric designed for high-concurrency payment gateways',
        'Physical air-gapping and cryptographic key storage modules (HSM) protection',
        'Automated regulatory audit trail generation across environmental and access controls'
      ],
      ctaText: 'Consult Banking Specialist',
      ctaHref: 'contact.html',
    },
    benefits: [
      {
        icon: 'bank',
        metric: 'Zero Data Loss',
        title: 'Synchronous Replication',
        desc: 'Engineered for sub-second RPO, ensuring no financial ledger records or transaction logs are lost during an unexpected outage.'
      },
      {
        icon: 'shield',
        metric: 'RBI Aligned',
        title: 'Regulatory Audit Readiness',
        desc: 'Comprehensive physical access logs, environmental telemetry, and failover validation protocols simplify compliance inspections.'
      },
      {
        icon: 'spark',
        metric: 'Real-Time Fraud ML',
        title: 'High-Throughput Analytics',
        desc: 'Accelerated compute capacity supporting parallel machine learning inference to score financial transactions for fraud in real time.'
      }
    ],
    useCases: [
      {
        tag: 'Core Banking Systems',
        title: 'Tier-Grade Primary & Secondary Banking Data Halls',
        desc: 'Engineering high-availability primary compute facilities coupled with synchronized regional disaster recovery sites.',
        points: [
          'Dual redundant incoming power feeds from separate municipal sub-stations',
          'Carrier-neutral diverse fiber routes connecting clearing house gateways',
          'Dedicated hardware security module (HSM) physical enclosures'
        ],
        impact: 'Unbroken banking operations and instant automated failover capability.'
      },
      {
        tag: 'Fintech Payment Ingest',
        title: 'Ultra-Low Latency Payment Processing Infrastructure',
        desc: 'Optimizing network and server response times for high-volume digital wallet and UPI payment processing.',
        points: [
          'Kernel-bypass high-throughput network cards minimizing packet processing delays',
          'NVMe flash storage arrays handling massive write-heavy database transaction queues',
          'Isolated private interconnection avoiding public internet packet jitter'
        ],
        impact: 'High transaction success rates and sub-second payment confirmation times.'
      }
    ],
    faqs: [
      {
        q: 'How does GreenNext support regulatory data localization and sovereignty requirements?',
        a: 'Our regional data center models keep all customer financial records, cryptographic keys, and transaction ledgers physically hosted within sovereign territory, satisfying national compliance mandates.'
      },
      {
        q: 'What recovery time objectives (RTO) are achievable with your disaster recovery designs?',
        a: 'With active-active synchronized architectures, RTO can approach near-zero, while active-passive automated warm standby configurations typically achieve recovery within minutes.'
      },
      {
        q: 'How is physical security enforced in banking co-location or private rooms?',
        a: 'We specify multi-factor biometric authentication, anti-tailgating mantrap entries, CCTV with behavioral analytics, and continuous perimeter monitoring.'
      }
    ],
    relatedLinks: [
      { label: 'Data Center Solutions', href: 'capabilities/data-center-solutions.html' },
      { label: 'Intelligent Automation', href: 'capabilities/intelligent-automation.html' },
      { label: 'Digital Infrastructure', href: 'capabilities/digital-infrastructure.html' },
      { label: 'Coimbatore Financial Hub', href: 'locations/coimbatore.html' }
    ]
  },

  manufacturing: {
    seoTitle: 'Smart Manufacturing & Industrial IoT Digital Infrastructure',
    metaDesc: 'Industrial edge computing, factory floor automation networks, resilient environmental protection, and predictive maintenance infrastructure.',
    eyebrow: 'INDUSTRIAL AUTOMATION & MANUFACTURING',
    headline: 'Rugged Digital Infrastructure for Industry 4.0 & Smart Factories',
    description: 'Connect industrial IoT, automated assembly lines, and enterprise supply chain operations with hardened computing infrastructure built for tough environments.',
    heroPrimary: { text: 'Talk to an Expert', href: '#enquiry' },
    heroSecondary: { text: 'Quick Enquiry', href: '#quick-enquiry' },
    img: 'assets/img/solar-panels.webp',
    alt: 'Industrial manufacturing facility powered by smart energy management and automated digital infrastructure',
    caption: 'Hardened edge computing and factory-floor IoT integration for continuous manufacturing.',
    deepDive: {
      eyebrow: 'Industrial Reliability',
      heading: 'Bridging Operational Technology (OT) and Enterprise IT with Resilient Edge Nodes',
      body: 'Modern manufacturing plants cannot tolerate network lag or server crashes that halt assembly lines. High dust levels, electrical noise, vibration, and temperature swings on factory floors demand specialized edge computing and hardened networking. GreenNext bridges operational technology (OT) and enterprise IT, deploying robust micro-data centers and real-time analytics across major industrial corridors like Coimbatore and Trichy.',
      bullets: [
        'Sealed IP-rated modular micro-data centers with internal climate control for shop-floor deployment',
        'Time-sensitive networking (TSN) ensuring deterministic machine-to-machine communication',
        'Continuous power isolation protecting delicate industrial controllers from plant machinery surges',
        'Edge AI inference engines evaluating acoustic and thermal sensor feeds for predictive maintenance'
      ],
      ctaText: 'Consult Manufacturing Specialist',
      ctaHref: 'contact.html',
    },
    benefits: [
      {
        icon: 'factory',
        metric: 'Zero Line Stops',
        title: 'Shop-Floor Resilience',
        desc: 'Protects critical MES and SCADA applications from factory floor dust, electromagnetic interference, and power spikes.'
      },
      {
        icon: 'cpu',
        metric: 'Real-Time IoT',
        title: 'Edge Processing Proximity',
        desc: 'Processes thousands of sensor telemetry signals locally, preventing WAN bandwidth choke and ensuring instant automated safety shutdowns.'
      },
      {
        icon: 'spark',
        metric: 'Predictive Maintenance',
        title: 'Downtime Prevention',
        desc: 'Continuous vibration and thermal analysis identifies motor and bearing degradation before machine catastrophic breakdown occurs.'
      }
    ],
    useCases: [
      {
        tag: 'Automotive & Precision Engineering',
        title: 'Shop-Floor Edge Compute & Computer Vision Quality Control',
        desc: 'Inspecting manufactured components on high-speed conveyor belts using localized GPU inference nodes.',
        points: [
          'Hardened edge server enclosures mounted directly adjacent to production lines',
          'High-speed optical fiber interconnects linking multiple robotic inspection cells',
          'Local telemetry buffering ensuring visual inspection continues during internet drops'
        ],
        impact: 'Instant defect detection with zero latency and zero dependency on external cloud connectivity.'
      },
      {
        tag: 'Supply Chain & ERP',
        title: 'Unified Plant-to-Warehouse Digital Backbone',
        desc: 'Connecting automated storage and retrieval systems (ASRS) with central manufacturing enterprise resource planning.',
        points: [
          'Redundant industrial wireless and fiber coverage across expansive plant floors',
          'Battery backup systems buffering against regional grid voltage sags',
          'Secure OT/IT firewalls isolating industrial control systems from corporate networks'
        ],
        impact: 'Accurate real-time inventory visibility and continuous material handling automation.'
      }
    ],
    faqs: [
      {
        q: 'How do you protect IT equipment from dust and heat on manufacturing floors?',
        a: 'We deploy self-contained, sealed modular enclosures featuring closed-loop DX cooling and high-efficiency particulate filtration, isolating IT hardware from harsh ambient factory conditions.'
      },
      {
        q: 'How does edge computing benefit smart factories compared to pure cloud computing?',
        a: 'Edge computing processes machine telemetry in milliseconds without sending massive raw sensor streams over the internet, saving bandwidth and ensuring production lines never stall when external internet fails.'
      },
      {
        q: 'Can GreenNext integrate with legacy industrial PLC and SCADA equipment?',
        a: 'Yes. Our architectures support standard industrial protocols (Modbus, Profinet, OPC-UA) through secure gateway adapters that translate machine data into modern enterprise formats.'
      }
    ],
    relatedLinks: [
      { label: 'Intelligent Automation', href: 'capabilities/intelligent-automation.html' },
      { label: 'Energy Efficiency', href: 'capabilities/energy-efficiency.html' },
      { label: 'Coimbatore Industrial Hub', href: 'locations/coimbatore.html' },
      { label: 'Trichy Industrial Hub', href: 'locations/trichy.html' }
    ]
  },

  technology: {
    seoTitle: 'Technology & SaaS Digital Infrastructure Solutions',
    metaDesc: 'Scalable data center foundations, AI compute clusters, multi-tenant cloud connectivity, and high-density hosting for software enterprises and SaaS providers.',
    eyebrow: 'TECHNOLOGY COMPANIES & SAAS PROVIDERS',
    headline: 'High-Velocity Digital Infrastructure for Scaling Technology Companies',
    description: 'Empower engineering teams, SaaS platforms, and AI product companies with agile, high-density infrastructure built for rapid iteration and scale.',
    heroPrimary: { text: 'Talk to an Expert', href: '#enquiry' },
    heroSecondary: { text: 'Quick Enquiry', href: '#quick-enquiry' },
    img: 'assets/img/city-skyline-night.webp',
    alt: 'High-tech enterprise innovation hub and software campus digital connectivity',
    caption: 'High-density scalable computing infrastructure engineered for modern tech enterprises.',
    deepDive: {
      eyebrow: 'SaaS Scalability',
      heading: 'Infrastructure That Accelerates Deployment Velocity Without Runaway Cloud Costs',
      body: 'Fast-growing software companies often face a dual challenge: rapid user concurrency growth and escalating public cloud egress and compute bills. GreenNext helps technology companies implement optimized hybrid infrastructure foundations—combining private high-density compute pods for steady-state workloads with flexible cloud interconnects for peak traffic surges.',
      bullets: [
        'High-density server cabinets supporting intensive containerized Kubernetes clusters',
        'Direct low-latency cloud interconnects allowing seamless hybrid data mobility',
        'Automated telemetry dashboards tracking resource efficiency and power allocation per cluster',
        'Carrier-neutral multi-homed BGP connectivity guaranteeing uninterrupted global user access'
      ],
      ctaText: 'Schedule Tech Infrastructure Review',
      ctaHref: 'contact.html',
    },
    benefits: [
      {
        icon: 'chip',
        metric: 'Predictable TCO',
        title: 'Hybrid Economics',
        desc: 'Reclaim budget from high public cloud compute rates by repatriating predictable production workloads to efficient dedicated private infrastructure.'
      },
      {
        icon: 'server',
        metric: 'High Concurrency',
        title: 'Uncompromised Performance',
        desc: 'Dedicated physical hardware eliminates noisy-neighbor virtualization contention, delivering stable sub-millisecond API response times.'
      },
      {
        icon: 'network',
        metric: 'Multi-Cloud Interconnect',
        title: 'Architectural Flexibility',
        desc: 'Direct private peering into all major public cloud providers enables multi-cloud resilience without public internet exposure.'
      }
    ],
    useCases: [
      {
        tag: 'SaaS Platforms',
        title: 'High-Density Kubernetes Application Clusters',
        desc: 'Hosting mission-critical multi-tenant SaaS application workloads on private, high-performance bare metal nodes.',
        points: [
          'High-throughput 100G top-of-rack switching fabric eliminating container network bottlenecks',
          'Direct-attach NVMe storage pools delivering hundreds of thousands of IOPS for distributed databases',
          'Modular aisle containment accommodating rapid rack-density expansions'
        ],
        impact: 'Substantially faster database query performance and predictable monthly infrastructure expenditure.'
      },
      {
        tag: 'AI Startup & Lab',
        title: 'Dedicated Accelerator Compute Pods',
        desc: 'Providing specialized high-power compute clusters for AI product teams training and deploying customer-facing models.',
        points: [
          'Custom power busway distribution accommodating high-wattage accelerator nodes',
          'Liquid cooling loops maintaining peak clock frequencies during continuous batch runs',
          'Isolated staging environments allowing safe benchmarking of new software builds'
        ],
        impact: 'Shortened model deployment cycles and sustained compute stability under continuous load.'
      }
    ],
    faqs: [
      {
        q: 'Why should a SaaS company consider private data center infrastructure over public cloud?',
        a: 'For stable, predictable workloads, private infrastructure typically offers 40% to 60% lower total cost of ownership compared to continuous cloud rental, while delivering superior I/O performance and avoiding noisy-neighbor lag.'
      },
      {
        q: 'How fast can a technology enterprise scale additional capacity with GreenNext?',
        a: 'Our modular facility designs feature pre-provisioned power busways and overhead fiber runs, allowing new server cabinets to be deployed and energized in days rather than months.'
      },
      {
        q: 'Does GreenNext support DevOps and infrastructure-as-code automation?',
        a: 'Yes. All facility telemetry and automated environmental controls expose open RESTful APIs that integrate cleanly with modern enterprise monitoring and observability stacks like Prometheus and Grafana.'
      }
    ],
    relatedLinks: [
      { label: 'AI Infrastructure', href: 'capabilities/ai-infrastructure.html' },
      { label: 'Digital Infrastructure', href: 'capabilities/digital-infrastructure.html' },
      { label: 'AI Data Centers', href: 'solutions/ai-data-centers.html' },
      { label: 'Mangalore Tech Gateway', href: 'locations/mangalore.html' }
    ]
  },

  government: {
    seoTitle: 'Public Sector & Government Digital Infrastructure Solutions',
    metaDesc: 'Sovereign data centers, citizen services digital infrastructure, air-gapped security, and resilient government computing facilities.',
    eyebrow: 'PUBLIC SECTOR & E-GOVERNANCE',
    headline: 'Secure, Sovereign Digital Infrastructure for Public Sector Excellence',
    description: 'Ensure citizen service continuity, public data sovereignty, and uncompromised cybersecurity with robust government digital infrastructure.',
    heroPrimary: { text: 'Talk to an Expert', href: '#enquiry' },
    heroSecondary: { text: 'Quick Enquiry', href: '#quick-enquiry' },
    img: 'assets/img/control-room.webp',
    alt: 'Secure public sector command and operations center monitoring e-governance infrastructure',
    caption: 'Air-gapped security and continuous resilience powering mission-critical citizen services.',
    deepDive: {
      eyebrow: 'Sovereign Integrity',
      heading: 'Protecting Public Services and Citizen Data with Sovereign Infrastructure',
      body: 'Public sector digital infrastructure must meet the highest bars of data sovereignty, physical perimeter defense, and continuous availability during civic crises. GreenNext designs government-grade computing centers that support statewide citizen portals, land registry databases, smart city operations, and emergency response coordination.',
      bullets: [
        'Complete data residency guarantees ensuring all public records stay within certified physical jurisdictions',
        'Physical compartmentalization including air-gapped network zones and tempest-shielded control suites',
        'Multi-tiered backup power with on-site fuel autonomy to maintain citizen portals during civil grid blackouts',
        'Carrier-neutral optical backbones providing private, encrypted links to district administrative headquarters'
      ],
      ctaText: 'Consult Public Sector Lead',
      ctaHref: 'contact.html',
    },
    benefits: [
      {
        icon: 'landmark',
        metric: 'Sovereign Data',
        title: 'Guaranteed Data Residency',
        desc: 'Ensures sensitive citizen data, tax records, and identity databases remain strictly localized within sovereign borders.'
      },
      {
        icon: 'shield',
        metric: 'Crisis Resilient',
        title: 'Emergency Continuity',
        desc: 'Engineered to remain fully operational during regional environmental storms or power grid collapses, sustaining emergency dispatch.'
      },
      {
        icon: 'network',
        metric: 'Secure E-Governance',
        title: 'Isolated Network Zoning',
        desc: 'Separates public-facing portal front-ends from confidential administrative back-end registries through verified security zones.'
      }
    ],
    useCases: [
      {
        tag: 'E-Governance Portals',
        title: 'Centralized Citizen Services & Document Registry Hub',
        desc: 'Hosting mission-critical municipal records, licensing portals, and welfare disbursement platforms.',
        points: [
          'High-concurrency load-balancing handling peak month-end tax filing and benefit disbursements',
          'Immutable optical storage tiers archiving statutory records against data tampering',
          'Tier-Grade power redundancy ensuring public websites never experience downtime'
        ],
        impact: 'High public trust with continuous, rapid citizen access to vital civil services.'
      },
      {
        tag: 'Smart City & Public Safety',
        title: 'Smart City Command & Control Centers (ICCC)',
        desc: 'Deploying municipal sensor, traffic management, and emergency response infrastructure.',
        points: [
          'Centralized video ingest server farms processing thousands of municipal traffic feeds',
          'Emergency dispatch failover links connecting police, fire, and medical teams',
          'Dedicated operations control rooms with ergonomic thermal and acoustic design'
        ],
        impact: 'Faster civic emergency response times and unified urban operations visibility.'
      }
    ],
    faqs: [
      {
        q: 'How does GreenNext ensure government compliance with data sovereignty directives?',
        a: 'Our facilities and architectures maintain 100% geographic residency within designated borders, accompanied by strict chain-of-custody documentation and physical separation from commercial multi-tenant environments.'
      },
      {
        q: 'How are facilities protected against civic disruptions or extreme weather?',
        a: 'We select locations outside historical 100-year flood zones, incorporate hardened building envelopes, and install dual-source fuel storage for extended continuous off-grid operation.'
      },
      {
        q: 'Can legacy government software applications be migrated to your modern infrastructure?',
        a: 'Yes. We support hybrid virtualization architectures that host legacy mainframe and client-server systems alongside modern containerized microservices without requiring complete software rewrites.'
      }
    ],
    relatedLinks: [
      { label: 'Data Center Solutions', href: 'capabilities/data-center-solutions.html' },
      { label: 'Digital Infrastructure', href: 'capabilities/digital-infrastructure.html' },
      { label: 'Madurai Hub', href: 'locations/madurai.html' },
      { label: 'Trichy Hub', href: 'locations/trichy.html' }
    ]
  },

  education: {
    seoTitle: 'Higher Education & Research Computing Infrastructure',
    metaDesc: 'High-performance computing (HPC) clusters, campus digital networks, research laboratories, and resilient student learning portals.',
    eyebrow: 'HIGHER EDUCATION & RESEARCH INSTITUTIONS',
    headline: 'High-Performance Computing & Digital Foundations for Academic Excellence',
    description: 'Empower faculty research, compute-heavy scientific simulations, and campus-wide digital learning with scalable, cost-effective infrastructure.',
    heroPrimary: { text: 'Talk to an Expert', href: '#enquiry' },
    heroSecondary: { text: 'Quick Enquiry', href: '#quick-enquiry' },
    img: 'assets/img/greenery-building.webp',
    alt: 'Modern university academic campus featuring high-speed digital research infrastructure',
    caption: 'High-performance research clusters and resilient campus digital networks.',
    deepDive: {
      eyebrow: 'Research Computing',
      heading: 'Empowering Scientific Simulation and Multi-Campus Learning Networks',
      body: 'Universities and research institutions require dual-purpose digital infrastructure: high-performance computing (HPC) for resource-heavy academic simulations (bioinformatics, physics, engineering), alongside highly available campus networks supporting tens of thousands of concurrent students accessing learning portals and digital libraries.',
      bullets: [
        'Dedicated high-density HPC compute clusters supporting MPI and parallel scientific workloads',
        'Campus-wide optical fiber backbones delivering high-speed connectivity to departments and hostels',
        'Secure identity management and eduroam-compatible network authentication',
        'Energy-efficient computing architectures designed to stay within academic budgetary boundaries'
      ],
      ctaText: 'Consult Academic Specialist',
      ctaHref: 'contact.html',
    },
    benefits: [
      {
        icon: 'graduation',
        metric: 'HPC Ready',
        title: 'Accelerated Scientific Discovery',
        desc: 'Provides faculty and PhD scholars with dedicated high-performance computing, drastically reducing simulation runtimes.'
      },
      {
        icon: 'network',
        metric: 'Campus Connectivity',
        title: 'Seamless Digital Learning',
        desc: 'Ensures digital learning management systems and virtual examination portals remain responsive under peak student traffic.'
      },
      {
        icon: 'bolt',
        metric: 'Grant-Efficient',
        title: 'Sustainable Operating Costs',
        desc: 'High-efficiency cooling and power architectures maximize productive compute output within allocated academic research grants.'
      }
    ],
    useCases: [
      {
        tag: 'Scientific Research',
        title: 'Centralized University Research Computing (HPC) Facility',
        desc: 'Consolidating fragmented departmental server closets into an efficient, unified university supercomputing center.',
        points: [
          'High-density server racks with shared InfiniBand or high-speed Ethernet fabrics',
          'Zoned cooling preventing thermal shutdown during multi-day continuous numerical simulations',
          'Fair-share job scheduling engines giving equal access to all engineering disciplines'
        ],
        impact: 'Attracted prestigious research grants and shortened scientific paper publication timelines.'
      },
      {
        tag: 'Campus Operations',
        title: 'Unified Digital Campus Backbone & Remote Examination Portal',
        desc: 'Delivering secure, high-concurrency access for online semester exams and institutional administration.',
        points: [
          'Redundant 10G campus optical rings linking academic blocks and server halls',
          'DDoS protection safeguarding examination servers from external manipulation',
          'Automated daily backup replication preserving university institutional archives'
        ],
        impact: 'Zero exam interruption and seamless campus-wide Wi-Fi performance.'
      }
    ],
    faqs: [
      {
        q: 'How does GreenNext accommodate the cyclical budget constraints of academic institutions?',
        a: 'We offer modular infrastructure designs that can be built in phases, allowing universities to deploy foundational capacity today and expand as research grants and budget cycles permit.'
      },
      {
        q: 'Can existing university server rooms be consolidated to save energy?',
        a: 'Yes. Departmental server closets typically run with very poor PUE. Consolidating into a centralized, contained mini-data center can reduce institutional energy waste substantially.'
      },
      {
        q: 'How do you secure academic research data against cyber threats and intellectual property theft?',
        a: 'We implement zero-trust network zoning, robust firewall segmentation, and secure role-based access controls to isolate proprietary scientific research from general student networks.'
      }
    ],
    relatedLinks: [
      { label: 'AI Infrastructure', href: 'capabilities/ai-infrastructure.html' },
      { label: 'Energy Efficiency', href: 'capabilities/energy-efficiency.html' },
      { label: 'Trichy Academic Corridor', href: 'locations/trichy.html' },
      { label: 'Technology Solutions', href: 'industries/technology.html' }
    ]
  },

  retail: {
    seoTitle: 'Retail & E-Commerce Digital Infrastructure Solutions',
    metaDesc: 'Omnichannel digital infrastructure, low-latency checkout, edge store computing, and automated inventory logistics for modern retailers.',
    eyebrow: 'RETAIL & OMNICHANNEL COMMERCE',
    headline: 'High-Availability Infrastructure for Peak-Season Commerce & Logistics',
    description: 'Keep e-commerce storefronts responsive, POS systems online, and distribution centers operating seamlessly during massive seasonal surges.',
    heroPrimary: { text: 'Talk to an Expert', href: '#enquiry' },
    heroSecondary: { text: 'Quick Enquiry', href: '#quick-enquiry' },
    img: 'assets/img/city-skyline-night.webp',
    alt: 'Commercial retail digital hub and smart logistics operations connected via modern digital infrastructure',
    caption: 'Resilient digital backbones ensuring zero transaction failure during peak retail flash sales.',
    deepDive: {
      eyebrow: 'Commerce Availability',
      heading: 'Surviving Flash Sales and Unifying In-Store and Online Customer Journeys',
      body: 'In retail and e-commerce, every second of checkout latency correlates directly with abandoned shopping carts and lost revenue. During festival flash sales, traffic spikes tenfold in seconds. GreenNext delivers elastic digital infrastructure that handles massive concurrency spikes while connecting in-store point-of-sale (POS) systems, automated distribution hubs, and real-time inventory databases.',
      bullets: [
        'High-concurrency database infrastructure handling flash-sale inventory locks and payments',
        'Edge micro-servers deployed across distribution centers for barcode scanning and packing automation',
        'Direct low-latency interconnects to major payment gateways and logistics carrier APIs',
        'Zero-downtime maintenance windows allowing continuous 24/7 global catalog browsing'
      ],
      ctaText: 'Consult Retail Specialist',
      ctaHref: 'contact.html',
    },
    benefits: [
      {
        icon: 'cart',
        metric: 'Peak Resilient',
        title: 'Zero Flash-Sale Crashes',
        desc: 'Infrastructure engineered to absorb massive concurrency spikes without slowing checkout or dropping payment sessions.'
      },
      {
        icon: 'network',
        metric: 'Omnichannel Sync',
        title: 'Real-Time Inventory Visibility',
        desc: 'Synchronizes physical retail store sales with online inventories instantly, preventing accidental double-selling.'
      },
      {
        icon: 'shield',
        metric: 'PCI-DSS Aligned',
        title: 'Secure Payment Processing',
        desc: 'Hardware security modules and isolated network segments protect customer card details and transaction ledgers.'
      }
    ],
    useCases: [
      {
        tag: 'E-Commerce Platform',
        title: 'Flash-Sale Peak Scalability & Payment Gateway Infrastructure',
        desc: 'Powering high-traffic e-commerce storefronts during high-volume seasonal shopping festivals.',
        points: [
          'Memory-optimized database caching nodes handling massive concurrent catalog reads',
          'Low-latency private peering routes directly into major payment aggregators',
          'Continuous real-time synthetic monitoring tracking checkout funnel latency'
        ],
        impact: 'Flawless checkout execution and record sales throughput during festival promotions.'
      },
      {
        tag: 'Warehouse & Logistics',
        title: 'Automated Regional Distribution Center Edge Backbone',
        desc: 'Connecting automated sorting conveyor belts, handheld scanners, and fleet dispatch across regional hubs.',
        points: [
          'Ruggedized edge servers maintaining distribution center sorting during internet hiccups',
          'High-density Wi-Fi 6 coverage across multi-acre warehouse storage zones',
          'Continuous battery backup preventing automated sorting line resets'
        ],
        impact: 'Rapid order dispatch times and accurate real-time shipment status tracking.'
      }
    ],
    faqs: [
      {
        q: 'How does GreenNext prepare retail infrastructure for seasonal shopping spikes?',
        a: 'We implement hybrid burst capacity models: foundational private infrastructure handles everyday steady traffic at low cost, with pre-provisioned rapid scale-out pathways for peak promotional weeks.'
      },
      {
        q: 'Can physical retail branches continue ringing up sales if their internet disconnects?',
        a: 'Yes. We design edge-resilient store architectures where local point-of-sale servers cache transactions and inventory locally, automatically synchronizing with central databases when connections restore.'
      },
      {
        q: 'How do you ensure compliance with payment card industry (PCI-DSS) requirements?',
        a: 'Our network topologies enforce strict physical and logical zoning: payment data traverses dedicated, encrypted VLANs completely segregated from general corporate and customer guest traffic.'
      }
    ],
    relatedLinks: [
      { label: 'Data Center Solutions', href: 'capabilities/data-center-solutions.html' },
      { label: 'Digital Infrastructure', href: 'capabilities/digital-infrastructure.html' },
      { label: 'Coimbatore Commercial Hub', href: 'locations/coimbatore.html' },
      { label: 'Mangalore Logistics Gateway', href: 'locations/mangalore.html' }
    ]
  },

  enterprise: {
    seoTitle: 'Enterprise Digital Infrastructure & Corporate IT Modernization',
    metaDesc: 'Scalable corporate data centers, hybrid cloud infrastructure, multi-site network resilience, and sustainable IT modernization for large corporations.',
    eyebrow: 'LARGE ENTERPRISES & CONGLOMERATES',
    headline: 'Unified Digital Infrastructure for the Modern Multi-Location Enterprise',
    description: 'Transform legacy corporate server rooms into modern, energy-efficient data center foundations built for hybrid cloud, AI, and distributed teams.',
    heroPrimary: { text: 'Talk to an Expert', href: '#enquiry' },
    heroSecondary: { text: 'Quick Enquiry', href: '#quick-enquiry' },
    img: 'assets/img/hero-banner.png',
    alt: 'Enterprise technology campus and digital data center infrastructure operations',
    caption: 'Unified enterprise infrastructure connecting corporate headquarters to regional subsidiaries.',
    deepDive: {
      eyebrow: 'Corporate Modernization',
      heading: 'Unifying Siloed Legacy Infrastructure into a Single Cohesive Operational Fabric',
      body: 'As enterprise conglomerates expand through acquisitions and organic growth, they inherit a fragmented maze of disparate server rooms, conflicting network technologies, and escalating utility costs. GreenNext partners with CIOs and enterprise architects to systematically consolidate infrastructure—establishing standardized, energy-efficient data centers and unified operational visibility.',
      bullets: [
        'Enterprise infrastructure consolidation replacing scattered departmental server rooms',
        'Seven-layer architectural alignment linking corporate ERP, connectivity, and cooling',
        'Enterprise-grade disaster recovery ensuring multi-site operational resilience',
        'Actionable environmental and carbon telemetry supporting corporate ESG reporting'
      ],
      ctaText: 'Schedule Enterprise Strategy Session',
      ctaHref: 'contact.html',
    },
    benefits: [
      {
        icon: 'briefcase',
        metric: 'Consolidated TCO',
        title: 'Operational Rationalization',
        desc: 'Replaces sprawling, inefficient legacy server closets with centralized, contained high-density white space, slashing ongoing maintenance overhead.'
      },
      {
        icon: 'shield',
        metric: 'Enterprise Uptime',
        title: 'Business Continuity Guarantee',
        desc: 'Concurrent maintainability ensures mission-critical ERP, billing, and communication suites operate without scheduled maintenance outages.'
      },
      {
        icon: 'spark',
        metric: 'AI-Ready Platform',
        title: 'Future-Proof Foundation',
        desc: 'Pre-provisions high-power electrical busways and optical cabling, allowing the enterprise to deploy internal AI and analytics clusters on demand.'
      }
    ],
    useCases: [
      {
        tag: 'Corporate Consolidation',
        title: 'Multi-Subsidiary Private Cloud & ERP Consolidation',
        desc: 'Migrating legacy dispersed branch server rooms into a unified regional enterprise data center hall.',
        points: [
          'High-availability hyperconverged computing infrastructure hosting all corporate ERP systems',
          'Tier-Grade power and precision cooling architectures ensuring continuous operation',
          'Role-based multi-tenant management allowing independent subsidiary IT governance'
        ],
        impact: 'Greatly simplified corporate IT management, lower licensing overhead, and enhanced data security.'
      },
      {
        tag: 'Disaster Recovery',
        title: 'Geographically Segregated Active-Passive Corporate Disaster Recovery',
        desc: 'Establishing synchronized business continuity sites between primary commercial centers and secondary regional hubs.',
        points: [
          'Continuous asynchronous database replication maintaining near-zero data delta',
          'Semi-annual automated disaster recovery simulation testing verifying failover procedures',
          'Guaranteed emergency workspace connectivity for corporate executive leadership'
        ],
        impact: 'Complete corporate peace of mind and verified compliance with enterprise risk management policies.'
      }
    ],
    faqs: [
      {
        q: 'How does GreenNext support enterprise migrations from legacy server rooms without business disruption?',
        a: 'We utilize structured phased migration methodologies: establishing parallel temporary environments, conducting off-hours pilot cutovers, and maintaining real-time rollback capabilities throughout.'
      },
      {
        q: 'How does GreenNext integrate with an enterprise’s existing IT team and facilities staff?',
        a: 'We act as an architectural partner. We design, deploy, and provide Tier-3 engineering support while training internal corporate teams on day-to-day management and automation dashboards.'
      },
      {
        q: 'What level of transparency is provided into facility environmental and energy metrics?',
        a: 'Our management consoles provide granular real-time telemetry across PUE, rack temperatures, circuit breaker loads, and generator test logs, directly exportable into corporate governance reports.'
      }
    ],
    relatedLinks: [
      { label: 'AI Infrastructure', href: 'capabilities/ai-infrastructure.html' },
      { label: 'Data Center Solutions', href: 'capabilities/data-center-solutions.html' },
      { label: 'Intelligent Automation', href: 'capabilities/intelligent-automation.html' },
      { label: 'Energy Efficiency', href: 'capabilities/energy-efficiency.html' }
    ]
  }
};

export const locationsContent = {
  madurai: {
    seoTitle: 'Madurai Regional AI Infrastructure & Data Center Hub | GreenNext',
    metaDesc: 'Discover GreenNext AI infrastructure and sustainable data center planning in Madurai — serving southern Tamil Nadu with resilient digital foundations.',
    tagline: 'Regional Technology & Infrastructure Hub',
    headline: 'Powering Southern Tamil Nadu’s Emerging AI & Enterprise Corridor',
    description: 'Madurai is rapidly establishing itself as a strategic digital growth hub. GreenNext delivers localized AI data center planning, energy-aware compute architectures, and high-availability digital infrastructure across the region.',
    heroPrimary: { text: 'Talk to an Expert', href: '#enquiry' },
    heroSecondary: { text: 'Quick Enquiry', href: '#quick-enquiry' },
    img: 'assets/img/madurai-temple.webp',
    alt: 'Madurai city landmark representing deep cultural heritage and rapidly expanding modern technology infrastructure',
    caption: 'Strategic regional hub serving southern Tamil Nadu with enterprise-grade infrastructure.',
    deepDive: {
      eyebrow: 'Regional Significance',
      heading: 'Madurai as the Strategic Anchor for Southern Tamil Nadu Enterprise Growth',
      body: 'As technology operations expand beyond Tier-1 metropolitan centers, Madurai provides an ideal regional catchment area. Serving key enterprise sectors across healthcare, textiles, precision engineering, and education across southern districts, Madurai demands reliable, low-latency digital infrastructure that doesn\'t depend on distant capital city hubs.',
      bullets: [
        'Centralized regional hub serving Tirunelveli, Tuticorin, Virudhunagar, and Dindigul',
        'Direct access to national highway and optical fiber corridors ensuring fast connectivity',
        'Growing technical talent pool supported by premier regional engineering universities',
        'Abundant regional renewable solar potential enabling green data center integration'
      ],
      ctaText: 'Consult Madurai Engineering Desk',
      ctaHref: 'contact.html',
    },
    highlights: [
      {
        icon: 'building',
        metric: 'Regional Core',
        title: 'Southern Hub Focus',
        desc: 'Serves as the natural technology and digital services anchor for an expansive industrial and educational catchment area.'
      },
      {
        icon: 'bolt',
        metric: 'Solar Synergies',
        title: 'High Solar Irradiation',
        desc: 'Leverages southern Tamil Nadu’s exceptional solar potential for direct renewable energy grid integration and sustainable PUE.'
      },
      {
        icon: 'network',
        metric: 'Fiber Corridors',
        title: 'Transit Redundancy',
        desc: 'Strategically positioned along multi-carrier fiber transit lines connecting Chennai, Bangalore, and southern port gateways.'
      }
    ],
    useCases: [
      {
        tag: 'Healthcare Hub',
        title: 'Southern Tamil Nadu Clinical Telemedicine & Hospital Cloud',
        desc: 'Connecting specialized hospital networks in Madurai to rural clinics across southern districts.',
        points: [
          'High-reliability data center white space for centralized electronic health records',
          'Low-latency connectivity supporting remote diagnostic video consultations',
          'Tier-Grade power protection safeguarding uninterrupted regional clinical operations'
        ],
        impact: 'Critical patient data access sustained across all surrounding district health centers.'
      },
      {
        tag: 'Textile & Manufacturing',
        title: 'Industrial Supply Chain & ERP Regional Data Continuity',
        desc: 'Hosting mission-critical production planning and supply chain databases for major regional manufacturing exporters.',
        points: [
          'Modular private server pods with automated off-site cloud backups',
          'Precision cooling containment preventing dust intrusion in semi-industrial zones',
          'Dual redundant telecommunications links eliminating business communication downtime'
        ],
        impact: 'Unbroken production line visibility and automated warehouse inventory sync.'
      }
    ],
    faqs: [
      {
        q: 'Does GreenNext operate live physical facilities in Madurai today?',
        a: 'GreenNext provides regional architectural design, planning, and deployment advisory for enterprises establishing data center presence in Madurai. We describe conceptual relevance and engineering capacity, strictly following our factual content standards.'
      },
      {
        q: 'Why should an enterprise choose Madurai over Chennai for disaster recovery?',
        a: 'Madurai offers significant geographic diversity outside coastal cyclone and flood zones, while providing lower land and operational costs alongside robust telecommunications fiber links.'
      },
      {
        q: 'Can Madurai facilities effectively integrate renewable solar energy?',
        a: 'Yes. Southern Tamil Nadu enjoys some of the highest solar insolation in India, making it exceptionally well-suited for on-site rooftop and off-site power purchase agreements (PPA) with solar farms.'
      }
    ],
    relatedLinks: [
      { label: 'AI Infrastructure', href: 'capabilities/ai-infrastructure.html' },
      { label: 'Data Center Solutions', href: 'capabilities/data-center-solutions.html' },
      { label: 'Coimbatore Hub', href: 'locations/coimbatore.html' },
      { label: 'Trichy Hub', href: 'locations/trichy.html' }
    ]
  },

  coimbatore: {
    seoTitle: 'Coimbatore Industrial IoT & AI Data Center Infrastructure | GreenNext',
    metaDesc: 'GreenNext enterprise digital infrastructure in Coimbatore — engineered for high-density AI, industrial automation, and advanced engineering ecosystems.',
    tagline: 'Industrial & Technology Ecosystem',
    headline: 'High-Density Digital Infrastructure for Coimbatore’s Industrial & Tech Powerhouse',
    description: 'Coimbatore uniquely merges precision manufacturing with a booming technology sector. GreenNext delivers intelligent automation, industrial IoT infrastructure, and energy-optimized data centers tailored for enterprise scale.',
    heroPrimary: { text: 'Talk to an Expert', href: '#enquiry' },
    heroSecondary: { text: 'Quick Enquiry', href: '#quick-enquiry' },
    img: 'assets/img/coimbatore-tech-park.png',
    alt: 'Coimbatore modern technology park and industrial manufacturing development corridor',
    caption: 'Advanced infrastructure supporting heavy industrial engineering and emerging SaaS hubs.',
    deepDive: {
      eyebrow: 'Ecosystem Strength',
      heading: 'Bridging Precision Manufacturing Heritage with Next-Generation Software Engineering',
      body: 'As Tamil Nadu’s premier industrial and second-largest software hub, Coimbatore possesses an intricate infrastructure landscape. Heavy engineering, textile machinery, and automotive foundries require robust shop-floor edge computing, while rapidly growing software and IT parks demand high-density AI clusters and low-latency cloud connectivity.',
      bullets: [
        'Thriving engineering and manufacturing ecosystem ready for Industry 4.0 automation',
        'Favorable elevated plateau climate offering extended natural free-cooling hours',
        'Direct multi-carrier optical fiber backbones linked to Bangalore and Chennai',
        'High density of premier technical universities supplying skilled engineering talent'
      ],
      ctaText: 'Consult Coimbatore Engineering Desk',
      ctaHref: 'contact.html',
    },
    highlights: [
      {
        icon: 'factory',
        metric: 'Dual Economy',
        title: 'Industrial & Tech Synergy',
        desc: 'Architected to simultaneously support heavy industrial OT control systems and modern cloud-native software stacks.'
      },
      {
        icon: 'bolt',
        metric: 'Cooling Advantage',
        title: 'Plateau Micro-Climate',
        desc: 'Favorable regional elevation reduces mechanical chiller run-hours, translating directly into lower annual PUE.'
      },
      {
        icon: 'cpu',
        metric: 'Industry 4.0',
        title: 'Smart Automation Readiness',
        desc: 'Hardened edge computing nodes connecting factory machinery directly with executive business intelligence dashboards.'
      }
    ],
    useCases: [
      {
        tag: 'Precision Engineering',
        title: 'Factory-Floor Edge AI Quality Control & Predictive Machine Health',
        desc: 'Connecting thousands of factory sensors to real-time machine learning inference nodes across industrial estates.',
        points: [
          'Dust-sealed micro-data centers deployed directly inside manufacturing facilities',
          'Continuous vibration analytics identifying spindle and pump wear in advance',
          'Isolated industrial Ethernet networks protecting machinery from corporate network anomalies'
        ],
        impact: 'Zero unplanned machine stoppages and consistent high-precision manufacturing quality.'
      },
      {
        tag: 'Technology Park',
        title: 'Multi-Tenant SaaS Innovation Pods in Tech Parks',
        desc: 'Providing high-density containerized compute clusters for growing software and SaaS organizations.',
        points: [
          'High-density server cabinets supporting up to 25kW per rack',
          'Direct carrier-neutral cloud on-ramps to major hyper-scale cloud regions',
          'Modular busway power architecture allowing fast, flexible computing capacity expansion'
        ],
        impact: 'Predictable IT infrastructure expenses with enterprise-grade uptime assurance.'
      }
    ],
    faqs: [
      {
        q: 'How does Coimbatore’s climate benefit data center energy efficiency?',
        a: 'Situated on an elevated plateau near the Western Ghats, Coimbatore experiences milder average temperatures and cooler nights than coastal metros, enabling significant free-cooling economizer hours and lower annual PUE.'
      },
      {
        q: 'How does GreenNext serve Coimbatore’s manufacturing and tech sectors simultaneously?',
        a: 'Our architectural frameworks are modular. We specify ruggedized, sealed edge units for industrial shop floors alongside high-density, low-latency compute suites for corporate and SaaS IT parks.'
      },
      {
        q: 'What connectivity redundancies exist between Coimbatore and primary tech corridors?',
        a: 'Coimbatore is crossed by multiple major telecommunication fiber routes linking Chennai, Bangalore, and Kerala, ensuring diverse carrier paths with low millisecond latency.'
      }
    ],
    relatedLinks: [
      { label: 'Intelligent Automation', href: 'capabilities/intelligent-automation.html' },
      { label: 'Energy Efficiency', href: 'capabilities/energy-efficiency.html' },
      { label: 'Madurai Hub', href: 'locations/madurai.html' },
      { label: 'Manufacturing Solutions', href: 'industries/manufacturing.html' }
    ]
  },

  trichy: {
    seoTitle: 'Trichy Strategic Central Connectivity & Digital Infrastructure | GreenNext',
    metaDesc: 'Discover GreenNext central digital infrastructure in Trichy — offering strategic geographic connectivity, educational synergy, and disaster recovery data centers.',
    tagline: 'Strategic Regional Infrastructure',
    headline: 'Unlocking Central Tamil Nadu’s Strategic Transit & Disaster Recovery Potential',
    description: 'Trichy sits at the geographic center of Tamil Nadu. GreenNext leverages this pivotal junction to design high-availability transit networks, academic research computing, and prime disaster recovery facilities.',
    heroPrimary: { text: 'Talk to an Expert', href: '#enquiry' },
    heroSecondary: { text: 'Quick Enquiry', href: '#quick-enquiry' },
    img: 'assets/img/greenery-building.webp',
    alt: 'Trichy regional technology center and central infrastructure connectivity hub',
    caption: 'Strategic central geographic positioning ideal for regional network transit and disaster recovery.',
    deepDive: {
      eyebrow: 'Central Transit Node',
      heading: 'The Natural Geographic Crossroads for Centralized Network Routing and Business Continuity',
      body: 'Trichy occupies a unique geographic position: equidistant from Tamil Nadu’s northern, southern, and western commercial centers. This central location makes it the ideal site for network routing aggregation, regional edge caching, and disaster recovery facilities that must remain insulated from coastal weather events while maintaining low transit times to all surrounding districts.',
      bullets: [
        'Geographic heart of Tamil Nadu providing balanced low-latency routing to all regional centers',
        'Inland positioning offering superior insulation from coastal storms, flooding, and maritime corrosion',
        'Strong academic ecosystem home to national institutes of technology and research universities',
        'Extensive rail, highway, and air transit networks facilitating physical engineering logistics'
      ],
      ctaText: 'Consult Trichy Engineering Desk',
      ctaHref: 'contact.html',
    },
    highlights: [
      {
        icon: 'network',
        metric: 'Centrally Located',
        title: 'Geographic Convergence',
        desc: 'Acts as the central junction point for statewide optical fiber routing, reducing inter-city transit hops.'
      },
      {
        icon: 'shield',
        metric: 'Inland Security',
        title: 'Ideal Disaster Recovery',
        desc: 'Protected from coastal cyclone zones, making it an exceptional location for secondary enterprise data halls.'
      },
      {
        icon: 'graduation',
        metric: 'Academic HPC',
        title: 'Research Institution Links',
        desc: 'Close synergy with premier engineering institutions fostering advanced research computing and technical talent.'
      }
    ],
    useCases: [
      {
        tag: 'Disaster Recovery',
        title: 'Secondary Disaster Recovery Data Hall for Chennai & Coastal Enterprises',
        desc: 'Providing secure, inland backup facilities for financial and corporate entities vulnerable to coastal storms.',
        points: [
          'High-speed dedicated dark fiber link maintaining real-time asynchronous database sync',
          'Automated generator failover with verified on-site fuel autonomy protocols',
          'Strict biometric access control and isolated enterprise disaster recovery suites'
        ],
        impact: 'Complete operational resilience and zero business downtime during coastal weather crises.'
      },
      {
        tag: 'Academic Research',
        title: 'Collaborative Supercomputing & Research Storage Hub',
        desc: 'Serving higher education and scientific research institutions across central Tamil Nadu.',
        points: [
          'High-density compute racks designed for heavy simulation and analytics runs',
          'High-throughput network backbones providing gigabit-speed access across university labs',
          'Energy-efficient containment maximizing computational output per grant rupee'
        ],
        impact: 'Accelerated academic research output and streamlined computational resource sharing.'
      }
    ],
    faqs: [
      {
        q: 'Why is Trichy considered an ideal disaster recovery location in South India?',
        a: 'Its inland geography protects it from coastal weather disturbances, while its central location ensures low-latency connectivity to Chennai, Bangalore, Coimbatore, and Madurai simultaneously.'
      },
      {
        q: 'What network transit advantages does Trichy offer over other regional cities?',
        a: 'Major national telecommunications trunk lines intersect through Trichy, enabling direct carrier routing across all directions without unnecessary metropolitan hair-pinning.'
      },
      {
        q: 'How does GreenNext support educational institutions in Trichy?',
        a: 'We design shared high-performance computing clusters and campus network architectures tailored to academic grant structures and high concurrent student usage.'
      }
    ],
    relatedLinks: [
      { label: 'Digital Infrastructure', href: 'capabilities/digital-infrastructure.html' },
      { label: 'Data Center Solutions', href: 'capabilities/data-center-solutions.html' },
      { label: 'Madurai Hub', href: 'locations/madurai.html' },
      { label: 'Education Solutions', href: 'industries/education.html' }
    ]
  },

  mangalore: {
    seoTitle: 'Mangalore Coastal Technology & Connectivity Gateway | GreenNext',
    metaDesc: 'Discover GreenNext digital infrastructure in Mangalore — connecting coastal trade, port logistics, financial services, and emerging technology parks.',
    tagline: 'Connected Coastal Technology Hub',
    headline: 'Connecting Coastal Trade & Emerging Tech with Next-Generation Digital Infrastructure',
    description: 'Mangalore unites major maritime port logistics, banking institutions, and an energetic technology sector. GreenNext delivers resilient data center solutions and high-throughput connectivity for coastal enterprises.',
    heroPrimary: { text: 'Talk to an Expert', href: '#enquiry' },
    heroSecondary: { text: 'Quick Enquiry', href: '#quick-enquiry' },
    img: 'assets/img/city-skyline-night.webp',
    alt: 'Mangalore coastal skyline and commercial port logistics technology center',
    caption: 'Strategic coastal gateway linking port logistics, banking, and IT corridor operations.',
    deepDive: {
      eyebrow: 'Coastal Gateway',
      heading: 'High-Integrity Infrastructure for Maritime Logistics, Financial Services, and Global Tech',
      body: 'As Karnataka’s primary maritime gateway and a major center for banking and software engineering, Mangalore requires infrastructure designed for coastal operating realities. High ambient humidity, airborne salinity, and intense seasonal monsoons demand specialized environmental protection, precision corrosion-resistant materials, and continuous power conditioning.',
      bullets: [
        'Strategic coastal gateway providing direct telecommunications landing and transit potential',
        'Specialized HVAC and moisture-barrier engineering protecting IT hardware from coastal humidity',
        'Strong banking and financial services heritage requiring high-integrity transaction processing',
        'Thriving IT export community demanding carrier-neutral high-speed international bandwidth'
      ],
      ctaText: 'Consult Mangalore Engineering Desk',
      ctaHref: 'contact.html',
    },
    highlights: [
      {
        icon: 'ship',
        metric: 'Maritime Gateway',
        title: 'Port Logistics Backbone',
        desc: 'Powers real-time container tracking, automated customs verification, and shipping fleet communications.'
      },
      {
        icon: 'shield',
        metric: 'Marine Protected',
        title: 'Corrosion & Humidity Control',
        desc: 'Advanced environmental envelope sealing and conformal-coated equipment protect against maritime salinity.'
      },
      {
        icon: 'bank',
        metric: 'Financial Heritage',
        title: 'Banking Infrastructure',
        desc: 'High-availability data halls engineered for core financial transaction processing and regulatory record compliance.'
      }
    ],
    useCases: [
      {
        tag: 'Maritime Logistics',
        title: 'Port Terminal Operating System (TOS) & Automated Gate Control',
        desc: 'Ensuring 24/7 continuous computing for shipping container management and customs clearance.',
        points: [
          'Weather-hardened server enclosures operating without disruption during monsoon downpours',
          'High-availability database clusters processing continuous cargo manifest transfers',
          'Dual redundant backup generators with marine-grade fuel filtration systems'
        ],
        impact: 'Zero cargo ship loading delays and continuous customs clearance throughput.'
      },
      {
        tag: 'Fintech & IT Parks',
        title: 'Coastal Tech Park Multi-Tenant Cloud & Data Services',
        desc: 'Delivering carrier-neutral high-bandwidth infrastructure for IT export and fintech firms.',
        points: [
          'High-density server cabinets with precision humidity and temperature regulation',
          'Carrier-neutral optical fiber entry points connecting directly to Bangalore and Mumbai',
          'Strict biometric access control and multi-tenant billing telemetry'
        ],
        impact: 'Enterprise-grade uptime and seamless global collaboration for software development teams.'
      }
    ],
    faqs: [
      {
        q: 'How does GreenNext address high coastal humidity and salinity in Mangalore?',
        a: 'We specify tightly sealed building envelopes with positive pressure filtration, dehumidification stages, and conformal protective coatings on critical copper and electrical switchgear to prevent corrosion.'
      },
      {
        q: 'How does Mangalore connect with major tech hubs like Bangalore?',
        a: 'Mangalore is linked via redundant high-capacity optical fiber routes traversing multiple distinct geographical paths through the Western Ghats into Bangalore, ensuring unbroken connectivity.'
      },
      {
        q: 'Can Mangalore facilities maintain operations during intense monsoon weather?',
        a: 'Yes. Our facility designs elevate sensitive electrical infrastructure well above historical flood lines, utilize heavy-duty storm-rated building envelopes, and maintain on-site fuel reserves for prolonged utility power outages.'
      }
    ],
    relatedLinks: [
      { label: 'Data Center Solutions', href: 'capabilities/data-center-solutions.html' },
      { label: 'Digital Infrastructure', href: 'capabilities/digital-infrastructure.html' },
      { label: 'Coimbatore Tech Hub', href: 'locations/coimbatore.html' },
      { label: 'Technology Solutions', href: 'industries/technology.html' }
    ]
  }
};

export const aboutContent = {
  seoTitle: 'About GreenNext | AI Data Centers & Sustainable Infrastructure',
  metaDesc: 'Learn how GreenNext unites AI-driven data centers, intelligent automation, energy efficiency, and digital infrastructure across South India’s growing technology corridors.',
  eyebrow: 'SUSTAINABLE. INTELLIGENT. AHEAD.',
  headline: 'Engineering the Connected Future of Enterprise Digital Infrastructure',
  description: 'GreenNext bridges computing power, energy efficiency, and intelligent automation into one unified operational architecture.',
  heroPrimary: { text: 'Talk to an Expert', href: 'contact.html' },
  heroSecondary: { text: 'Explore Capabilities', href: 'capabilities/index.html' },
  whoWeAre: {
    heading: 'Bridging Compute, Energy, and Automation into One Operational Picture',
    body: 'In traditional enterprise computing, compute demand, facilities power, and cooling systems are planned in isolated silos. Software teams size processors for workload spikes, facilities teams provision power without visibility into real-time demand, and monitoring tools alert engineers only after systems have failed. GreenNext was founded to eliminate these boundaries. We engineer digital infrastructure as a single, interdependent ecosystem—where compute, power, cooling, and automation operate in continuous harmony.',
    floatCardText: 'Sustainable. Intelligent. Ahead.'
  },
  sevenLayers: [
    { num: '01', title: 'Applications', desc: 'The mission-critical business workloads, databases, and AI models infrastructure exists to power.' },
    { num: '02', title: 'Connectivity', desc: 'Carrier-neutral, low-latency optical network fabrics linking distributed users and cloud on-ramps.' },
    { num: '03', title: 'Compute', desc: 'High-density accelerated processors and bare-metal nodes sized around actual workload demand.' },
    { num: '04', title: 'Storage & Data', desc: 'Resilient, high-IOPS NVMe flash tiers and scalable object stores connecting compute and apps.' },
    { num: '05', title: 'Energy Management', desc: 'Modular, high-efficiency power distribution and renewable integration tracking workload draw.' },
    { num: '06', title: 'Cooling Infrastructure', desc: 'Dynamic airflow containment and liquid loops responding directly to generated thermal load.' },
    { num: '07', title: 'Monitoring & Automation', desc: 'Universal cross-layer telemetry and closed-loop control observing, predicting, and optimizing all six layers.' }
  ],
  values: [
    {
      icon: 'shield',
      title: 'Factual Engineering Integrity',
      desc: 'We reject unverified marketing hype. Every metric, design recommendation, and architectural proposal is grounded in proven engineering principles and rigorous physics.'
    },
    {
      icon: 'bolt',
      title: 'Proactive Environmental Stewardship',
      desc: 'True sustainability is achieved through operational efficiency—optimizing airflow, eliminating parasitic power loss, and designing for renewable grid integration.'
    },
    {
      icon: 'cpu',
      title: 'Human-in-the-Loop Intelligence',
      desc: 'We design intelligent automation that informs and empowers operational teams with transparent, explainable logic rather than unprovable black boxes.'
    },
    {
      icon: 'network',
      title: 'Regional Economic Commitment',
      desc: 'We are dedicated to building high-grade infrastructure in South India’s Tier-2 corridors—Madurai, Coimbatore, Trichy, and Mangalore—expanding digital prosperity.'
    }
  ],
  faqs: [
    {
      q: 'What is GreenNext’s core business model?',
      a: 'GreenNext provides comprehensive digital presence engineering, technical architecture advisory, data center facility engineering, and intelligent automation solutions for enterprises building sustainable digital infrastructure.'
    },
    {
      q: 'Does GreenNext operate its own commercial colocation facilities?',
      a: 'GreenNext currently provides specialized infrastructure architecture, engineering consultation, and deployment advisory. All regional facility contexts described represent architectural planning models and strategic regional focus areas.'
    },
    {
      q: 'How does GreenNext approach sustainability differently from standard vendors?',
      a: 'Rather than treating sustainability as carbon offset marketing, we focus on engineering physics: minimizing PUE through direct containment, eliminating idle power draw, and integrating on-site solar microgrids.'
    }
  ]
};

export const sustainabilityContent = {
  seoTitle: 'Sustainable Infrastructure & Green Data Center Engineering | GreenNext',
  metaDesc: 'Explore GreenNext commitment to sustainable data centers: energy efficiency, closed-loop liquid cooling, renewable energy integration, and responsible digital growth.',
  eyebrow: 'RESPONSIBLE INFRASTRUCTURE',
  headline: 'Sustainability Starts with Engineering Visibility, Not Marketing Claims',
  description: 'Responsible digital infrastructure is achieved by understanding how compute demand drives power draw, power drives cooling load, and cooling efficiency determines environmental impact.',
  heroPrimary: { text: 'Talk to an Expert', href: 'contact.html' },
  heroSecondary: { text: 'Explore Energy Solutions', href: 'capabilities/energy-efficiency.html' },
  pillars: [
    {
      icon: 'bolt',
      metric: 'Energy Awareness',
      title: 'Power-to-Compute Alignment',
      desc: 'Tracks real-time kilowatt draw against actual processor utilization, eliminating idle ghost power consumption across server racks.'
    },
    {
      icon: 'spark',
      metric: 'Thermal Precision',
      title: 'Intelligent Cooling Containment',
      desc: 'Advanced aisle containment and direct-to-chip liquid cooling loops dramatically reduce parasitic chiller compressor electrical loads.'
    },
    {
      icon: 'shield',
      metric: 'Renewable Ready',
      title: 'Clean Grid & Microgrid Integration',
      desc: 'Architectures designed to integrate on-site solar photovoltaic arrays and battery storage, clipping carbon-intensive peak grid usage.'
    },
    {
      icon: 'cpu',
      metric: 'Long Life-Cycle',
      title: 'Modular Equipment Longevity',
      desc: 'Modular, serviceable hardware topologies that extend physical equipment lifespans, drastically reducing electronic waste (e-waste).'
    }
  ],
  deepDive: {
    eyebrow: 'The Sustainable Loop',
    heading: 'The Physical Energy Chain: Compute &rarr; Power &rarr; Cooling &rarr; Efficiency',
    body: 'Every computing calculation generates heat as electrical resistance dissipates energy. In unoptimized facilities, extracting this heat consumes nearly as much electricity as running the server itself. GreenNext approaches sustainability through architectural physics: eliminating bypass airflow, staging variable-speed cooling to match workload heat output, and deploying high-efficiency power busways. By making every link in this chain transparent and measurable, enterprises make responsible environmental progress supported by hard engineering data.',
    bullets: [
      'Hot/cold aisle containment preventing thermal mixing and reducing required supply fan static pressure',
      'High-efficiency double-conversion modular UPS units maintaining near 97% efficiency across partial loads',
      'Intelligent ambient free-cooling economizers maximizing seasonal outdoor air cooling hours',
      'Granular environmental telemetry logging verifiable, auditable data for enterprise ESG disclosures'
    ],
    ctaText: 'Discuss Sustainable Architecture',
    ctaHref: 'contact.html',
    img: 'assets/img/solar-panels.webp',
    alt: 'Solar panel renewable energy integration powering clean enterprise computing infrastructure',
    caption: 'Factual sustainability engineering reducing environmental footprint through operational efficiency.'
  },
  useCases: [
    {
      tag: 'Thermal Modernization',
      title: 'Brownfield Server Room Containment Retrofit',
      desc: 'Transforming legacy uncontained server halls into high-efficiency contained environments.',
      points: [
        'Custom modular aisle containment baffles eliminating cold air bypass',
        'Variable-speed EC fan retrofits reducing motor electrical consumption',
        'Supply air temperature optimization safely elevating chiller water setpoints'
      ],
      impact: 'Immediate reduction in mechanical cooling energy consumption without hardware replacement.'
    },
    {
      tag: 'Renewable Microgrid',
      title: 'On-Site Rooftop Solar & BESS Peak Shaving',
      desc: 'Supplying clean renewable power for auxiliary data center operations and peak load shaving.',
      points: [
        'High-efficiency solar PV arrays mounted on data center facility roofs',
        'Battery energy storage absorbing midday solar energy for discharge during peak tariff hours',
        'Automated telemetry tracking avoided grid emissions with verified meter logs'
      ],
      impact: 'Stabilized facility operating energy costs and lower carbon intensity per computing transaction.'
    }
  ],
  faqs: [
    {
      q: 'Does GreenNext claim certified carbon neutrality?',
      a: 'No. GreenNext strictly follows factual guidelines: we do not claim unverified certifications or blanket carbon neutrality. We engineer facilities for optimal energy efficiency and transparent measurement.'
    },
    {
      q: 'How does high server density affect data center sustainability?',
      a: 'Higher density computing concentrates heat in smaller footprints, allowing direct-to-chip liquid cooling to extract heat far more efficiently than dispersed low-density air systems, resulting in net energy savings.'
    },
    {
      q: 'What data does GreenNext provide for corporate ESG reporting?',
      a: 'Our telemetry dashboards provide auditable kilowatt-hour logs, PUE tracking curves, water usage effectiveness (WUE) metrics, and calculated electrical distribution loss reports.'
    }
  ],
  relatedLinks: [
    { label: 'Energy Efficiency Capability', href: 'capabilities/energy-efficiency.html' },
    { label: 'Data Center Solutions', href: 'capabilities/data-center-solutions.html' },
    { label: 'Energy Optimization Solution', href: 'solutions/energy-optimization.html' },
    { label: 'About Us', href: 'about.html' }
  ]
};

export const careersContent = {
  seoTitle: 'Careers at GreenNext | Build Sustainable AI Infrastructure',
  metaDesc: 'Explore engineering and infrastructure career opportunities at GreenNext across Madurai, Coimbatore, Trichy, and Mangalore.',
  eyebrow: 'JOIN OUR MISSION',
  headline: 'Build the Resilient, Intelligent Infrastructure Behind Tomorrow’s Enterprises',
  description: 'Join a team of systems architects, electrical engineers, and automation specialists pioneering sustainable data centers across South India.',
  heroPrimary: { text: 'Explore Open Disciplines', href: '#apply' },
  heroSecondary: { text: 'Learn About GreenNext', href: 'about.html' },
  practiceAreas: [
    {
      icon: 'server',
      title: 'Data Center & Electrical Engineering',
      desc: 'Design and deploy mission-critical power distribution, UPS topologies, high-voltage substations, and concurrent maintainability architectures.'
    },
    {
      icon: 'bolt',
      title: 'Thermal & Mechanical HVAC Systems',
      desc: 'Engineer next-generation liquid cooling systems, direct-to-chip heat exchangers, computational fluid dynamics (CFD) airflow models, and aisle containment.'
    },
    {
      icon: 'cpu',
      title: 'Intelligent Automation & Software Telemetry',
      desc: 'Develop full-stack monitoring systems, machine learning anomaly detection models, and closed-loop control algorithms connecting IT and facilities.'
    },
    {
      icon: 'network',
      title: 'Digital Infrastructure & Optical Networking',
      desc: 'Architect high-availability leaf-spine fabrics, carrier-neutral Meet-Me-Rooms, structured cabling backbones, and hybrid cloud gateways.'
    }
  ],
  culturePoints: [
    {
      icon: 'shield',
      title: 'Engineering Rigor & Factual Honesty',
      desc: 'We value deep technical understanding over buzzwords. We solve difficult problems through sound physics, mathematics, and empirical evidence.'
    },
    {
      icon: 'spark',
      title: 'Ownership & Direct Impact',
      desc: 'Every team member has a direct voice in project architecture and execution, driving real regional digital transformation.'
    },
    {
      icon: 'building',
      title: 'Regional Roots, Global Standards',
      desc: 'Work on tier-grade infrastructure in vibrant South Indian cities—Madurai, Coimbatore, Trichy, and Mangalore—combining career growth with high quality of life.'
    }
  ],
  faqs: [
    {
      q: 'Where are GreenNext engineering roles based?',
      a: 'We support roles across our regional focus hubs in Madurai, Coimbatore, Trichy, and Mangalore, offering flexible working arrangements depending on field and project requirements.'
    },
    {
      q: 'What backgrounds do you look for in candidates?',
      a: 'We welcome talent across electrical engineering, mechanical HVAC, computer science, network engineering, and data center facilities operations who share a commitment to technical precision.'
    },
    {
      q: 'How does the application and interview process work?',
      a: 'Submit your resume and background via our application form. Our technical team conducts an initial conversation, followed by an in-depth architectural and problem-solving discussion.'
    }
  ]
};

export const contactContent = {
  seoTitle: 'Contact & Enterprise Consultation | GreenNext',
  metaDesc: 'Connect with GreenNext infrastructure specialists for detailed data center consultations, quick technical enquiries, or instant WhatsApp discussions.',
  eyebrow: 'TALK TO AN EXPERT',
  headline: 'Connect with GreenNext Infrastructure Specialists',
  description: 'Discuss your AI data center plans, compute requirements, energy optimization goals, or regional deployments across South India.',
  heroPrimary: { text: 'Request Detailed Consultation', href: '#enquiry' },
  heroSecondary: { text: 'Quick Enquiry', href: '#quick-enquiry' },
  pathways: [
    {
      icon: 'building',
      title: 'Detailed Consultation',
      desc: 'Schedule an in-depth architectural review with a senior GreenNext enterprise data center specialist.',
      actionText: 'Submit Consultation Request',
      actionHref: '#enquiry'
    },
    {
      icon: 'spark',
      title: 'Quick Enquiry',
      desc: 'Have a short question about regional feasibility, capacity, or specifications? Send a rapid 4-field note.',
      actionText: 'Send Quick Enquiry',
      actionHref: '#quick-enquiry'
    },
    {
      icon: 'whatsapp',
      title: 'WhatsApp Technical Desk',
      desc: 'Direct, instant conversation with our technical support and advisory desk on WhatsApp.',
      actionText: 'Chat on WhatsApp',
      actionHref: '#',
      isWhatsApp: true
    },
    {
      icon: 'bot',
      title: 'AI Infrastructure Assistant',
      desc: 'Instant interactive guidance on uptime SLAs, cooling architectures, regional corridors, and infrastructure scoping.',
      actionText: 'Launch AI Assistant',
      actionHref: '#',
      isChatbot: true
    }
  ],
  faqs: [
    {
      q: 'What information should I have ready before requesting a consultation?',
      a: 'Having an estimate of target compute capacity (in kW or rack count), current facility constraints, timeline, and geographic preference (Madurai, Coimbatore, Trichy, Mangalore) helps us tailor the discussion.'
    },
    {
      q: 'How quickly does GreenNext respond to enquiries?',
      a: 'Our engineering desk reviews and responds to all enterprise consultation requests and quick enquiries within one business day.'
    },
    {
      q: 'Is our initial consultation confidential?',
      a: 'Yes. All project specifications, commercial requirements, and architectural roadmaps discussed are handled under strict enterprise confidentiality.'
    }
  ],
  regionalOffices: [
    {
      city: 'Madurai',
      badge: 'Southern Technology Hub',
      title: 'Madurai Regional Office & AI Compute Center',
      address: 'GreenNext Regional Tech Park, Ring Road IT Corridor, Mattuthavani, Madurai, Tamil Nadu 625020',
      phone: '+91 452 290 8820',
      email: 'madurai@greennext.io',
      impact: 'Focus: IT Growth Corridor, Regional Software Ecosystems, Diagnostic Healthcare AI',
      hours: 'Mon - Fri: 8:30 AM - 6:30 PM IST (24/7 Operations NOC)'
    },
    {
      city: 'Coimbatore',
      badge: 'Industrial Automation Heartland',
      title: 'Coimbatore Regional Hub & Advanced Engineering Center',
      address: 'Level 5, GreenTech Innovation Tower, Avinashi Road, Peelamedu, Coimbatore, Tamil Nadu 641004',
      phone: '+91 422 490 8820',
      email: 'coimbatore@greennext.io',
      impact: 'Focus: Smart Manufacturing, Robotics Clusters, Industrial IoT & Predictive Maintenance',
      hours: 'Mon - Fri: 8:30 AM - 6:30 PM IST (24/7 Operations NOC)'
    },
    {
      city: 'Trichy',
      badge: 'Academic & Research Corridor',
      title: 'Trichy Regional Center & Scientific Computing Lab',
      address: 'Block B, Innovation Hub, Navalpattu IT Park SEZ, Tiruchirappalli, Tamil Nadu 620026',
      phone: '+91 431 290 8820',
      email: 'trichy@greennext.io',
      impact: 'Focus: Higher Education HPC, Research Supercomputing & Central Corridor Failover',
      hours: 'Mon - Fri: 8:30 AM - 6:30 PM IST (24/7 Operations NOC)'
    },
    {
      city: 'Mangalore',
      badge: 'Coastal Trade & Maritime Gateway',
      title: 'Mangalore Regional Office & Coastal Telemetry Hub',
      address: 'Suite 302, Harbor View Business Complex, Bejai Main Road, Mangalore, Karnataka 575004',
      phone: '+91 824 290 8820',
      email: 'mangalore@greennext.io',
      impact: 'Focus: Maritime Trade Logistics, Port Automation & Subsea Cable Landing Connectivity',
      hours: 'Mon - Fri: 8:30 AM - 6:30 PM IST (24/7 Operations NOC)'
    }
  ]
};

export const solutionsContent = {
  'ai-data-centers': {
    seoTitle: 'AI Data Centers & High-Density Facility Engineering | GreenNext Solutions',
    metaDesc: 'Purpose-built AI data center solutions engineered for 40kW+ rack densities, liquid cooling loops, low-PUE power architectures, and continuous AI workload reliability.',
    eyebrow: 'HIGH-DENSITY FACILITY ENGINEERING',
    headline: 'Turnkey AI Data Centers Engineered for High-Density Computing',
    description: 'GreenNext builds modular, high-density AI data centers purpose-engineered for accelerated compute clusters, direct liquid cooling loops, and sub-1.25 PUE sustainability.',
    heroPrimary: { text: 'Talk to an Expert', href: '#enquiry' },
    heroSecondary: { text: 'Quick Enquiry', href: '#quick-enquiry' },
    img: 'assets/img/server-room.webp',
    alt: 'High-density accelerated computing server rows in a modern AI data center facility',
    caption: 'Turnkey AI facilities engineered for 40kW+ rack density and continuous accelerated compute.',
    deepDive: {
      eyebrow: 'Facility Architecture',
      heading: 'Overcoming Thermal and Electrical Thresholds in Accelerated Computing',
      body: 'Accelerated machine learning clusters generate unprecedented thermal densities that overwhelm standard air-cooled facilities. GreenNext delivers end-to-end AI data center engineering, uniting dual-bus isolated power topologies, close-coupled chilled water loops, and heavy-duty structural flooring capable of supporting multi-ton GPU appliances.',
      bullets: [
        'Modular power distribution buses supporting 40kW to 100kW continuous rack densities',
        'Direct-to-chip liquid cooling manifolds and rear-door heat exchanger integration',
        'High-velocity containment zones preventing heated exhaust recirculation',
        'Carrier-neutral diverse fiber entrances ensuring sub-millisecond regional connectivity'
      ],
      ctaText: 'Explore Turnkey Facility Options',
      ctaHref: 'contact.html',
    },
    benefits: [
      {
        icon: 'database',
        metric: '40kW+ Density',
        title: 'High-Density Readiness',
        desc: 'Engineered specifically for GPU, TPU, and custom ASIC architectures requiring intense electrical supply and thermal dissipation.'
      },
      {
        icon: 'bolt',
        metric: 'Sub-1.25 PUE',
        title: 'Energy-Conscious Operation',
        desc: 'Optimized cooling loops and transformer topologies minimize non-compute parasitic load across year-round climatic variations.'
      },
      {
        icon: 'shield',
        metric: 'Tier-Grade Redundancy',
        title: 'Continuous Availability',
        desc: 'Concurrently maintainable power feeds and automated transfer switches keep generative AI and analytics workloads running 24/7.'
      }
    ],
    useCases: [
      {
        tag: 'Model Training',
        title: 'Enterprise Foundation Model Clusters',
        desc: 'Dedicated high-density halls engineered for synchronized multi-thousand accelerator training environments.',
        points: [
          'Isolated thermal containment guaranteeing uniform intake temperatures',
          'Ultra-dense busbar power drops directly feeding heavy computing frames',
          'Real-time branch circuit monitoring alerting on minor phase imbalances'
        ],
        impact: 'Sustained peak model training performance with zero thermal throttling or unexpected power trip interruptions.'
      },
      {
        tag: 'Regional Scale',
        title: 'Distributed Inference Hubs Across South India',
        desc: 'Colocation and dedicated modules in Madurai, Coimbatore, Trichy, and Mangalore serving regional AI applications.',
        points: [
          'Proximity to regional fiber rings for sub-5ms enterprise inferencing latency',
          'Modular expansion architecture scaling from 250kW to multi-megawatt capacity',
          'Comprehensive physical access control and biometric boundary logging'
        ],
        impact: 'Localized edge intelligence with Tier-grade reliability and reduced long-haul data transit overhead.'
      }
    ],
    faqs: [
      {
        q: 'What rack densities can GreenNext AI Data Centers support?',
        a: 'Our facilities are engineered from the foundation to support up to 60kW to 80kW+ per cabinet using hybrid cooling loops and up to 100kW+ with direct-to-chip liquid delivery manifolds.'
      },
      {
        q: 'Can existing enterprise facilities be retrofitted to GreenNext AI Data Center standards?',
        a: 'Yes. We conduct structural, electrical, and thermal feasibility reviews to deploy contained modular AI pods within existing building footprints.'
      },
      {
        q: 'What PUE can be expected in South Indian climatic conditions?',
        a: 'Through variable liquid loops, aisle containment, and ambient optimization, GreenNext AI facilities maintain an annualized design PUE between 1.20 and 1.28.'
      }
    ],
    relatedLinks: [
      { title: 'AI Infrastructure', href: 'capabilities/ai-infrastructure.html' },
      { title: 'Energy Optimization', href: 'solutions/energy-optimization.html' },
      { title: 'Smart Infrastructure', href: 'solutions/smart-infrastructure.html' },
      { title: 'Automation Solutions', href: 'solutions/automation-solutions.html' }
    ]
  },
  'smart-infrastructure': {
    seoTitle: 'Smart Infrastructure & Adaptive Facility Automation | GreenNext Solutions',
    metaDesc: 'Adaptive smart infrastructure solutions unifying physical environmental sensing, dynamic airflow balancing, and intelligent workload routing across enterprise facilities.',
    eyebrow: 'ADAPTIVE FACILITY AUTOMATION',
    headline: 'Intelligent Physical Infrastructure That Adapts in Real Time',
    description: 'Unify environmental sensor meshes, variable-frequency cooling systems, and dynamic power routing into a responsive, autonomous facility ecosystem.',
    heroPrimary: { text: 'Talk to an Expert', href: '#enquiry' },
    heroSecondary: { text: 'Quick Enquiry', href: '#quick-enquiry' },
    img: 'assets/img/circuit-board.webp',
    alt: 'Smart infrastructure telemetry controller and sensory micro-circuits in facility control room',
    caption: 'Adaptive sensory frameworks monitoring ambient thermal, power, and environmental telemetry.',
    deepDive: {
      eyebrow: 'Sensory Intelligence',
      heading: 'Closed-Loop Telemetry Across the Physical Infrastructure Layer',
      body: 'Traditional data centers operate on static cooling set-points and manual inspections, leading to widespread over-cooling and undetected micro-hotspots. GreenNext Smart Infrastructure deploys high-density sensory arrays across server racks, ceiling plenums, and fluid headers, continuously adapting fan speeds, chiller stages, and valve positions to actual thermal load in real time.',
      bullets: [
        'Dense IoT sensor arrays tracking thermal differentials, static air pressure, and relative humidity',
        'Dynamic damper and fan modulating algorithms maintaining optimal delta-T without overcooling',
        'Vibration and harmonic acoustic monitoring forecasting mechanical pump and fan degradation',
        'Unified telemetry dashboards aggregating multi-facility signals into a single pane of glass'
      ],
      ctaText: 'Schedule Smart Facility Demonstration',
      ctaHref: 'contact.html',
    },
    benefits: [
      {
        icon: 'network',
        metric: '100% Floor Telemetry',
        title: 'Deep Operational Visibility',
        desc: 'Eliminates monitoring blind spots with multi-point rack telemetry capturing top, middle, and bottom thermal gradients.'
      },
      {
        icon: 'cpu',
        metric: 'Millisecond Tuning',
        title: 'Adaptive Cooling Modulation',
        desc: 'Dynamically shifts cooling volume to match fluctuating compute workloads without manual technician intervention.'
      },
      {
        icon: 'shield',
        metric: 'Predictive Defense',
        title: 'Proactive Health Alarms',
        desc: 'Detects micro-anomalies in power draw, fan speed fluctuations, and fluid pressure before operational thresholds are breached.'
      }
    ],
    useCases: [
      {
        tag: 'Thermal Balance',
        title: 'Autonomous Hot-Aisle Airflow Regulation',
        desc: 'Preventing hot air recirculation through automated pressure balancing and modulating extraction fans.',
        points: [
          'Differential pressure sensors measuring plenum-to-aisle gradient',
          'Automatic speed modulation keeping static pressure slightly positive',
          'Instant detection of unsealed cable pass-throughs or missing blanking panels'
        ],
        impact: 'Consistent intake temperatures across all server elevations and 18% reduction in fan energy draw.'
      },
      {
        tag: 'Fleet Management',
        title: 'Multi-Site Centralized Operations Console',
        desc: 'Unifying operational telemetry from regional hubs across Madurai, Coimbatore, Trichy, and Mangalore.',
        points: [
          'Encrypted telemetry streams transmitting status metrics to core engineering console',
          'Standardized threshold alerts prioritizing critical incidents automatically',
          'Mobile and web alerts routing real-time issues directly to standby on-call engineers'
        ],
        impact: 'Unified operational governance with 70% reduction in mean time to acknowledge facility anomalies.'
      }
    ],
    faqs: [
      {
        q: 'Can GreenNext Smart Infrastructure integrate with third-party Building Management Systems (BMS)?',
        a: 'Yes. Our smart infrastructure layer interfaces with standard BACnet, Modbus, SNMP, and modern REST APIs to integrate smoothly with existing enterprise BMS and DCIM suites.'
      },
      {
        q: 'Does installing smart sensors require taking server racks offline?',
        a: 'No. Our non-invasive sensory arrays and IoT telemetry monitors are deployed hot with zero interruption to server uptime or network connectivity.'
      },
      {
        q: 'How does smart infrastructure help with sustainability reporting?',
        a: 'Automated telemetry logs exact kilowatt-hour consumption, cooling energy, and water usage effectiveness (WUE), generating verifiable audit trails for ESG and compliance reporting.'
      }
    ],
    relatedLinks: [
      { title: 'Intelligent Automation', href: 'capabilities/intelligent-automation.html' },
      { title: 'AI Data Centers', href: 'solutions/ai-data-centers.html' },
      { title: 'Energy Optimization', href: 'solutions/energy-optimization.html' },
      { title: 'Digital Infrastructure', href: 'capabilities/digital-infrastructure.html' }
    ]
  },
  'energy-optimization': {
    seoTitle: 'Data Center Energy Optimization & PUE Reduction | GreenNext Solutions',
    metaDesc: 'Enterprise data center energy optimization solutions delivering measurable PUE reduction, variable liquid loop tuning, waste heat mitigation, and clean grid integration.',
    eyebrow: 'SUSTAINABLE POWER ARCHITECTURES',
    headline: 'Data Center Energy Optimization for Sub-1.25 PUE Performance',
    description: 'Eliminate parasitic cooling waste, optimize electrical distribution paths, and integrate renewable energy inputs without compromising computing availability or compute SLAs.',
    heroPrimary: { text: 'Talk to an Expert', href: '#enquiry' },
    heroSecondary: { text: 'Quick Enquiry', href: '#quick-enquiry' },
    img: 'assets/img/wind-turbines.webp',
    alt: 'Renewable wind energy turbines powering clean technology data center infrastructure',
    caption: 'Comprehensive thermodynamic optimization reducing operational PUE and electrical overhead.',
    deepDive: {
      eyebrow: 'Thermodynamic Audit',
      heading: 'Eliminating Parasitic Energy Losses in High-Density Computing',
      body: 'In an unoptimized data center, up to 40% of total electrical power is consumed by cooling systems, transformer heat losses, and power conversion stages rather than compute servers. GreenNext performs comprehensive thermodynamic and electrical audits, identifying root causes of parasitic consumption and implementing targeted retrofits that lower facility PUE to sub-1.25 levels.',
      bullets: [
        'Comprehensive computational fluid dynamics (CFD) modeling of cold and hot air boundaries',
        'Variable-speed drive (VSD) retrofits for chillers, condenser pumps, and air handling units',
        'High-efficiency modular transformer and uninterruptible power supply (UPS) alignment',
        'Solar and clean grid power integration balancing carbon intensity during peak tariff windows'
      ],
      ctaText: 'Request Facility Energy Audit',
      ctaHref: 'contact.html',
    },
    benefits: [
      {
        icon: 'bolt',
        metric: '20–35% Savings',
        title: 'Parasitic Draw Reduction',
        desc: 'Lowers electrical operational costs by systematically removing airflow bypass and thermal over-provisioning.'
      },
      {
        icon: 'spark',
        metric: 'Sub-1.25 PUE',
        title: 'Optimized Power Usage',
        desc: 'Ensures the vast majority of grid electricity powers revenue-generating compute instead of auxiliary cooling systems.'
      },
      {
        icon: 'shield',
        metric: 'Zero-Downtime',
        title: 'Live Facility Retrofits',
        desc: 'Optimization procedures and containment adjustments are executed live without disrupting active server workloads.'
      }
    ],
    useCases: [
      {
        tag: 'Facility Retrofit',
        title: 'Legacy Data Center Containment & VSD Upgrades',
        desc: 'Modernizing a 1.8 PUE enterprise facility to sub-1.30 operational efficiency within four months.',
        points: [
          'Aisle containment barriers installed to completely stop hot and cold air mixing',
          'Legacy fixed-speed pumps upgraded with smart variable-frequency drives',
          'Elevated chilled water supply temperature by 3°C safely within ASHRAE thermal limits'
        ],
        impact: 'Achieved 28% drop in monthly electricity costs with zero server downtime during implementation.'
      },
      {
        tag: 'Renewable Integration',
        title: 'Rooftop Solar & High-Density Battery Buffering',
        desc: 'Pairing clean solar generation with battery energy storage systems (BESS) for peak shaving.',
        points: [
          'On-site rooftop solar feeding directly into facility auxiliary power bus',
          'Battery storage discharging during regional peak utility tariff hours',
          'Automated carbon-aware workload scheduling shifting non-urgent tasks to solar peak hours'
        ],
        impact: 'Reduced grid dependence during peak tariff windows and decreased Scope 2 carbon footprint by 32%.'
      }
    ],
    faqs: [
      {
        q: 'What is the typical payback timeline for a GreenNext energy optimization engagement?',
        a: 'Most enterprise clients achieve full capital expenditure payback within 9 to 18 months through direct operational electricity savings.'
      },
      {
        q: 'Does energy optimization require replacing all existing cooling units?',
        a: 'No. Our engineering methodology prioritizes non-invasive airflow containment, VSD additions, and control algorithm optimization before recommending capital-intensive hardware replacements.'
      },
      {
        q: 'How does GreenNext verify PUE improvements?',
        a: 'We install revenue-grade power meters on utility inputs, UPS outputs, and cooling distribution boards, providing transparent, auditable PUE calculations in real time.'
      }
    ],
    relatedLinks: [
      { title: 'Energy Efficiency', href: 'capabilities/energy-efficiency.html' },
      { title: 'AI Data Centers', href: 'solutions/ai-data-centers.html' },
      { title: 'Sustainability', href: 'sustainability.html' },
      { title: 'Coimbatore Hub', href: 'locations/coimbatore.html' }
    ]
  },
  'automation-solutions': {
    seoTitle: 'Infrastructure Automation & Closed-Loop Operations | GreenNext Solutions',
    metaDesc: 'Autonomous operations solutions streamlining routine maintenance runbooks, incident mitigation, cooling adjustments, and hardware health forecasting.',
    eyebrow: 'AUTONOMOUS OPERATIONS FRAMEWORKS',
    headline: 'Closed-Loop Infrastructure Automation for Zero-Downtime Operations',
    description: 'Empower enterprise operations teams with automated runbooks, predictive anomaly interception, and closed-loop environmental controls that remove manual latency.',
    heroPrimary: { text: 'Talk to an Expert', href: '#enquiry' },
    heroSecondary: { text: 'Quick Enquiry', href: '#quick-enquiry' },
    img: 'assets/img/control-room.webp',
    alt: 'Automated data center control room displaying real-time operations telemetry and automated incident response scripts',
    caption: 'Autonomous infrastructure operations reducing human response latency and preventing facility downtime.',
    deepDive: {
      eyebrow: 'Operational Automation',
      heading: 'From Alert Fatigue to Autonomous Incident Remediation',
      body: 'Operations teams in high-density data centers are frequently overwhelmed by thousands of minor telemetry alerts daily. GreenNext Automation Solutions introduces intelligent closed-loop frameworks where routine anomalies—such as transient power dips, local temperature surges, or fan speed fluctuations—are handled automatically by verified, deterministic execution runbooks within pre-approved safety guardrails.',
      bullets: [
        'Deterministic automated runbooks executing verified mitigation steps within seconds of an anomaly',
        'Granular safety thresholds ensuring automated scripts never exceed approved operational bounds',
        'Automatic bi-directional ticket creation and audit logging across enterprise ITSM suites',
        'Predictive wear modeling alerting maintenance crews weeks prior to mechanical bearing or capacitor failure'
      ],
      ctaText: 'Consult on Operations Automation',
      ctaHref: 'contact.html',
    },
    benefits: [
      {
        icon: 'cpu',
        metric: 'Sub-Second Response',
        title: 'Zero-Latency Remediation',
        desc: 'Remediates environmental imbalances and power failover sequences in seconds rather than waiting for on-call technician dispatch.'
      },
      {
        icon: 'spark',
        metric: '85% Fewer Alarms',
        title: 'Alert Noise Elimination',
        desc: 'Filters out transient telemetry noise to present operations teams with verified, high-priority operational events.'
      },
      {
        icon: 'shield',
        metric: '100% Audited',
        title: 'Deterministic Safety Guardrails',
        desc: 'Every automated remediation action is logged with detailed telemetry snapshots and complete rollback capabilities.'
      }
    ],
    useCases: [
      {
        tag: 'Cooling Control',
        title: 'Automated Variable Loop Modulation',
        desc: 'Direct closed-loop feedback between server CPU temperatures and localized cooling valve actuators.',
        points: [
          'High-rate telemetry listening to server BMC and facility sensor packets',
          'Closed-loop control loop adjusting chilled water valve within 2 seconds of compute spike',
          'Failsafe default state returning valves to 100% open in the event of communication timeout'
        ],
        impact: 'Prevents thermal throttling on intensive batch compute runs while eliminating overcooling during idle periods.'
      },
      {
        tag: 'Power Resiliency',
        title: 'Automated Redundant Path Load Balancing',
        desc: 'Dynamic load shedding and UPS redistribution during regional electrical grid transients.',
        points: [
          'Continuous harmonic monitoring on primary utility feeds',
          'Instant non-critical auxiliary load shedding when grid frequency drops',
          'Safe sequenced transfer to on-site backup generators with zero phase collision'
        ],
        impact: 'Flawless power continuity with zero compute cluster dropouts during regional brownouts or storm transients.'
      }
    ],
    faqs: [
      {
        q: 'Can automation be overridden manually by facility engineers?',
        a: 'Yes. Every automation loop includes physical manual override switches as well as single-click digital pause buttons on the engineering console.'
      },
      {
        q: 'How does GreenNext prevent automation loops from making erroneous adjustments?',
        a: 'All scripts execute within strict, immutable boundary guardrails (e.g., valves cannot close below 30%, fan speeds cannot drop below 40% while servers are energized), backed by multi-sensor consensus validation.'
      },
      {
        q: 'What ITSM platforms are supported for incident logging?',
        a: 'Our automation solution integrates natively with ServiceNow, Jira Service Management, PagerDuty, Opsgenie, and custom enterprise webhook endpoints.'
      }
    ],
    relatedLinks: [
      { title: 'Intelligent Automation', href: 'capabilities/intelligent-automation.html' },
      { title: 'Smart Infrastructure', href: 'solutions/smart-infrastructure.html' },
      { title: 'AI Infrastructure', href: 'capabilities/ai-infrastructure.html' },
      { title: 'Madurai Hub', href: 'locations/madurai.html' }
    ]
  }
};
