if (window.location.pathname.includes('/join-us/')) {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMap);
    } else {
        initMap();
    }
}

function scrollToMap() {
    const mapElement = document.getElementById('map');
    if (mapElement) {
        // Calculate the position to scroll to (slightly above the map for better visibility)
        const offsetTop = mapElement.offsetTop - 20;
        
        // Smooth scroll to the map
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function initMap() {
    // Check if head element exists
    if (!document.head) {
        console.error('Document head is not available');
        return;
    }
    
    // Add Leaflet CSS
    const leafletCss = document.createElement('link');
    leafletCss.rel = 'stylesheet';
    leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(leafletCss);

    // Add Slick Carousel CSS
    const slickCSS = document.createElement('link');
    slickCSS.rel = 'stylesheet';
    slickCSS.href = 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css';
    document.head.appendChild(slickCSS);

    // Add custom styles
    const styleTag = document.createElement('style');
    styleTag.textContent = `
        #map {
            width: 100%;
            height: 70vh; 
        }
        .leaflet-popup-content {
            margin: 10px 15px;
            line-height: 1.4;
            width: 300px !important; 
            max-height: 400px; 
            overflow-y: auto; 
        }
        .location-popup {
            font-size: 14px;
        }
        .location-popup img {
            max-width: 100%;
            max-height: 120px;
            margin-bottom: 8px;
            display: block;
        }
        .location-popup h3 {
            margin: 5px 0;
            font-size: 16px;
            line-height: 1.3;
        }
        .location-popup p {
            margin: 6px 0;
            font-size: 13px;
            line-height: 1.4;
        }
        .location-popup .address {
            font-weight: bold;
            margin: 8px 0;
            font-size: 13px;
        }
        .location-popup .contact-info {
            margin-top: 10px;
            font-size: 13px;
        }
        .location-popup a {
            word-break: break-all;
        }
        .locations-list {
            display: block;
            width: 100%;
        }
        .location {
            display: flex;
            margin-bottom: 2rem;
            width: 100%;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .location:hover {
            background-color: #f5f7fa;
            transform: translateY(-2px);
        }
        .location-image {
            flex: 0 0 auto;
            width: 150px;
            margin-right: 1rem;
        }
        .location-image img {
            width: 100%;
            height: auto;
            display: block;
        }
        .location-content {
            flex: 1;
        }
        .location-category {
            font-weight: bold;
            margin-bottom: 0.5rem;
            color: #4ecdc4;
        }
        .location-title {
            margin: 0 0 0.5rem 0;
            font-size: 1.25rem;
            color: #2c3e50;
        }
        .location-description {
            margin-bottom: 1rem;
            line-height: 1.5;
        }
        .location-address {
            line-height: 1.5;
        }
        .locations-list hr {
            color: rgba(0,0,0,.1);
        }
        .location-address div {
            margin-bottom: 0.25rem;
        }
        /* Custom scrollbar for popup */
        .leaflet-popup-content::-webkit-scrollbar {
            width: 6px;
        }
        .leaflet-popup-content::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        .leaflet-popup-content::-webkit-scrollbar-thumb {
            background: #888;
        }
        /* Filter controls */
        .map-filter-controls {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
        }
        .map-filter-controls select, 
        .map-filter-controls input {
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 0.9rem;
        }
        .map-container {
            position: relative;
            margin-bottom: 2rem;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
    `;
    document.head.appendChild(styleTag);

    // Add Leaflet JS
    const leafletJs = document.createElement('script');
    leafletJs.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    leafletJs.onload = function() {
        // Initialize the map
        const map = L.map('map').setView([42.4072, -71.3824], 8);

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Create an object to store markers by name for easy access
        const markers = {};

        // Get all location elements
        const locationElements = document.querySelectorAll('.location');
        
        // Create filter controls
        const filterControls = document.createElement('div');
        filterControls.className = 'map-filter-controls';
        filterControls.innerHTML = `
            <select id="category-filter">
                <option value="all">All Categories</option>
                <option value="Business-Network">Business Network</option>
                <option value="Human-Services">Human Services</option>
                <option value="Education">Education</option>
            </select>
            <input type="text" id="search-locations" placeholder="Search organizations...">
        `;
        
        // Insert filter controls before the map
        const mapContainer = document.getElementById('map').parentNode;
        mapContainer.insertBefore(filterControls, document.getElementById('map'));
        
        // Loop through each location element
        locationElements.forEach(locationEl => {
            // Extract data from the element
            const geo = locationEl.getAttribute('geo');
            const name = locationEl.getAttribute('name');
            const category = locationEl.classList[1] || '';
            
            // Extract image source if available
            const imgElement = locationEl.querySelector('.location-image img');
            const image = imgElement ? imgElement.src : '';
            
            // Extract description
            const descriptionElement = locationEl.querySelector('.location-description');
            const description = descriptionElement ? descriptionElement.textContent.trim() : '';
            
            // Extract address
            const addressElement = locationEl.querySelector('.location-address');
            const address = addressElement ? addressElement.textContent.trim() : '';
            
            // Parse coordinates
            const [lat, lng] = geo.split(',').map(coord => parseFloat(coord.trim()));
            
            // Create popup content
            let popupContent = `<div class="location-popup">`;
            
            if (image) {
                popupContent += `<img src="${image}" alt="${name}">`;
            }
            
            popupContent += `<h3>${name}</h3>`;
            
            if (category) {
                const categoryName = category.replace(/-/g, ' ');
                popupContent += `<p><strong>Category:</strong> ${categoryName}</p>`;
            }
            
            // Limit description length
            const maxDescLength = 200;
            const shortDescription = description.length > maxDescLength 
                ? description.substring(0, maxDescLength) + '...' 
                : description;
                
            if (shortDescription) {
                popupContent += `<p>${shortDescription}</p>`;
            }
            
            if (address) {
                popupContent += `<p class="address"><strong>Address:</strong> ${address}</p>`;
            }
            
            popupContent += `</div>`;
            
            // Create marker with extracted data
            const marker = L.marker([lat, lng]).addTo(map);
            marker.bindPopup(popupContent);
            
            // Store marker for later reference
            markers[name] = marker;
            
            // Add geo and name attributes to the marker icon and popup
            marker._icon.setAttribute('geo', geo);
            marker._icon.setAttribute('name', name);
            
            // Add event listener to set attributes on popup when it opens
            marker.on('popupopen', function() {
                const popup = marker.getPopup();
                const popupElement = popup.getElement();
                if (popupElement) {
                    popupElement.setAttribute('geo', geo);
                    popupElement.setAttribute('name', name);
                }
            });
            
            // Make location elements clickable to open corresponding popup and scroll to map
            locationEl.addEventListener('click', function() {
                map.setView([lat, lng], 13);
                marker.openPopup();
                scrollToMap(); // Scroll to the map
            });
        });
        
        // Add filtering functionality
        const categoryFilter = document.getElementById('category-filter');
        const searchInput = document.getElementById('search-locations');
        
        function filterLocations() {
            const categoryValue = categoryFilter.value;
            const searchValue = searchInput.value.toLowerCase();
            
            locationElements.forEach(locationEl => {
                const category = locationEl.classList[1] || '';
                const name = locationEl.getAttribute('name').toLowerCase();
                const description = locationEl.querySelector('.location-description').textContent.toLowerCase();
                const address = locationEl.querySelector('.location-address').textContent.toLowerCase();
                
                const categoryMatch = categoryValue === 'all' || category === categoryValue;
                const searchMatch = name.includes(searchValue) || 
                                  description.includes(searchValue) || 
                                  address.includes(searchValue);
                
                if (categoryMatch && searchMatch) {
                    locationEl.style.display = 'flex';
                    
                    // Show corresponding marker on map
                    const marker = markers[locationEl.getAttribute('name')];
                    if (marker) {
                        map.addLayer(marker);
                    }
                } else {
                    locationEl.style.display = 'none';
                    
                    // Hide corresponding marker on map
                    const marker = markers[locationEl.getAttribute('name')];
                    if (marker) {
                        map.removeLayer(marker);
                    }
                }
            });
        }
        
        categoryFilter.addEventListener('change', filterLocations);
        searchInput.addEventListener('input', filterLocations);
    };
    
    leafletJs.onerror = function() {
        console.error('Failed to load Leaflet library');
    };
    
    document.head.appendChild(leafletJs);
}