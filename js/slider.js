/**
 * GreenNext — Hero Slider Controller
 * Supports autoplay, keyboard navigation, touch/swipe gestures, and accessible ARIA updates.
 */
(function () {
  var slider = document.querySelector('.hero-slider');
  if (!slider) return;

  var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
  var indicators = Array.prototype.slice.call(slider.querySelectorAll('.slider-indicator'));
  var prevBtn = slider.querySelector('.slider-arrow--prev');
  var nextBtn = slider.querySelector('.slider-arrow--next');

  if (!slides.length) return;

  var currentIndex = 0;
  var autoplayTimer = null;
  var AUTOPLAY_INTERVAL = 5500;
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isPaused = false;

  function updateSlide(newIndex) {
    if (newIndex < 0) newIndex = slides.length - 1;
    if (newIndex >= slides.length) newIndex = 0;
    currentIndex = newIndex;

    slides.forEach(function (slide, idx) {
      var isActive = idx === currentIndex;
      slide.classList.toggle('active', isActive);
      slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });

    indicators.forEach(function (ind, idx) {
      var isActive = idx === currentIndex;
      ind.classList.toggle('active', isActive);
      ind.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    resetAutoplay();
  }

  function nextSlide() {
    updateSlide(currentIndex + 1);
  }

  function prevSlide() {
    updateSlide(currentIndex - 1);
  }

  function startAutoplay() {
    if (prefersReduced || isPaused) return;
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, AUTOPLAY_INTERVAL);
    slider.classList.remove('paused');
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
    slider.classList.add('paused');
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // Button Listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', function (e) {
      e.preventDefault();
      prevSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function (e) {
      e.preventDefault();
      nextSlide();
    });
  }

  // Indicator Listeners
  indicators.forEach(function (indicator, idx) {
    indicator.addEventListener('click', function (e) {
      e.preventDefault();
      updateSlide(idx);
    });
  });

  // Pause on hover / interaction
  slider.addEventListener('mouseenter', function () {
    isPaused = true;
    stopAutoplay();
  });

  slider.addEventListener('mouseleave', function () {
    isPaused = false;
    startAutoplay();
  });

  slider.addEventListener('focusin', function () {
    isPaused = true;
    stopAutoplay();
  });

  slider.addEventListener('focusout', function () {
    isPaused = false;
    startAutoplay();
  });

  // Keyboard navigation
  slider.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  });

  // Touch / Swipe support for mobile
  var touchStartX = 0;
  var touchEndX = 0;
  var touchStartY = 0;
  var touchEndY = 0;

  slider.addEventListener('touchstart', function (e) {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      stopAutoplay();
    }
  }, { passive: true });

  slider.addEventListener('touchend', function (e) {
    if (e.changedTouches.length === 1) {
      touchEndX = e.changedTouches[0].clientX;
      touchEndY = e.changedTouches[0].clientY;
      handleSwipe();
      startAutoplay();
    }
  }, { passive: true });

  function handleSwipe() {
    var diffX = touchEndX - touchStartX;
    var diffY = touchEndY - touchStartY;
    // Check horizontal swipe threshold (at least 45px and more horizontal than vertical)
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  // Start initially
  updateSlide(0);
  startAutoplay();
})();
