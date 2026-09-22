import { icon } from './icons.mjs';
import { nav, footerData, finalCTA, formConfigs, careersFormConfig, tagline, heroImg } from './data.mjs';
import { curveDivider, blobDecor, processFlow, miniFlowHorizontal, dashboardMock, locationsMapVisual } from './visuals.mjs';

const CURRENT_YEAR = 2026;

function link(base, href) {
  if (!href || href.startsWith('#') || /^https?:\/\//.test(href)) return href;
  return base + href;
}

function cta(text, href, { variant = 'primary', size = 'lg', base = '' } = {}) {
  const cls = `btn btn-${variant}${size ? ' btn-' + size : ''}`;
  return `<a class="${cls}" href="${link(base, href)}"><span>${text}</span><span class="btn-arrow">&rarr;</span></a>`;
}

function dropdownItems(base, children) {
  return children.map(child => `
    <a class="dropdown-item" href="${link(base, child.href)}">
      <span class="dropdown-item-icon">${icon(child.icon || 'spark')}</span>
      <span class="dropdown-item-text"><span class="dropdown-item-label">${child.label}</span></span>
    </a>`).join('');
}

function desktopNav(base) {
  return nav.main.map(item => {
    if (item.children) {
      return `
        <li class="nav-item">
          <a class="nav-link" href="${link(base, item.href)}">${item.label}</a>
          <button class="nav-link-toggle" aria-haspopup="true" aria-expanded="false" aria-label="Show ${item.label} menu">
            <svg class="nav-link-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <div class="nav-dropdown">${dropdownItems(base, item.children)}</div>
        </li>`;
    }
    return `<li class="nav-item"><a class="nav-link" href="${link(base, item.href)}">${item.label}</a></li>`;
  }).join('');
}

function mobileNav(base) {
  return nav.main.map((item, i) => {
    if (item.children) {
      return `
        <div class="mobile-nav-section">
          <button class="mobile-accordion-trigger" data-accordion="mob-${i}" aria-expanded="false">
            ${item.label}
            <svg class="mobile-accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <div class="mobile-accordion-content" id="mob-${i}">
            <a class="mobile-accordion-link mobile-accordion-link--all" href="${link(base, item.href)}">View All ${item.label} &rarr;</a>
            ${item.children.map(c => `<a class="mobile-accordion-link" href="${link(base, c.href)}">${c.label}</a>`).join('')}
          </div>
        </div>`;
    }
    return `<a class="mobile-nav-item" href="${link(base, item.href)}">${item.label}</a>`;
  }).join('');
}

export function headerAndNav(base) {
  return `
  <header id="gn-header">
    <div class="container nav-wrapper">
      <a class="nav-logo" href="${link(base, 'index.html')}">
        <span class="nav-logo-icon">${icon('spark')}</span>
        <span class="nav-logo-text-wrap">
          <span class="nav-logo-text">Green<span>Next</span></span>
          <span class="nav-logo-tagline">${tagline}</span>
        </span>
      </a>
      <nav aria-label="Main">
        <ul class="nav-menu">${desktopNav(base)}</ul>
      </nav>
      <div class="nav-right">
        <a class="nav-cta" href="${link(base, 'contact.html')}">Talk to an Expert <span class="btn-arrow">&rarr;</span></a>
        <button class="nav-hamburger" id="gn-hamburger" aria-label="Open menu" aria-expanded="false">
          <span class="hamburger-bar"></span><span class="hamburger-bar"></span><span class="hamburger-bar"></span>
        </button>
      </div>
    </div>
  </header>
  <div class="nav-mobile-drawer" id="gn-mobile-drawer">
    ${mobileNav(base)}
    <div class="mobile-nav-divider"></div>
    <a class="mobile-nav-cta" href="${link(base, 'contact.html')}">Talk to an Expert &rarr;</a>
  </div>`;
}

export function breadcrumb(base, trail) {
  const parts = trail.map((t, i) => {
    const isLast = i === trail.length - 1;
    if (isLast || !t.href) return `<span>${t.label}</span>`;
    return `<a href="${link(base, t.href)}">${t.label}</a><span class="breadcrumb-sep">/</span>`;
  }).join(' ');
  return `<div class="container breadcrumb-bar"><div class="breadcrumb">${parts}</div></div>`;
}

const HERO_MINI_STATS = [
  { icon: 'spark', label: 'AI Optimized', sub: 'Smarter Operations' },
  { icon: 'bolt', label: 'Energy Efficient', sub: 'Greener Tomorrow' },
  { icon: 'shield', label: '24/7 Monitoring', sub: 'Reliable Always' },
];

export function hero({ variant = 'light', eyebrow, headline, description, primary, secondary, base = '', compact = true, richMedia = false }) {
  if (richMedia) {
    return `
    <section class="hero hero--photo-bg" style="background-image:url('${link(base, heroImg)}');">
      <div class="hero-photo-overlay"></div>
      <div class="container">
        <div class="hero-content reveal" style="max-width:640px;">
          ${eyebrow ? `<span class="hero-eyebrow">${eyebrow}</span>` : ''}
          <h1 class="display-lg hero-title">${headline}</h1>
          <p class="hero-description">${description}</p>
          <div class="hero-ctas">
            ${primary ? cta(primary.text, primary.href, { variant: 'primary', base }) : ''}
            ${secondary ? cta(secondary.text, secondary.href, { variant: 'ghost', base }) : ''}
          </div>
          <div class="hero-mini-stats">
            ${HERO_MINI_STATS.map(s => `
              <div class="hero-mini-stat">
                <span class="hero-mini-stat-icon">${icon(s.icon)}</span>
                <span><strong>${s.label}</strong><br><span class="hero-mini-stat-sub">${s.sub}</span></span>
              </div>`).join('')}
          </div>
        </div>
      </div>
      <div class="float-card float-card-1"><span class="float-card-dot"></span>AI Optimized</div>
      <div class="float-card float-card-2"><span class="float-card-dot"></span>Energy Efficient</div>
      <div class="float-card float-card-3"><span class="float-card-dot"></span>24/7 Monitoring</div>
    </section>`;
  }
  return `
  <section class="hero hero--${variant}${compact ? ' hero--compact' : ''}">
    <div class="${variant === 'dark' ? 'hero-bg-grid' : 'hero-bg-pattern'}"></div>
    <div class="container">
      <div class="hero-content reveal" style="max-width:760px;">
        ${eyebrow ? `<span class="hero-eyebrow">${eyebrow}</span>` : ''}
        <h1 class="display-lg hero-title">${headline}</h1>
        <p class="hero-description">${description}</p>
        <div class="hero-ctas">
          ${primary ? cta(primary.text, primary.href, { variant: 'primary', base }) : ''}
          ${secondary ? cta(secondary.text, secondary.href, { variant: variant === 'dark' ? 'ghost' : 'secondary', base }) : ''}
        </div>
      </div>
    </div>
  </section>`;
}

export function featureGrid(features, { columns = 3 } = {}) {
  return `
  <section class="section">
    <div class="container">
      <div class="grid-${columns}">
        ${features.map((f, i) => `
          <div class="feature-card reveal reveal-delay-${(i % 3) + 1}">
            <div class="feature-icon">${icon(f.icon)}</div>
            <h3 class="feature-title">${f.title}</h3>
            <p class="feature-desc">${f.desc}</p>
          </div>`).join('')}
      </div>
    </div>
  </section>`;
}

export function cardGrid(base, items, { hrefPrefix, ctaText = 'Learn More', columns = 3, withPhoto = false, wrap = true } = {}) {
  const grid = `
      <div class="grid-${columns}">
        ${items.map((it, i) => `
          <a class="card reveal reveal-delay-${(i % 3) + 1}" style="display:block;text-decoration:none" href="${link(base, hrefPrefix + it.slug + '.html')}">
            ${withPhoto && it.img ? `<div class="card-visual"><img src="${link(base, it.img)}" alt="${it.name}" loading="lazy"></div>` : ''}
            <div style="display:flex;align-items:center;gap:var(--space-3);${withPhoto ? '' : 'margin-bottom:0;'}">
              <div class="card-icon" style="${withPhoto ? 'width:36px;height:36px;margin-bottom:0;' : ''}">${icon(it.icon || 'pin')}</div>
              <h3 class="feature-title" style="margin:0;">${it.name}</h3>
            </div>
            <p class="feature-desc" style="margin-top:var(--space-3);">${it.cardDesc}</p>
            <span class="location-card-link" style="margin-top: var(--space-5);">${ctaText} <span class="btn-arrow">&rarr;</span></span>
          </a>`).join('')}
      </div>`;
  if (!wrap) return grid;
  return `
  <section class="section">
    <div class="container">
      ${grid}
    </div>
  </section>`;
}

export function metricsStrip() {
  const metrics = [
    { icon: 'database', value: '4', label: 'Regional Data Center Locations' },
    { icon: 'shield', value: '24/7', label: 'Intelligent Monitoring' },
    { icon: 'cpu', value: 'AI', label: 'Powered Operations' },
    { icon: 'bolt', value: 'Green', label: 'Energy-Efficient Infrastructure' },
  ];
  return `
  <section class="metrics-strip">
    <div class="container metrics-strip-inner">
      <div class="metrics-strip-items">
        ${metrics.map(m => `
          <div class="metrics-strip-item">
            <span class="metrics-strip-icon">${icon(m.icon)}</span>
            <span><strong>${m.value}</strong><br><span class="metrics-strip-label">${m.label}</span></span>
          </div>`).join('')}
      </div>
      <div class="metrics-strip-note">
        A CLEANER DIGITAL TOMORROW <br>FOR A BRIGHTER WORLD <span class="btn-arrow">&rarr;</span>
      </div>
    </div>
  </section>`;
}

function fieldMarkup(field) {
  const req = field.required ? 'required' : '';
  const reqMark = field.required ? ' *' : '';
  if (field.type === 'select') {
    return `
      <div class="form-field">
        <label for="${field.name}">${field.label}${reqMark}</label>
        <select id="${field.name}" name="${field.name}" ${req}>
          <option value="" disabled selected>Select ${field.label}</option>
          ${field.options.map(o => `<option value="${o}">${o}</option>`).join('')}
        </select>
      </div>`;
  }
  if (field.type === 'textarea') {
    return `
      <div class="form-field form-field--full">
        <label for="${field.name}">${field.label}${reqMark}</label>
        <textarea id="${field.name}" name="${field.name}" rows="4" ${req}></textarea>
      </div>`;
  }
  if (field.type === 'file') {
    return `
      <div class="form-field form-field--full">
        <label for="${field.name}">${field.label}${reqMark}</label>
        <input type="file" id="${field.name}" name="${field.name}" accept=".pdf,.doc,.docx" ${req}>
      </div>`;
  }
  return `
    <div class="form-field">
      <label for="${field.name}">${field.label}${reqMark}</label>
      <input type="${field.type}" id="${field.name}" name="${field.name}" ${req}>
    </div>`;
}

export function leadFormSection(bucket, { base = '', prefillLocation } = {}) {
  const cfg = formConfigs[bucket] || formConfigs.general;
  const baseFields = [
    { type: 'text', name: 'full_name', label: 'Full Name', required: true },
    { type: 'email', name: 'business_email', label: 'Business Email', required: true },
    { type: 'text', name: 'company_name', label: 'Company Name', required: true },
    { type: 'tel', name: 'phone', label: 'Phone Number', required: false },
    prefillLocation
      ? { type: 'text', name: 'location', label: 'Location', required: true, value: prefillLocation }
      : { type: 'text', name: 'location', label: 'Location', required: true },
  ];
  const allFields = [...baseFields, ...cfg.extraFields, { type: 'textarea', name: 'message', label: cfg.messageLabel, required: true }];

  return `
  <section class="section bg-soft" id="enquiry">
    <div class="container">
      <div class="lead-form-card reveal">
        <div class="lead-form-panel">
          <div class="section-header">
            <h2 class="heading-lg">${cfg.heading}</h2>
            <p class="text-base text-muted">${cfg.description}</p>
          </div>
          <form class="lead-form" novalidate>
            <div class="form-grid">
              ${allFields.map(f => {
                if (f.value) {
                  return `
                    <div class="form-field">
                      <label for="${f.name}">${f.label} *</label>
                      <input type="text" id="${f.name}" name="${f.name}" value="${f.value}" required>
                    </div>`;
                }
                return fieldMarkup(f);
              }).join('')}
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary btn-lg"><span>${cfg.submitLabel}</span><span class="btn-arrow">&rarr;</span></button>
            </div>
          </form>
        </div>
        <div class="form-success">
          <div class="form-success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <h3 class="heading-md">Thank you for reaching out to GreenNext.</h3>
          <p class="text-base text-muted">Your enquiry has been received. Our team will get in touch with you shortly.</p>
          <a class="btn btn-secondary btn-lg" href="${link(base, 'index.html')}"><span>Back to Home</span><span class="btn-arrow">&rarr;</span></a>
        </div>
      </div>
    </div>
  </section>`;
}

export function careersFormSection(base) {
  const cfg = careersFormConfig;
  const fields = [
    { type: 'text', name: 'full_name', label: 'Full Name', required: true },
    { type: 'email', name: 'email', label: 'Email', required: true },
    { type: 'tel', name: 'phone', label: 'Phone', required: true },
    { type: 'select', name: 'position', label: 'Position Applying For', required: true,
      options: ['Engineering', 'Infrastructure & Operations', 'Data Center Operations', 'AI & Automation', 'Business & Other'] },
    { type: 'file', name: 'resume', label: 'Resume Upload', required: true },
    { type: 'url', name: 'linkedin', label: 'LinkedIn Profile', required: false },
  ];
  return `
  <section class="section bg-soft" id="apply">
    <div class="container">
      <div class="lead-form-card reveal">
        <div class="lead-form-panel">
          <div class="section-header">
            <h2 class="heading-lg">${cfg.heading}</h2>
            <p class="text-base text-muted">${cfg.description}</p>
          </div>
          <form class="lead-form" novalidate>
            <div class="form-grid">
              ${fields.map(fieldMarkup).join('')}
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary btn-lg"><span>${cfg.submitLabel}</span><span class="btn-arrow">&rarr;</span></button>
            </div>
          </form>
        </div>
        <div class="form-success">
          <div class="form-success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <h3 class="heading-md">Thank you for applying to GreenNext.</h3>
          <p class="text-base text-muted">Your application has been received. Our talent team will review it and reach out if there's a match.</p>
          <a class="btn btn-secondary btn-lg" href="${link(base, 'index.html')}"><span>Back to Home</span><span class="btn-arrow">&rarr;</span></a>
        </div>
      </div>
    </div>
  </section>`;
}

export function finalCTASection(base) {
  return `
  <section class="cta-section">
    <div class="container">
      <h2 class="cta-section-title reveal">${finalCTA.heading}</h2>
      <p class="cta-section-desc reveal">${finalCTA.description}</p>
      <div class="cta-section-actions reveal">
        ${cta(finalCTA.primary.text, finalCTA.primary.href, { variant: 'primary', base })}
        ${cta(finalCTA.secondary.text, finalCTA.secondary.href, { variant: 'ghost', base })}
      </div>
    </div>
  </section>`;
}

export function footer(base) {
  return `
  <footer class="site-footer">
    <div class="footer-cta-bar">
      <div class="container footer-cta-inner">
        <span class="heading-sm" style="color:white;">Ready to talk?</span>
        ${cta('Talk to an Expert', 'contact.html', { variant: 'ghost', size: '', base })}
      </div>
    </div>
    <div class="container footer-main">
      <div class="footer-brand">
        <a class="nav-logo" href="${link(base, 'index.html')}">
          <span class="nav-logo-icon">${icon('spark')}</span>
          <span class="nav-logo-text" style="color:white;">Green<span>Next</span></span>
        </a>
        <p class="footer-tagline">${tagline}</p>
        <p class="footer-brand-desc">AI-driven infrastructure, data centers, and intelligent automation for the modern enterprise.</p>
      </div>
      ${footerData.columns.map(col => `
        <div class="footer-col">
          <h4 class="footer-col-title">${col.title}</h4>
          <ul class="footer-links">
            ${col.links.map(l => `<li><a href="${link(base, l.href)}">${l.label}</a></li>`).join('')}
          </ul>
        </div>`).join('')}
      <div class="footer-col">
        <h4 class="footer-col-title">Contact</h4>
        <ul class="footer-links">
          <li><a href="mailto:hello@greennext.example">hello@greennext.example</a></li>
          <li><a href="tel:+910000000000">+91 00000 00000</a></li>
          <li><a href="${link(base, 'privacy-policy.html')}">Privacy Policy</a></li>
          <li><a href="${link(base, 'terms-and-conditions.html')}">Terms &amp; Conditions</a></li>
        </ul>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>&copy; ${CURRENT_YEAR} GreenNext. All rights reserved.</span>
      <div class="footer-bottom-links">
        <a href="${link(base, 'privacy-policy.html')}">Privacy Policy</a>
        <a href="${link(base, 'terms-and-conditions.html')}">Terms &amp; Conditions</a>
      </div>
    </div>
  </footer>`;
}

export function page({ base = '', title, metaDesc, bodyHtml, jsExtra = [] }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} | GreenNext</title>
<meta name="description" content="${metaDesc}">
<link rel="stylesheet" href="${link(base, 'css/main.css')}">
<link rel="stylesheet" href="${link(base, 'css/nav.css')}">
<link rel="stylesheet" href="${link(base, 'css/forms.css')}">
<link rel="stylesheet" href="${link(base, 'css/footer.css')}">
<link rel="stylesheet" href="${link(base, 'css/pages.css')}">
<link rel="stylesheet" href="${link(base, 'css/visual.css')}">
</head>
<body>
${headerAndNav(base)}
<main class="page-transition">
${bodyHtml}
</main>
${footer(base)}
<script src="${link(base, 'js/nav.js')}" defer></script>
<script src="${link(base, 'js/reveal.js')}" defer></script>
<script src="${link(base, 'js/forms.js')}" defer></script>
<script src="${link(base, 'js/motion.js')}" defer></script>
${jsExtra.join('\n')}
</body>
</html>
`;
}

export function aboutSplitSection({ heading, body, floatCardText, base = '', img = 'assets/img/control-room.webp', id }) {
  return `
  <section class="section section-relative"${id ? ` id="${id}"` : ''}>
    ${blobDecor('blob-decor--tr')}
    <div class="container about-split">
      <div class="reveal reveal-left">
        <span class="section-label">About GreenNext</span>
        <h2 class="heading-xl" style="margin-bottom: var(--space-5);">${heading}</h2>
        <p class="text-lg text-muted">${body}</p>
      </div>
      <div class="about-split-visual reveal reveal-right">
        <div class="about-split-visual-panel" style="padding:0;">
          <div class="about-split-ring"></div>
          <img src="${link(base, img)}" alt="GreenNext infrastructure operations" loading="lazy" style="width:100%;height:320px;object-fit:cover;border-radius:var(--radius-2xl);display:block;position:relative;z-index:1;">
        </div>
        <div class="about-float-card">${floatCardText}</div>
      </div>
    </div>
  </section>`;
}

export function anchorSection({ id, eyebrow, heading, body }) {
  return `
  <section class="section" id="${id}">
    <div class="container" style="max-width: 780px;">
      <span class="section-label">${eyebrow}</span>
      <h2 class="heading-lg reveal" style="margin-bottom: var(--space-4);">${heading}</h2>
      <p class="text-lg text-muted reveal">${body}</p>
    </div>
  </section>`;
}

export function intelligenceDashboardSection() {
  const nodes = [
    { icon: 'database', label: 'Data Center' },
    { icon: 'cpu', label: 'AI Monitoring' },
    { icon: 'spark', label: 'Analysis' },
    { icon: 'shield', label: 'Prediction' },
    { icon: 'bolt', label: 'Optimization' },
  ];
  return `
  <section class="section bg-soft section-relative">
    <div class="container">
      <div class="intelligence-dashboard-grid">
        <div class="reveal reveal-left">
          <span class="section-label">Intelligent Automation</span>
          <h2 class="heading-xl">Intelligence at the Core</h2>
          <p class="text-base text-muted" style="margin-top:var(--space-4);">AI transforms data center operations from reactive to proactive.</p>
          ${miniFlowHorizontal(nodes)}
        </div>
        <div class="reveal reveal-right">
          <div class="dashboard-mock-wrap">
            <div class="section-label" style="background:rgba(255,255,255,0.06);border-color:rgba(255,255,255,0.1);color:var(--color-accent);margin-bottom:var(--space-5);">Platform View</div>
            <h3 class="heading-md" style="color:white;margin-bottom:var(--space-2);">A Platform Built to See Everything</h3>
            <p class="text-sm" style="color:rgba(255,255,255,0.55);margin-bottom:var(--space-6);">A conceptual view of the visibility GreenNext infrastructure is designed to provide.</p>
            ${dashboardMock()}
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

export function processFlowSection({ eyebrow, heading, steps }) {
  return `
  <section class="section">
    <div class="container">
      <div class="section-header section-header--center">
        <span class="section-label">${eyebrow}</span>
        <h2 class="heading-xl">${heading}</h2>
      </div>
      ${processFlow(steps)}
    </div>
  </section>`;
}

export function sustainabilitySection(base, id = 'sustainability') {
  const points = [
    { icon: 'bolt', text: 'Energy efficiency' },
    { icon: 'spark', text: 'Intelligent cooling' },
    { icon: 'cpu', text: 'Smart monitoring' },
    { icon: 'shield', text: 'Infrastructure optimization' },
    { icon: 'network', text: 'Responsible digital growth' },
  ];
  return `
  <section class="section section-relative" id="${id}">
    <div class="container about-split">
      <div class="reveal reveal-left" style="order:2;">
        <span class="section-label">Sustainability</span>
        <h2 class="heading-xl" style="margin-bottom:var(--space-5);">Designed for a More Sustainable Digital Future</h2>
        <ul style="display:flex;flex-direction:column;gap:var(--space-3);">
          ${points.map(p => `<li style="display:flex;align-items:center;gap:var(--space-3);"><span class="flow-node-icon" style="width:32px;height:32px;flex-shrink:0;">${icon(p.icon)}</span><span class="text-base text-muted">${p.text}</span></li>`).join('')}
        </ul>
      </div>
      <div class="reveal reveal-right" style="order:1;">
        <img src="${link(base, 'assets/img/solar-panels.webp')}" alt="Renewable solar energy infrastructure" loading="lazy" style="width:100%;height:320px;object-fit:cover;border-radius:var(--radius-2xl);">
      </div>
    </div>
  </section>`;
}

export function futureVisionSection() {
  const nodes = [
    { icon: 'server', label: 'Infrastructure' },
    { icon: 'cpu', label: 'Intelligence' },
    { icon: 'spark', label: 'Automation' },
    { icon: 'bolt', label: 'Optimization' },
    { icon: 'shield', label: 'Sustainable Growth' },
  ];
  return `
  <section class="section bg-soft">
    <div class="container">
      <div class="section-header section-header--center">
        <span class="section-label">Future Vision</span>
        <h2 class="heading-xl">Engineering the Infrastructure of Tomorrow</h2>
      </div>
      <div style="display:flex;justify-content:center;">${miniFlowHorizontal(nodes)}</div>
    </div>
  </section>`;
}

export function locationsMapSection(base, locations, hrefPrefix = 'locations/') {
  return `
  <section class="section">
    <div class="container locations-split">
      ${locationsMapVisual(locations)}
      <div class="grid-2" style="gap: var(--space-6);">
        ${locations.map((loc, i) => `
          <div class="location-card location-card--photo reveal reveal-delay-${(i % 4) + 1}" data-city="${loc.slug}">
            <div class="location-card-photo">
              ${loc.img
                ? `<img src="${link(base, loc.img)}" alt="${loc.name} regional infrastructure" loading="lazy"><div class="location-card-overlay"></div>`
                : `<div class="location-photo-placeholder">${icon('building')}<span>${loc.imgPlaceholder || 'Photo needed'}</span></div>`}
            </div>
            <div class="location-card-body">
              <h3 class="location-card-name">${loc.name}</h3>
              <p class="location-card-desc">${loc.tagline || loc.cardDesc}</p>
              <a class="location-card-link" href="${link(base, hrefPrefix + loc.slug + '.html')}">Explore <span class="btn-arrow">&rarr;</span></a>
            </div>
          </div>`).join('')}
      </div>
    </div>
  </section>`;
}

export { cta, curveDivider, blobDecor };
