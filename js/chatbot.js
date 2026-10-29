/**
 * GreenNext AI Infrastructure Assistant (Chatbot)
 * Intelligent interactive advisor for AI data centers, South India regional hubs,
 * enterprise uptime/efficiency metrics, and consultation scheduling.
 */
(function () {
  var KB = [
    {
      keywords: ['metric', 'uptime', 'energy', 'carbon', 'savings', 'sla', 'pue', 'percentage', '99.95', '40%', '60%'],
      response: `<strong>GreenNext Enterprise Sustainability Metrics:</strong><br>
      • <strong>99.95% Uptime SLA:</strong> Concurrent maintainability with 2N redundant electrical feeds and fail-safe dual cooling loops.<br>
      • <strong>40% Energy Savings:</strong> Precision aisle containment and variable-velocity direct liquid cooling loops eliminate parasitic fan overhead.<br>
      • <strong>60% Carbon Footprint Reduction:</strong> Direct integration with South India's regional solar and wind microgrids in Coimbatore and Madurai.<br>
      • <strong>40kW–80kW+ Rack Density:</strong> Purpose-built structural and thermal headroom for modern accelerated AI compute clusters.`,
      cta: { text: 'Explore Infrastructure', href: 'capabilities/index.html' }
    },
    {
      keywords: ['tree of thought', 'tree', 'framework', 'roots', 'trunk', 'branches', 'leaves', 'tot'],
      response: `<strong>The GreenNext "Tree of Thought" Framework:</strong><br>
      • <strong>🌱 Roots (Layer 1):</strong> Renewable Energy & Ground Foundations — Solar arrays, wind corridors, and geo-thermal subsurface heat sinks in South India.<br>
      • <strong>🏛️ Trunk (Layer 2):</strong> Mission-Critical Physical Compute — Tier-III/IV architecture, 40–80kW racks, direct-to-chip liquid cooling, and 800G optical fabric.<br>
      • <strong>⚡ Branches (Layer 3):</strong> Operational AI & Automation — Nexus Telemetry Mesh, neural thermal balancing, and closed-loop cooling valve actuators.<br>
      • <strong>🍃 Leaves (Layer 4):</strong> Regional Economic Outcomes — IT growth in Madurai, smart manufacturing in Coimbatore, research HPC in Trichy, and port trade in Mangalore.`,
      cta: { text: 'View Solutions Framework', href: 'solutions/index.html' }
    },
    {
      keywords: ['madurai', 'it growth', 'temple city', 'software', 'health'],
      response: `<strong>Madurai Regional Hub (IT Growth Corridor):</strong><br>
      Madurai serves as the technology expansion epicenter for Southern Tamil Nadu. GreenNext provides carrier-neutral facilities, low-latency connectivity to Chennai and Bangalore, and specialized diagnostic healthcare AI compute clusters.<br><br>
      📍 <strong>Office:</strong> Ring Road IT Corridor, Mattuthavani, Madurai 625020<br>
      📞 <strong>Phone:</strong> +91 452 290 8820 | ✉️ <strong>Email:</strong> madurai@greennext.io`,
      cta: { text: 'Explore Madurai Hub', href: 'locations/madurai.html' }
    },
    {
      keywords: ['coimbatore', 'industry', 'manufacturing', 'robotics', 'textile', 'iot'],
      response: `<strong>Coimbatore Regional Hub (Premier Industry Heartland):</strong><br>
      Coimbatore is South India's industrial powerhouse. GreenNext delivers high-density compute infrastructure for smart factories, real-time industrial robotics, predictive machine maintenance, and high-volume edge telemetry ingestion.<br><br>
      📍 <strong>Office:</strong> Level 5, GreenTech Tower, Avinashi Road, Peelamedu, Coimbatore 641004<br>
      📞 <strong>Phone:</strong> +91 422 490 8820 | ✉️ <strong>Email:</strong> coimbatore@greennext.io`,
      cta: { text: 'Explore Coimbatore Hub', href: 'locations/coimbatore.html' }
    },
    {
      keywords: ['trichy', 'tiruchirappalli', 'education', 'research', 'academic', 'hpc', 'university'],
      response: `<strong>Trichy Regional Hub (Education & Research Corridor):</strong><br>
      Positioned at the geographical center of Tamil Nadu, Trichy links premier universities and scientific institutions. GreenNext provides academic HPC simulation clusters, petabyte-scale storage, and geographic disaster recovery synchronization.<br><br>
      📍 <strong>Office:</strong> Innovation Park, Navalpattu IT SEZ, Tiruchirappalli 620026<br>
      📞 <strong>Phone:</strong> +91 431 290 8820 | ✉️ <strong>Email:</strong> trichy@greennext.io`,
      cta: { text: 'Explore Trichy Hub', href: 'locations/trichy.html' }
    },
    {
      keywords: ['mangalore', 'mangaluru', 'trade', 'port', 'coastal', 'logistics', 'subsea'],
      response: `<strong>Mangalore Regional Hub (Coastal Trade Gateway):</strong><br>
      Mangalore provides strategic proximity to international maritime shipping lanes and coastal submarine cable landing stations. GreenNext delivers sub-millisecond trade backbones, port logistics telemetry, and regional banking resilience.<br><br>
      📍 <strong>Office:</strong> Harbor View Commercial Complex, Bejai Main Road, Mangalore 575004<br>
      📞 <strong>Phone:</strong> +91 824 290 8820 | ✉️ <strong>Email:</strong> mangalore@greennext.io`,
      cta: { text: 'Explore Mangalore Hub', href: 'locations/mangalore.html' }
    },
    {
      keywords: ['location', 'locations', 'city', 'cities', 'regional', 'south india', 'hub', 'hubs'],
      response: `<strong>GreenNext Regional Presence Across South India:</strong><br>
      • <strong>Madurai:</strong> Southern IT Growth & Health Tech Corridor<br>
      • <strong>Coimbatore:</strong> Industrial & Advanced Smart Manufacturing Heartland<br>
      • <strong>Trichy:</strong> Central Education & Scientific HPC Research Corridor<br>
      • <strong>Mangalore:</strong> Coastal Trade, Maritime Logistics & Subsea Gateway<br><br>
      All four hubs are interconnected via redundant carrier-neutral optical paths with active-active disaster recovery replication.`,
      cta: { text: 'View Regional Network', href: 'locations/index.html' }
    },
    {
      keywords: ['intelligence', 'model', 'models', 'predictive', 'flow', 'automation', 'telemetry', 'ntoe'],
      response: `<strong>GreenNext Intelligence Architecture:</strong><br>
      • <strong>AI Models:</strong> Neural Thermal Optimization Engine (NTOE) models 3D facility airflow in real time; Reinforcement Learning balances rack compute against solar/wind availability.<br>
      • <strong>Predictive Insights:</strong> 20-minute advance hotspot early-warning triggers preventive workload balancing before throttling occurs; 24-hr predictive PUE forecasting.<br>
      • <strong>Automation Flows:</strong> 50,000+ sensor points streaming every 250ms triggering closed-loop cooling valve adjustments with verified cryptographic audit logs.`,
      cta: { text: 'Learn About Operations', href: 'capabilities/intelligent-automation.html' }
    },
    {
      keywords: ['consultation', 'contact', 'book', 'talk', 'expert', 'enquiry', 'plan', 'quote', 'pricing', 'cost'],
      response: `<strong>Plan Your Infrastructure With GreenNext:</strong><br>
      You can schedule a confidential technical consultation with our enterprise architecture desk, send a 60-second technical enquiry, or chat with our senior engineers directly on WhatsApp.<br><br>
      Our team typically responds with preliminary sizing, rack density allocations, and regional feasibility data within 4 business hours.`,
      cta: { text: 'Schedule Consultation', href: 'contact.html#enquiry' }
    }
  ];

  var DEFAULT_RESPONSE = `Thank you for your enquiry. GreenNext engineers AI data centers across South India (Madurai, Coimbatore, Trichy, Mangalore) delivering <strong>99.95% uptime</strong>, <strong>40% energy savings</strong>, and <strong>60% carbon reduction</strong>.<br><br>
  Would you like to explore our regional hubs, inspect the Tree of Thought framework, or schedule a technical consultation with an enterprise architect?`;

  function initChatbot() {
    // Avoid double init
    if (document.getElementById('gn-chatbot-root')) return;

    var root = document.createElement('div');
    root.id = 'gn-chatbot-root';
    root.innerHTML = `
      <div class="gn-chat-widget" id="gn-chat-widget" aria-label="GreenNext AI Assistant">
        <!-- Floating Trigger Button -->
        <button class="gn-chat-trigger" id="gn-chat-toggle" aria-expanded="false" aria-label="Open GreenNext AI Assistant" title="Chat with GreenNext AI">
          <span class="gn-chat-trigger-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="10" rx="2"></rect>
              <circle cx="12" cy="5" r="2"></circle>
              <path d="M12 7v4"></path>
              <line x1="8" y1="16" x2="8" y2="16"></line>
              <line x1="16" y1="16" x2="16" y2="16"></line>
            </svg>
          </span>
          <span class="gn-chat-trigger-close">&times;</span>
          <span class="gn-chat-badge">AI Assistant</span>
        </button>

        <!-- Chat Window Card -->
        <div class="gn-chat-card" id="gn-chat-card" role="dialog" aria-labelledby="gn-chat-title" aria-hidden="true">
          <div class="gn-chat-header">
            <div class="gn-chat-header-info">
              <div class="gn-chat-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>
              </div>
              <div>
                <h3 class="gn-chat-title" id="gn-chat-title">GreenNext AI Assistant</h3>
                <span class="gn-chat-status"><span class="gn-chat-status-dot"></span> Online • Sustainable Infrastructure Desk</span>
              </div>
            </div>
            <button class="gn-chat-close-btn" id="gn-chat-close" aria-label="Minimize Chat">&times;</button>
          </div>

          <div class="gn-chat-messages" id="gn-chat-messages">
            <div class="gn-chat-msg gn-chat-msg--bot">
              <div class="gn-chat-bubble">
                Hello! I am your <strong>GreenNext AI Infrastructure Assistant</strong>. How can I assist with your sustainable AI data center requirements across South India?
              </div>
              <span class="gn-chat-time">Just now</span>
            </div>
          </div>

          <!-- Suggested Chips -->
          <div class="gn-chat-chips" id="gn-chat-chips">
            <button type="button" class="gn-chat-chip" data-query="metrics">⚡ 99.95% Uptime & 40% Energy</button>
            <button type="button" class="gn-chat-chip" data-query="tree of thought">🌱 Tree of Thought</button>
            <button type="button" class="gn-chat-chip" data-query="regional hubs">📍 Regional Hubs</button>
            <button type="button" class="gn-chat-chip" data-query="consultation">📅 Plan Infrastructure</button>
          </div>

          <!-- Chat Input -->
          <form class="gn-chat-form" id="gn-chat-form">
            <input type="text" class="gn-chat-input" id="gn-chat-input" placeholder="Ask about uptime, cooling, Madurai, Coimbatore..." autocomplete="off" required>
            <button type="submit" class="gn-chat-send" id="gn-chat-send" aria-label="Send message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </button>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(root);

    var toggle = document.getElementById('gn-chat-toggle');
    var card = document.getElementById('gn-chat-card');
    var closeBtn = document.getElementById('gn-chat-close');
    var form = document.getElementById('gn-chat-form');
    var input = document.getElementById('gn-chat-input');
    var messages = document.getElementById('gn-chat-messages');
    var chips = document.getElementById('gn-chat-chips');

    function openChat() {
      card.classList.add('active');
      toggle.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      card.setAttribute('aria-hidden', 'false');
      setTimeout(function () { input.focus(); }, 150);
    }

    function closeChat() {
      card.classList.remove('active');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      card.setAttribute('aria-hidden', 'true');
    }

    toggle.addEventListener('click', function () {
      card.classList.contains('active') ? closeChat() : openChat();
    });

    closeBtn.addEventListener('click', closeChat);

    // Global triggers (links with data-open-chat)
    document.querySelectorAll('[data-open-chat="true"]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openChat();
      });
    });

    function appendMessage(text, isUser, cta) {
      var msg = document.createElement('div');
      msg.className = 'gn-chat-msg ' + (isUser ? 'gn-chat-msg--user' : 'gn-chat-msg--bot');
      var ctaHtml = '';
      if (cta && cta.text && cta.href) {
        ctaHtml = `<div class="gn-chat-msg-cta"><a href="${cta.href}" class="gn-chat-cta-btn">${cta.text} &rarr;</a></div>`;
      }
      msg.innerHTML = `
        <div class="gn-chat-bubble">${text}${ctaHtml}</div>
        <span class="gn-chat-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      `;
      messages.appendChild(msg);
      messages.scrollTop = messages.scrollHeight;
    }

    function findResponse(query) {
      var q = query.toLowerCase();
      for (var i = 0; i < KB.length; i++) {
        var item = KB[i];
        for (var j = 0; j < item.keywords.length; j++) {
          if (q.indexOf(item.keywords[j]) !== -1) {
            return item;
          }
        }
      }
      return { response: DEFAULT_RESPONSE, cta: { text: 'Schedule a Consultation', href: 'contact.html' } };
    }

    function handleQuery(q) {
      if (!q || !q.trim()) return;
      appendMessage(q.trim(), true);
      input.value = '';

      // Typing indicator
      var typing = document.createElement('div');
      typing.className = 'gn-chat-msg gn-chat-msg--bot gn-chat-typing';
      typing.innerHTML = '<div class="gn-chat-bubble"><span class="gn-chat-dots"><span>.</span><span>.</span><span>.</span></span></div>';
      messages.appendChild(typing);
      messages.scrollTop = messages.scrollHeight;

      setTimeout(function () {
        if (typing.parentNode) typing.parentNode.removeChild(typing);
        var match = findResponse(q);
        appendMessage(match.response, false, match.cta);
      }, 500);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      handleQuery(input.value);
    });

    chips.addEventListener('click', function (e) {
      var chip = e.target.closest('.gn-chat-chip');
      if (!chip) return;
      var q = chip.getAttribute('data-query');
      handleQuery(q);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }
})();
