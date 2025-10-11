if (window.location.pathname.includes('/about/')) {
  const containerCheckInterval = setInterval(() => {
    if (document.querySelector('.tl-carousel-container')) {
      clearInterval(containerCheckInterval);
      executeCarouselCode();
    }
  }, 100);

  function executeCarouselCode() {
    // Load Slick CSS
    const slickCSS = document.createElement('link');
    slickCSS.rel = 'stylesheet';
    slickCSS.href = 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css';
    document.head.appendChild(slickCSS);

    const slickThemeCSS = document.createElement('link');
    slickThemeCSS.rel = 'stylesheet';
    slickThemeCSS.href = 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css';
    document.head.appendChild(slickThemeCSS);

    // Custom styles
    const styleTag = document.createElement('style');
    styleTag.textContent = `
      .tl-carousel-container {
        max-width: 1200px;
        margin: 40px auto;
        padding: 0 20px;
        box-sizing: border-box;
      }

      .tl-timeline-carousel {
        position: relative;
      }

      .tl-timeline-carousel .slick-list {
        margin: 0 -10px;
      }

      .tl-timeline-carousel .slick-slide {
        padding: 0 10px;
        box-sizing: border-box;
      }

      .tl-slide-content {
        background: rgba(229, 240, 250, 0.5);
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 25px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        height: 100%;
        display: flex !important;
        flex-direction: column;
      }

      .tl-slide-year {
        font-size: 14px;
        font-weight: 700;
        color: #2a5c82;
        margin-bottom: 10px;
      }

      .tl-slide-title {
        font-size: 18px;
        font-weight: 700;
        color: #333;
        margin-bottom: 15px;
        line-height: 1.3;
      }

      .tl-slide-description {
        font-size: 14px;
        line-height: 1.5;
        color: #666;
      }

      .tl-slide-description h4 {
        font-size: 16px;
        margin: 10px 0;
      }

      /* Custom arrow styles */
      .tl-carousel-prev,
      .tl-carousel-next {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: white;
        border: 2px solid #00074F;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      }

      .tl-carousel-prev:hover,
      .tl-carousel-next:hover {
        background: #00074F;
      }

      .tl-carousel-prev::before,
      .tl-carousel-next::before {
        content: "";
        width: 12px;
        height: 12px;
        border-top: 3px solid #00074F;
        border-right: 3px solid #00074F;
        transition: all 0.3s ease;
      }

      .tl-carousel-prev::before {
        transform: rotate(-135deg);
        margin-right: -2px;
      }

      .tl-carousel-next::before {
        transform: rotate(45deg);
        margin-left: -2px;
      }

      .tl-carousel-prev:hover::before,
      .tl-carousel-next:hover::before {
        border-color: white;
      }

      .tl-carousel-prev {
        left: -50px;
      }

      .tl-carousel-next {
        right: -50px;
      }

      /* Dots customization */
      .tl-timeline-carousel .slick-dots {
        bottom: -40px;
      }

      .tl-timeline-carousel .slick-dots li button:before {
        font-size: 10px;
        color: #00074F;
        opacity: 0.3;
      }

      .tl-timeline-carousel .slick-dots li.slick-active button:before {
        opacity: 1;
        color: #00074F;
      }

      /* Responsive adjustments */
      @media (max-width: 1300px) {
        .tl-carousel-prev {
          left: -30px;
        }
        .tl-carousel-next {
          right: -30px;
        }
      }

      @media (max-width: 1200px) {
        .tl-carousel-container {
          padding: 0 40px;
        }
        .tl-carousel-prev {
          left: 0;
        }
        .tl-carousel-next {
          right: 0;
        }
      }

      @media (max-width: 768px) {
        .tl-carousel-container {
          padding: 0 30px;
        }
        .tl-timeline-carousel .slick-list {
          margin: 0 -5px;
        }
        .tl-timeline-carousel .slick-slide {
          padding: 0 5px;
        }
        .tl-slide-content {
          padding: 20px;
        }
        .tl-carousel-prev,
        .tl-carousel-next {
          width: 35px;
          height: 35px;
        }
      }

      @media (max-width: 480px) {
        .tl-carousel-container {
          padding: 0 20px;
        }
      }
    `;
    document.head.appendChild(styleTag);

    // Load jQuery and Slick
    const jqueryScript = document.createElement('script');
    jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    jqueryScript.onload = function () {
      const slickScript = document.createElement('script');
      slickScript.src = 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js';
      slickScript.onload = function () {
        // Initialize carousel after everything is loaded
        if (document.readyState === 'complete') {
          initializeCarousel();
        } else {
          $(document).ready(initializeCarousel);
        }

        function initializeCarousel() {
          const $carousel = $('#tl-timeline-carousel');
          
          if ($carousel.length && $carousel.find('.tl-slide').length > 0) {
            $carousel.slick({
              slidesToShow: 4,
              slidesToScroll: 1,
              autoplay: true,
              autoplaySpeed: 6000,
              speed: 800,
              arrows: true,
              dots: true,
              prevArrow: '<button type="button" class="tl-carousel-prev" aria-label="Previous"></button>',
              nextArrow: '<button type="button" class="tl-carousel-next" aria-label="Next"></button>',
              responsive: [
                { 
                  breakpoint: 1200, 
                  settings: { 
                    slidesToShow: 3
                  } 
                },
                { 
                  breakpoint: 900, 
                  settings: { 
                    slidesToShow: 3
                  } 
                },
                { 
                  breakpoint: 768, 
                  settings: { 
                    slidesToShow: 2
                  } 
                },
                { 
                  breakpoint: 500, 
                  settings: { 
                    slidesToShow: 1
                  } 
                }
              ]
            });

            // Set equal heights on init and resize
            function setEqualHeights() {
              let maxHeight = 0;
              $('.tl-slide-content').css('height', 'auto').each(function() {
                const height = $(this).outerHeight();
                if (height > maxHeight) maxHeight = height;
              }).css('height', maxHeight + 'px');
            }

            setEqualHeights();
            $(window).on('resize', setEqualHeights);
            $carousel.on('setPosition', setEqualHeights);

          } else {
            console.warn('Carousel elements not found');
          }
        }
      };
      document.body.appendChild(slickScript);
    };
    document.body.appendChild(jqueryScript);
  }
}