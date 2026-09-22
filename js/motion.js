(function () {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Locations map <-> card hover linking
  var markers = document.querySelectorAll('.locations-map-marker');
  var cards = document.querySelectorAll('.location-card[data-city]');
  if (markers.length && cards.length) {
    function setActive(city) {
      markers.forEach(function (m) { m.classList.toggle('active', m.getAttribute('data-city') === city); });
      cards.forEach(function (c) { c.classList.toggle('active', c.getAttribute('data-city') === city); });
    }
    function clearActive() {
      markers.forEach(function (m) { m.classList.remove('active'); });
      cards.forEach(function (c) { c.classList.remove('active'); });
    }
    markers.forEach(function (m) {
      m.addEventListener('mouseenter', function () { setActive(m.getAttribute('data-city')); });
      m.addEventListener('mouseleave', clearActive);
    });
    cards.forEach(function (c) {
      c.addEventListener('mouseenter', function () { setActive(c.getAttribute('data-city')); });
      c.addEventListener('mouseleave', clearActive);
    });
  }

  // Subtle hero visual parallax on mouse move (desktop only, reduced-motion safe)
  if (!prefersReduced && window.matchMedia('(hover: hover)').matches) {
    var heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
      var heroSection = heroVisual.closest('.hero');
      heroSection.addEventListener('mousemove', function (e) {
        var rect = heroSection.getBoundingClientRect();
        var dx = (e.clientX - rect.left) / rect.width - 0.5;
        var dy = (e.clientY - rect.top) / rect.height - 0.5;
        heroVisual.style.transform = 'translate(' + (dx * 10) + 'px,' + (dy * 10) + 'px)';
      });
      heroSection.addEventListener('mouseleave', function () {
        heroVisual.style.transform = '';
      });
    }
  }
})();
