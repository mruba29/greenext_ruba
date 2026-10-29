import { icon } from './icons.mjs';
import { nav, footerData, finalCTA, formConfigs, careersFormConfig, tagline, heroImg } from './data.mjs';
import { curveDivider, blobDecor, processFlow, miniFlowHorizontal, dashboardMock, locationsMapVisual, architectureDiagram, systemArchitectureDiagram, treeOfThoughtVisual, regionalImpactMatrixVisual } from './visuals.mjs';

const CURRENT_YEAR = new Date().getFullYear();

function link(base, href) {
  if (!href || href.startsWith('#') || /^https?:\/\//.test(href)) return href;
  return base + href;
}

function cta(text, href, { variant = 'primary', size = 'lg', base = '', openLeadModal = false } = {}) {
  const cls = `btn btn-${variant}${size ? ' btn-' + size : ''}`;
  const shouldOpen = openLeadModal || (text && (text.includes('Talk to an Expert') || text.includes('Request Consultation') || text.includes('Schedule a Consultation') || text.includes('Plan Your Infrastructure')));
  const modalAttr = shouldOpen ? ' data-open-lead-modal="true"' : '';
  return `<a class="${cls}" href="${link(base, href)}"${modalAttr}><span>${text}</span><span class="btn-arrow">&rarr;</span></a>`;
}

function renderMegaMenu(base, item) {
  const m = item.mega;
  if (!m) return '';
  return `
    <div class="nav-mega-dropdown" role="region" aria-label="${item.label} Submenu">
      <div class="nav-mega-inner">
        <!-- LEFT HIGHLIGHT PANEL -->
        <div class="nav-mega-panel">
          <div>
            <span class="nav-mega-badge">${m.category}</span>
            <h3 class="nav-mega-heading">${m.title}</h3>
            <p class="nav-mega-intro">${m.intro}</p>
          </div>
          ${m.highlight ? `
            <div class="nav-mega-highlight">
              <span class="nav-mega-highlight-badge">${m.highlight.badge}</span>
              <strong class="nav-mega-highlight-title">${m.highlight.title}</strong>
              <p class="nav-mega-highlight-desc">${m.highlight.desc}</p>
            </div>
          ` : ''}
          ${m.cta ? `
            <a class="nav-mega-cta" href="${link(base, m.cta.href)}">
              <span>${m.cta.text}</span>
              <span class="btn-arrow">&rarr;</span>
            </a>
          ` : ''}
        </div>

        <!-- RIGHT MULTI-COLUMN MENU ITEMS -->
        <div class="nav-mega-columns">
          ${m.columns.map(col => `
            <div class="nav-mega-col">
              ${col.map(c => `
                <a class="nav-mega-item" href="${link(base, c.href)}">
                  <span class="nav-mega-icon">${icon(c.icon || 'spark')}</span>
                  <div class="nav-mega-item-text">
                    <span class="nav-mega-item-title">${c.label}</span>
                    <span class="nav-mega-item-desc">${c.desc}</span>
                  </div>
                </a>
              `).join('')}
            </div>
          `).join('')}
        </div>
      </div>
    </div>`;
}

function desktopNav(base) {
  return nav.main.map(item => {
    if (item.mega) {
      return `
        <li class="nav-item">
          <a class="nav-link" href="${link(base, item.href)}">${item.label}</a>
          <button class="nav-link-toggle" aria-haspopup="true" aria-expanded="false" aria-label="Show ${item.label} menu">
            <svg class="nav-link-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          ${renderMegaMenu(base, item)}
        </li>`;
    }
    return `<li class="nav-item"><a class="nav-link" href="${link(base, item.href)}">${item.label}</a></li>`;
  }).join('');
}

function mobileNav(base) {
  return nav.main.map((item, i) => {
    if (item.mega) {
      const allItems = item.mega.columns.flat();
      return `
        <div class="mobile-nav-section">
          <button class="mobile-accordion-trigger" data-accordion="mob-${i}" aria-expanded="false">
            <span>${item.label}</span>
            <svg class="mobile-accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <div class="mobile-accordion-content" id="mob-${i}">
            <div class="mobile-mega-intro-box">
              <span class="mobile-mega-badge">${item.mega.category}</span>
              <p class="mobile-mega-intro">${item.mega.intro}</p>
              <a class="mobile-accordion-link mobile-accordion-link--all" href="${link(base, item.href)}">${item.mega.cta ? item.mega.cta.text : 'View All ' + item.label} &rarr;</a>
            </div>
            ${allItems.map(c => `
              <a class="mobile-accordion-link mobile-mega-sublink" href="${link(base, c.href)}">
                <span class="mobile-mega-icon">${icon(c.icon || 'spark')}</span>
                <div class="mobile-mega-text">
                  <span class="mobile-mega-label">${c.label}</span>
                  <span class="mobile-mega-desc">${c.desc}</span>
                </div>
              </a>
            `).join('')}
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
        <span class="nav-logo-icon">${icon('brandLeaf')}</span>
        <span class="nav-logo-text-wrap">
          <span class="nav-logo-text">Green<span>Next</span></span>
          <span class="nav-logo-tagline">${tagline}</span>
        </span>
      </a>
      <nav aria-label="Main">
        <ul class="nav-menu">${desktopNav(base)}</ul>
      </nav>
      <div class="nav-right">
        <a class="nav-whatsapp-btn" href="#" data-whatsapp="true" aria-label="Chat with GreenNext on WhatsApp" title="Chat on WhatsApp">
          ${icon('whatsapp')}
        </a>
        <a class="nav-cta" href="${link(base, 'contact.html')}" data-open-lead-modal="true">Plan Your Infrastructure <span class="btn-arrow">&rarr;</span></a>
        <button class="nav-hamburger" id="gn-hamburger" aria-label="Open menu" aria-expanded="false">
          <span class="hamburger-bar"></span><span class="hamburger-bar"></span><span class="hamburger-bar"></span>
        </button>
      </div>
    </div>
  </header>
  <div class="nav-mobile-drawer" id="gn-mobile-drawer">
    ${mobileNav(base)}
    <div class="mobile-nav-divider"></div>
    <a class="mobile-nav-whatsapp" href="#" data-whatsapp="true" style="display:flex;align-items:center;gap:var(--space-2);padding:var(--space-3) var(--space-4);color:#25D366;font-weight:600;text-decoration:none;">
      ${icon('whatsapp')} Chat on WhatsApp
    </a>
    <a class="mobile-nav-cta" href="${link(base, 'contact.html')}" data-open-lead-modal="true">Plan Your Infrastructure &rarr;</a>
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

export function heroSlider(base = '') {
  return `
  <section class="hero-slider" aria-label="GreenNext Intelligent Digital Infrastructure">
    <div class="hero-slider-track">
      <div class="hero-slide active" style="background-image:url('${link(base, 'assets/img/hero-banner.png')}');" role="region" aria-label="GreenNext Intelligent Digital Infrastructure">
        <div class="hero-slide-overlay"></div>
        <div class="container hero-slide-content">
          <div class="hero-slide-inner reveal visible">
            <span class="hero-eyebrow">INTELLIGENT DIGITAL INFRASTRUCTURE</span>
            <h1 class="hero-slide-title">Build Beyond Compute.<br>Build What's Next.</h1>
            <p class="hero-slide-desc">GreenNext brings together AI-ready infrastructure, intelligent operations, energy optimization, and data-driven insights to support reliable and sustainable digital infrastructure.</p>
            <div class="hero-corridors">
              <span class="hero-corridor-label">Target Service Locations:</span>
              <span class="hero-corridor-pill">Madurai</span>
              <span class="hero-corridor-sep">&bull;</span>
              <span class="hero-corridor-pill">Coimbatore</span>
              <span class="hero-corridor-sep">&bull;</span>
              <span class="hero-corridor-pill">Trichy</span>
              <span class="hero-corridor-sep">&bull;</span>
              <span class="hero-corridor-pill">Mangalore</span>
            </div>
            <div class="hero-slide-actions">
              ${cta('Explore Our Infrastructure', 'capabilities/index.html', { variant: 'primary', size: 'lg', base })}
              ${cta('Plan Your Infrastructure', 'contact.html', { variant: 'ghost', size: 'lg', base, openLeadModal: true })}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

export function hero({
  variant = 'dark',
  eyebrow,
  headline,
  description,
  primary,
  secondary,
  base = '',
  compact = true,
  img = '',
  richMedia = false,
  tags = []
}) {
  const resolvedImg = img || (richMedia ? heroImg : '');
  const hasBg = Boolean(resolvedImg);
  const secondaryVariant = variant === 'dark' ? 'ghost' : 'secondary';

  return `
  <section class="hero hero--${variant}${compact ? ' hero--compact' : ''}${hasBg ? ' hero--has-bg' : ''}"${hasBg ? ` style="background-image:url('${link(base, resolvedImg)}');"` : ''}>
    ${hasBg ? '<div class="hero-photo-overlay"></div>' : ''}
    <div class="${variant === 'dark' ? 'hero-bg-grid' : 'hero-bg-pattern'}"></div>
    <div class="container">
      <div class="hero-content reveal" style="max-width:760px;">
        ${eyebrow ? `<span class="hero-eyebrow">${eyebrow}</span>` : ''}
        <h1 class="display-lg hero-title">${headline}</h1>
        <p class="hero-description">${description}</p>
        <div class="hero-ctas">
          ${primary ? cta(primary.text, primary.href, { variant: 'primary', base }) : ''}
          ${secondary ? cta(secondary.text, secondary.href, { variant: secondaryVariant, base }) : ''}
        </div>
        ${tags && tags.length ? `
          <div class="hero-mini-stats" style="margin-top:var(--space-8);">
            ${tags.map(t => `
              <div class="hero-mini-stat">
                <span class="hero-mini-stat-icon">${icon(t.icon || 'spark')}</span>
                <span><strong>${t.label}</strong>${t.sub ? `<br><span class="hero-mini-stat-sub">${t.sub}</span>` : ''}</span>
              </div>`).join('')}
          </div>` : ''}
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
    {
      stat: '99.95%',
      label: 'Uptime SLA Availability',
      tag: 'Tier-Grade Reliability',
      icon: 'shield',
      desc: 'Dual-bus 2N electrical continuity and concurrent maintainability guaranteeing uninterrupted AI model execution.'
    },
    {
      stat: '40%',
      label: 'Operational Energy Savings',
      tag: 'PUE Optimization',
      icon: 'bolt',
      desc: 'Precision cold/hot aisle containment coupled with variable liquid cooling loops eliminating parasitic fan and chiller waste.'
    },
    {
      stat: '60%',
      label: 'Carbon Footprint Reduction',
      tag: 'Regional Clean Grid',
      icon: 'leaf',
      desc: 'Direct solar microgrid ingestion and wind corridor power contracts across Madurai, Coimbatore, and Trichy facilities.'
    },
    {
      stat: '40–80kW+',
      label: 'High-Density Rack Headroom',
      tag: 'Accelerated Density',
      icon: 'cpu',
      desc: 'Engineered for extreme compute densities, direct-to-chip heat extraction, and non-blocking 800G GPU interconnect fabrics.'
    }
  ];

  return `
  <section class="metrics-strip" id="enterprise-metrics">
    <div class="container">
      <div class="metrics-strip-headline">
        <span class="section-label" style="background:rgba(46,204,113,0.12);border-color:rgba(46,204,113,0.3);color:var(--color-primary);">INFRASTRUCTURE AT A GLANCE</span>
        <h2 class="metrics-strip-title">Enterprise-Grade Performance &amp; Sustainability Metrics</h2>
        <p class="metrics-strip-subtitle">Engineered specifically for South India’s high-density AI clusters and green power grids.</p>
      </div>
      <div class="metrics-grid">
        ${metrics.map((m, i) => `
          <div class="metrics-card reveal reveal-delay-${i + 1}">
            <div class="metrics-card-header">
              <div class="metrics-card-icon">${icon(m.icon)}</div>
              <span class="metrics-card-tag">${m.tag}</span>
            </div>
            <div class="metrics-card-stat">${m.stat}</div>
            <div class="metrics-card-label">${m.label}</div>
            <p class="metrics-card-desc">${m.desc}</p>
          </div>
        `).join('')}
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
        <textarea id="${field.name}" name="${field.name}" rows="4" placeholder="${field.placeholder || ''}" ${req}></textarea>
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
      <input type="${field.type}" id="${field.name}" name="${field.name}" placeholder="${field.placeholder || ''}" ${req}>
    </div>`;
}

export function quickEnquirySection({ base = '', title = 'Quick Enquiry', subtitle = 'Connect with an infrastructure architect in 60 seconds.' } = {}) {
  return `
  <div class="quick-enquiry-card reveal">
    <div class="quick-enquiry-panel">
      <div class="quick-enquiry-header">
        <h3 class="quick-enquiry-title">${title}</h3>
        <p class="quick-enquiry-sub">${subtitle}</p>
      </div>
      <form class="quick-enquiry-form" novalidate>
        <div class="form-field">
          <label for="qe_name">Name *</label>
          <input type="text" id="qe_name" name="name" placeholder="Your full name" required>
        </div>
        <div class="form-field">
          <label for="qe_contact">Work Email or Phone *</label>
          <input type="text" id="qe_contact" name="contact" placeholder="email@company.com or +91..." required>
        </div>
        <div class="form-field">
          <label for="qe_interest">Area of Interest *</label>
          <select id="qe_interest" name="area_of_interest" required>
            <option value="" disabled selected>Select Area of Interest</option>
            <option value="AI Data Centers">AI Data Centers</option>
            <option value="AI Infrastructure">AI Infrastructure</option>
            <option value="Energy Efficiency">Energy Efficiency</option>
            <option value="Intelligent Automation">Intelligent Automation</option>
            <option value="Digital Infrastructure">Digital Infrastructure</option>
            <option value="Regional Facilities">Regional Facilities (Madurai, Coimbatore, Trichy, Mangalore)</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary btn-sm"><span>Submit Enquiry</span><span class="btn-arrow">&rarr;</span></button>
      </form>
    </div>
    <div class="form-success">
      <div class="form-success-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <h3 class="heading-sm">Enquiry Received</h3>
      <p class="text-sm text-muted">Thank you. Our solutions team will get in touch with you shortly.</p>
    </div>
  </div>`;
}

export function leadFormSection(bucket, { base = '', prefillLocation } = {}) {
  const cfg = formConfigs[bucket] || formConfigs.consultation || formConfigs.general;
  
  // Base fields complying with Requirement 6A (Long Form)
  const baseFields = [
    { type: 'text', name: 'full_name', label: 'Full Name', required: true, placeholder: 'e.g. John Doe' },
    { type: 'email', name: 'business_email', label: 'Business Email', required: true, placeholder: 'e.g. name@enterprise.com' },
    { type: 'text', name: 'company_name', label: 'Company Name', required: true, placeholder: 'e.g. Acme Corp' },
    { type: 'tel', name: 'phone', label: 'Phone Number', required: true, placeholder: 'e.g. +91 98765 43210' },
    prefillLocation
      ? { type: 'text', name: 'location', label: 'Location', required: true, value: prefillLocation }
      : { type: 'text', name: 'location', label: 'Location / City', required: true, placeholder: 'e.g. Madurai, Coimbatore, Bangalore' },
  ];

  const extraFields = cfg.extraFields || [];
  const messageField = {
    type: 'textarea',
    name: 'project_requirements',
    label: cfg.messageLabel || 'Project Requirements',
    required: true,
    placeholder: 'Outline your compute density, workload scale, cooling targets, or regional deployment timeline...'
  };

  const allFields = [...baseFields, ...extraFields, messageField];

  return `
  <section class="section bg-soft" id="enquiry">
    <div class="container">
      <div class="lead-form-card reveal">
        <div class="lead-form-panel">
          <div class="section-header" style="margin-bottom:var(--space-6);">
            <div class="demo-mode-badge">
              <span>⚡ Enterprise Consultation Request • Confidential Advisory</span>
            </div>
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
              <div class="form-field--consent">
                <input type="checkbox" id="consent_${bucket}" name="consent" required>
                <label for="consent_${bucket}">
                  I agree to the processing of my contact information in accordance with GreenNext’s <a href="${link(base, 'privacy-policy.html')}" target="_blank">Privacy Policy</a>. *
                </label>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary btn-lg">
                <span>${cfg.submitLabel || 'Submit Request'}</span>
                <span class="btn-arrow">&rarr;</span>
              </button>
              <a class="hero-whatsapp-btn" href="#" data-whatsapp="true" style="padding:10px 18px;">
                ${icon('whatsapp')} <span>Prefer WhatsApp? Chat Directly</span>
              </a>
            </div>
          </form>
        </div>
        <div class="form-success">
          <div class="form-success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <h3 class="heading-md">Thank you for reaching out to GreenNext.</h3>
          <p class="text-base text-muted">Your enquiry has been received. Our infrastructure team will get in touch with you shortly.</p>
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
          <form class="careers-form lead-form" novalidate>
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
        <a class="hero-whatsapp-btn" href="#" data-whatsapp="true" style="padding:14px 22px;font-size:var(--font-size-base);">
          ${icon('whatsapp')} <span>Chat on WhatsApp</span>
        </a>
      </div>
    </div>
  </section>`;
}

export function footer(base) {
  return `
  <footer class="site-footer">
    <div class="footer-cta-bar">
      <div class="container footer-cta-inner">
        <div>
          <span class="heading-sm" style="color:white;display:block;">Ready to build smarter infrastructure?</span>
          <span class="text-sm" style="color:rgba(255,255,255,0.7);">Connect with GreenNext infrastructure architects across Madurai, Coimbatore, Trichy, and Mangalore.</span>
        </div>
        <div class="footer-cta-actions">
          ${cta('Talk to an Expert', 'contact.html', { variant: 'primary', size: '', base })}
          <a class="hero-whatsapp-btn" href="#" data-whatsapp="true" style="padding:10px 18px;">
            ${icon('whatsapp')} <span>WhatsApp Us</span>
          </a>
        </div>
      </div>
    </div>
    <div class="container footer-main">
      <div class="footer-brand">
        <a class="nav-logo" href="${link(base, 'index.html')}">
          <span class="nav-logo-icon">${icon('brandLeaf')}</span>
          <span class="nav-logo-text-wrap">
            <span class="nav-logo-text" style="color:white;">Green<span>Next</span></span>
            <span class="nav-logo-tagline">${tagline}</span>
          </span>
        </a>
        <p class="footer-brand-desc">AI-driven infrastructure, data centers, and intelligent automation engineered for enterprise performance and sustainability.</p>
        <div class="footer-socials">
          <a class="footer-social-link" href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="GreenNext on LinkedIn" title="LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74v-8.37H5.06v8.37h2.8z"/></svg>
          </a>
          <a class="footer-social-link" href="#" data-whatsapp="true" aria-label="GreenNext WhatsApp Chat" title="WhatsApp">
            ${icon('whatsapp')}
          </a>
        </div>
      </div>
      ${footerData.columns.map(col => `
        <div class="footer-col">
          <h4 class="footer-col-title">${col.title}</h4>
          <ul class="footer-links">
            ${col.links.map(l => `<li><a href="${link(base, l.href)}">${l.label}</a></li>`).join('')}
          </ul>
        </div>`).join('')}
      <div class="footer-col">
        <h4 class="footer-col-title">Contact &amp; Advisory</h4>
        <ul class="footer-links">
          <li><a href="${link(base, 'contact.html#schedule-consultation')}">Schedule Consultation &rarr;</a></li>
          <li><a href="${link(base, 'contact.html#enquiry')}">Infrastructure Enquiry &rarr;</a></li>
          <li><a class="footer-whatsapp-link" href="#" data-whatsapp="true">${icon('whatsapp')} Chat on WhatsApp</a></li>
          <li><a href="${link(base, 'about.html')}">About GreenNext</a></li>
          <li><a href="${link(base, 'privacy-policy.html')}">Privacy Policy</a></li>
          <li><a href="${link(base, 'terms-and-conditions.html')}">Terms &amp; Conditions</a></li>
        </ul>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>&copy; <span id="gn-footer-year">${CURRENT_YEAR}</span> GreenNext. All rights reserved.</span>
      <div class="footer-bottom-links">
        <a href="${link(base, 'privacy-policy.html')}">Privacy Policy</a>
        <a href="${link(base, 'terms-and-conditions.html')}">Terms &amp; Conditions</a>
      </div>
    </div>
  </footer>`;
}

export function welcomeModal(base = '') {
  return `
  <div class="gn-modal-backdrop" id="gn-welcome-modal" role="dialog" aria-modal="true" aria-labelledby="welcome-modal-title" aria-hidden="true">
    <div class="gn-modal gn-modal--welcome">
      <button class="gn-modal-close" data-dismiss="modal" aria-label="Close welcome modal">&times;</button>
      <div class="gn-modal-header">
        <div class="gn-modal-badge">
          <span class="gn-modal-badge-dot"></span>
          <span class="gn-welcome-badge-text">Welcome to GreenNext</span>
        </div>
        <h2 class="gn-modal-title gn-welcome-title" id="welcome-modal-title">Welcome to GreenNext</h2>
      </div>
      <p class="gn-modal-body gn-welcome-body-text">
        Discover intelligent infrastructure designed for a smarter, more sustainable future.
      </p>
      <div class="gn-modal-tags">
        <span class="gn-modal-tag">${icon('server')} AI Infrastructure</span>
        <span class="gn-modal-tag">${icon('bolt')} Energy Optimization</span>
        <span class="gn-modal-tag">${icon('cpu')} Intelligent Automation</span>
      </div>
      <div class="gn-modal-actions">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <a class="btn btn-ghost" href="${link(base, 'solutions/index.html')}">Explore GreenNext</a>
        <a class="btn btn-primary" href="${link(base, 'contact.html')}"><span>Talk to an Expert</span><span class="btn-arrow">&rarr;</span></a>
      </div>
    </div>
  </div>`;
}

export function exitModal(base = '') {
  return `
  <div class="gn-modal-backdrop" id="gn-exit-modal" role="dialog" aria-modal="true" aria-labelledby="exit-modal-title" aria-hidden="true">
    <div class="gn-modal gn-modal--exit">
      <button class="gn-modal-close" data-dismiss="modal" aria-label="Close exit modal">&times;</button>
      <div class="gn-modal-icon-circle">
        ${icon('brandLeaf')}
      </div>
      <div class="gn-modal-header">
        <h2 class="gn-modal-title" id="exit-modal-title">Thank You for Visiting GreenNext</h2>
      </div>
      <p class="gn-modal-body">
        We appreciate your interest in intelligent, sustainable infrastructure. We look forward to connecting with you.
      </p>
      <div class="gn-modal-actions">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Continue Exploring</button>
        <a class="btn btn-primary" href="${link(base, 'contact.html')}"><span>Contact Our Team</span><span class="btn-arrow">&rarr;</span></a>
      </div>
    </div>
  </div>`;
}

export function thankYouModal(base = '') {
  return `
  <div class="gn-modal-backdrop" id="gn-thankyou-modal" role="dialog" aria-modal="true" aria-labelledby="thankyou-modal-title" aria-hidden="true">
    <div class="gn-modal gn-modal--thankyou">
      <button class="gn-modal-close" data-dismiss="modal" aria-label="Close thank you modal">&times;</button>
      <div class="gn-modal-icon-circle" style="width:52px;height:52px;border-radius:var(--radius-xl);background:var(--color-primary);color:white;display:flex;align-items:center;justify-content:center;margin-bottom:var(--space-4);">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:26px;height:26px;"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <div class="gn-modal-header">
        <span class="gn-modal-badge"><span class="gn-modal-badge-dot"></span> Request Confirmed</span>
        <h2 class="gn-modal-title" id="thankyou-modal-title">Thank You, <span class="gn-thankyou-name">Valued Visitor</span>!</h2>
      </div>
      <p class="gn-modal-body">
        We appreciate your interest in GreenNext infrastructure solutions. Our enterprise solutions team has received your enquiry and will connect with you shortly.
      </p>
      <div class="demo-mode-badge" style="display:flex;margin-bottom:var(--space-6);padding:10px 14px;background:var(--color-bg-soft);border:1px solid var(--color-border);border-radius:var(--radius-md);font-size:12px;color:var(--color-text-muted);">
        <span>ℹ️ Demo Mode: Submission validated locally. To dispatch live webhooks/emails, configure API_ENDPOINT in js/config.js.</span>
      </div>
      <div class="gn-modal-actions">
        <a class="hero-whatsapp-btn" href="#" data-whatsapp="true" style="padding:10px 16px;">
          ${icon('whatsapp')} <span>Chat on WhatsApp</span>
        </a>
        <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>`;
}

export function floatingLeadModal(base = '') {
  return `
  <div class="gn-modal-backdrop" id="gn-floating-lead-modal" role="dialog" aria-modal="true" aria-labelledby="floating-lead-title" aria-hidden="true">
    <div class="gn-modal gn-modal--lead">
      <button class="gn-modal-close" data-dismiss="modal" aria-label="Close modal">&times;</button>
      <div class="gn-modal-header" style="margin-bottom:var(--space-4);">
        <div class="gn-modal-badge">
          <span class="gn-modal-badge-dot"></span> ⚡ Priority Consultation
        </div>
        <h2 class="gn-modal-title" id="floating-lead-title">Request Infrastructure Consultation</h2>
        <p class="gn-modal-subtitle" style="font-size:var(--font-size-sm);color:var(--color-text-muted);margin:0;">
          Speak with an enterprise architect regarding AI clusters, thermal efficiency, or regional deployments.
        </p>
      </div>
      <form class="floating-lead-form lead-form" novalidate>
        <!-- Hidden Metadata Fields -->
        <input type="hidden" name="form_type" value="Floating Lead Form">
        <input type="hidden" name="page_url" value="">
        <input type="hidden" name="page_title" value="">
        <input type="hidden" name="referrer" value="">
        <input type="hidden" name="utm_source" value="">
        <input type="hidden" name="utm_medium" value="">
        <input type="hidden" name="utm_campaign" value="">
        <input type="hidden" name="utm_term" value="">
        <input type="hidden" name="utm_content" value="">

        <div class="form-grid" style="grid-template-columns:1fr 1fr;gap:var(--space-3);">
          <div class="form-field" style="margin-bottom:0;">
            <label for="fl_name">Full Name *</label>
            <input type="text" id="fl_name" name="full_name" placeholder="e.g. Alex Rivera" required>
          </div>
          <div class="form-field" style="margin-bottom:0;">
            <label for="fl_email">Work Email *</label>
            <input type="email" id="fl_email" name="business_email" placeholder="name@enterprise.com" required>
          </div>
          <div class="form-field" style="margin-bottom:0;">
            <label for="fl_phone">Phone Number *</label>
            <input type="tel" id="fl_phone" name="phone" placeholder="+91 98765 43210" required>
          </div>
          <div class="form-field" style="margin-bottom:0;">
            <label for="fl_interest">Requirement / Service *</label>
            <select id="fl_interest" name="area_of_interest" required>
              <option value="" disabled selected>Select Requirement / Service</option>
              <option value="AI Data Centers">AI Data Centers</option>
              <option value="AI Infrastructure">AI Infrastructure</option>
              <option value="Energy Efficiency">Energy Efficiency & Cooling</option>
              <option value="Intelligent Automation">Intelligent Automation</option>
              <option value="Digital Infrastructure">Digital Infrastructure</option>
              <option value="Regional Facilities">Regional Facilities (Madurai, Coimbatore, Trichy, Mangalore)</option>
              <option value="General Enterprise Consultation">General Enterprise Consultation</option>
            </select>
          </div>
          <div class="form-field form-field--full" style="grid-column:span 2;margin-bottom:0;">
            <label for="fl_reqs">Brief Requirements (Optional)</label>
            <textarea id="fl_reqs" name="project_requirements" rows="2" placeholder="Compute scale, target racks, regional timeline, or key technical goals..."></textarea>
          </div>
          <div class="form-field--consent" style="grid-column:span 2;margin-top:var(--space-1);margin-bottom:var(--space-1);display:flex;align-items:flex-start;gap:8px;font-size:12px;color:var(--color-text-muted);">
            <input type="checkbox" id="consent_floating" name="consent" required style="margin-top:3px;">
            <label for="consent_floating">
              I agree to the processing of my contact information in accordance with GreenNext’s <a href="${link(base, 'privacy-policy.html')}" target="_blank">Privacy Policy</a>. *
            </label>
          </div>
        </div>
        <div class="form-actions" style="margin-top:var(--space-4);display:flex;align-items:center;justify-content:space-between;gap:var(--space-3);flex-wrap:wrap;">
          <button type="submit" class="btn btn-primary btn-md">
            <span>Submit Consultation Request</span>
            <span class="btn-arrow">&rarr;</span>
          </button>
          <a class="hero-whatsapp-btn" href="#" data-whatsapp="true" style="padding:8px 14px;font-size:var(--font-size-xs);">
            ${icon('whatsapp')} <span>Prefer WhatsApp?</span>
          </a>
        </div>
      </form>
    </div>
  </div>`;
}

export function floatingActionWidgets(base = '') {
  return `
  <!-- Floating WhatsApp (Bottom Left - Dedicated Quick Connect) -->
  <aside class="floating-whatsapp-container" id="gn-floating-whatsapp" aria-label="WhatsApp Quick Connect">
    <div class="floating-action-item">
      <a class="floating-whatsapp-btn" id="floating-whatsapp" href="#" data-whatsapp="true" aria-label="Chat with GreenNext on WhatsApp" title="Chat on WhatsApp">
        ${icon('whatsapp')}
      </a>
      <span class="floating-whatsapp-tooltip">Chat on WhatsApp</span>
    </div>
  </aside>

  <!-- Floating Consultation Request (Bottom Right - Stacked Above AI Assistant) -->
  <aside class="floating-actions-container" id="gn-floating-actions" aria-label="Infrastructure Consultation Request">
    <div class="floating-action-item">
      <span class="floating-action-tooltip">Request Consultation</span>
      <button type="button" class="floating-lead-btn" id="floating-lead-trigger" data-open-lead-modal="true" aria-label="Request Infrastructure Consultation">
        ${icon('brandLeaf')}
        <span class="floating-lead-btn-label">Consultation</span>
      </button>
    </div>
  </aside>`;
}

export function preloader(base = '') {
  return `
  <!-- GreenNext Brand Preloader (Respects reduced-motion) -->
  <div class="gn-preloader" id="gn-preloader" aria-hidden="true">
    <div class="gn-preloader-inner">
      <div class="gn-preloader-leaf-wrap">
        ${icon('brandLeaf')}
      </div>
      <div class="gn-preloader-brand">
        <span class="gn-preloader-text">Green<span>Next</span></span>
        <span class="gn-preloader-tagline">${tagline}</span>
      </div>
      <div class="gn-preloader-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100">
        <div class="gn-preloader-bar"></div>
      </div>
    </div>
  </div>`;
}

export function floatingWhatsAppWidget(base = '') {
  return floatingActionWidgets(base);
}

export function page({ base = '', title, metaDesc, bodyHtml, jsExtra = [] }) {
  const cleanTitle = title.includes('GreenNext') ? title : `${title} | GreenNext`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${cleanTitle}</title>
<meta name="description" content="${metaDesc}">
<link rel="icon" type="image/svg+xml" href="${link(base, 'assets/favicon.svg')}">
<link rel="stylesheet" href="${link(base, 'css/main.css')}">
<link rel="stylesheet" href="${link(base, 'css/nav.css')}">
<link rel="stylesheet" href="${link(base, 'css/forms.css')}">
<link rel="stylesheet" href="${link(base, 'css/footer.css')}">
<link rel="stylesheet" href="${link(base, 'css/pages.css')}">
<link rel="stylesheet" href="${link(base, 'css/visual.css')}">
<link rel="stylesheet" href="${link(base, 'css/slider.css')}">
<link rel="stylesheet" href="${link(base, 'css/modals.css')}">
</head>
<body>
${preloader(base)}
${headerAndNav(base)}
<main class="page-transition">
${bodyHtml}
</main>
${footer(base)}
${welcomeModal(base)}
${exitModal(base)}
${thankYouModal(base)}
${floatingLeadModal(base)}
${floatingActionWidgets(base)}
<script>
(function(){
  function dismissPreloader(){
    var p = document.getElementById('gn-preloader');
    if(p && !p.classList.contains('loaded')){
      p.classList.add('loaded');
      setTimeout(function(){ if(p && p.parentNode) p.parentNode.removeChild(p); }, 400);
    }
  }
  if(document.readyState === 'complete'){
    dismissPreloader();
  } else {
    window.addEventListener('load', dismissPreloader);
    setTimeout(dismissPreloader, 350);
  }
})();
</script>
<script src="${link(base, 'js/config.js')}" defer></script>
<script src="${link(base, 'js/analytics.js')}" defer></script>
<script src="${link(base, 'js/nav.js')}" defer></script>
<script src="${link(base, 'js/reveal.js')}" defer></script>
<script src="${link(base, 'js/forms.js')}" defer></script>
<script src="${link(base, 'js/motion.js')}" defer></script>
<script src="${link(base, 'js/slider.js')}" defer></script>
<script src="${link(base, 'js/modals.js')}" defer></script>
<script src="${link(base, 'js/chatbot.js')}" defer></script>
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
        <div style="margin-top:var(--space-6);">
          ${cta('Learn About Our Approach', 'about.html', { variant: 'secondary', size: 'md', base })}
        </div>
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

export function intelligenceDashboardSection(base = '') {
  const nodes = [
    { icon: 'database', label: '1. Observe' },
    { icon: 'cpu', label: '2. Understand' },
    { icon: 'spark', label: '3. Predict' },
    { icon: 'shield', label: '4. Optimize' },
    { icon: 'bolt', label: '5. Improve' },
  ];

  const intelligencePillars = [
    {
      icon: 'cpu',
      badge: 'Core Intelligence',
      title: 'AI Models',
      desc: 'Purpose-trained neural architectures continuously modeling facility thermodynamics, workload distribution, and physical server states.',
      items: [
        'Neural Thermal Optimization Engine (NTOE) mapping dynamic heat dissipation curves',
        'Deep Reinforcement Learning agents dynamically balancing cooling pumps and fan speeds for minimum PUE',
        'High-dimensional autoencoders detecting minute sensor drifts and power anomalies across 50,000+ points'
      ]
    },
    {
      icon: 'spark',
      badge: 'Proactive Telemetry',
      title: 'Predictive Insights',
      desc: 'Anticipates operational events and grid demand shifts up to 24 hours in advance to prevent throttling or outages.',
      items: [
        '20-Minute Pre-Heat Warning alerts before GPU/accelerator thermal safety thresholds are breached',
        '24-Hour Predictive PUE Modeling correlated with Tamil Nadu and Karnataka regional weather patterns',
        'MTBF & Component Health Analytics forecasting capacitor, valve, and UPS degradation before failure'
      ]
    },
    {
      icon: 'bolt',
      badge: 'Autonomous Execution',
      title: 'Automation Flows',
      desc: 'Deterministic closed-loop actuation that stabilizes temperatures and energy efficiency in milliseconds without manual intervention.',
      items: [
        'Sub-second 250ms sensor streaming across power busways, CRAC units, and liquid manifolds',
        'Cross-Domain Root-Cause Correlation validating alarms against active compute profiles to stop false positives',
        'Closed-Loop Valve & Fan Actuation executing policy-governed cooling adjustments within strict safety boundaries'
      ]
    }
  ];

  return `
  <section class="section bg-space section-relative" id="intelligence">
    <div class="container">
      <div class="intelligence-dashboard-grid">
        <div class="reveal reveal-left">
          <span class="section-label" style="background:rgba(46,204,113,0.12);border-color:rgba(46,204,113,0.3);color:var(--color-primary);">INFRASTRUCTURE TELEMETRY &amp; AI</span>
          <h2 class="heading-xl" style="color:var(--color-white);margin-top:var(--space-2);">See the Signals Behind Your Infrastructure</h2>
          <p class="text-base" style="color:var(--color-text-muted);margin-top:var(--space-4);margin-bottom:var(--space-6);line-height:1.7;">
            Continuous multi-sensor telemetry captures thermal distributions, power utilization, and network load across every rack cluster, translating physical telemetry into autonomous operational clarity.
          </p>
          <div style="margin-bottom:var(--space-6);">
            <div style="font-size:var(--font-size-xs);font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--color-primary);margin-bottom:var(--space-3);">Operational Intelligence Lifecycle</div>
            ${miniFlowHorizontal(nodes)}
          </div>
          <div style="display:flex;gap:var(--space-4);flex-wrap:wrap;align-items:center;">
            <a class="btn btn-primary btn-md" href="${link(base, 'capabilities/intelligent-automation.html')}">
              <span>Explore Operational Capabilities</span>
              <span class="btn-arrow">&rarr;</span>
            </a>
            <a class="btn btn-ghost btn-md" href="${link(base, 'contact.html')}" data-open-lead-modal="true">
              <span>Request Architecture Brief</span>
            </a>
          </div>
        </div>
        <div class="reveal reveal-right">
          <div class="dashboard-mock-wrap">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4);">
              <span class="section-label" style="background:rgba(46,204,113,0.12);border-color:rgba(46,204,113,0.3);color:var(--color-primary);">Platform Observability</span>
              <span style="font-size:11px;color:var(--color-text-dim);font-family:var(--font-family-mono);letter-spacing:0.04em;">NEXUS-OPS // v4.2</span>
            </div>
            <h3 class="heading-md" style="color:white;margin-bottom:var(--space-2);">Continuous Facility Telemetry</h3>
            <p class="text-sm" style="color:rgba(255,255,255,0.65);margin-bottom:var(--space-5);">Unified sensor streaming across power distributions, thermal zones, and non-blocking fabric.</p>
            ${dashboardMock()}
          </div>
        </div>
      </div>

      <div class="intelligence-pillars-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-6);margin-top:var(--space-12);">
        ${intelligencePillars.map((p, i) => `
          <div class="card card--dark reveal reveal-delay-${i + 1}" style="padding:var(--space-6);display:flex;flex-direction:column;justify-content:space-between;background:rgba(10,37,64,0.7);border:1px solid rgba(46,204,113,0.25);border-radius:var(--radius-xl);">
            <div>
              <div style="display:flex;align-items:center;justify-content:space-between;gap:var(--space-3);margin-bottom:var(--space-4);">
                <div class="card-icon" style="width:38px;height:38px;margin:0;background:rgba(46,204,113,0.14);color:var(--color-primary);">${icon(p.icon)}</div>
                <span style="font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--color-primary);">${p.badge}</span>
              </div>
              <h3 class="heading-md" style="color:#FFFFFF;margin-bottom:var(--space-2);">${p.title}</h3>
              <p class="text-sm" style="color:rgba(255,255,255,0.7);margin-bottom:var(--space-4);line-height:1.6;">${p.desc}</p>
              <ul style="display:flex;flex-direction:column;gap:var(--space-2);padding:0;margin:0;list-style:none;">
                ${p.items.map(it => `
                  <li style="display:flex;align-items:flex-start;gap:var(--space-2);font-size:13px;color:rgba(255,255,255,0.88);line-height:1.5;">
                    <span style="color:var(--color-primary);font-weight:bold;flex-shrink:0;">✓</span>
                    <span>${it}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
            <div style="margin-top:var(--space-6);padding-top:var(--space-4);border-top:1px solid rgba(255,255,255,0.1);">
              <a href="${link(base, 'capabilities/intelligent-automation.html')}" style="color:var(--color-primary);font-size:var(--font-size-sm);font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:6px;">
                Learn Technical Architecture &rarr;
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>`;
}

export function treeOfThoughtSection(base = '') {
  return `
  <section class="section bg-soft section-relative" id="tot-framework">
    <div class="container">
      <div class="section-header section-header--center">
        <span class="section-label">ARCHITECTURAL METHODOLOGY</span>
        <h2 class="heading-xl">Tree of Thought: Sustainable AI Architecture</h2>
        <p class="text-base text-muted" style="max-width:760px;margin:var(--space-3) auto 0;">
          A unified 4-layer architectural framework connecting deep clean-power roots with high-density physical compute, autonomous intelligence, and regional industry outcomes.
        </p>
      </div>
      ${treeOfThoughtVisual()}
      <div style="margin-top:var(--space-8);text-align:center;display:flex;justify-content:center;gap:var(--space-4);flex-wrap:wrap;">
        <a class="btn btn-primary btn-lg" href="${link(base, 'contact.html')}" data-open-lead-modal="true">
          <span>Deploy on Tree of Thought Architecture</span>
          <span class="btn-arrow">&rarr;</span>
        </a>
        <a class="btn btn-secondary btn-lg" href="${link(base, 'solutions/index.html')}">
          <span>Explore All Solutions</span>
          <span class="btn-arrow">&rarr;</span>
        </a>
      </div>
    </div>
  </section>`;
}

export function regionalImpactSection(base = '') {
  return `
  <section class="section section-relative" id="regional-impact">
    <div class="container">
      <div class="section-header section-header--center">
        <span class="section-label">REGIONAL INDUSTRY CATALYST</span>
        <h2 class="heading-xl">Regional Economic Impact Across South India</h2>
        <p class="text-base text-muted" style="max-width:760px;margin:var(--space-3) auto 0;">
          Purpose-built compute infrastructure customized for South India's distinct economic powerhouses: Madurai (IT Growth), Coimbatore (Industry Hub), Trichy (Education & Research), and Mangalore (Maritime Trade).
        </p>
      </div>
      ${regionalImpactMatrixVisual()}
      <div style="margin-top:var(--space-8);text-align:center;display:flex;justify-content:center;gap:var(--space-4);flex-wrap:wrap;">
        <a class="btn btn-primary btn-md" href="${link(base, 'locations/index.html')}">
          <span>Explore All Regional Hubs</span>
          <span class="btn-arrow">&rarr;</span>
        </a>
        <a class="btn btn-ghost btn-md" href="${link(base, 'contact.html')}" data-open-lead-modal="true">
          <span>Consult Regional Architecture Desk</span>
        </a>
      </div>
    </div>
  </section>`;
}

export function regionalOfficesSection(offices = [], base = '') {
  if (!offices || !offices.length) return '';
  return `
  <section class="section bg-soft" id="regional-offices">
    <div class="container">
      <div class="section-header section-header--center">
        <span class="section-label">REGIONAL PRESENCE</span>
        <h2 class="heading-xl">Regional Offices &amp; Engineering Centers</h2>
        <p class="text-base text-muted" style="max-width:760px;margin:var(--space-3) auto 0;">
          Direct, on-the-ground engineering advisory and 24/7 mission-critical operations across South India's core technology corridors.
        </p>
      </div>
      <div class="grid-2" style="gap:var(--space-6);margin-top:var(--space-8);">
        ${offices.map((office, i) => `
          <div class="regional-office-card card reveal reveal-delay-${i + 1}" style="padding:var(--space-6);display:flex;flex-direction:column;justify-content:space-between;border:1px solid var(--color-border);background:var(--color-surface);border-radius:var(--radius-xl);">
            <div>
              <div style="display:flex;align-items:center;justify-content:space-between;gap:var(--space-3);margin-bottom:var(--space-3);">
                <div style="display:flex;align-items:center;gap:var(--space-2);">
                  <span class="card-icon" style="width:36px;height:36px;margin:0;display:inline-flex;align-items:center;justify-content:center;border-radius:var(--radius-md);background:rgba(46,204,113,0.12);color:var(--color-primary);">${icon('pin')}</span>
                  <h3 class="heading-sm" style="margin:0;color:var(--color-midnight);">${office.city}</h3>
                </div>
                <span class="regional-impact-tag" style="font-size:11px;padding:3px 10px;border-radius:var(--radius-full);background:rgba(10,37,64,0.06);color:var(--color-midnight);font-weight:700;">${office.badge}</span>
              </div>
              <h4 style="font-size:var(--font-size-base);color:var(--color-primary);margin-bottom:var(--space-3);font-family:var(--font-heading);font-weight:700;">${office.title}</h4>
              <p class="text-sm" style="color:var(--color-text-muted);margin-bottom:var(--space-3);line-height:1.6;">
                <strong>Address:</strong> ${office.address}
              </p>
              <div style="display:flex;flex-direction:column;gap:6px;font-size:var(--font-size-sm);color:var(--color-text-main);margin-bottom:var(--space-4);">
                <div><strong>Phone:</strong> <a href="tel:${office.phone.replace(/[^+\d]/g, '')}" style="color:var(--color-midnight);font-weight:600;text-decoration:none;">${office.phone}</a></div>
                <div><strong>Email:</strong> <a href="mailto:${office.email}" style="color:var(--color-primary);font-weight:600;text-decoration:none;">${office.email}</a></div>
                <div style="font-size:12px;color:var(--color-text-dim);"><strong>Hours:</strong> ${office.hours}</div>
              </div>
              <div style="padding:var(--space-2) var(--space-3);background:rgba(46,204,113,0.08);border-left:3px solid var(--color-primary);border-radius:var(--radius-sm);font-size:12px;color:var(--color-midnight);line-height:1.5;">
                ${office.impact}
              </div>
            </div>
            <div style="margin-top:var(--space-5);display:flex;gap:var(--space-3);align-items:center;flex-wrap:wrap;">
              <a class="btn btn-secondary btn-sm" href="${link(base, `locations/${office.city.toLowerCase()}.html`)}">
                <span>View Facility Details</span> &rarr;
              </a>
              <a class="hero-whatsapp-btn" href="#" data-whatsapp="true" style="padding:7px 14px;font-size:12px;">
                ${icon('whatsapp')} <span>WhatsApp Desk</span>
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>`;
}

export function architectureSection(base = '') {
  return `
  <section class="section bg-midnight section-relative" id="architecture">
    <div class="cyber-grid-bg"></div>
    <div class="container" style="position:relative;z-index:1;">
      <div class="section-header section-header--center">
        <span class="section-label" style="background:rgba(0,212,255,0.1);border-color:rgba(0,212,255,0.3);color:var(--color-accent);">TECHNOLOGY &amp; ARCHITECTURE</span>
        <h2 class="heading-xl" style="color:var(--color-white);margin-top:var(--space-2);">Engineered for Scale. Designed for Change.</h2>
        <p class="text-lg" style="color:var(--color-text-muted);max-width:740px;margin:var(--space-3) auto 0;">
          A multi-tiered infrastructure topology integrating high-density compute, resilient connectivity, continuous observability, and policy-driven automation.
        </p>
      </div>
      ${architectureDiagram()}
      <div style="margin-top:var(--space-8);text-align:center;">
        <a class="btn btn-primary btn-lg" href="${link(base, 'contact.html')}" data-open-lead-modal="true">
          <span>Consult on Architectural Deployment</span>
          <span class="btn-arrow">&rarr;</span>
        </a>
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
    { icon: 'bolt', text: 'Renewable energy grid integration and on-site solar support' },
    { icon: 'spark', text: 'Intelligent liquid and direct-to-chip cooling architectures' },
    { icon: 'cpu', text: 'Smart monitoring algorithms that dynamically track thermal efficiency' },
    { icon: 'shield', text: 'Continuous infrastructure optimization designed for lower PUE' },
    { icon: 'network', text: 'Responsible digital growth across regional technology corridors' },
  ];
  return `
  <section class="section section-relative" id="${id}">
    <div class="container about-split">
      <div class="reveal reveal-left" style="order:2;">
        <span class="section-label">Sustainability</span>
        <h2 class="heading-xl" style="margin-bottom:var(--space-5);">Designed for a More Sustainable Digital Future</h2>
        <p class="text-base text-muted" style="margin-bottom:var(--space-4);">We engineer digital infrastructure where computing power and environmental stewardship advance together.</p>
        <ul style="display:flex;flex-direction:column;gap:var(--space-3);margin-bottom:var(--space-6);">
          ${points.map(p => `<li style="display:flex;align-items:center;gap:var(--space-3);"><span class="flow-node-icon" style="width:32px;height:32px;flex-shrink:0;">${icon(p.icon)}</span><span class="text-base text-muted">${p.text}</span></li>`).join('')}
        </ul>
        <div>
          <a class="btn btn-secondary btn-md" href="${link(base, 'solutions/energy-optimization.html')}"><span>Discover Our Approach</span><span class="btn-arrow">&rarr;</span></a>
        </div>
      </div>
      <div class="reveal reveal-right" style="order:1;">
        <img src="${link(base, 'assets/img/solar-panels.webp')}" alt="Renewable solar energy infrastructure" loading="lazy" style="width:100%;height:340px;object-fit:cover;border-radius:var(--radius-2xl);">
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
              <a class="location-card-link" href="${link(base, hrefPrefix + loc.slug + '.html')}">Explore Location <span class="btn-arrow">&rarr;</span></a>
            </div>
          </div>`).join('')}
      </div>
    </div>
  </section>`;
}

export function benefitsSection(benefits = [], { eyebrow = 'Business Value', heading = 'Tangible Operational & Strategic Benefits', subtitle = '' } = {}) {
  if (!benefits || !benefits.length) return '';
  return `
  <section class="section">
    <div class="container">
      <div class="section-header section-header--center">
        <span class="section-label">${eyebrow}</span>
        <h2 class="heading-xl">${heading}</h2>
        ${subtitle ? `<p class="text-lg text-muted" style="max-width:720px;margin:var(--space-3) auto 0;">${subtitle}</p>` : ''}
      </div>
      <div class="benefits-grid">
        ${benefits.map((b, i) => `
          <div class="benefit-card reveal reveal-delay-${(i % 3) + 1}">
            <div class="benefit-card-header">
              <div class="benefit-card-icon">${icon(b.icon || 'spark')}</div>
              ${b.metric ? `<span class="benefit-card-metric">${b.metric}</span>` : ''}
            </div>
            <h3 class="benefit-card-title">${b.title}</h3>
            <p class="benefit-card-desc">${b.desc}</p>
          </div>`).join('')}
      </div>
    </div>
  </section>`;
}

export function useCasesSection(useCases = [], { eyebrow = 'Enterprise Applications', heading = 'Proven Architectural Use Cases', subtitle = '' } = {}) {
  if (!useCases || !useCases.length) return '';
  return `
  <section class="section bg-soft">
    <div class="container">
      <div class="section-header section-header--center">
        <span class="section-label">${eyebrow}</span>
        <h2 class="heading-xl">${heading}</h2>
        ${subtitle ? `<p class="text-lg text-muted" style="max-width:720px;margin:var(--space-3) auto 0;">${subtitle}</p>` : ''}
      </div>
      <div class="use-cases-grid">
        ${useCases.map((uc, i) => `
          <div class="use-case-card reveal reveal-delay-${(i % 3) + 1}">
            ${uc.tag ? `<span class="use-case-badge">${uc.tag}</span>` : ''}
            <h3 class="use-case-title">${uc.title}</h3>
            <p class="use-case-desc">${uc.desc}</p>
            ${uc.points && uc.points.length ? `
              <ul class="use-case-points">
                ${uc.points.map(pt => `
                  <li class="use-case-point">
                    <span class="use-case-point-icon">${icon('spark')}</span>
                    <span>${pt}</span>
                  </li>`).join('')}
              </ul>` : ''}
            ${uc.impact ? `<div class="use-case-impact"><span>Outcome:</span> ${uc.impact}</div>` : ''}
          </div>`).join('')}
      </div>
    </div>
  </section>`;
}

export function deepDiveSection({ eyebrow = 'Technical Deep Dive', heading, body, bullets = [], img = 'assets/img/server-room.webp', alt = '', caption = '', base = '', ctaText = 'Talk to an Expert', ctaHref = 'contact.html', reverse = false } = {}) {
  const resolvedHeading = heading || 'Infrastructure Deep Dive';
  const resolvedAlt = alt || resolvedHeading;
  const resolvedImg = img || 'assets/img/server-room.webp';
  return `
  <section class="section">
    <div class="container deep-dive-grid${reverse ? ' deep-dive-grid--reverse' : ''}">
      <div class="reveal reveal-${reverse ? 'right' : 'left'}">
        ${eyebrow ? `<span class="section-label">${eyebrow}</span>` : ''}
        <h2 class="heading-xl" style="margin-bottom:var(--space-4);">${resolvedHeading}</h2>
        <p class="text-base text-muted" style="margin-bottom:var(--space-4);line-height:1.7;">${body}</p>
        ${bullets && bullets.length ? `
          <div class="deep-dive-bullets">
            ${bullets.map(b => `
              <div class="deep-dive-bullet">
                <span class="deep-dive-bullet-icon">${icon('spark')}</span>
                <span>${b}</span>
              </div>`).join('')}
          </div>` : ''}
        ${ctaText ? `
          <div style="margin-top:var(--space-6);display:flex;gap:var(--space-4);flex-wrap:wrap;align-items:center;">
            ${cta(ctaText, ctaHref, { variant: 'primary', size: 'md', base })}
            <a class="hero-whatsapp-btn" href="#" data-whatsapp="true" style="padding:11px 18px;font-size:var(--font-size-sm);">
              ${icon('whatsapp')} <span>WhatsApp</span>
            </a>
          </div>` : ''}
      </div>
      <div class="reveal reveal-${reverse ? 'left' : 'right'}">
        <div class="deep-dive-visual">
          <img src="${link(base, resolvedImg)}" alt="${resolvedAlt}" loading="lazy">
          ${caption ? `<div class="deep-dive-caption">${caption}</div>` : ''}
        </div>
      </div>
    </div>
  </section>`;
}

export function faqSection(faqs = [], { eyebrow = 'Frequently Asked Questions', heading = 'Clarity on Architecture & Engagements' } = {}) {
  if (!faqs || !faqs.length) return '';
  return `
  <section class="section section-faq">
    <div class="container faq-wrap">
      <div class="section-header section-header--center">
        <span class="section-label">${eyebrow}</span>
        <h2 class="heading-xl">${heading}</h2>
      </div>
      <div class="faq-list">
        ${faqs.map(faq => `
          <details class="faq-item">
            <summary class="faq-summary">
              <span>${faq.q}</span>
              <span class="faq-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
              </span>
            </summary>
            <div class="faq-answer">
              <p>${faq.a}</p>
            </div>
          </details>`).join('')}
      </div>
    </div>
  </section>`;
}

export function relatedLinksBar(links = [], base = '') {
  if (!links || !links.length) return '';
  return `
  <section class="container" style="padding-bottom:var(--space-8);">
    <div class="related-nav-bar">
      <div class="related-nav-title">
        <span class="nav-logo-icon" style="width:20px;height:20px;">${icon('brandLeaf')}</span>
        <span>Related Solutions &amp; Infrastructure:</span>
      </div>
      <div class="related-nav-pills">
        ${links.map(l => `<a class="related-nav-pill" href="${link(base, l.href)}">${l.label} &rarr;</a>`).join('')}
      </div>
    </div>
  </section>`;
}

export function glanceCardsSection(base = '', cards = []) {
  if (!cards || !cards.length) return '';
  return `
  <section class="section" id="glance">
    <div class="container">
      <div class="section-header section-header--center">
        <span class="section-label">INFRASTRUCTURE AT A GLANCE</span>
        <h2 class="heading-xl">Infrastructure Designed Around Your Next Move</h2>
        <p class="text-base text-muted" style="max-width:760px;margin:var(--space-3) auto 0;">
          From high-density accelerated compute clusters to carrier-neutral regional networks, GreenNext integrates critical infrastructure layers into unified, resilient foundations.
        </p>
      </div>
      <div class="grid-4" style="gap:var(--space-6);margin-top:var(--space-10);">
        ${cards.map((card, i) => `
          <div class="card reveal reveal-delay-${i + 1}" style="padding:var(--space-6);display:flex;flex-direction:column;justify-content:space-between;background:rgba(11,18,32,0.7);border:1px solid rgba(0,255,102,0.2);border-radius:var(--radius-xl);">
            <div>
              <div class="card-icon" style="width:44px;height:44px;border-radius:10px;background:rgba(0,255,102,0.12);color:#00FF66;display:flex;align-items:center;justify-content:center;margin-bottom:var(--space-4);">
                ${icon(card.icon)}
              </div>
              <h3 class="heading-md" style="color:#FFFFFF;margin-bottom:var(--space-2);">${card.title}</h3>
              <p class="text-sm" style="color:#AAB7CB;line-height:1.6;margin-bottom:var(--space-4);">${card.desc}</p>
            </div>
            <div>
              <a class="location-card-link" href="${link(base, card.href)}">
                <span>Learn More</span> <span class="btn-arrow">&rarr;</span>
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>`;
}

export function challengesSection(base = '', challenges = []) {
  if (!challenges || !challenges.length) return '';
  return `
  <section class="section bg-soft section-relative" id="challenges">
    <div class="container">
      <div class="section-header section-header--center">
        <span class="section-label">CRITICAL CHALLENGES WE ADDRESS</span>
        <h2 class="heading-xl">Engineering Solutions for High-Density Operational Hurdles</h2>
        <p class="text-base text-muted" style="max-width:760px;margin:var(--space-3) auto 0;">
          As computing densities accelerate, data center operators face escalating thermal, electrical, and visibility constraints. Here is how GreenNext resolves them.
        </p>
      </div>
      <div class="grid-3" style="gap:var(--space-6);margin-top:var(--space-10);">
        ${challenges.map((c, i) => `
          <div class="card card--dark reveal reveal-delay-${(i % 3) + 1}" style="padding:var(--space-6);display:flex;flex-direction:column;justify-content:space-between;background:rgba(11,18,32,0.85);border:1px solid rgba(0,255,102,0.2);border-radius:var(--radius-xl);">
            <div>
              <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-4);">
                <div class="card-icon" style="width:36px;height:36px;border-radius:8px;background:rgba(0,255,102,0.12);color:#00FF66;display:flex;align-items:center;justify-content:center;margin:0;">
                  ${icon(c.icon)}
                </div>
                <h3 class="heading-sm" style="color:#FFFFFF;margin:0;">${c.title}</h3>
              </div>
              
              <div style="margin-bottom:var(--space-3);padding:var(--space-3);background:rgba(220,38,38,0.06);border-left:3px solid #EF4444;border-radius:var(--radius-sm);font-size:12px;color:#E8EDF5;line-height:1.5;">
                <strong style="color:#F87171;display:block;margin-bottom:2px;font-size:10px;letter-spacing:0.06em;text-transform:uppercase;">Challenge:</strong>
                ${c.problem}
              </div>

              <div style="margin-bottom:var(--space-3);padding:var(--space-3);background:rgba(0,255,102,0.06);border-left:3px solid #00FF66;border-radius:var(--radius-sm);font-size:12px;color:#E8EDF5;line-height:1.5;">
                <strong style="color:#00FF66;display:block;margin-bottom:2px;font-size:10px;letter-spacing:0.06em;text-transform:uppercase;">GreenNext Approach:</strong>
                ${c.solution}
              </div>

              <div style="padding:var(--space-3);background:rgba(57,255,20,0.04);border-left:3px solid #39FF14;border-radius:var(--radius-sm);font-size:12px;color:#AAB7CB;line-height:1.5;">
                <strong style="color:#39FF14;display:block;margin-bottom:2px;font-size:10px;letter-spacing:0.06em;text-transform:uppercase;">Measurable Benefit:</strong>
                ${c.benefit}
              </div>
            </div>

            <div style="margin-top:var(--space-5);padding-top:var(--space-3);border-top:1px solid rgba(255,255,255,0.08);">
              <a class="location-card-link" href="${link(base, c.href)}">
                <span>View Solution Architecture</span> &rarr;
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>`;
}

export function howGreenNextWorksSection(base = '', steps = []) {
  if (!steps || !steps.length) return '';
  return `
  <section class="section bg-midnight section-relative" id="how-it-works">
    <div class="cyber-grid-bg"></div>
    <div class="container" style="position:relative;z-index:1;">
      <div class="section-header section-header--center">
        <span class="section-label" style="background:rgba(0,255,102,0.1);border-color:rgba(0,255,102,0.3);color:var(--color-primary);">OPERATIONAL LIFECYCLE</span>
        <h2 class="heading-xl" style="color:#FFFFFF;margin-top:var(--space-2);">How GreenNext Works</h2>
        <p class="text-base text-muted" style="max-width:760px;margin:var(--space-3) auto 0;">
          A disciplined 6-stage lifecycle taking enterprise facilities from initial density assessment through autonomous optimization and continuous enhancement.
        </p>
      </div>
      
      <div class="how-works-timeline" style="display:flex;align-items:stretch;gap:var(--space-3);margin-top:var(--space-10);overflow-x:auto;padding-bottom:var(--space-4);">
        ${steps.map((s, i) => `
          <div class="how-works-step reveal reveal-delay-${(i % 3) + 1}" style="flex:1;min-width:170px;background:rgba(11,18,32,0.85);border:1px solid rgba(0,255,102,0.25);border-radius:var(--radius-xl);padding:var(--space-5);display:flex;flex-direction:column;justify-content:space-between;">
            <div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-3);">
                <span style="font-size:10px;font-weight:800;letter-spacing:0.1em;color:#00FF66;background:rgba(0,255,102,0.12);padding:2px 8px;border-radius:4px;border:1px solid rgba(0,255,102,0.3);">STAGE ${s.step}</span>
                <div style="width:28px;height:28px;border-radius:6px;background:rgba(0,255,102,0.12);color:#00FF66;display:flex;align-items:center;justify-content:center;">${icon(s.icon)}</div>
              </div>
              <h3 class="heading-sm" style="color:#FFFFFF;margin-bottom:var(--space-2);">${s.name}</h3>
              <p class="text-xs" style="color:#AAB7CB;line-height:1.5;">${s.desc}</p>
            </div>
            ${i < steps.length - 1 ? '<div style="margin-top:var(--space-4);text-align:right;color:#00FF66;font-size:14px;font-weight:bold;">&rarr;</div>' : ''}
          </div>
        `).join('')}
      </div>
    </div>
  </section>`;
}

export function systemArchitectureSection(base = '') {
  return `
  <section class="section section-relative" id="system-architecture">
    <div class="container">
      <div class="section-header section-header--center">
        <span class="section-label">END-TO-END DATAFLOW PIPELINE</span>
        <h2 class="heading-xl">System Architecture: Sensors to Operational Decisions</h2>
        <p class="text-base text-muted" style="max-width:760px;margin:var(--space-3) auto 0;">
          A connected operational dataflow capturing physical sensor signals across facilities, translating telemetry into 10 key performance indicators, and driving policy-governed decisions.
        </p>
      </div>
      ${systemArchitectureDiagram()}
    </div>
  </section>`;
}

export function whyGreenNextSection(base = '', pillars = []) {
  if (!pillars || !pillars.length) return '';
  return `
  <section class="section bg-soft section-relative" id="why-greennext">
    <div class="container">
      <div class="section-header section-header--center">
        <span class="section-label">WHY GREENNEXT</span>
        <h2 class="heading-xl">Enterprise Digital Infrastructure Built for Tomorrow</h2>
        <p class="text-base text-muted" style="max-width:760px;margin:var(--space-3) auto 0;">
          Unified visibility, verified efficiency, and modular scalability that ensure your computing infrastructure stays resilient under accelerating AI workloads.
        </p>
      </div>
      <div class="grid-3" style="gap:var(--space-6);margin-top:var(--space-10);">
        ${pillars.map((p, i) => `
          <div class="card reveal reveal-delay-${(i % 3) + 1}" style="padding:var(--space-6);background:rgba(11,18,32,0.7);border:1px solid rgba(0,255,102,0.2);border-radius:var(--radius-xl);">
            <div class="card-icon" style="width:40px;height:40px;border-radius:10px;background:rgba(0,255,102,0.12);color:#00FF66;display:flex;align-items:center;justify-content:center;margin-bottom:var(--space-4);">
              ${icon(p.icon)}
            </div>
            <h3 class="heading-sm" style="color:#FFFFFF;margin-bottom:var(--space-2);">${p.title}</h3>
            <p class="text-sm" style="color:#AAB7CB;line-height:1.6;">${p.desc}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>`;
}

export function consultationCTASection(base = '') {
  return `
  <section class="section bg-midnight section-relative" id="consultation-cta" style="padding:var(--space-16) 0;">
    <div class="cyber-grid-bg"></div>
    <div class="container" style="position:relative;z-index:1;max-width:900px;text-align:center;">
      <span class="section-label" style="background:rgba(0,255,102,0.1);border-color:rgba(0,255,102,0.3);color:var(--color-primary);">PARTNER WITH GREENNEXT</span>
      <h2 class="heading-2xl" style="color:#FFFFFF;margin-top:var(--space-3);margin-bottom:var(--space-4);">Let's Plan Your Infrastructure.</h2>
      <p class="text-lg" style="color:#AAB7CB;max-width:720px;margin:0 auto var(--space-8);line-height:1.65;">
        Discuss your infrastructure requirements, operational challenges, and digital transformation priorities with GreenNext.
      </p>
      <div style="display:flex;justify-content:center;gap:var(--space-4);flex-wrap:wrap;align-items:center;">
        <a class="btn btn-primary btn-lg" href="${link(base, 'contact.html')}" data-open-lead-modal="true">
          <span>Plan Your Infrastructure</span>
          <span class="btn-arrow">&rarr;</span>
        </a>
        <a class="btn btn-secondary btn-lg" href="${link(base, 'solutions/index.html')}">
          <span>Explore All Solutions</span>
        </a>
      </div>
    </div>
  </section>`;
}

export { cta, curveDivider, blobDecor };

