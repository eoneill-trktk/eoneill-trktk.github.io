if (window.location.pathname.includes('/about/')) {
  /**
   * Waits for jQuery and Slick to be available before initializing carousel
   */
  function initWhenReady() {
    // Check for jQuery + Slick plugin
    if (window.jQuery && jQuery.fn.slick) {
      initializeCarousel();
    } else {
      // Check again every 100ms until ready
      setTimeout(initWhenReady, 100);
    }
  }

  /**
   * Main carousel initialization logic
   */
  function initializeCarousel() {
    (function($) {
      // Set equal heights for slides
      function setEqualSlideHeights() {
        let maxHeight = 0;
        const $slides = $('.tl-slide-content');
        
        $slides
          .css('height', 'auto')
          .each(function() {
            const h = $(this).outerHeight();
            if (h > maxHeight) maxHeight = h;
          })
          .css('height', maxHeight + 'px');
      }

      // Initialize Slick carousel
      function setupCarousel() {
        const $carousel = $('#tl-timeline-carousel');

        if ($carousel.find('.tl-slide').length) {
          $carousel.slick({
            slidesToShow: 5,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 6000,
            speed: 800,
            arrows: false,
            dots: true,
            responsive: [
              { breakpoint: 1200, settings: { slidesToShow: 4 } },
              { breakpoint: 992, settings: { slidesToShow: 3 } },
              { breakpoint: 768, settings: { slidesToShow: 2 } },
              { breakpoint: 576, settings: { slidesToShow: 1 } }
            ]
          });

          // Event handlers
          $carousel.on('setPosition', setEqualSlideHeights);
          $('.tl-carousel-prev').click(() => $carousel.slick('slickPrev'));
          $('.tl-carousel-next').click(() => $carousel.slick('slickNext'));
          
          // Initial height calculation
          setEqualSlideHeights();
        }
      }

      // Run when DOM is ready
      if (document.readyState === 'complete') {
        setTimeout(setupCarousel, 100);
      } else {
        $(window).on('load', () => {
          setTimeout(setupCarousel, 100);
        });
      }

      // Handle window resize
      $(window).on('resize', setEqualSlideHeights);

    })(jQuery); // Pass jQuery to the IIFE
  }

  // Start checking for dependencies
  initWhenReady();
}