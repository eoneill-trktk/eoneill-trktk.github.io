(function() {
            // Inject Swiper CSS
            const swiperCSS = document.createElement('link');
            swiperCSS.rel = 'stylesheet';
            swiperCSS.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
            document.head.appendChild(swiperCSS);
            
            // Inject custom styles
            const customStyles = document.createElement('style');
            customStyles.textContent = `
                .bis-carousel-container {
                    position: relative;
                    width: 100%;
                    height: 200px;
                    margin: 0 auto;
                    overflow: hidden;
                }
                
                .bis-carousel-container .swiper {
                    width: 100%;
                    height: 100%;
                }
                
                .bis-carousel-container .bis-carousel-item {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    transition: transform 1s ease, opacity 1s ease;
                    opacity: 0.5;
                }
                
                .bis-carousel-container .bis-carousel-item.swiper-slide-active {
                    opacity: 1;
                    transform: scale(1.2);
                    z-index: 2;
                }
                
                .bis-carousel-container .bis-carousel-image-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    padding: 10px;
                }
                
                .bis-carousel-container .bis-carousel-image-wrapper img {
                    max-height: 100%;
                    max-width: 100%;
                    object-fit: contain;
                    transition: transform 1s ease;
                }
                
                .bis-carousel-container .bis-carousel-nav {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 40px;
                    height: 40px;
                    background: rgba(255, 255, 255, 0.9);
                    border: none;
                    border-radius: 50%;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                    z-index: 10;
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 18px;
                    font-weight: bold;
                    transition: all 0.3s ease;
                }
                
                .bis-carousel-container .bis-carousel-nav:hover {
                    background: white;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                }
                
                .bis-carousel-container .bis-carousel-prev {
                    left: 15px;
                }
                
                .bis-carousel-container .bis-carousel-next {
                    right: 15px;
                }
                
                /* Responsive adjustments */
                @media (max-width: 768px) {
                    .bis-carousel-container {
                        height: 180px;
                    }
                    
                    .bis-carousel-container .bis-carousel-nav {
                        width: 35px;
                        height: 35px;
                        font-size: 16px;
                    }
                }
                
                @media (max-width: 480px) {
                    .bis-carousel-container {
                        height: 150px;
                    }
                    
                    .bis-carousel-container .bis-carousel-nav {
                        width: 30px;
                        height: 30px;
                        font-size: 14px;
                    }
                }
            `;
            document.head.appendChild(customStyles);
            
            // Load Swiper JS and initialize when ready
            function loadSwiperAndInit() {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
                script.onload = function() {
                    initSwiperWhenReady();
                };
                document.head.appendChild(script);
            }
            
            // Initialize Swiper when available
            function initSwiperWhenReady() {
                if (typeof Swiper === 'undefined') {
                    setTimeout(initSwiperWhenReady, 100);
                    return;
                }
                
                // Check if our carousel container exists
                const carouselContainer = document.getElementById('bis-carousel');
                if (!carouselContainer) {
                    console.warn('bis-carousel container not found');
                    return;
                }
                
                // Modify the HTML structure for Swiper
                const track = document.getElementById('bis-carousel-track');
                if (track) {
                    track.classList.add('swiper-wrapper');
                    const items = track.querySelectorAll('.bis-carousel-item');
                    items.forEach(item => {
                        item.classList.add('swiper-slide');
                    });
                    
                    // Create swiper container
                    const swiperEl = document.createElement('div');
                    swiperEl.classList.add('swiper');
                    swiperEl.appendChild(track.cloneNode(true));
                    track.parentNode.replaceChild(swiperEl, track);
                    
                    // Initialize Swiper
                    const swiper = new Swiper(swiperEl, {
                        loop: true,
                        centeredSlides: true,
                        slidesPerView: 'auto',
                        spaceBetween: 20,
                        speed: 1000,
                        autoplay: {
                            delay: 5000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true
                        },
                        navigation: {
                            nextEl: '.bis-carousel-next',
                            prevEl: '.bis-carousel-prev',
                        },
                        breakpoints: {
                            320: {
                                slidesPerView: 1.5,
                                spaceBetween: 10
                            },
                            640: {
                                slidesPerView: 3,
                                spaceBetween: 15
                            },
                            1024: {
                                slidesPerView: 5,
                                spaceBetween: 20
                            }
                        },
                        on: {
                            init: function() {
                                const activeSlide = this.slides[this.activeIndex];
                                if (activeSlide) {
                                    activeSlide.classList.add('swiper-slide-active');
                                }
                            },
                            slideChange: function() {
                                this.slides.forEach(slide => {
                                    slide.classList.remove('swiper-slide-active');
                                });
                                
                                const activeSlide = this.slides[this.activeIndex];
                                if (activeSlide) {
                                    activeSlide.classList.add('swiper-slide-active');
                                }
                            }
                        }
                    });
                }
            }
            
            // Start the process when DOM is ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', loadSwiperAndInit);
            } else {
                loadSwiperAndInit();
            }
        })();