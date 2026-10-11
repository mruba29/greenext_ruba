import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { capabilities, industries, solutions, locations } from './data.mjs';
import {
  capabilitiesContent,
  industriesContent,
  locationsContent,
  aboutContent,
  sustainabilityContent,
  careersContent,
  contactContent,
  solutionsContent,
} from './content.mjs';
import {
  page, hero, heroSlider, quickEnquirySection, breadcrumb, featureGrid, cardGrid, metricsStrip,
  leadFormSection, careersFormSection, finalCTASection,
  aboutSplitSection, anchorSection, intelligenceDashboardSection, processFlowSection,
  sustainabilitySection, futureVisionSection, locationsMapSection,
  benefitsSection, useCasesSection, deepDiveSection, faqSection, relatedLinksBar,
} from './templates.mjs';
import { icon } from './icons.mjs';

const featuredCapabilities = capabilities.filter(c => c.featured);
const featuredSolutions = solutions.filter(s => s.featured);

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const ENERGY_STEPS = [
  { icon: 'bolt', title: 'Energy Audit', desc: 'Assess power draw across the infrastructure footprint.' },
  { icon: 'cpu', title: 'Thermal Analytics', desc: 'Map heat distribution against server workload demand.' },
  { icon: 'spark', title: 'Targeted Optimization', desc: 'Apply containment and variable liquid loops where it matters most.' },
  { icon: 'shield', title: 'Continuous Efficiency', desc: 'Sustain lower operational PUE without risking compute reliability.' },
];

const AUTOMATION_STEPS = [
  { icon: 'cpu', title: 'Monitor', desc: 'Continuously observe infrastructure signals across compute, energy, cooling, and network.' },
  { icon: 'spark', title: 'Detect', desc: 'Recognize when observed telemetry falls outside expected operational patterns.' },
  { icon: 'shield', title: 'Analyze', desc: 'Isolate root causes and assess the multi-layer impact of emerging events.' },
  { icon: 'bolt', title: 'Decide', desc: 'Synthesize optimal response options with clear explainable operational logic.' },
  { icon: 'server', title: 'Automate', desc: 'Trigger verified closed-loop actions within granular safety boundaries.' },
];

function processSectionFor(slug) {
  if (slug === 'energy-efficiency' || slug === 'energy-optimization') {
    return processFlowSection({ eyebrow: 'How It Works', heading: 'The Energy Optimization Cycle', steps: ENERGY_STEPS });
  }
  if (slug === 'intelligent-automation' || slug === 'automation-solutions') {
    return processFlowSection({ eyebrow: 'Autonomous Workflow', heading: 'From Continuous Telemetry to Closed-Loop Optimization', steps: AUTOMATION_STEPS });
  }
  return '';
}

function write(relPath, html) {
  const full = join(ROOT, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, html, 'utf8');
}

// ---------------------------------------------------------------------------
// 1. HOME (index.html)
// ---------------------------------------------------------------------------
{
  const base = '';
  const homeFaqs = [
    {
      q: 'What makes GreenNext’s approach to AI data center infrastructure unique?',
      a: 'GreenNext treats compute, energy, cooling, and automation as one connected system rather than fragmented purchases. We engineer high-density infrastructure foundations from layer one, ensuring accelerated workloads operate without thermal or power bottlenecks.'
    },
    {
      q: 'Why does GreenNext focus on Madurai, Coimbatore, Trichy, and Mangalore?',
      a: 'These four South Indian corridors represent rapidly growing technology and industrial ecosystems that require modern, reliable digital infrastructure, offering strategic advantages in climate, connectivity, land availability, and disaster recovery diversity.'
    },
    {
      q: 'How does GreenNext achieve energy efficiency without compromising computing performance?',
      a: 'By understanding the physical chain: compute demand drives power draw, and power drives cooling load. Through aisle containment, high-efficiency UPS systems, and intelligent thermal balancing, we eliminate parasitic energy waste while keeping processors at peak performance.'
    },
    {
      q: 'How can an enterprise engage GreenNext for infrastructure planning or advisory?',
      a: 'You can request an enterprise consultation through our contact form, send a quick enquiry with your preliminary requirements, or message our engineering desk directly on WhatsApp.'
    }
  ];

  const body = `
${heroSlider(base)}
${metricsStrip()}

<section class="section" style="padding-bottom:0;">
  <div class="container">
    <div class="section-header" style="display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:var(--space-4);margin-bottom:var(--space-10);">
      <div>
        <span class="section-label">Core Capabilities</span>
        <h2 class="heading-xl">Foundations for Accelerated Computing</h2>
        <p class="text-base text-muted" style="margin-top:var(--space-2);">Purpose-built infrastructure foundations for high-density AI clusters and mission-critical enterprise workloads.</p>
      </div>
      <a class="location-card-link" href="capabilities/index.html">Explore All Capabilities <span class="btn-arrow">&rarr;</span></a>
    </div>
  </div>
</section>
${cardGrid(base, featuredCapabilities, { hrefPrefix: 'capabilities/', ctaText: 'Learn More', columns: 5, withPhoto: true })}

<section class="section bg-soft">
  <div class="container">
    <div class="industries-solutions-grid">
      <div>
        <div class="section-header" style="display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:var(--space-3);margin-bottom:var(--space-8);">
          <div>
            <span class="section-label">Industries</span>
            <h2 class="heading-lg">Who We Serve</h2>
            <p class="text-sm text-muted" style="margin-top:var(--space-2);">Tailored digital infrastructure across mission-critical enterprise sectors.</p>
          </div>
        </div>
        <a class="location-card-link" href="industries/index.html" style="margin-bottom:var(--space-6);display:inline-flex;">Explore Industry Solutions <span class="btn-arrow">&rarr;</span></a>
        <div class="grid-4" style="gap:var(--space-4);">
          ${industries.map((ind, i) => `
            <a class="card reveal reveal-delay-${(i % 4) + 1}" style="display:block;text-decoration:none;padding:var(--space-5);" href="industries/${ind.slug}.html">
              <div class="card-icon" style="width:36px;height:36px;margin-bottom:var(--space-3);">${icon(ind.icon)}</div>
              <h3 class="feature-title" style="font-size:var(--font-size-sm);">${ind.name}</h3>
              <span class="text-xs text-muted" style="display:block;margin-top:4px;">Explore &rarr;</span>
            </a>`).join('')}
        </div>
      </div>
      <div>
        <div class="section-header" style="display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:var(--space-3);margin-bottom:var(--space-8);">
          <div>
            <span class="section-label">Solutions</span>
            <h2 class="heading-lg">Solutions for the AI Era</h2>
            <p class="text-sm text-muted" style="margin-top:var(--space-2);">Scalable, secure, and energy-efficient architectures designed for continuous uptime.</p>
          </div>
        </div>
        <a class="location-card-link" href="solutions/index.html" style="margin-bottom:var(--space-6);display:inline-flex;">Explore All Solutions <span class="btn-arrow">&rarr;</span></a>
        ${cardGrid(base, featuredSolutions, { hrefPrefix: 'solutions/', ctaText: 'Learn More', columns: 2, withPhoto: true, wrap: false })}
      </div>
    </div>
  </div>
</section>

${processFlowSection({ eyebrow: 'Autonomous Workflow', heading: 'From Continuous Telemetry to Closed-Loop Optimization', steps: AUTOMATION_STEPS })}

${intelligenceDashboardSection()}

<section class="section bg-soft" style="padding-bottom: 0;">
  <div class="container">
    <div class="section-header section-header--center">
      <span class="section-label">Regional Presence</span>
      <h2 class="heading-xl">South India Technology Corridors</h2>
      <p class="text-base text-muted" style="margin-top: var(--space-4);">GreenNext delivers localized AI data center and digital infrastructure expertise across Madurai, Coimbatore, Trichy, and Mangalore.</p>
      <a class="location-card-link" href="locations/index.html" style="justify-content:center;margin-top:var(--space-4);">Explore Regional Hubs <span class="btn-arrow">&rarr;</span></a>
    </div>
  </div>
</section>
<div class="bg-soft">
${locationsMapSection(base, locations, 'locations/')}
</div>

${sustainabilitySection(base)}

${aboutSplitSection({
  heading: 'Infrastructure Engineered to Think Ahead',
  body: 'GreenNext bridges high-performance computing, smart energy management, and intelligent automation into one unified operational architecture. We empower forward-looking organizations with sustainable, AI-ready data center facilities designed for longevity and resilience.',
  floatCardText: 'Sustainable. Intelligent. Ahead.',
  base,
  img: 'assets/img/control-room.webp',
  id: 'about-greennext',
})}

<section class="section bg-soft" style="padding-top: var(--space-12);">
  <div class="container" style="max-width: 900px;">
    ${quickEnquirySection({ base, title: 'Quick Infrastructure Enquiry', subtitle: 'Need rapid pricing, facility specifications, or capacity planning? Connect with our team directly.' })}
  </div>
</section>

${faqSection(homeFaqs, { eyebrow: 'Frequently Asked Questions', heading: 'Enterprise & Regional Infrastructure Clarity' })}

${finalCTASection(base)}
`;
  write('index.html', page({
    base,
    title: 'AI Data Centers, Intelligent Automation & Sustainable Digital Infrastructure',
    metaDesc: 'GreenNext designs AI-driven data centers, intelligent automation, and energy-efficient digital infrastructure across Madurai, Coimbatore, Trichy, and Mangalore.',
    bodyHtml: body,
  }));
}

// ---------------------------------------------------------------------------
// 2–6. CAPABILITIES hub + detail (AI Infrastructure, Data Center Solutions, etc.)
// ---------------------------------------------------------------------------
{
  const base = '../';
  const body = `
${breadcrumb(base, [{ label: 'Home', href: 'index.html' }, { label: 'Capabilities' }])}
${hero({
  base,
  eyebrow: 'CORE CAPABILITIES',
  headline: 'Foundations for High-Density AI & Modern Enterprise Computing',
  description: 'Explore the five core capabilities behind GreenNext: from accelerated AI compute architecture to energy efficiency and carrier-neutral connectivity.',
  primary: { text: 'Talk to an Expert', href: 'contact.html' },
  secondary: { text: 'Quick Enquiry', href: 'contact.html#quick-enquiry' },
})}
${cardGrid(base, capabilities, { hrefPrefix: 'capabilities/', columns: 3, withPhoto: true })}
${finalCTASection(base)}
`;
  write('capabilities/index.html', page({
    base, title: 'Enterprise Capabilities | AI Infrastructure & Data Center Engineering',
    metaDesc: 'Explore GreenNext capabilities: AI infrastructure, data center solutions, intelligent automation, energy efficiency, and digital infrastructure.',
    bodyHtml: body,
  }));

  for (const cap of capabilities) {
    const cData = capabilitiesContent[cap.slug];
    const capTitle = cData ? cData.seoTitle : cap.name;
    const capDesc = cData ? cData.metaDesc : cap.cardDesc;

    const capBody = `
${breadcrumb(base, [{ label: 'Home', href: 'index.html' }, { label: 'Capabilities', href: 'capabilities/index.html' }, { label: cap.name }])}
${hero({
  base,
  eyebrow: cData ? cData.eyebrow : cap.eyebrow,
  headline: cData ? cData.headline : cap.headline,
  description: cData ? cData.description : cap.description,
  primary: { text: 'Talk to an Expert', href: '#enquiry' },
  secondary: { text: 'Quick Enquiry', href: '#quick-enquiry' },
})}
${cData && cData.benefits ? benefitsSection(cData.benefits, { eyebrow: 'Business Benefits', heading: 'Engineered for Performance, Reliability & TCO' }) : ''}
${cData && cData.deepDive ? deepDiveSection({ ...cData.deepDive, base }) : ''}
${cData && cData.useCases ? useCasesSection(cData.useCases, { eyebrow: 'Enterprise Use Cases', heading: 'Practical Deployments Across Modern Workloads' }) : ''}
${featureGrid(cap.features)}
${processSectionFor(cap.slug)}
${cData && cData.faqs ? faqSection(cData.faqs, { eyebrow: 'Frequently Asked Questions', heading: `Technical & Operational Clarity: ${cap.name}` }) : ''}
<section class="section bg-soft" id="quick-enquiry" style="padding-top:var(--space-12);">
  <div class="container" style="max-width:900px;">
    ${quickEnquirySection({ base, title: `Quick Enquiry — ${cap.name}`, subtitle: 'Have a specific question regarding rack density, power availability, or facility readiness?' })}
  </div>
</section>
<div id="enquiry">
  ${leadFormSection(cap.formBucket, { base })}
</div>
${cData && cData.relatedLinks ? relatedLinksBar(cData.relatedLinks, base) : ''}
${finalCTASection(base)}
`;
    write(`capabilities/${cap.slug}.html`, page({
      base, title: capTitle,
      metaDesc: capDesc,
      bodyHtml: capBody,
    }));
  }
}

// ---------------------------------------------------------------------------
// 7–14. INDUSTRIES hub + detail (Healthcare, Finance, Manufacturing, etc.)
// ---------------------------------------------------------------------------
{
  const base = '../';
  const body = `
${breadcrumb(base, [{ label: 'Home', href: 'index.html' }, { label: 'Industries' }])}
${hero({
  base,
  eyebrow: 'ENTERPRISE INDUSTRIES',
  headline: 'Digital Infrastructure Tailored to Your Industry’s Operational Realities',
  description: 'GreenNext designs high-availability infrastructure, secure data centers, and automation frameworks suited to the strict compliance and uptime needs of your sector.',
  primary: { text: 'Talk to an Expert', href: 'contact.html' },
  secondary: { text: 'Quick Enquiry', href: 'contact.html#quick-enquiry' },
})}
${cardGrid(base, industries, { hrefPrefix: 'industries/', ctaText: 'Explore Industry', columns: 4 })}
${finalCTASection(base)}
`;
  write('industries/index.html', page({
    base, title: 'Industries We Serve | Enterprise Digital Infrastructure Solutions',
    metaDesc: 'GreenNext serves healthcare, finance, manufacturing, technology, government, education, retail, and enterprise conglomerates with tailored infrastructure.',
    bodyHtml: body,
  }));

  for (const ind of industries) {
    const iData = industriesContent[ind.slug];
    const indTitle = iData ? iData.seoTitle : ind.name;
    const indDesc = iData ? iData.metaDesc : ind.description;

    const indBody = `
${breadcrumb(base, [{ label: 'Home', href: 'index.html' }, { label: 'Industries', href: 'industries/index.html' }, { label: ind.name }])}
${hero({
  base,
  eyebrow: iData ? iData.eyebrow : ind.name.toUpperCase(),
  headline: iData ? iData.headline : `Infrastructure Solutions for ${ind.name}`,
  description: iData ? iData.description : ind.description,
  primary: { text: 'Talk to an Expert', href: '#enquiry' },
  secondary: { text: 'Quick Enquiry', href: '#quick-enquiry' },
})}
${iData && iData.benefits ? benefitsSection(iData.benefits, { eyebrow: 'Sector Benefits', heading: `Purpose-Built Advantages for ${ind.name}` }) : ''}
${iData && iData.deepDive ? deepDiveSection({ ...iData.deepDive, base }) : ''}
${iData && iData.useCases ? useCasesSection(iData.useCases, { eyebrow: 'Sector Applications', heading: `Proven Deployments in ${ind.name}` }) : ''}
${iData && iData.faqs ? faqSection(iData.faqs, { eyebrow: 'Frequently Asked Questions', heading: `${ind.name} Infrastructure Clarity` }) : ''}
<section class="section bg-soft" id="quick-enquiry" style="padding-top:var(--space-12);">
  <div class="container" style="max-width:900px;">
    ${quickEnquirySection({ base, title: `Quick Enquiry — ${ind.name} Infrastructure`, subtitle: `Discuss compliance, latency, or capacity requirements with our ${ind.name} sector specialists.` })}
  </div>
</section>
<div id="enquiry">
  ${leadFormSection('general', { base, prefillIndustry: ind.name })}
</div>
${iData && iData.relatedLinks ? relatedLinksBar(iData.relatedLinks, base) : ''}
${finalCTASection(base)}
`;
    write(`industries/${ind.slug}.html`, page({
      base, title: indTitle,
      metaDesc: indDesc,
      bodyHtml: indBody,
    }));
  }
}

// ---------------------------------------------------------------------------
// SOLUTIONS hub + detail
// ---------------------------------------------------------------------------
{
  const base = '../';
  const body = `
${breadcrumb(base, [{ label: 'Home', href: 'index.html' }, { label: 'Solutions' }])}
${hero({
  base,
  eyebrow: 'ENGINEERED SOLUTIONS',
  headline: 'Specialized Solutions for the AI-Driven Enterprise',
  description: 'Explore GreenNext solutions spanning AI data centers, smart infrastructure, energy optimization, and automation.',
  primary: { text: 'Talk to an Expert', href: 'contact.html' },
  secondary: { text: 'Quick Enquiry', href: 'contact.html#quick-enquiry' },
})}
${cardGrid(base, solutions, { hrefPrefix: 'solutions/', columns: 4, withPhoto: true })}
${finalCTASection(base)}
`;
  write('solutions/index.html', page({
    base, title: 'Solutions | AI Data Centers & Energy Optimization',
    metaDesc: 'GreenNext solutions: AI data centers, smart infrastructure, energy optimization, and automation solutions.',
    bodyHtml: body,
  }));

  for (const sol of solutions) {
    const sData = solutionsContent[sol.slug];
    const solTitle = sData ? sData.seoTitle : `${sol.name} | GreenNext Solutions`;
    const solDesc = sData ? sData.metaDesc : sol.cardDesc;

    const solBody = `
${breadcrumb(base, [{ label: 'Home', href: 'index.html' }, { label: 'Solutions', href: 'solutions/index.html' }, { label: sol.name }])}
${hero({
  base,
  eyebrow: sData ? sData.eyebrow : sol.eyebrow,
  headline: sData ? sData.headline : sol.headline,
  description: sData ? sData.description : sol.description,
  primary: { text: 'Talk to an Expert', href: '#enquiry' },
  secondary: { text: 'Quick Enquiry', href: '#quick-enquiry' },
})}
${sData && sData.benefits ? benefitsSection(sData.benefits, { eyebrow: 'Solution Benefits', heading: `Enterprise Advantages of ${sol.name}` }) : featureGrid(sol.features)}
${sData && sData.deepDive ? deepDiveSection({ ...sData.deepDive, base }) : ''}
${processSectionFor(sol.slug)}
${sData && sData.useCases ? useCasesSection(sData.useCases, { eyebrow: 'Proven Implementations', heading: `Real-World Deployments of ${sol.name}` }) : ''}
${sData && sData.faqs ? faqSection(sData.faqs, { eyebrow: 'Frequently Asked Questions', heading: `${sol.name} Architecture & Deployment FAQ` }) : ''}
<section class="section bg-soft" id="quick-enquiry" style="padding-top:var(--space-12);">
  <div class="container" style="max-width:900px;">
    ${quickEnquirySection({ base, title: `Quick Enquiry — ${sol.name}`, subtitle: 'Connect with our solutions engineering desk for architectural options.' })}
  </div>
</section>
<div id="enquiry">
  ${leadFormSection(sol.formBucket, { base })}
</div>
${sData && sData.relatedLinks ? relatedLinksBar(sData.relatedLinks, base) : ''}
${finalCTASection(base)}
`;
    write(`solutions/${sol.slug}.html`, page({
      base, title: solTitle,
      metaDesc: solDesc,
      bodyHtml: solBody,
    }));
  }
}

// ---------------------------------------------------------------------------
// 15. LOCATIONS hub + detail (Madurai, Coimbatore, Trichy, Mangalore)
// ---------------------------------------------------------------------------
{
  const base = '../';
  const body = `
${breadcrumb(base, [{ label: 'Home', href: 'index.html' }, { label: 'Locations' }])}
${hero({
  base,
  eyebrow: 'REGIONAL PRESENCE',
  headline: 'Connected Digital Infrastructure Across South India’s Growth Corridors',
  description: 'GreenNext supports enterprises across Madurai, Coimbatore, Trichy, and Mangalore with regional infrastructure expertise, high-density AI planning, and energy-aware facility design.',
  primary: { text: 'Talk to an Expert', href: 'contact.html' },
  secondary: { text: 'Quick Enquiry', href: 'contact.html#quick-enquiry' },
})}
${locationsMapSection(base, locations, 'locations/')}
${anchorSection({
  id: 'regional-network', eyebrow: 'Regional Network',
  heading: 'A Connected Regional Corridor Network',
  body: 'GreenNext operates across Madurai, Coimbatore, Trichy, and Mangalore as a coordinated network, allowing infrastructure standards, cooling methodologies, and automation telemetry to be shared consistently rather than siloed in one city.',
})}
${anchorSection({
  id: 'infrastructure-footprint', eyebrow: 'Infrastructure Footprint',
  heading: 'Tailored Infrastructure Footprints for Local Economies',
  body: 'Across these four regions, GreenNext brings the same core capabilities—AI infrastructure, data center solutions, intelligent automation, and energy efficiency—adapted to each region’s distinct industrial, maritime, educational, or commercial character.',
})}
${anchorSection({
  id: 'connectivity', eyebrow: 'Connectivity',
  heading: 'Carrier-Neutral Regional Interconnects',
  body: 'Consistent optical connectivity between locations supports synchronized multi-city data replication, active-passive disaster recovery, and low-latency access for distributed enterprise branch offices.',
})}
${anchorSection({
  id: 'regional-operations', eyebrow: 'Regional Operations',
  heading: 'Localized Engineering Advisory & 24/7 Operations',
  body: 'Regional operations teams work closely with local enterprises to ensure infrastructure designs reflect local electrical grid characteristics and ambient climates while meeting tier-grade uptime requirements.',
})}
<section class="section bg-soft" id="quick-enquiry" style="padding-top:var(--space-12);">
  <div class="container" style="max-width:900px;">
    ${quickEnquirySection({ base, title: 'Quick Regional Infrastructure Enquiry', subtitle: 'Select your preferred region and share your preliminary facility or capacity requirements.' })}
  </div>
</section>
${finalCTASection(base)}
`;
  write('locations/index.html', page({
    base, title: 'Regional Presence | Madurai, Coimbatore, Trichy, Mangalore',
    metaDesc: 'GreenNext regional presence across Madurai, Coimbatore, Trichy, and Mangalore — powering South India’s enterprise digital corridors.',
    bodyHtml: body,
  }));

  for (const loc of locations) {
    const lData = locationsContent[loc.slug];
    const locTitle = lData ? lData.seoTitle : loc.name;
    const locDesc = lData ? lData.metaDesc : loc.description;

    const locBody = `
${breadcrumb(base, [{ label: 'Home', href: 'index.html' }, { label: 'Locations', href: 'locations/index.html' }, { label: loc.name }])}
${hero({
  base,
  eyebrow: `${loc.name.toUpperCase()} REGIONAL HUB`,
  headline: lData ? lData.headline : `GreenNext in ${loc.name}`,
  description: lData ? lData.description : loc.description,
  primary: { text: 'Talk to an Expert', href: '#enquiry' },
  secondary: { text: 'Quick Enquiry', href: '#quick-enquiry' },
})}
${lData && lData.highlights ? benefitsSection(lData.highlights, { eyebrow: 'Regional Advantages', heading: `Why ${loc.name} for Digital Infrastructure` }) : ''}
${lData && lData.deepDive ? deepDiveSection({ ...lData.deepDive, base }) : ''}
${lData && lData.useCases ? useCasesSection(lData.useCases, { eyebrow: 'Regional Deployments', heading: `Targeted Enterprise Scenarios in ${loc.name}` }) : ''}
${lData && lData.faqs ? faqSection(lData.faqs, { eyebrow: 'Frequently Asked Questions', heading: `${loc.name} Regional Infrastructure FAQ` }) : ''}
<section class="section bg-soft" id="quick-enquiry" style="padding-top:var(--space-12);">
  <div class="container" style="max-width:900px;">
    ${quickEnquirySection({ base, title: `Quick Enquiry for ${loc.name}`, subtitle: `Connect with our ${loc.name} regional engineering advisory desk.` })}
  </div>
</section>
<div id="enquiry">
  ${leadFormSection('general', { base, prefillLocation: loc.name })}
</div>
${lData && lData.relatedLinks ? relatedLinksBar(lData.relatedLinks, base) : ''}
${finalCTASection(base)}
`;
    write(`locations/${loc.slug}.html`, page({
      base, title: locTitle,
      metaDesc: locDesc,
      bodyHtml: locBody,
    }));
  }
}

// ---------------------------------------------------------------------------
// 16. ABOUT US (about.html)
// ---------------------------------------------------------------------------
{
  const base = '';
  const body = `
${breadcrumb(base, [{ label: 'Home', href: 'index.html' }, { label: 'About Us' }])}
${hero({
  base,
  eyebrow: aboutContent.eyebrow,
  headline: aboutContent.headline,
  description: aboutContent.description,
  primary: aboutContent.heroPrimary,
  secondary: aboutContent.heroSecondary,
})}
${aboutSplitSection({
  id: 'company-overview', base,
  heading: aboutContent.whoWeAre.heading,
  body: aboutContent.whoWeAre.body,
  floatCardText: aboutContent.whoWeAre.floatCardText,
})}
<div id="who-we-are"></div>
<section class="section bg-soft" id="our-approach">
  <div id="technology-approach"></div>
  <div class="container">
    <div class="section-header section-header--center">
      <span class="section-label">Architecture Philosophy</span>
      <h2 class="heading-xl">The Seven-Layer Infrastructure Model</h2>
      <p class="text-base text-muted" style="max-width:720px;margin:var(--space-3) auto 0;">Connecting compute, energy, cooling, and automation into one unified operational architecture.</p>
    </div>
    <div class="grid-4" style="gap:var(--space-5);">
      ${aboutContent.sevenLayers.map(layer => `
        <div class="card reveal" style="padding:var(--space-6);">
          <span style="font-size:var(--font-size-xs);font-weight:700;color:var(--color-primary);">${layer.num}</span>
          <h3 class="feature-title" style="margin:var(--space-2) 0 var(--space-3);">${layer.title}</h3>
          <p class="feature-desc" style="font-size:var(--font-size-sm);">${layer.desc}</p>
        </div>`).join('')}
    </div>
  </div>
</section>
<div id="why-greennext"></div>
${benefitsSection(aboutContent.values, { eyebrow: 'Core Principles', heading: 'The Engineering Values That Guide Every Decision' })}
${sustainabilitySection(base, 'sustainability')}
${futureVisionSection()}
${faqSection(aboutContent.faqs, { eyebrow: 'Frequently Asked Questions', heading: 'Understanding Our Approach & Focus' })}
<section class="section bg-soft" id="quick-enquiry" style="padding-top:var(--space-12);">
  <div class="container" style="max-width:900px;">
    ${quickEnquirySection({ base, title: 'Connect with GreenNext Leadership', subtitle: 'Discuss architectural partnerships, regional advisory, or media inquiries.' })}
  </div>
</section>
${finalCTASection(base)}
`;
  write('about.html', page({
    base, title: aboutContent.seoTitle,
    metaDesc: aboutContent.metaDesc,
    bodyHtml: body,
  }));
}

// ---------------------------------------------------------------------------
// 17. SUSTAINABILITY (sustainability.html)
// ---------------------------------------------------------------------------
{
  const base = '';
  const body = `
${breadcrumb(base, [{ label: 'Home', href: 'index.html' }, { label: 'Sustainability' }])}
${hero({
  base,
  eyebrow: sustainabilityContent.eyebrow,
  headline: sustainabilityContent.headline,
  description: sustainabilityContent.description,
  primary: sustainabilityContent.heroPrimary,
  secondary: sustainabilityContent.heroSecondary,
})}
${benefitsSection(sustainabilityContent.pillars, { eyebrow: 'Four Pillars', heading: 'Our Core Sustainability Commitments' })}
${deepDiveSection({ ...sustainabilityContent.deepDive, base })}
${useCasesSection(sustainabilityContent.useCases, { eyebrow: 'Sustainable Deployments', heading: 'Real-World Energy & Cooling Optimization' })}
${faqSection(sustainabilityContent.faqs, { eyebrow: 'Frequently Asked Questions', heading: 'Sustainability Standards & Transparency' })}
<section class="section bg-soft" id="quick-enquiry" style="padding-top:var(--space-12);">
  <div class="container" style="max-width:900px;">
    ${quickEnquirySection({ base, title: 'Discuss Your Energy & Sustainability Roadmap', subtitle: 'Connect with our energy optimization specialists for a preliminary facility review.' })}
  </div>
</section>
${relatedLinksBar(sustainabilityContent.relatedLinks, base)}
${finalCTASection(base)}
`;
  write('sustainability.html', page({
    base, title: sustainabilityContent.seoTitle,
    metaDesc: sustainabilityContent.metaDesc,
    bodyHtml: body,
  }));
}

// ---------------------------------------------------------------------------
// 18. CAREERS (careers.html)
// ---------------------------------------------------------------------------
{
  const base = '';
  const body = `
${breadcrumb(base, [{ label: 'Home', href: 'index.html' }, { label: 'Careers' }])}
${hero({
  base,
  eyebrow: careersContent.eyebrow,
  headline: careersContent.headline,
  description: careersContent.description,
  primary: careersContent.heroPrimary,
  secondary: careersContent.heroSecondary,
})}
${benefitsSection(careersContent.culturePoints, { eyebrow: 'Our Culture', heading: 'Why Build Your Career at GreenNext' })}
<section class="section bg-soft" id="career-opportunities">
  <div id="practice-areas"></div>
  <div class="container">
    <div class="section-header section-header--center">
      <span class="section-label">Engineering Disciplines</span>
      <h2 class="heading-xl">Open Practice Areas &amp; Specializations</h2>
      <p class="text-base text-muted" style="max-width:720px;margin:var(--space-3) auto 0;">We welcome exceptional talent across power engineering, thermodynamics, optical networking, and software automation.</p>
    </div>
    <div class="grid-2" style="gap:var(--space-6);">
      ${careersContent.practiceAreas.map(pa => `
        <div class="feature-card reveal" style="padding:var(--space-6);">
          <div class="feature-icon" style="margin-bottom:var(--space-4);">${icon(pa.icon)}</div>
          <h3 class="feature-title" style="margin-bottom:var(--space-2);">${pa.title}</h3>
          <p class="feature-desc">${pa.desc}</p>
        </div>`).join('')}
    </div>
  </div>
</section>
${faqSection(careersContent.faqs, { eyebrow: 'Frequently Asked Questions', heading: 'Hiring Process & Candidate Guidance' })}
<section class="section" id="work-with-us">
  <div id="apply"></div>
  ${careersFormSection(base)}
</section>
${finalCTASection(base)}
`;
  write('careers.html', page({
    base, title: careersContent.seoTitle,
    metaDesc: careersContent.metaDesc,
    bodyHtml: body,
  }));
}

// ---------------------------------------------------------------------------
// 19. CONTACT US (contact.html)
// ---------------------------------------------------------------------------
{
  const base = '';
  const body = `
${breadcrumb(base, [{ label: 'Home', href: 'index.html' }, { label: 'Contact' }])}
${hero({
  base,
  eyebrow: contactContent.eyebrow,
  headline: contactContent.headline,
  description: contactContent.description,
  primary: contactContent.heroPrimary,
  secondary: contactContent.heroSecondary,
})}
<div class="container" id="contact-information" style="margin-top: var(--space-10);">
  <div id="pathways"></div>
  <div class="grid-3" style="gap: var(--space-6);">
    ${contactContent.pathways.map((pw, i) => `
      <div class="feature-card reveal reveal-delay-${i + 1}" ${pw.isWhatsApp ? 'id="whatsapp"' : ''} style="text-align: center;display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          <div class="feature-icon" style="margin: 0 auto var(--space-4);${pw.isWhatsApp ? 'color:#25D366;' : ''}">${icon(pw.icon)}</div>
          <h3 class="feature-title">${pw.title}</h3>
          <p class="feature-desc">${pw.desc}</p>
        </div>
        <div style="margin-top:var(--space-6);">
          ${pw.isWhatsApp
            ? `<a class="hero-whatsapp-btn" href="#" data-whatsapp="true" style="justify-content:center;margin:0 auto;display:inline-flex;">${icon('whatsapp')} <span>${pw.actionText}</span></a>`
            : `<a class="btn btn-secondary btn-sm" href="${pw.actionHref}"><span>${pw.actionText}</span> &rarr;</a>`}
        </div>
      </div>`).join('')}
  </div>
</div>
<div id="talk-to-an-expert">
  <div id="enquiry">
    ${leadFormSection('consultation', { base })}
  </div>
</div>
<section class="section bg-soft" id="quick-enquiry" style="padding-top:var(--space-12);">
  <div class="container" style="max-width:900px;">
    ${quickEnquirySection({ base, title: 'Quick Technical Enquiry', subtitle: 'Need a fast answer from our engineering desk? Submit your details below.' })}
  </div>
</section>
${faqSection(contactContent.faqs, { eyebrow: 'Frequently Asked Questions', heading: 'Consultation & Advisory FAQ' })}
${finalCTASection(base)}
`;
  write('contact.html', page({
    base, title: contactContent.seoTitle,
    metaDesc: contactContent.metaDesc,
    bodyHtml: body,
  }));
}

// ---------------------------------------------------------------------------
// 20. CUSTOM 404 PAGE (404.html)
// ---------------------------------------------------------------------------
{
  const base = '';
  const body = `
${breadcrumb(base, [{ label: 'Home', href: 'index.html' }, { label: '404 Page Not Found' }])}
<section class="section" style="padding-top:var(--space-16);padding-bottom:var(--space-24);text-align:center;">
  <div class="container" style="max-width:860px;">
    <div style="display:inline-flex;align-items:center;gap:var(--space-2);padding:6px 16px;border-radius:var(--radius-full);background:rgba(220,38,38,0.08);border:1px solid rgba(220,38,38,0.25);color:var(--color-error);font-size:var(--font-size-xs);font-weight:700;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:var(--space-6);">
      <span>404 — Route Not Found</span>
    </div>
    <h1 class="heading-2xl" style="margin-bottom:var(--space-4);">The Requested Infrastructure Route Does Not Exist</h1>
    <p class="text-lg text-muted" style="line-height:1.65;max-width:680px;margin:0 auto var(--space-8);">
      The page or technical resource you are attempting to access has been relocated, renamed, or is temporarily unavailable. Use the architecture directory below to navigate to verified sections.
    </p>
    <div style="display:flex;justify-content:center;flex-wrap:wrap;gap:var(--space-4);margin-bottom:var(--space-16);">
      <a class="btn btn-primary" href="index.html"><span>Return to Homepage</span> &rarr;</a>
      <a class="btn btn-secondary" href="capabilities/index.html"><span>Explore Capabilities</span></a>
      <a class="btn btn-secondary" href="contact.html"><span>Contact Technical Desk</span></a>
    </div>

    <div class="card" style="text-align:left;padding:var(--space-8);background:var(--color-bg-soft);border-color:var(--color-border-light);">
      <h2 class="heading-sm" style="margin-bottom:var(--space-4);color:var(--color-dark);">Verified Architecture Site Directory</h2>
      <div class="grid-4" style="gap:var(--space-4);">
        <div>
          <h3 style="font-size:var(--font-size-xs);font-weight:700;text-transform:uppercase;color:var(--color-primary);margin-bottom:var(--space-2);">Capabilities</h3>
          <ul style="list-style:none;font-size:var(--font-size-xs);display:flex;flex-direction:column;gap:6px;">
            <li><a href="capabilities/ai-infrastructure.html" style="color:var(--color-text);text-decoration:none;">AI Infrastructure</a></li>
            <li><a href="capabilities/data-center-solutions.html" style="color:var(--color-text);text-decoration:none;">Data Centers</a></li>
            <li><a href="capabilities/intelligent-automation.html" style="color:var(--color-text);text-decoration:none;">Automation</a></li>
            <li><a href="capabilities/energy-efficiency.html" style="color:var(--color-text);text-decoration:none;">Energy Efficiency</a></li>
            <li><a href="capabilities/digital-infrastructure.html" style="color:var(--color-text);text-decoration:none;">Digital Backbone</a></li>
          </ul>
        </div>
        <div>
          <h3 style="font-size:var(--font-size-xs);font-weight:700;text-transform:uppercase;color:var(--color-primary);margin-bottom:var(--space-2);">Solutions</h3>
          <ul style="list-style:none;font-size:var(--font-size-xs);display:flex;flex-direction:column;gap:6px;">
            <li><a href="solutions/ai-data-centers.html" style="color:var(--color-text);text-decoration:none;">AI Facilities</a></li>
            <li><a href="solutions/smart-infrastructure.html" style="color:var(--color-text);text-decoration:none;">Smart Sensing</a></li>
            <li><a href="solutions/energy-optimization.html" style="color:var(--color-text);text-decoration:none;">PUE Reduction</a></li>
            <li><a href="solutions/automation-solutions.html" style="color:var(--color-text);text-decoration:none;">Operations</a></li>
          </ul>
        </div>
        <div>
          <h3 style="font-size:var(--font-size-xs);font-weight:700;text-transform:uppercase;color:var(--color-primary);margin-bottom:var(--space-2);">Locations</h3>
          <ul style="list-style:none;font-size:var(--font-size-xs);display:flex;flex-direction:column;gap:6px;">
            <li><a href="locations/madurai.html" style="color:var(--color-text);text-decoration:none;">Madurai Hub</a></li>
            <li><a href="locations/coimbatore.html" style="color:var(--color-text);text-decoration:none;">Coimbatore Hub</a></li>
            <li><a href="locations/trichy.html" style="color:var(--color-text);text-decoration:none;">Trichy Hub</a></li>
            <li><a href="locations/mangalore.html" style="color:var(--color-text);text-decoration:none;">Mangalore Hub</a></li>
          </ul>
        </div>
        <div>
          <h3 style="font-size:var(--font-size-xs);font-weight:700;text-transform:uppercase;color:var(--color-primary);margin-bottom:var(--space-2);">Company</h3>
          <ul style="list-style:none;font-size:var(--font-size-xs);display:flex;flex-direction:column;gap:6px;">
            <li><a href="about.html" style="color:var(--color-text);text-decoration:none;">About GreenNext</a></li>
            <li><a href="sustainability.html" style="color:var(--color-text);text-decoration:none;">Sustainability</a></li>
            <li><a href="careers.html" style="color:var(--color-text);text-decoration:none;">Careers Portal</a></li>
            <li><a href="contact.html" style="color:var(--color-text);text-decoration:none;">Contact Advisory</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>
`;
  write('404.html', page({
    base, title: '404 — Page Not Found | GreenNext',
    metaDesc: 'The requested infrastructure route could not be found. Explore GreenNext capabilities, solutions, and regional hubs.',
    bodyHtml: body,
  }));
}

// ---------------------------------------------------------------------------
// PRIVACY / TERMS
// ---------------------------------------------------------------------------
{
  const base = '';
  const legalBody = (title, paragraphs) => `
${breadcrumb(base, [{ label: 'Home', href: 'index.html' }, { label: title }])}
<section class="section">
  <div class="container" style="max-width: 780px;">
    <h1 class="heading-xl" style="margin-bottom: var(--space-8);">${title}</h1>
    ${paragraphs.map(p => `<p class="text-base text-muted" style="margin-bottom: var(--space-5);">${p}</p>`).join('')}
  </div>
</section>
`;

  write('privacy-policy.html', page({
    base, title: 'Privacy Policy | GreenNext',
    metaDesc: 'GreenNext Privacy Policy.',
    bodyHtml: legalBody('Privacy Policy', [
      '<!-- Placeholder legal copy: replace with GreenNext\'s reviewed privacy policy. -->',
      'This page outlines how GreenNext collects, uses, and protects information submitted through this website, including enquiry and application forms.',
      'All personal data submitted through consultation requests or application portals is processed in accordance with applicable data privacy legislation and kept strictly confidential.',
    ]),
  }));

  write('terms-and-conditions.html', page({
    base, title: 'Terms & Conditions | GreenNext',
    metaDesc: 'GreenNext Terms & Conditions.',
    bodyHtml: legalBody('Terms &amp; Conditions', [
      '<!-- Placeholder legal copy: replace with GreenNext\'s reviewed terms and conditions. -->',
      'These terms govern the use of this website. By using this site, you agree to these terms.',
      'All architectural descriptions, technical diagrams, and conceptual models displayed on this website are proprietary to GreenNext and intended for informational and advisory planning purposes.',
    ]),
  }));
}

console.log('GreenNext site successfully generated for all primary pages and 404.');
