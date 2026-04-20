(function () {
  'use strict';

  function init() {
    var sliders = document.querySelectorAll('.service-cards-slider');
    if (!sliders.length) return;

    sliders.forEach(function (slider) {
      var flickityEl = slider.querySelector('.service-cards-slider__flickity');
      var dotsWrap   = slider.querySelector('.service-cards-slider__dots');
      var prevBtn    = slider.querySelector('.service-cards-slider__arrow--prev');
      var nextBtn    = slider.querySelector('.service-cards-slider__arrow--next');

      if (!flickityEl) return;

      var flkty = new Flickity(flickityEl, {
        cellAlign:          'left',
        contain:             true,
        wrapAround:          true,
        autoPlay:            10000,
        pauseAutoPlayOnHover: true,
        prevNextButtons:     false,
        pageDots:            false,
        friction:            1,
        selectedAttraction:  1,
        adaptiveHeight:      false
      });

      function buildDots() {
        if (!dotsWrap) return;
        dotsWrap.innerHTML = '';
        var count = flkty.cells.length;
        for (var i = 0; i < count; i++) {
          (function (idx) {
            var dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'service-cards-slider__dot';
            dot.setAttribute('aria-label', 'Go to slide ' + (idx + 1));
            dot.addEventListener('click', function () {
              flkty.select(idx);
              flkty.stopPlayer();
              flkty.playPlayer();
            });
            dotsWrap.appendChild(dot);
          })(i);
        }
        updateDots();
      }

      function updateDots() {
        if (!dotsWrap) return;
        var dots = dotsWrap.querySelectorAll('.service-cards-slider__dot');
        dots.forEach(function (dot, i) {
          var active = i === flkty.selectedIndex;
          dot.classList.toggle('is-active', active);
          dot.setAttribute('aria-current', active ? 'true' : 'false');
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', function () {
          flkty.previous();
          flkty.stopPlayer();
          flkty.playPlayer();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', function () {
          flkty.next();
          flkty.stopPlayer();
          flkty.playPlayer();
        });
      }

      flkty.on('select', updateDots);

      buildDots();
      flkty.resize();
    });
  }

  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }

}());
