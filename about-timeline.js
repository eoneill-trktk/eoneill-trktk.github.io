if (window.location.pathname.includes('/about/')) {
  const containerCheckInterval = setInterval(() => {
    if (document.querySelector('.tl-carousel-container')) {
      clearInterval(containerCheckInterval);
      executeCarouselCode();
    }
  }, 100);

  function executeCarouselCode() {
    const slickCSS = document.createElement('link');
    slickCSS.rel = 'stylesheet';
    slickCSS.href = 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css';
    document.head.appendChild(slickCSS);

    const styleTag = document.createElement('style');
    styleTag.textContent = `
      .tl-carousel-container {
        position: relative;
        max-width: 1200px;
        margin: 40px auto;
        padding: 0 15px;
      }

      .tl-timeline-carousel:not(.slick-initialized) {
        opacity: 0;
        height: 0;
        overflow: hidden;
      }

      .tl-timeline-carousel.slick-initialized {
        opacity: 1;
        height: auto;
        overflow: visible;
        transition: opacity 0.5s ease;
      }

      .tl-timeline-carousel {
        position: relative;
        margin: 0 -15px;
      }

      .tl-timeline-carousel .tl-slide {
        padding: 0 15px;
        outline: none;
      }

      .tl-timeline-carousel .tl-slide-content {
        background: white;
        border-radius: 8px;
        padding: 30px;
        height: 100%;
        box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        border: 1px solid #e0e0e0;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
      }

      .tl-slide-year {
        font-size: 14px;
        font-weight: 700;
        color: #2a5c82;
        margin-bottom: 10px;
      }

      .tl-slide-title {
        font-size: 20px;
        font-weight: 700;
        color: #333;
        margin-bottom: 15px;
      }

      .tl-slide-description {
        font-size: 12px;
        line-height: 1.5;
        color: #666;
      }

      .tl-slide-description h4{
        font-size: 14px;
      }

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
        display: flex !important;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10;
        opacity: 1 !important;
        visibility: visible !important;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      }

      .tl-carousel-prev:hover,
      .tl-carousel-next:hover {
        background: #00074F;
      }

      .tl-carousel-prev:hover::before,
      .tl-carousel-next:hover::before {
        border-color: white;
      }

      .tl-carousel-prev::before,
      .tl-carousel-next::before {
        content: "";
        width: 15px;
        height: 15px;
        border-top: 3px solid #00074F;
        border-right: 3px solid #00074F;
        transition: all 0.3s ease;
      }

      .tl-carousel-prev::before {
        transform: rotate(-135deg);
        margin-right: -3px;
      }

      .tl-carousel-next::before {
        transform: rotate(45deg);
        margin-left: -3px;
      }

      .tl-carousel-prev {
        left: -25px;
      }

      .tl-carousel-next {
        right: -25px;
      }

      .tl-timeline-carousel .slick-dots {
        display: flex;
        justify-content: center;
        list-style: none;
        padding: 0;
        margin: 30px 0 0;
      }

      .tl-timeline-carousel .slick-dots li {
        margin: 0 8px;
      }

      .tl-timeline-carousel .slick-dots button {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #00074F;
        opacity: 0.3;
        border: none;
        text-indent: -9999px;
        overflow: hidden;
        padding: 0;
        cursor: pointer;
      }

      .tl-timeline-carousel .slick-dots .slick-active button {
        background: #00074F;
        opacity: 1;
        width: 30px;
        border-radius: 6px;
      }

      @media (max-width: 768px) {
        .tl-carousel-prev {
          left: -15px;
        }

        .tl-carousel-next {
          right: -15px;
        }

        .tl-slide-content {
          padding: 20px;
        }

        .tl-slide-title {
          font-size: 18px;
        }

        .tl-carousel-prev,
        .tl-carousel-next {
          width: 35px;
          height: 35px;
        }
      }
    `;
    document.head.appendChild(styleTag);

    const jqueryScript = document.createElement('script');
    jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    jqueryScript.onload = function () {
      const slickScript = document.createElement('script');
      slickScript.src = 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js';
      slickScript.onload = function () {
        (function() {
          function setEqualSlideHeights() {
            var maxHeight = 0;
            var $slides = $('.tl-slide-content');
            $slides.css('height', 'auto');
            $slides.each(function() {
              var h = $(this).outerHeight();
              if (h > maxHeight) maxHeight = h;
            });
            $slides.css('height', maxHeight + 'px');
          }

          function initializeCarousel() {
            var $carousel = $('#tl-timeline-carousel');

            if ($carousel.find('.tl-slide').length > 0) {
              $carousel.slick({
                slidesToShow: 5,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 6000,
                speed: 800,
                arrows: true,
                dots: true,
                prevArrow: '<button type="button" class="tl-carousel-prev"></button>',
                nextArrow: '<button type="button" class="tl-carousel-next"></button>',
                responsive: [
                  { 
                    breakpoint: 1200, 
                    settings: { 
                      slidesToShow: 3
                    } 
                  },
                  { 
                    breakpoint: 992, 
                    settings: { 
                      slidesToShow: 2
                    } 
                  },
                  { 
                    breakpoint: 768, 
                    settings: { 
                      slidesToShow: 1
                    } 
                  },
                  { 
                    breakpoint: 576, 
                    settings: { 
                      slidesToShow: 1
                    } 
                  }
                ]
              });

              $carousel.on('setPosition', function() {
                setEqualSlideHeights();
              });

              $('.tl-carousel-prev').click(function() {
                $carousel.slick('slickPrev');
              });

              $('.tl-carousel-next').click(function() {
                $carousel.slick('slickNext');
              });

              setEqualSlideHeights();
            } else {
              console.error('Slides not found - check HTML structure');
            }
          }

          if (document.readyState === 'complete') {
            setTimeout(initializeCarousel, 100);
          } else {
            $(window).on('load', function() {
              setTimeout(initializeCarousel, 100);
            });
          }

          $(window).on('resize', function() {
            setEqualSlideHeights();
          });
        })();
      };
      document.body.appendChild(slickScript);
    };
    document.body.appendChild(jqueryScript);
  }
}

