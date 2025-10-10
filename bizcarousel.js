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
                    max-width: 1080px;
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
                        height: 100px;
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
                    .bis-carousel-container {
                position: relative;
                width: 100%;
                height: 240px; /* Increased height to accommodate labels */
                margin: 20px 0;
                overflow: hidden;
            }
            
            .bis-carousel-container .swiper {
                width: 100%;
                height: 100%;
            }
            
            .bis-carousel-container .swiper-wrapper {
                align-items: center;
            }
            
            .bis-carousel-container .bis-carousel-item {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100%;
                transition: all 0.5s ease;
                opacity: 0.5;
                width: 200px;
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
                width: 200px;
                height: 100px;
                background-color: #fff;
                border-radius: 8px;
                padding: 15px;
            }
            
            .bis-carousel-container .bis-carousel-image-wrapper img {
                max-width: 80%;
                max-height: 100%;
                object-fit: contain;
                display: block;
            }
            
            .bis-carousel-container .bis-carousel-label {
                text-align: center;
                font-size: 14px;
                font-weight: 600;
                color: #333;
                width: 100%;
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
            }
            
            .bis-carousel-container .bis-carousel-prev {
                left: 15px;
            }
            
            .bis-carousel-container .bis-carousel-next {
                right: 15px;
            }
            
            @media (max-width: 768px) {
                .bis-carousel-container {
                    height: 220px;
                }
                
                .bis-carousel-container .bis-carousel-image-wrapper {
                    width: 180px;
                    height: 140px;
                }
                
                .bis-carousel-container .bis-carousel-nav {
                    width: 35px;
                    height: 35px;
                    font-size: 16px;
                }
                
                .bis-carousel-container .bis-carousel-item {
                    width: 180px;
                }
            }
            
            @media (max-width: 480px) {
                .bis-carousel-container {
                    height: 200px;
                }
                
                .bis-carousel-container .bis-carousel-image-wrapper {
                    width: 160px;
                    height: 100px;
                }
                
                .bis-carousel-container .bis-carousel-nav {
                    width: 30px;
                    height: 30px;
                    font-size: 14px;
                }
                
                .bis-carousel-container .bis-carousel-item {
                    width: 160px;
                }
                
                .bis-carousel-container .bis-carousel-label {
                    font-size: 12px;
                }
            }
                .bis-carousel-item {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    `;
    document.head.appendChild(customStyles);

    // --- Sort slides before Swiper builds ---
    const categoryOrder = { gold:1, silver:2, bronze:3 };
    const getName = el => (el.getAttribute('name')||el.querySelector('img')?.alt||'').trim().toLowerCase();

    function sortSlides(){
        const track=document.getElementById('bis-carousel-track');
        if(!track) return;
        const slides=[...track.querySelectorAll('.bis-carousel-item')];
        slides.sort((a,b)=>{
            const la=(a.querySelector('.bis-carousel-label')?.textContent||'').trim().toLowerCase();
            const lb=(b.querySelector('.bis-carousel-label')?.textContent||'').trim().toLowerCase();
            const ca=categoryOrder[la]??99, cb=categoryOrder[lb]??99;
            if(ca!==cb) return ca-cb;
            return getName(a).localeCompare(getName(b));
        });
        slides.forEach(s=>track.appendChild(s));
    }

    function loadSwiperAndInit(){
        const s=document.createElement('script');
        s.src='https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
        s.onload=initSwiperWhenReady;
        document.head.appendChild(s);
    }

    function initSwiperWhenReady(){
        if(typeof Swiper==='undefined'){setTimeout(initSwiperWhenReady,100);return;}
        const container=document.getElementById('bis-carousel');
        if(!container) return;

        const track=document.getElementById('bis-carousel-track');
        if(track){
            sortSlides();
            track.classList.add('swiper-wrapper');
            track.querySelectorAll('.bis-carousel-item').forEach(i=>i.classList.add('swiper-slide'));
            const swiperEl=document.createElement('div');
            swiperEl.classList.add('swiper');
            swiperEl.appendChild(track.cloneNode(true));
            track.parentNode.replaceChild(swiperEl,track);

            const swiper=new Swiper(swiperEl,{
                loop:true,
                centeredSlides:true,
                slidesPerView:'auto',
                spaceBetween:20,
                speed:1000,
                autoplay:{delay:5000,disableOnInteraction:false,pauseOnMouseEnter:true},
                navigation:{nextEl:'.bis-carousel-next',prevEl:'.bis-carousel-prev'},
                breakpoints:{
                    320:{slidesPerView:1.5,spaceBetween:10},
                    640:{slidesPerView:3,spaceBetween:15},
                    1024:{slidesPerView:5,spaceBetween:20}
                },
                initialSlide:0
            });
            swiper.slideToLoop(0,0,false); // make slide 1 really active
        }
    }

    document.readyState==='loading'?document.addEventListener('DOMContentLoaded',loadSwiperAndInit):loadSwiperAndInit();
    document.querySelector('.bis-carousel-container').style.margin = '0 auto';

})();
