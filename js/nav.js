/**
 * GreenNext — Navigation & Header Controller
 * Handles sticky navbar compaction, dropdown animations,
 * active route highlighting, mobile drawer accordions, and dynamic footer year.
 */
(function () {
  var header = document.getElementById('gn-header');
  var hamburger = document.getElementById('gn-hamburger');
  var drawer = document.getElementById('gn-mobile-drawer');

  // Sticky header with compact styling on scroll
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 12) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Highlight active page / section in nav
  function highlightActiveNav() {
    var path = window.location.pathname.replace(/\/index\.html$/, '/').replace(/^\//, '');
    if (!path || path === '') path = 'index.html';

    var navLinks = document.querySelectorAll('.nav-link, .dropdown-item, .mobile-nav-item, .mobile-accordion-link');
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var cleanHref = href.replace(/^\.\.\//, '').replace(/^\//, '');

      if (cleanHref === path || (path.startsWith(cleanHref.replace('.html', '')) && cleanHref !== 'index.html')) {
        link.classList.add('active');
        var parentItem = link.closest('.nav-item');
        if (parentItem) parentItem.classList.add('active');
      }
    });
  }
  highlightActiveNav();

  // Desktop dropdowns
  var navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(function (item) {
    var toggle = item.querySelector(':scope > .nav-link-toggle');
    if (!toggle) return;

    var closeTimeout = null;

    function open() {
      if (closeTimeout) clearTimeout(closeTimeout);
      navItems.forEach(function (i) {
        if (i !== item) {
          var t = i.querySelector(':scope > .nav-link-toggle');
          if (t) t.setAttribute('aria-expanded', 'false');
          i.classList.remove('open');
        }
      });
      item.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
    }

    function close() {
      closeTimeout = setTimeout(function () {
        item.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }, 150);
    }

    item.addEventListener('mouseenter', open);
    item.addEventListener('mouseleave', close);

    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      item.classList.contains('open') ? item.classList.remove('open') : open();
    });

    toggle.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        item.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  });

  // Close dropdown on outside click
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item')) {
      navItems.forEach(function (i) {
        i.classList.remove('open');
        var t = i.querySelector(':scope > .nav-link-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Mobile hamburger & drawer
  if (hamburger && drawer) {
    hamburger.addEventListener('click', function () {
      var isOpen = drawer.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  // Mobile accordions
  document.querySelectorAll('.mobile-accordion-trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var content = document.getElementById(btn.getAttribute('data-accordion'));
      var isOpen = btn.classList.toggle('open');
      if (content) content.classList.toggle('open', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  });

  // Dynamic footer year
  var yearEl = document.getElementById('gn-footer-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
