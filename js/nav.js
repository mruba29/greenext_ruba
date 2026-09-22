(function () {
  var header = document.getElementById('gn-header');
  var hamburger = document.getElementById('gn-hamburger');
  var drawer = document.getElementById('gn-mobile-drawer');

  function onScroll() {
    if (!header) return;
    if (window.scrollY > 8) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Desktop dropdowns. The nav-link itself is a real link to the section's
  // hub page; the separate toggle button opens/closes the dropdown so
  // keyboard and touch users can reach it without triggering navigation.
  var navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(function (item) {
    var toggle = item.querySelector(':scope > .nav-link-toggle');
    if (!toggle) return;

    function open() {
      navItems.forEach(function (i) {
        var t = i.querySelector(':scope > .nav-link-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
        i.classList.remove('open');
      });
      item.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
    }
    function close() {
      item.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    item.addEventListener('mouseenter', open);
    item.addEventListener('mouseleave', close);
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      item.classList.contains('open') ? close() : open();
    });
    toggle.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item')) {
      navItems.forEach(function (i) { i.classList.remove('open'); });
    }
  });

  // Mobile hamburger + drawer
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
})();
