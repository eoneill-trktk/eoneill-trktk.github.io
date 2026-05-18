(function () {
  'use strict';

  if (!window.location.pathname.includes('our-philosophy')) return;

  function init() {
    var carousels = document.querySelectorAll('.zen-carousel');
    if (!carousels.length) return;

    carousels.forEach(function (carousel) {
      var slides   = carousel.querySelectorAll('.zen-slide');
      var dotsWrap = carousel.querySelector('.zen-carousel__dots');
      var prevBtn  = carousel.querySelector('.zen-carousel__arrow--prev');
      var nextBtn  = carousel.querySelector('.zen-carousel__arrow--next');

      if (!slides.length) return;

      var count         = slides.length;
      var current       = 0;
      var autoPlayTimer = null;
      var autoPlayDelay = 8000;

      // Respect whichever slide Liquid marked is-active on render
      slides.forEach(function (slide, i) {
        if (slide.classList.contains('is-active')) current = i;
      });

      function goTo(idx) {
        var next = (idx + count) % count;
        if (next === current) return;

        slides[current].classList.remove('is-active');
        setDot(current, false);

        current = next;

        slides[current].classList.add('is-active');
        setDot(current, true);
      }

      function setDot(idx, active) {
        if (!dotsWrap) return;
        var dot = dotsWrap.querySelector('[data-dot="' + idx + '"]');
        if (!dot) return;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-current', active ? 'true' : 'false');
      }

      function wireDots() {
        if (!dotsWrap) return;
        dotsWrap.querySelectorAll('.zen-carousel__dot').forEach(function (dot) {
          dot.addEventListener('click', function () {
            goTo(parseInt(dot.getAttribute('data-dot'), 10));
            resetAutoPlay();
          });
        });
      }

      function startAutoPlay() {
        autoPlayTimer = setInterval(function () {
          goTo(current + 1);
        }, autoPlayDelay);
      }

      function stopAutoPlay() {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }

      function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', function () {
          goTo(current - 1);
          resetAutoPlay();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', function () {
          goTo(current + 1);
          resetAutoPlay();
        });
      }

      carousel.addEventListener('mouseenter', stopAutoPlay);
      carousel.addEventListener('mouseleave', startAutoPlay);

      wireDots();
      startAutoPlay();
    });
  }

  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }

}());