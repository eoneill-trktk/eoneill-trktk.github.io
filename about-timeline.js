if (window.location.pathname.includes('/about/')) {
  const containerCheckInterval = setInterval(() => {
    if (document.querySelector('.tl-carousel-container')) {
      clearInterval(containerCheckInterval);
      executeCarouselCode();
    }
  }, 100);

  function executeCarouselCode() {
    // Inject slick CSS
    const slickCSS = document.createElement('link');
    slickCSS.rel = 'stylesheet';
    slickCSS.href = 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css';
    document.head.appendChild(slickCSS);

    // Inject custom styling
    const styleTag = document.createElement('style');
    styleTag.textContent = `
      /* Styling injected from CSS section */
    `;
    document.head.appendChild(styleTag);

    // Load jQuery then Slick
    const jqueryScript = document.createElement('script');
    jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    jqueryScript.onload = function () {
      const slickScript = document.createElement('script');
      slickScript.src = 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js';
      slickScript.onload = function () {
        (function () {
          function getSlidesToShow() {
            const w = window.innerWidth;
            if (w < 576) return 1;
            if (w < 992) return 2;
            if (w < 1400) return 3;
            return 5;
          }

          function initializeCarousel() {
            const $carousel = $('#tl-timeline-carousel');

            if ($carousel.find('.tl-slide').length > 0) {
              $carousel.slick({
                slidesToShow: getSlidesToShow(),
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 6000,
                speed: 800,
                arrows: true,
                dots: true,
                prevArrow: '<button type="button" class="tl-carousel-prev"></button>',
                nextArrow: '<button type="button" class="tl-carousel-next"></button>',
              });

              // Adjust on resize dynamically
              $(window).on('resize', function () {
                $carousel.slick('slickSetOption', 'slidesToShow', getSlidesToShow(), true);
              });

              $('.tl-carousel-prev').click(() => $carousel.slick('slickPrev'));
              $('.tl-carousel-next').click(() => $carousel.slick('slickNext'));
            } else {
              console.error('Slides not found - check HTML structure');
            }
          }

          if (document.readyState === 'complete') {
            setTimeout(initializeCarousel, 100);
          } else {
            $(window).on('load', function () {
              setTimeout(initializeCarousel, 100);
            });
          }
        })();
      };
      document.body.appendChild(slickScript);
    };
    document.body.appendChild(jqueryScript);
  }
}
