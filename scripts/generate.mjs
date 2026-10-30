import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { capabilities, industries, solutions, locations, operationalWorkflowSteps, glanceCards, challenges, howGreenNextWorksSteps, systemArchitectureSteps, whyGreenNextPillars, tenKpis } from './data.mjs';
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
  aboutSplitSection, anchorSection, intelligenceDashboardSection, processFlowSection, architectureSection,
  sustainabilitySection, futureVisionSection, locationsMapSection,
  benefitsSection, useCasesSection, deepDiveSection, faqSection, relatedLinksBar,
  treeOfThoughtSection, regionalImpactSection, regionalOfficesSection,
  glanceCardsSection, challengesSection, howGreenNextWorksSection, systemArchitectureSection, whyGreenNextSection, consultationCTASection,
} from './templates.mjs';
import { icon } from './icons.mjs';
import { dashboardMock } from './visuals.mjs';

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

<!-- Section 2: Infrastructure at a Glance -->
${glanceCardsSection(base, glanceCards)}
${metricsStrip()}

<!-- Section 3: Challenges We Address -->
${challengesSection(base, challenges)}

<!-- Section 4: Infrastructure Capabilities -->
<section class="section" style="padding-bottom:0;" id="capabilities">
  <div class="container">
    <div class="section-header" style="display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:var(--space-4);margin-bottom:var(--space-10);">
      <div>
        <span class="section-label">Core Capabilities</span>
        <h2 class="heading-xl">The Foundation Behind Intelligent Enterprise</h2>
        <p class="text-base text-muted" style="margin-top:var(--space-2);">Purpose-built infrastructure foundations for high-density AI clusters, facility engineering, and operational visibility.</p>
      </div>
      <a class="location-card-link" href="capabilities/index.html">Explore All Capabilities <span class="btn-arrow">&rarr;</span></a>
    </div>
  </div>
</section>
${cardGrid(base, featuredCapabilities, { hrefPrefix: 'capabilities/', ctaText: 'Learn More', columns: 3, withPhoto: true })}

<!-- Section 5: Intelligent Solutions -->
<section class="section bg-soft" style="padding-bottom:0;" id="solutions">
  <div class="container">
    <div class="section-header" style="display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:var(--space-4);margin-bottom:var(--space-10);">
      <div>
        <span class="section-label">Intelligent Solutions</span>
        <h2 class="heading-xl">Engineered Solutions for Modern Workloads</h2>
        <p class="text-base text-muted" style="margin-top:var(--space-2);">Connect infrastructure data, operational visibility, and intelligent monitoring to support better decisions.</p>
      </div>
      <a class="location-card-link" href="solutions/index.html">Explore All Solutions <span class="btn-arrow">&rarr;</span></a>
    </div>
  </div>
</section>
${cardGrid(base, featuredSolutions, { hrefPrefix: 'solutions/', ctaText: 'Explore Solution', columns: 3, withPhoto: true })}

<!-- Section 6: How GreenNext Works -->
${howGreenNextWorksSection(base, howGreenNextWorksSteps)}

<!-- Section 7: Infrastructure Intelligence (10 KPIs Telemetry Console) -->
${intelligenceDashboardSection(base)}

<!-- Section 8: System Architecture -->
${systemArchitectureSection(base)}

<!-- Tree of Thought Architecture Section -->
${treeOfThoughtSection(base)}

<!-- Section 9: Industry Applications -->
<section class="section bg-soft" id="industries">
  <div class="container">
    <div class="section-header section-header--center">
      <span class="section-label">Industry Solutions</span>
      <h2 class="heading-xl">Infrastructure for Industries That Cannot Stand Still</h2>
      <p class="text-base text-muted" style="max-width:760px;margin:var(--space-3) auto 0;">
        Different sectors face distinct physical and architectural hurdles—from microsecond financial determinism to healthcare regulatory compliance.
      </p>
    </div>
    <div class="grid-3" style="gap:var(--space-5);margin-top:var(--space-8);">
      ${industries.slice(0, 6).map((ind, i) => `
        <div class="card reveal reveal-delay-${(i % 3) + 1}" style="display:flex;flex-direction:column;justify-content:space-between;padding:var(--space-6);background:rgba(11,18,32,0.7);border:1px solid rgba(0,255,102,0.2);border-radius:var(--radius-xl);">
          <div>
            <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-4);">
              <div class="card-icon" style="width:40px;height:40px;border-radius:10px;background:rgba(0,255,102,0.12);color:#00FF66;display:flex;align-items:center;justify-content:center;margin-bottom:0;">${icon(ind.icon)}</div>
              <h3 class="feature-title" style="margin:0;font-size:var(--font-size-base);color:#FFFFFF;">${ind.name}</h3>
            </div>
            <div style="margin-bottom:var(--space-3);font-size:var(--font-size-xs);line-height:1.6;color:var(--color-cool-grey);">
              <strong style="color:#FFFFFF;display:block;margin-bottom:2px;">Challenge:</strong> ${ind.challenge}
            </div>
            <div style="margin-bottom:var(--space-3);font-size:var(--font-size-xs);line-height:1.6;color:var(--color-cool-grey);">
              <strong style="color:#FFFFFF;display:block;margin-bottom:2px;">Capability:</strong> ${ind.capability}
            </div>
            <div style="padding:var(--space-2) var(--space-3);background:rgba(0,255,102,0.06);border-left:2px solid #00FF66;border-radius:var(--radius-sm);font-size:11px;color:#AAB7CB;line-height:1.5;">
              <strong style="color:#00FF66;">Outcome:</strong> ${ind.outcome}
            </div>
          </div>
          <div style="margin-top:var(--space-5);">
            <a class="location-card-link" href="industries/${ind.slug}.html">Sector Architecture &rarr;</a>
          </div>
        </div>`).join('')}
    </div>
  </div>
</section>

<!-- Section 10: Regional Focus -->
<section class="section bg-soft" style="padding-bottom: 0;" id="locations">
  <div class="container">
    <div class="section-header section-header--center">
      <span class="section-label">Regional Focus</span>
      <h2 class="heading-xl">Closer to the Next Wave of Digital Growth</h2>
      <p class="text-base text-muted" style="max-width:760px;margin:var(--space-3) auto 0;">
        Target service locations and strategic connectivity across South India's high-growth industrial and academic corridors: Madurai, Coimbatore, Trichy, and Mangalore.
      </p>
      <a class="location-card-link" href="locations/index.html" style="justify-content:center;margin-top:var(--space-4);">Explore Regional Hubs <span class="btn-arrow">&rarr;</span></a>
    </div>
  </div>
</section>
<div class="bg-soft">
${locationsMapSection(base, locations, 'locations/')}
</div>
${regionalImpactSection(base)}

<!-- Section 11: Why GreenNext -->
${whyGreenNextSection(base, whyGreenNextPillars)}

${sustainabilitySection(base)}

${aboutSplitSection({
  heading: 'Infrastructure Engineered to Think Ahead',
  body: 'GreenNext bridges high-performance computing, smart energy management, and intelligent automation into one unified operational architecture. We empower forward-looking organizations with sustainable, AI-ready data center facilities designed for longevity and resilience.',
  floatCardText: 'Powering Intelligence. Engineering Tomorrow.',
  base,
  img: 'assets/img/control-room.webp',
  id: 'about-greennext',
})}

<!-- Section 12: Consultation CTA -->
${consultationCTASection(base)}

<section class="section bg-soft" id="consultation" style="padding-top: var(--space-12);">
  <div class="container" style="max-width: 900px;">
    ${quickEnquirySection({
      base,
      title: 'Schedule a Consultation or Send an Enquiry',
      subtitle: 'Talk with our senior engineering team about your infrastructure priorities, operational challenges, and long-term technology roadmap.'
    })}
  </div>
</section>

${faqSection(homeFaqs, { eyebrow: 'Frequently Asked Questions', heading: 'Enterprise & Regional Infrastructure Clarity' })}

${finalCTASection(base)}
`;
  write('index.html', page({
    base,
    title: 'GreenNext — Powering Intelligence. Engineering Tomorrow. | AI Data Center Infrastructure',
    metaDesc: 'GreenNext delivers AI-ready infrastructure, high-density data center engineering, intelligent operations, and energy-conscious computing foundations for enterprises.',
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
  variant: 'dark',
  img: 'assets/img/datacenter-hero.jpg',
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
  variant: 'dark',
  img: cap.slug === 'ai-infrastructure' ? 'assets/img/datacenter-hero.jpg' : (cap.img || 'assets/img/server-room.webp'),
  eyebrow: cData ? cData.eyebrow : cap.eyebrow,
  headline: cData ? cData.headline : cap.headline,
  description: cData ? cData.description : cap.description,
  primary: { text: 'Talk to an Expert', href: '#enquiry' },
  secondary: { text: 'Quick Enquiry', href: '#quick-enquiry' },
})}
${cData && cData.benefits ? benefitsSection(cData.benefits, { eyebrow: 'Business Benefits', heading: 'Engineered for Performance, Reliability & TCO' }) : ''}
${cData && cData.deepDive ? deepDiveSection({ img: cData.img, alt: cData.alt, caption: cData.caption, ...cData.deepDive, base }) : ''}
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
  variant: 'dark',
  img: 'assets/img/datacenter-hero.jpg',
  eyebrow: 'ENTERPRISE INDUSTRIES',
  headline: 'Digital Infrastructure Tailored to Your Industry’s Operational Realities',
  description: 'GreenNext designs high-availability infrastructure, secure data centers, and automation frameworks suited to the strict compliance and uptime needs of your sector.',
  primary: { text: 'Talk to an Expert', href: 'contact.html' },
  secondary: { text: 'Quick Enquiry', href: 'contact.html#quick-enquiry' },
})}
${cardGrid(base, industries, { hrefPrefix: 'industries/', ctaText: 'Explore Industry', columns: 4 })}
${regionalImpactSection(base)}
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
  variant: 'dark',
  img: 'assets/img/datacenter-hero.jpg',
  eyebrow: iData ? iData.eyebrow : ind.name.toUpperCase(),
  headline: iData ? iData.headline : `Infrastructure Solutions for ${ind.name}`,
  description: iData ? iData.description : ind.description,
  primary: { text: 'Talk to an Expert', href: '#enquiry' },
  secondary: { text: 'Quick Enquiry', href: '#quick-enquiry' },
})}
${iData && iData.benefits ? benefitsSection(iData.benefits, { eyebrow: 'Sector Benefits', heading: `Purpose-Built Advantages for ${ind.name}` }) : ''}
${iData && iData.deepDive ? deepDiveSection({ img: iData.img, alt: iData.alt, caption: iData.caption, ...iData.deepDive, base }) : ''}
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
  variant: 'dark',
  img: 'assets/img/datacenter-hero.jpg',
  eyebrow: 'ENGINEERED SOLUTIONS',
  headline: 'Specialized Solutions for the AI-Driven Enterprise',
  description: 'Explore GreenNext solutions spanning AI data centers, smart infrastructure, energy optimization, and automation.',
  primary: { text: 'Talk to an Expert', href: 'contact.html' },
  secondary: { text: 'Quick Enquiry', href: 'contact.html#quick-enquiry' },
})}
${cardGrid(base, solutions, { hrefPrefix: 'solutions/', columns: 4, withPhoto: true })}
${treeOfThoughtSection(base)}
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
  variant: 'dark',
  img: sol.img || 'assets/img/server-room.webp',
  eyebrow: sData ? sData.eyebrow : sol.eyebrow,
  headline: sData ? sData.headline : sol.headline,
  description: sData ? sData.description : sol.description,
  primary: { text: 'Talk to an Expert', href: '#enquiry' },
  secondary: { text: 'Quick Enquiry', href: '#quick-enquiry' },
})}
${sData && sData.benefits ? benefitsSection(sData.benefits, { eyebrow: 'Solution Benefits', heading: `Enterprise Advantages of ${sol.name}` }) : featureGrid(sol.features)}
${sData && sData.deepDive ? deepDiveSection({ img: sData.img, alt: sData.alt, caption: sData.caption, ...sData.deepDive, base }) : ''}
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
  variant: 'dark',
  img: 'assets/img/datacenter-hero.jpg',
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
  variant: 'dark',
  img: loc.img || 'assets/img/datacenter-hero.jpg',
  eyebrow: `${loc.name.toUpperCase()} REGIONAL HUB`,
  headline: lData ? lData.headline : `GreenNext in ${loc.name}`,
  description: lData ? lData.description : loc.description,
  primary: { text: 'Talk to an Expert', href: '#enquiry' },
  secondary: { text: 'Quick Enquiry', href: '#quick-enquiry' },
})}
${lData && lData.highlights ? benefitsSection(lData.highlights, { eyebrow: 'Regional Advantages', heading: `Why ${loc.name} for Digital Infrastructure` }) : ''}
${lData && lData.deepDive ? deepDiveSection({ img: lData.img, alt: lData.alt, caption: lData.caption, ...lData.deepDive, base }) : ''}
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
  variant: 'dark',
  img: 'assets/img/control-room.webp',
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
  variant: 'dark',
  img: 'assets/img/solar-panels.webp',
  eyebrow: sustainabilityContent.eyebrow,
  headline: sustainabilityContent.headline,
  description: sustainabilityContent.description,
  primary: sustainabilityContent.heroPrimary,
  secondary: sustainabilityContent.heroSecondary,
})}
${benefitsSection(sustainabilityContent.pillars, { eyebrow: 'Four Pillars', heading: 'Our Core Sustainability Commitments' })}
${deepDiveSection({ img: sustainabilityContent.img, alt: sustainabilityContent.alt, caption: sustainabilityContent.caption, ...sustainabilityContent.deepDive, base })}
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
  variant: 'dark',
  img: 'assets/img/server-room.webp',
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
  variant: 'dark',
  img: 'assets/img/datacenter-hero.jpg',
  eyebrow: contactContent.eyebrow,
  headline: contactContent.headline,
  description: contactContent.description,
  primary: contactContent.heroPrimary,
  secondary: contactContent.heroSecondary,
})}
<div class="container" id="contact-information" style="margin-top: var(--space-10);">
  <div id="pathways"></div>
  <div class="grid-4" style="gap: var(--space-5);">
    ${contactContent.pathways.map((pw, i) => `
      <div class="feature-card reveal reveal-delay-${i + 1}" ${pw.isWhatsApp ? 'id="whatsapp"' : ''} style="text-align: center;display:flex;flex-direction:column;justify-content:space-between;padding:var(--space-6);">
        <div>
          <div class="feature-icon" style="margin: 0 auto var(--space-4);${pw.isWhatsApp ? 'color:#25D366;' : ''}">${icon(pw.icon)}</div>
          <h3 class="feature-title" style="font-size:var(--font-size-base);">${pw.title}</h3>
          <p class="feature-desc" style="font-size:var(--font-size-xs);">${pw.desc}</p>
        </div>
        <div style="margin-top:var(--space-5);">
          ${pw.isWhatsApp
            ? `<a class="hero-whatsapp-btn" href="#" data-whatsapp="true" style="justify-content:center;margin:0 auto;display:inline-flex;padding:9px 16px;font-size:var(--font-size-xs);">${icon('whatsapp')} <span>${pw.actionText}</span></a>`
            : pw.isChatbot
              ? `<button type="button" class="btn btn-primary btn-sm" data-open-chat="true" style="width:100%;justify-content:center;"><span>${pw.actionText}</span> &rarr;</button>`
              : `<a class="btn btn-secondary btn-sm" href="${pw.actionHref}" style="width:100%;justify-content:center;"><span>${pw.actionText}</span> &rarr;</a>`}
        </div>
      </div>`).join('')}
  </div>
</div>
${regionalOfficesSection(contactContent.regionalOffices, base)}
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
    metaDesc: 'GreenNext enterprise data privacy commitments, information processing practices, and security measures.',
    bodyHtml: legalBody('Privacy Policy', [
      'GreenNext is committed to safeguarding personal and organizational information submitted through this website, including technical enquiry channels, priority consultation forms, and career portals.',
      'All personal information, including names, corporate email addresses, phone numbers, and architectural requirements, is collected solely to evaluate digital infrastructure needs, provide customized engineering advisory, or review employment applications.',
      'GreenNext implements modern technical, administrative, and physical security measures to protect data against unauthorized access, alteration, or disclosure. We do not sell or rent enterprise contact details to third-party commercial marketing entities.',
      'Visitors may contact the GreenNext governance desk at hello@greennext.example regarding data updates, access requests, or privacy inquiries.'
    ]),
  }));

  write('terms-and-conditions.html', page({
    base, title: 'Terms & Conditions | GreenNext',
    metaDesc: 'GreenNext terms of website use, intellectual property rights, and technical advisory disclaimers.',
    bodyHtml: legalBody('Terms &amp; Conditions', [
      'These Terms and Conditions govern access to and use of the GreenNext website, technical architecture materials, and digital consultation pathways. By accessing this platform, users agree to adhere to these terms.',
      'All architectural descriptions, technical diagrams, conceptual topologies, and telemetry models displayed on this website are proprietary to GreenNext and intended for informational and advisory planning purposes.',
      'GreenNext strives to maintain accurate, up-to-date documentation regarding computing topologies, cooling benchmarks, and regional network corridors. Actual infrastructure specifications are finalized under formal service level agreements (SLAs) and master services contracts.',
      'For questions regarding intellectual property rights or enterprise partnership agreements, contact the GreenNext legal and advisory desk at hello@greennext.example.'
    ]),
  }));
}

// ---------------------------------------------------------------------------
// 21. TECHNOLOGY & ENGINEERING (technology.html)
// ---------------------------------------------------------------------------
{
  const base = '';
  const techBody = `
${breadcrumb(base, [{ label: 'Home', href: 'index.html' }, { label: 'Technology & Engineering' }])}
${hero({
  base,
  variant: 'dark',
  img: 'assets/img/circuit-board.webp',
  eyebrow: 'TECHNOLOGY &amp; ENGINEERING',
  headline: 'Layer-One Engineering for Extreme-Density AI Computing',
  description: 'Explore the physical engineering principles behind GreenNext: 2N electrical power topologies, direct-to-chip liquid cooling loops, 800G non-blocking optical fabrics, and autonomous closed-loop controls.',
  primary: { text: 'Schedule Technical Review', href: '#enquiry' },
  secondary: { text: 'Quick Enquiry', href: '#quick-enquiry' },
})}

<section class="section">
  <div class="container">
    <div class="section-header section-header--center">
      <span class="section-label">PHYSICAL INFRASTRUCTURE ARCHITECTURE</span>
      <h2 class="heading-xl">Engineered for 40kW–80kW+ Extreme Rack Densities</h2>
      <p class="text-base text-muted" style="max-width:760px;margin:var(--space-3) auto 0;">
        Modern AI model training generates intense localized thermal loads that overwhelm legacy data center designs. GreenNext re-engineers the physical layer from the ground up.
      </p>
    </div>
    
    <div class="grid-3" style="gap:var(--space-6);margin-top:var(--space-10);">
      <div class="card reveal" style="padding:var(--space-6);background:rgba(11,18,32,0.8);border:1px solid rgba(0,255,102,0.25);border-radius:var(--radius-xl);">
        <div class="card-icon" style="width:40px;height:40px;border-radius:10px;background:rgba(0,255,102,0.12);color:#00FF66;display:flex;align-items:center;justify-content:center;margin-bottom:var(--space-4);">${icon('bolt')}</div>
        <h3 class="heading-sm" style="color:#FFFFFF;margin-bottom:var(--space-2);">2N Isolated Power Trains</h3>
        <p class="text-sm" style="color:#AAB7CB;line-height:1.6;">Dual independent medium-voltage utility feeds paired with high-efficiency double-conversion modular UPS units and active harmonic filtration.</p>
      </div>
      <div class="card reveal" style="padding:var(--space-6);background:rgba(11,18,32,0.8);border:1px solid rgba(0,255,102,0.25);border-radius:var(--radius-xl);">
        <div class="card-icon" style="width:40px;height:40px;border-radius:10px;background:rgba(0,255,102,0.12);color:#00FF66;display:flex;align-items:center;justify-content:center;margin-bottom:var(--space-4);">${icon('spark')}</div>
        <h3 class="heading-sm" style="color:#FFFFFF;margin-bottom:var(--space-2);">Direct-to-Chip Liquid Loops</h3>
        <p class="text-sm" style="color:#AAB7CB;line-height:1.6;">Precision dielectric cold-plate cooling extracting thermal energy directly from high-TDP accelerators, reducing compressor workload and parasitic PUE loss.</p>
      </div>
      <div class="card reveal" style="padding:var(--space-6);background:rgba(11,18,32,0.8);border:1px solid rgba(0,255,102,0.25);border-radius:var(--radius-xl);">
        <div class="card-icon" style="width:40px;height:40px;border-radius:10px;background:rgba(0,255,102,0.12);color:#00FF66;display:flex;align-items:center;justify-content:center;margin-bottom:var(--space-4);">${icon('network')}</div>
        <h3 class="heading-sm" style="color:#FFFFFF;margin-bottom:var(--space-2);">800G Non-Blocking Fabrics</h3>
        <p class="text-sm" style="color:#AAB7CB;line-height:1.6;">Deterministic spine-leaf optical networking interconnecting multi-node GPU clusters with sub-microsecond latency and zero packet drop under heavy all-reduce jobs.</p>
      </div>
    </div>
  </div>
</section>

${architectureSection(base)}
${systemArchitectureSection(base)}

<section class="section bg-soft" id="quick-enquiry" style="padding-top:var(--space-12);">
  <div class="container" style="max-width:900px;">
    ${quickEnquirySection({ base, title: 'Schedule an Engineering Consultation', subtitle: 'Connect with GreenNext systems architects to discuss rack thermal modeling and electrical specifications.' })}
  </div>
</section>
<div id="enquiry">
  ${leadFormSection('general', { base })}
</div>
${finalCTASection(base)}
`;

  write('technology.html', page({
    base,
    title: 'Technology & Engineering | GreenNext High-Density AI Infrastructure',
    metaDesc: 'Explore GreenNext technology: 2N power topologies, direct-to-chip liquid cooling, 800G non-blocking optical backbones, and autonomous closed-loop facility telemetry.',
    bodyHtml: techBody,
  }));
}

// ---------------------------------------------------------------------------
// 22. CONSULTATION BOOKING (book-consultation.html)
// ---------------------------------------------------------------------------
{
  const base = '';
  const consultBody = `
${breadcrumb(base, [{ label: 'Home', href: 'index.html' }, { label: 'Book a Consultation' }])}
${hero({
  base,
  variant: 'dark',
  img: 'assets/img/control-room.webp',
  eyebrow: 'PRIORITY ARCHITECTURE CONSULTATION',
  headline: 'Plan Your Digital Infrastructure With GreenNext Experts',
  description: 'Discuss your power capacity, cooling density, workload distribution, and regional connectivity roadmap directly with our senior infrastructure engineering desk.',
  primary: { text: 'Schedule Priority Call', href: '#consultation-form' },
  secondary: { text: 'WhatsApp Technical Desk', href: '#whatsapp' },
})}

<section class="section" id="consultation-form">
  <div class="container" style="max-width:900px;">
    <div class="section-header section-header--center">
      <span class="section-label">DIRECT ADVISORY BOOKING</span>
      <h2 class="heading-xl">Let’s Plan Your Infrastructure</h2>
      <p class="text-base text-muted" style="max-width:720px;margin:var(--space-3) auto 0;">
        Share your operational requirements, compute density targets, or target service corridor (Madurai, Coimbatore, Trichy, Mangalore) to connect with a systems architect.
      </p>
    </div>
    ${leadFormSection('consultation', { base })}
  </div>
</section>

<section class="section bg-soft" id="whatsapp" style="text-align:center;padding:var(--space-12) 0;">
  <div class="container" style="max-width:700px;">
    <div style="width:54px;height:54px;border-radius:50%;background:rgba(37,211,102,0.15);color:#25D366;display:flex;align-items:center;justify-content:center;margin:0 auto var(--space-4);font-size:24px;">
      ${icon('whatsapp')}
    </div>
    <h3 class="heading-md" style="color:#FFFFFF;margin-bottom:var(--space-2);">Prefer Direct Messaging?</h3>
    <p class="text-sm text-muted" style="margin-bottom:var(--space-5);">Our engineering desk is available on WhatsApp for immediate technical queries regarding facility availability, power densities, and site scoping.</p>
    <a class="hero-whatsapp-btn" href="#" data-whatsapp="true" style="justify-content:center;margin:0 auto;display:inline-flex;padding:12px 24px;font-size:var(--font-size-sm);">
      ${icon('whatsapp')} <span>Connect on WhatsApp (+91 94433 66100)</span>
    </a>
  </div>
</section>

${finalCTASection(base)}
`;

  write('book-consultation.html', page({
    base,
    title: 'Plan Your Infrastructure | Book a Consultation with GreenNext',
    metaDesc: 'Schedule an enterprise consultation with GreenNext senior engineers. Discuss AI rack density, cooling optimization, power availability, and regional site scoping.',
    bodyHtml: consultBody,
  }));
}

// ---------------------------------------------------------------------------
// 23. INTELLIGENCE SUITE (intelligence/index.html & sub-pages)
// ---------------------------------------------------------------------------
{
  const base = '../';
  
  // 1. Intelligence Hub / Index
  const intHubBody = `
${breadcrumb(base, [{ label: 'Home', href: 'index.html' }, { label: 'Intelligence' }])}
${hero({
  base,
  variant: 'dark',
  img: 'assets/img/control-room.webp',
  eyebrow: 'INFRASTRUCTURE INTELLIGENCE // NEXUS-OPS',
  headline: 'Real-Time Telemetry & 10-KPI Performance Center',
  description: 'Unified operational observability across compute, electrical, thermal, and network tiers with continuous KPI computation and predictive anomaly alerts.',
  primary: { text: 'View Telemetry Console', href: '#telemetry-console' },
  secondary: { text: 'Open Executive Dashboard', href: '../analytics.html' },
})}

<section class="section" id="telemetry-console">
  <div class="container">
    <div class="section-header section-header--center">
      <span class="section-label">OBSERVABILITY SUITE</span>
      <h2 class="heading-xl">Ten Mission-Critical Infrastructure KPIs</h2>
      <p class="text-base text-muted" style="max-width:760px;margin:var(--space-3) auto 0;">
        Validated formulas, target thresholds, and real-time calculation engines monitoring facility health, energy efficiency, and sustainability.
      </p>
    </div>
    ${dashboardMock()}
  </div>
</section>

<section class="section bg-soft" id="intelligence-modules">
  <div class="container">
    <div class="section-header section-header--center">
      <span class="section-label">INTELLIGENCE MODULES</span>
      <h2 class="heading-xl">Deep-Dive Telemetry Domains</h2>
      <p class="text-base text-muted" style="max-width:760px;margin:var(--space-3) auto 0;">
        Explore specialized analytics modules designed for facility engineers, energy managers, and executive leadership.
      </p>
    </div>
    
    <div class="grid-4" style="gap:var(--space-6);margin-top:var(--space-10);">
      <div class="card reveal" style="padding:var(--space-6);background:rgba(11,18,32,0.85);border:1px solid rgba(0,255,102,0.25);border-radius:var(--radius-xl);display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          <div class="card-icon" style="width:36px;height:36px;border-radius:8px;background:rgba(0,255,102,0.12);color:#00FF66;display:flex;align-items:center;justify-content:center;margin-bottom:var(--space-3);">${icon('bolt')}</div>
          <h3 class="heading-sm" style="color:#FFFFFF;margin-bottom:var(--space-2);">Energy Intelligence</h3>
          <p class="text-xs" style="color:#AAB7CB;line-height:1.5;">Continuous PUE analysis, chiller COP tracking, and branch-circuit electrical power profiling.</p>
        </div>
        <div style="margin-top:var(--space-4);"><a class="location-card-link" href="energy-intelligence.html">Explore Energy &rarr;</a></div>
      </div>

      <div class="card reveal" style="padding:var(--space-6);background:rgba(11,18,32,0.85);border:1px solid rgba(0,255,102,0.25);border-radius:var(--radius-xl);display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          <div class="card-icon" style="width:36px;height:36px;border-radius:8px;background:rgba(0,255,102,0.12);color:#00FF66;display:flex;align-items:center;justify-content:center;margin-bottom:var(--space-3);">${icon('database')}</div>
          <h3 class="heading-sm" style="color:#FFFFFF;margin-bottom:var(--space-2);">Capacity Analytics</h3>
          <p class="text-xs" style="color:#AAB7CB;line-height:1.5;">3D spatial utilization, structural floor weight runway, and electrical panel expansion planning.</p>
        </div>
        <div style="margin-top:var(--space-4);"><a class="location-card-link" href="capacity-analytics.html">Explore Capacity &rarr;</a></div>
      </div>

      <div class="card reveal" style="padding:var(--space-6);background:rgba(11,18,32,0.85);border:1px solid rgba(0,255,102,0.25);border-radius:var(--radius-xl);display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          <div class="card-icon" style="width:36px;height:36px;border-radius:8px;background:rgba(0,255,102,0.12);color:#00FF66;display:flex;align-items:center;justify-content:center;margin-bottom:var(--space-3);">${icon('spark')}</div>
          <h3 class="heading-sm" style="color:#FFFFFF;margin-bottom:var(--space-2);">Sustainability Reporting</h3>
          <p class="text-xs" style="color:#AAB7CB;line-height:1.5;">CUE, WUE, and Renewable Energy Factor (REF) monitoring aligned with ISO 50001 and ESG standards.</p>
        </div>
        <div style="margin-top:var(--space-4);"><a class="location-card-link" href="sustainability-reporting.html">Explore ESG &rarr;</a></div>
      </div>

      <div class="card reveal" style="padding:var(--space-6);background:rgba(11,18,32,0.85);border:1px solid rgba(0,255,102,0.25);border-radius:var(--radius-xl);display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          <div class="card-icon" style="width:36px;height:36px;border-radius:8px;background:rgba(0,255,102,0.12);color:#00FF66;display:flex;align-items:center;justify-content:center;margin-bottom:var(--space-3);">${icon('shield')}</div>
          <h3 class="heading-sm" style="color:#FFFFFF;margin-bottom:var(--space-2);">Infrastructure Performance</h3>
          <p class="text-xs" style="color:#AAB7CB;line-height:1.5;">99.999% availability verification, sub-millisecond network transit, and MTTR incident benchmarks.</p>
        </div>
        <div style="margin-top:var(--space-4);"><a class="location-card-link" href="infrastructure-performance.html">Explore Performance &rarr;</a></div>
      </div>

      <div class="card reveal" style="padding:var(--space-6);background:rgba(11,18,32,0.85);border:1px solid rgba(0,255,102,0.25);border-radius:var(--radius-xl);display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          <div class="card-icon" style="width:36px;height:36px;border-radius:8px;background:rgba(0,255,102,0.12);color:#00FF66;display:flex;align-items:center;justify-content:center;margin-bottom:var(--space-3);">${icon('server')}</div>
          <h3 class="heading-sm" style="color:#FFFFFF;margin-bottom:var(--space-2);">Communication Templates</h3>
          <p class="text-xs" style="color:#AAB7CB;line-height:1.5;">Enterprise email communication templates with live variable preview, editor, and test email dispatch.</p>
        </div>
        <div style="margin-top:var(--space-4);"><a class="location-card-link" href="../templates.html">Open Templates &rarr;</a></div>
      </div>
    </div>
  </div>
</section>

${systemArchitectureSection(base)}
${finalCTASection(base)}
`;

  write('intelligence/index.html', page({
    base,
    title: 'Infrastructure KPI Dashboard & Intelligence Center | GreenNext',
    metaDesc: 'GreenNext Infrastructure Intelligence: Ten mission-critical KPIs, live telemetry architecture, energy optimization metrics, and continuous capacity analytics.',
    bodyHtml: intHubBody,
  }));

  // Helper generator for sub-intelligence pages
  const subPages = [
    {
      slug: 'energy-intelligence',
      title: 'Energy Intelligence & Thermal Telemetry',
      eyebrow: 'ENERGY INTELLIGENCE',
      headline: 'Sub-Second Power Telemetry & PUE Optimization',
      desc: 'Real-time electrical distribution tracking, phase load balancing, and precision cooling COP monitoring designed for extreme-density AI environments.',
      kpis: ['pue', 'cer', 'cost'],
      focus: 'Thermal Heat Dissipation & Power Utilization'
    },
    {
      slug: 'capacity-analytics',
      title: 'Capacity Analytics & Spatial Runway Modeling',
      eyebrow: 'CAPACITY RUNWAY',
      headline: 'Multi-Dimensional Space, Power & Cooling Runway',
      desc: 'Predictive modeling simulating structural floor loads, electrical distribution headroom, and thermal exhaust limits to prevent stranded capacity.',
      kpis: ['cap', 'util'],
      focus: 'Modular Expansion & Hardware Refresh Planning'
    },
    {
      slug: 'sustainability-reporting',
      title: 'Sustainability Reporting & ESG Accounting',
      eyebrow: 'SUSTAINABILITY ANALYTICS',
      headline: 'Automated Carbon, Water & Renewable Energy Accounting',
      desc: 'Replaces manual carbon estimates with verified continuous telemetry measuring CUE, WUE, and hourly matching with clean solar and wind microgrids.',
      kpis: ['cue', 'wue', 'ref'],
      focus: 'Scope 1, 2, and 3 Verified ESG Telemetry'
    },
    {
      slug: 'infrastructure-performance',
      title: 'Infrastructure Performance & Reliability SLAs',
      eyebrow: 'PERFORMANCE BENCHMARKS',
      headline: 'Fault-Tolerant Availability & Microsecond Fabric SLAs',
      desc: 'Continuous verification of tier-grade concurrent maintainability, sub-millisecond east-west packet transit, and rapid MTTR incident isolation.',
      kpis: ['avail', 'mttr'],
      focus: 'Deterministic Compute Continuity'
    }
  ];

  for (const sp of subPages) {
    const spBody = `
${breadcrumb(base, [{ label: 'Home', href: 'index.html' }, { label: 'Intelligence', href: 'intelligence/index.html' }, { label: sp.title }])}
${hero({
  base,
  variant: 'dark',
  img: 'assets/img/control-room.webp',
  eyebrow: sp.eyebrow,
  headline: sp.headline,
  description: sp.desc,
  primary: { text: 'Connect With Operations Desk', href: '#enquiry' },
  secondary: { text: 'All Intelligence Modules', href: 'index.html' },
})}

<section class="section">
  <div class="container">
    <div class="section-header section-header--center">
      <span class="section-label">KPI FOCUS: ${sp.focus}</span>
      <h2 class="heading-xl">Core Telemetry Benchmarks</h2>
      <p class="text-base text-muted" style="max-width:760px;margin:var(--space-3) auto 0;">
        Simulated operational telemetry parameters and continuous formula calculations.
      </p>
    </div>
    
    <div class="dashboard-mock" style="margin-top:var(--space-8);">
      <div class="dashboard-kpis-grid" style="grid-template-columns:repeat(${sp.kpis.length}, 1fr);">
        ${tenKpis.filter(k => sp.kpis.includes(k.id)).map(k => `
          <div class="dashboard-telemetry-card">
            <div class="dashboard-telemetry-top">
              <span class="dashboard-telemetry-icon">${icon(k.id === 'pue' || k.id === 'ref' ? 'bolt' : k.id === 'avail' || k.id === 'mttr' ? 'shield' : 'spark')}</span>
              <span class="dashboard-status-indicator"><span class="dashboard-status-dot dashboard-status-dot--good"></span> ${k.status}</span>
            </div>
            <div class="dashboard-telemetry-val" style="color:#00FF66;font-family:var(--font-family-mono);font-size:1.8rem;font-weight:700;">${k.value}</div>
            <div class="dashboard-telemetry-cat" style="font-size:13px;font-weight:600;color:#FFFFFF;margin-top:4px;">${k.name}</div>
            <div style="font-size:11px;color:#AAB7CB;margin-top:6px;line-height:1.4;">${k.def}</div>
            <div style="font-size:10px;color:#00FF66;margin-top:6px;font-family:var(--font-family-mono);background:rgba(0,255,102,0.08);padding:4px 8px;border-radius:4px;">
              Formula: ${k.formula}
            </div>
          </div>
        `).join('')}
      </div>
      <div style="margin-top:var(--space-6);font-size:11px;color:#AAB7CB;text-align:center;">
        * Notice: Telemetry parameters shown reflect demonstration baselines for architectural scoping. Live telemetry streams under active SLAs.
      </div>
    </div>
  </div>
</section>

${systemArchitectureSection(base)}

<div id="enquiry">
  ${leadFormSection('general', { base })}
</div>
${finalCTASection(base)}
`;

    write(`intelligence/${sp.slug}.html`, page({
      base,
      title: `${sp.title} | GreenNext Intelligence`,
      metaDesc: sp.desc,
      bodyHtml: spBody,
    }));
  }
}

// ---------------------------------------------------------------------------
// 24. CAPABILITY ALIASES FOR EXACT MEGA MENU ROUTE CONSISTENCY
// ---------------------------------------------------------------------------
{
  const aliases = [
    { from: 'capabilities/ai-infrastructure.html', to: 'capabilities/ai-data-centers.html' },
    { from: 'capabilities/data-center-solutions.html', to: 'capabilities/data-center-engineering.html' },
    { from: 'capabilities/intelligent-automation.html', to: 'capabilities/intelligent-operations.html' },
    { from: 'solutions/automation-solutions.html', to: 'solutions/operational-automation.html' },
  ];

  for (const { from, to } of aliases) {
    try {
      const fullFrom = join(ROOT, from);
      const fullTo = join(ROOT, to);
      const content = readFileSync(fullFrom, 'utf8');
      writeFileSync(fullTo, content, 'utf8');
    } catch (e) {
      // If source file not read yet, ignore
    }
  }
}

console.log('GreenNext site successfully generated for all primary pages, intelligence suite, and 404.');
