import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { capabilities, industries, solutions, locations } from './data.mjs';
import {
  page, hero, breadcrumb, featureGrid, cardGrid, metricsStrip,
  leadFormSection, careersFormSection, finalCTASection,
  aboutSplitSection, anchorSection, intelligenceDashboardSection, processFlowSection,
  sustainabilitySection, futureVisionSection, locationsMapSection,
} from './templates.mjs';
import { icon } from './icons.mjs';

const featuredCapabilities = capabilities.filter(c => c.featured);
const featuredSolutions = solutions.filter(s => s.featured);

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const ENERGY_STEPS = [
  { icon: 'bolt', title: 'Energy', desc: 'Assess consumption across your infrastructure footprint.' },
  { icon: 'cpu', title: 'AI Analysis', desc: 'Analyze usage patterns to surface optimization opportunities.' },
  { icon: 'spark', title: 'Optimization', desc: 'Apply targeted efficiency improvements where they matter most.' },
  { icon: 'shield', title: 'Efficient Operations', desc: 'Sustain lower consumption without compromising reliability.' },
];

const AUTOMATION_STEPS = [
  { icon: 'cpu', title: 'Monitor', desc: 'Continuously observe infrastructure health and activity.' },
  { icon: 'spark', title: 'Analyze', desc: 'Surface patterns and anomalies as they emerge.' },
  { icon: 'shield', title: 'Predict', desc: 'Anticipate issues before they affect operations.' },
  { icon: 'bolt', title: 'Automate', desc: 'Trigger the right response without manual intervention.' },
  { icon: 'server', title: 'Optimize', desc: 'Continuously tune infrastructure for better performance.' },
];

function processSectionFor(slug) {
  if (slug === 'energy-efficiency' || slug === 'energy-optimization') {
    return processFlowSection({ eyebrow: 'How It Works', heading: 'Smarter Energy. Lower Impact.', steps: ENERGY_STEPS });
  }
  if (slug === 'intelligent-automation' || slug === 'automation-solutions') {
    return processFlowSection({ eyebrow: 'How It Works', heading: 'From Monitoring to Optimization', steps: AUTOMATION_STEPS });
  }
  return '';
}

function write(relPath, html) {
  const full = join(ROOT, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, html, 'utf8');
}

// ---------------------------------------------------------------------------
// HOME
// ---------------------------------------------------------------------------
{
  const base = '';
  const body = `
${hero({
  variant: 'dark', base, compact: false, richMedia: true,
  eyebrow: 'AI-DRIVEN INFRASTRUCTURE',
  headline: "Building the Intelligent Infrastructure Behind Tomorrow's Enterprises",
  description: "GreenNext designs and delivers AI-driven data centers, intelligent automation, and energy-efficient digital infrastructure for enterprises that can't afford to stand still.",
  primary: { text: 'Talk to an Expert', href: 'contact.html' },
  secondary: { text: 'Explore Solutions', href: 'solutions/index.html' },
})}
${metricsStrip()}

<section class="section" style="padding-bottom:0;">
  <div class="container">
    <div class="section-header" style="display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:var(--space-4);margin-bottom:var(--space-10);">
      <div>
        <span class="section-label">What We Build</span>
        <h2 class="heading-xl">Core Capabilities for a Smarter Future</h2>
      </div>
      <a class="location-card-link" href="capabilities/index.html">Explore All Capabilities <span class="btn-arrow">&rarr;</span></a>
    </div>
  </div>
</section>
${cardGrid(base, featuredCapabilities, { hrefPrefix: 'capabilities/', columns: 5, withPhoto: true })}

<section class="section bg-soft">
  <div class="container">
    <div class="industries-solutions-grid">
      <div>
        <div class="section-header" style="display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:var(--space-3);margin-bottom:var(--space-8);">
          <div>
            <span class="section-label">Industries</span>
            <h2 class="heading-lg">Who We Serve</h2>
            <p class="text-sm text-muted" style="margin-top:var(--space-2);">Enabling digital transformations across industries with intelligent infrastructure.</p>
          </div>
        </div>
        <a class="location-card-link" href="industries/index.html" style="margin-bottom:var(--space-6);display:inline-flex;">Explore All Industries <span class="btn-arrow">&rarr;</span></a>
        <div class="grid-4" style="gap:var(--space-4);">
          ${industries.map((ind, i) => `
            <a class="card reveal reveal-delay-${(i % 4) + 1}" style="display:block;text-decoration:none;padding:var(--space-5);" href="industries/${ind.slug}.html">
              <div class="card-icon" style="width:36px;height:36px;margin-bottom:var(--space-3);">${icon(ind.icon)}</div>
              <h3 class="feature-title" style="font-size:var(--font-size-sm);">${ind.name}</h3>
            </a>`).join('')}
        </div>
      </div>
      <div>
        <div class="section-header" style="display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:var(--space-3);margin-bottom:var(--space-8);">
          <div>
            <span class="section-label">Solutions</span>
            <h2 class="heading-lg">Solutions for the AI Era</h2>
            <p class="text-sm text-muted" style="margin-top:var(--space-2);">Scalable, secure, and intelligent infrastructure solutions.</p>
          </div>
        </div>
        <a class="location-card-link" href="solutions/index.html" style="margin-bottom:var(--space-6);display:inline-flex;">Explore All Solutions <span class="btn-arrow">&rarr;</span></a>
        ${cardGrid(base, featuredSolutions, { hrefPrefix: 'solutions/', columns: 2, withPhoto: true, wrap: false })}
      </div>
    </div>
  </div>
</section>

${intelligenceDashboardSection()}

<section class="section bg-soft" style="padding-bottom: 0;">
  <div class="container">
    <div class="section-header section-header--center">
      <span class="section-label">Our Presence</span>
      <h2 class="heading-xl">Our Regional Presence</h2>
      <p class="text-base text-muted" style="margin-top: var(--space-4);">GreenNext supports enterprises across South India with regional infrastructure expertise.</p>
      <a class="location-card-link" href="locations/index.html" style="justify-content:center;margin-top:var(--space-4);">Explore Locations <span class="btn-arrow">&rarr;</span></a>
    </div>
  </div>
</section>
<div class="bg-soft">
${locationsMapSection(base, locations, 'locations/')}
</div>

${finalCTASection(base)}
`;
  write('index.html', page({
    base, title: 'AI-Driven Infrastructure & Data Center Solutions',
    metaDesc: 'GreenNext designs AI-driven data centers, intelligent automation, and energy-efficient digital infrastructure for the modern enterprise.',
    bodyHtml: body,
  }));
}

// ---------------------------------------------------------------------------
// CAPABILITIES hub + detail
// ---------------------------------------------------------------------------
{
  const base = '../';
  const body = `
${breadcrumb(base, [{ label: 'Home', href: 'index.html' }, { label: 'Capabilities' }])}
${hero({
  base,
  eyebrow: 'CAPABILITIES',
  headline: 'Everything GreenNext Builds, in One Place',
  description: 'From AI infrastructure to energy efficiency, explore the capabilities behind GreenNext solutions.',
  primary: { text: 'Talk to an Expert', href: 'contact.html' },
})}
${cardGrid(base, capabilities, { hrefPrefix: '', columns: 3, withPhoto: true })}
${finalCTASection(base)}
`;
  write('capabilities/index.html', page({
    base, title: 'Capabilities',
    metaDesc: 'Explore GreenNext capabilities: AI infrastructure, data center solutions, intelligent automation, energy efficiency, and digital infrastructure.',
    bodyHtml: body,
  }));

  for (const cap of capabilities) {
    const capBody = `
${breadcrumb(base, [{ label: 'Home', href: 'index.html' }, { label: 'Capabilities', href: 'capabilities/index.html' }, { label: cap.name }])}
${hero({
  base,
  eyebrow: cap.eyebrow,
  headline: cap.headline,
  description: cap.description,
  primary: cap.heroPrimary,
  secondary: { text: 'Talk to an Expert', href: 'contact.html' },
})}
${featureGrid(cap.features)}
${processSectionFor(cap.slug)}
${leadFormSection(cap.formBucket, { base })}
${finalCTASection(base)}
`;
    write(`capabilities/${cap.slug}.html`, page({
      base, title: cap.name,
      metaDesc: cap.cardDesc,
      bodyHtml: capBody,
    }));
  }
}

// ---------------------------------------------------------------------------
// INDUSTRIES hub + detail
// ---------------------------------------------------------------------------
{
  const base = '../';
  const body = `
${breadcrumb(base, [{ label: 'Home', href: 'index.html' }, { label: 'Industries' }])}
${hero({
  base,
  eyebrow: 'INDUSTRIES',
  headline: 'Infrastructure Built Around Your Industry',
  description: 'GreenNext designs infrastructure and automation solutions suited to the operational realities of your industry.',
  primary: { text: 'Talk to an Expert', href: 'contact.html' },
})}
${cardGrid(base, industries, { hrefPrefix: '', ctaText: 'Explore Your Industry', columns: 3 })}
${finalCTASection(base)}
`;
  write('industries/index.html', page({
    base, title: 'Industries',
    metaDesc: 'GreenNext serves healthcare, finance, manufacturing, technology, and government with tailored infrastructure solutions.',
    bodyHtml: body,
  }));

  for (const ind of industries) {
    const indBody = `
${breadcrumb(base, [{ label: 'Home', href: 'index.html' }, { label: 'Industries', href: 'industries/index.html' }, { label: ind.name }])}
${hero({
  base,
  eyebrow: ind.name.toUpperCase(),
  headline: `Infrastructure Solutions for ${ind.name}`,
  description: ind.description,
  primary: { text: 'Talk to an Expert', href: 'contact.html' },
  secondary: { text: 'Explore Solutions', href: 'solutions/index.html' },
})}
${featureGrid(capabilities.slice(0, 3).map(c => ({ icon: c.icon, title: c.name, desc: c.cardDesc })))}
${leadFormSection('general', { base })}
${finalCTASection(base)}
`;
    write(`industries/${ind.slug}.html`, page({
      base, title: ind.name,
      metaDesc: ind.cardDesc,
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
  eyebrow: 'SOLUTIONS',
  headline: 'Solutions for the AI-Driven Enterprise',
  description: 'Explore GreenNext solutions spanning AI data centers, smart infrastructure, energy optimization, and automation.',
  primary: { text: 'Talk to an Expert', href: 'contact.html' },
})}
${cardGrid(base, solutions, { hrefPrefix: '', columns: 4, withPhoto: true })}
${finalCTASection(base)}
`;
  write('solutions/index.html', page({
    base, title: 'Solutions',
    metaDesc: 'GreenNext solutions: AI data centers, smart infrastructure, energy optimization, and automation solutions.',
    bodyHtml: body,
  }));

  for (const sol of solutions) {
    const solBody = `
${breadcrumb(base, [{ label: 'Home', href: 'index.html' }, { label: 'Solutions', href: 'solutions/index.html' }, { label: sol.name }])}
${hero({
  base,
  eyebrow: sol.eyebrow,
  headline: sol.headline,
  description: sol.description,
  primary: sol.heroPrimary,
  secondary: { text: 'Talk to an Expert', href: 'contact.html' },
})}
${featureGrid(sol.features)}
${processSectionFor(sol.slug)}
${leadFormSection(sol.formBucket, { base })}
${finalCTASection(base)}
`;
    write(`solutions/${sol.slug}.html`, page({
      base, title: sol.name,
      metaDesc: sol.cardDesc,
      bodyHtml: solBody,
    }));
  }
}

// ---------------------------------------------------------------------------
// LOCATIONS hub + detail
// ---------------------------------------------------------------------------
{
  const base = '../';
  const body = `
${breadcrumb(base, [{ label: 'Home', href: 'index.html' }, { label: 'Locations' }])}
${hero({
  base,
  eyebrow: 'LOCATIONS',
  headline: 'Our Regional Presence',
  description: 'GreenNext supports enterprises across South India with regional infrastructure expertise.',
  primary: { text: 'Talk to an Expert', href: 'contact.html' },
})}
${locationsMapSection(base, locations, '')}
${anchorSection({
  id: 'regional-network', eyebrow: 'Regional Network',
  heading: 'A Connected Regional Network',
  body: 'GreenNext operates as a connected network across Madurai, Coimbatore, Trichy, and Mangalore, allowing infrastructure expertise to be shared consistently across the region rather than staying siloed within a single location.',
})}
${anchorSection({
  id: 'infrastructure-footprint', eyebrow: 'Infrastructure Footprint',
  heading: 'Our Infrastructure Footprint',
  body: "Across these four locations, GreenNext brings the same core capabilities — AI infrastructure, data center solutions, intelligent automation, and energy efficiency — adapted to each region's specific enterprise needs.",
})}
${anchorSection({
  id: 'connectivity', eyebrow: 'Connectivity',
  heading: 'Regional Connectivity',
  body: 'Consistent connectivity between locations supports coordinated infrastructure delivery, so enterprises working across multiple South Indian cities can rely on the same standards throughout.',
})}
${anchorSection({
  id: 'regional-operations', eyebrow: 'Regional Operations',
  heading: 'Regional Operations',
  body: "Regional operations teams work closely with each location to ensure infrastructure recommendations reflect local context while staying aligned with GreenNext's broader engineering standards.",
})}
${finalCTASection(base)}
`;
  write('locations/index.html', page({
    base, title: 'Locations',
    metaDesc: 'GreenNext regional presence across Madurai, Coimbatore, Trichy, and Mangalore.',
    bodyHtml: body,
  }));

  for (const loc of locations) {
    const locBody = `
${breadcrumb(base, [{ label: 'Home', href: 'index.html' }, { label: 'Locations', href: 'locations/index.html' }, { label: loc.name }])}
${hero({
  base,
  eyebrow: loc.name.toUpperCase(),
  headline: `GreenNext in ${loc.name}`,
  description: loc.description,
  primary: { text: 'Talk to an Expert', href: 'contact.html' },
})}
${leadFormSection('general', { base, prefillLocation: loc.name })}
${finalCTASection(base)}
`;
    write(`locations/${loc.slug}.html`, page({
      base, title: loc.name,
      metaDesc: loc.cardDesc,
      bodyHtml: locBody,
    }));
  }
}

// ---------------------------------------------------------------------------
// ABOUT
// ---------------------------------------------------------------------------
{
  const base = '';
  const body = `
${breadcrumb(base, [{ label: 'Home', href: 'index.html' }, { label: 'About Us' }])}
${hero({
  base,
  eyebrow: 'ABOUT GREENNEXT',
  headline: 'Infrastructure for an AI-Driven Future',
  description: 'GreenNext designs and delivers AI-driven infrastructure, data centers, and intelligent automation for enterprises building for what comes next.',
  primary: { text: 'Talk to an Expert', href: 'contact.html' },
})}
${aboutSplitSection({
  id: 'who-we-are', base,
  heading: 'Building Infrastructure That Thinks Ahead',
  body: "<!-- Placeholder copy: replace with verified company history and team details. --> GreenNext is a technology-focused infrastructure company working across AI, automation, data centers, and energy efficiency. We approach infrastructure as a long-term foundation, not a one-time build.",
  floatCardText: 'Powering a Sustainable Digital Future',
})}
${anchorSection({
  id: 'our-vision', eyebrow: 'Our Vision',
  heading: 'Our Vision',
  body: '<!-- Placeholder copy: replace with verified vision statement. --> To be the infrastructure partner enterprises turn to as AI reshapes how digital operations are built and run.',
})}
${anchorSection({
  id: 'our-mission', eyebrow: 'Our Mission',
  heading: 'Our Mission',
  body: "<!-- Placeholder copy: replace with verified mission statement. --> To design and deliver AI-driven infrastructure, data centers, and automation that enterprises can depend on, without compromising on energy efficiency.",
})}
${anchorSection({
  id: 'technology-approach', eyebrow: 'Technology Approach',
  heading: 'Our Technology Approach',
  body: 'We start every engagement by understanding how your enterprise operates today, and where it needs to scale tomorrow &mdash; across compute, energy, and automation &mdash; before recommending an approach.',
})}
${anchorSection({
  id: 'innovation', eyebrow: 'Innovation',
  heading: 'Innovation',
  body: 'GreenNext treats intelligent automation and AI-driven monitoring as core parts of infrastructure design, not add-ons layered on afterward.',
})}
${featureGrid(capabilities.filter(c => c.featured).slice(0, 3).map(c => ({ icon: c.icon, title: c.name, desc: c.cardDesc })))}
${sustainabilitySection(base)}
${futureVisionSection()}
${finalCTASection(base)}
`;
  write('about.html', page({
    base, title: 'About Us',
    metaDesc: 'GreenNext designs and delivers AI-driven infrastructure, data centers, and intelligent automation for the modern enterprise.',
    bodyHtml: body,
  }));
}

// ---------------------------------------------------------------------------
// CAREERS
// ---------------------------------------------------------------------------
{
  const base = '';
  const body = `
${breadcrumb(base, [{ label: 'Home', href: 'index.html' }, { label: 'Careers' }])}
${hero({
  base,
  eyebrow: 'CAREERS',
  headline: 'Build the Infrastructure of Tomorrow With Us',
  description: "We're always looking for talented people across engineering, infrastructure, and operations who want to work on AI-driven infrastructure.",
  primary: { text: 'Join GreenNext', href: '#apply' },
})}
${featureGrid([
  { icon: 'cpu', title: 'Meaningful Work', desc: 'Work on infrastructure that powers real AI and enterprise workloads.' },
  { icon: 'network', title: 'Collaborative Teams', desc: 'Work alongside teams that value collaboration and ownership.' },
  { icon: 'spark', title: 'Room to Grow', desc: 'Grow your skills across infrastructure, automation, and AI.' },
])}
${careersFormSection(base)}
`;
  write('careers.html', page({
    base, title: 'Careers',
    metaDesc: 'Join GreenNext and help build AI-driven infrastructure, data centers, and intelligent automation.',
    bodyHtml: body,
  }));
}

// ---------------------------------------------------------------------------
// CONTACT
// ---------------------------------------------------------------------------
{
  const base = '';
  const body = `
${breadcrumb(base, [{ label: 'Home', href: 'index.html' }, { label: 'Contact' }])}
${hero({
  base,
  eyebrow: 'CONTACT',
  headline: 'Talk to the GreenNext Team',
  description: 'Share a few details about your requirement and our team will get back to you shortly.',
  primary: { text: 'Submit Enquiry', href: '#enquiry' },
})}
${leadFormSection('general', { base })}
`;
  write('contact.html', page({
    base, title: 'Contact',
    metaDesc: 'Get in touch with GreenNext to discuss AI infrastructure, data center, and automation requirements.',
    bodyHtml: body,
  }));
}

// ---------------------------------------------------------------------------
// PRIVACY / TERMS (generic boilerplate placeholders)
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
    base, title: 'Privacy Policy',
    metaDesc: 'GreenNext Privacy Policy.',
    bodyHtml: legalBody('Privacy Policy', [
      '<!-- Placeholder legal copy: replace with GreenNext\'s reviewed privacy policy. -->',
      'This page outlines how GreenNext collects, uses, and protects information submitted through this website, including enquiry and application forms.',
      'This is placeholder content and should be replaced with a privacy policy reviewed by GreenNext and, where appropriate, legal counsel.',
    ]),
  }));

  write('terms-and-conditions.html', page({
    base, title: 'Terms & Conditions',
    metaDesc: 'GreenNext Terms & Conditions.',
    bodyHtml: legalBody('Terms &amp; Conditions', [
      '<!-- Placeholder legal copy: replace with GreenNext\'s reviewed terms and conditions. -->',
      'These terms govern the use of this website. By using this site, you agree to these terms.',
      'This is placeholder content and should be replaced with terms and conditions reviewed by GreenNext and, where appropriate, legal counsel.',
    ]),
  }));
}

console.log('GreenNext site generated.');
