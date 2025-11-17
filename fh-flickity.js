function initializeFlickitySlider(sliderId) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initSlider();
        });
    } else {
        if (document.readyState === 'complete') {
            initSlider();
        } else {
            window.addEventListener('load', initSlider);
        }
    }

    function initSlider() {
        const sliderElement = document.getElementById(sliderId);
        
        if (!sliderElement) {
            console.warn('Flickity slider element not found:', sliderId);
            return;
        }

        if (typeof Flickity === 'undefined') {
            console.error('Flickity library not loaded');
            return;
        }

        let groupCells = 1;
    
    if (window.matchMedia('(min-width: 768px)').matches) {
        groupCells = 2;
    }
    if (window.matchMedia('(min-width: 1024px)').matches) {
        groupCells = 3;
    }
    if (window.matchMedia('(min-width: 1200px)').matches) {
        groupCells = 4;
    }

        const defaultOptions = {
            cellAlign: 'left',
            contain: true,
            groupCells: true,
            pageDots: false,
            prevNextButtons: true,
            draggable: true,
            wrapAround: false,
            adaptiveHeight: true,
            imagesLoaded: true,
            freeScroll: false,
            groupCells: '80%',
            cellSelector: '.carousel-cell',
            resize: true,
            setGallerySize: true,
            percentPosition: false
        };

        const dataOptions = sliderElement.getAttribute('data-flickity');
        let customOptions = {};
        
        try {
            if (dataOptions) {
                customOptions = JSON.parse(dataOptions.replace(/'/g, '"'));
            }
        } catch (e) {
            console.warn('Error parsing Flickity options:', e);
        }

        const options = { ...defaultOptions, ...customOptions };

        const flkty = new Flickity(sliderElement, options);

        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                flkty.resize();
            }, 250);
        });

        if (typeof ResizeObserver !== 'undefined') {
            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    if (entry.target === sliderElement) {
                        flkty.resize();
                    }
                }
            });
            resizeObserver.observe(sliderElement);
        }

        return flkty;
    }
}


function initializeAllFlickitySliders() {
    const sliders = document.querySelectorAll('[data-flickity]');
    sliders.forEach(slider => {
        if (slider.id) {
            initializeFlickitySlider(slider.id);
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAllFlickitySliders);
} else {
    initializeAllFlickitySliders();
}