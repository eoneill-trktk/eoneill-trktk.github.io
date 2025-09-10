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
        const offsetTop = mapElement.offsetTop - 20;
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
            width: 400px !important; 
            max-height: 500px; 
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
            position: relative;
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
            color: #00074F;
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
        /* Pagination styles */
        .locations-pagination {
            display: flex;
            justify-content: center;
            margin-top: 20px;
            gap: 8px;
        }
        .pagination-btn {
            padding: 8px 12px;
            background: #f0f0f0;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
        }
        .pagination-btn.active {
            background: #00074F;
            color: white;
            border-color: #00074F;
        }
        .location.hidden {
            display: none !important;
        }
        .location.page-hidden {
            display: none !important;
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
        let currentPage = 1;
        let itemsPerPage = 2;
        let currentCategory = 'all';
        let visibleLocations = [];

        // Get all location elements
        const locationElements = document.querySelectorAll('.location');
        
        // Get unique categories from location elements
        const categories = new Set(['all']);
        locationElements.forEach(locationEl => {
            const category = locationEl.classList[1] || '';
            if (category) {
                // Extract the base category name (before any hyphens)
                const baseCategory = category.split('-')[0];
                categories.add(baseCategory);
            }
        });
        
        // Create filter controls
        const filterControls = document.createElement('div');
        filterControls.className = 'map-filter-controls';
        
        // Build category options
        let categoryOptions = '<option value="all">All Categories</option>';
        categories.forEach(category => {
            if (category !== 'all') {
                const categoryName = category.replace(/-/g, ' ');
                categoryOptions += `<option value="${category}">${categoryName}</option>`;
            }
        });
        
        filterControls.innerHTML = `
            <select id="category-filter">
                ${categoryOptions}
            </select>
            <input type="text" id="search-locations" placeholder="Search organizations...">
        `;
        
        // Insert filter controls before the map
        const mapContainer = document.getElementById('map').parentNode;
        mapContainer.insertBefore(filterControls, document.getElementById('map'));
        
        // Create pagination container
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'locations-pagination';
        document.querySelector('.locations-list').parentNode.appendChild(paginationContainer);
        
        // Function to update pagination
        function updatePagination() {
            // Get visible locations
            visibleLocations = Array.from(locationElements).filter(locationEl => 
                !locationEl.classList.contains('hidden')
            );
            
            // Calculate total pages
            const totalPages = Math.ceil(visibleLocations.length / itemsPerPage);
            
            // Update pagination buttons
            paginationContainer.innerHTML = '';
            
            for (let i = 1; i <= totalPages; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
                pageBtn.textContent = i;
                pageBtn.addEventListener('click', () => {
                    currentPage = i;
                    updateVisibleItems();
                    updatePagination();
                });
                paginationContainer.appendChild(pageBtn);
            }
            
            // Update visible items
            updateVisibleItems();
        }
        
        // Function to update visible items based on current page
        function updateVisibleItems() {
            // First remove all page-hidden classes
            locationElements.forEach(locationEl => {
                locationEl.classList.remove('page-hidden');
            });
            
            // Then apply page-hidden to items not on current page
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            
            visibleLocations.forEach((locationEl, index) => {
                if (index < startIndex || index >= endIndex) {
                    locationEl.classList.add('page-hidden');
                }
            });
        }
        
        // Loop through each location element
        locationElements.forEach(locationEl => {
            // Extract data from the element
            const geo = locationEl.getAttribute('geo');
            const name = locationEl.getAttribute('name');
            const category = locationEl.classList[1] || '';
            
            // Determine icon based on category
            let iconUrl = '/siteassets/markers/marker_gray.png'; // Default
            if (category.startsWith('Colleges')) iconUrl = '/siteassets/markers/marker_green.png';
            else if (category.startsWith('Human')) iconUrl = '/siteassets/markers/marker_orange.png';
            else if (category.startsWith('Business')) iconUrl = '/siteassets/markers/marker_purple.png';
            else if (category.startsWith('Massachusetts')) iconUrl = '/siteassets/markers/marker_blue.png';
            else if (category.startsWith('MassHire')) iconUrl = '/siteassets/markers/marker_gray.png';
            else if (category.startsWith('Regional')) iconUrl = '/siteassets/markers/marker_pink.png';
            else if (category.startsWith('Youth')) iconUrl = '/siteassets/markers/marker_red.png';
            
            // Create custom icon
            const customIcon = L.icon({
                iconUrl: iconUrl,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34]
            });
            
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
            
            // Create popup content (without description limiter)
            let popupContent = `<div class="location-popup">`;
            
            if (image) {
                popupContent += `<img src="${image}" alt="${name}">`;
            }
            
            popupContent += `<h3>${name}</h3>`;
            
            if (category) {
                const categoryName = category.replace(/-/g, ' ');
                popupContent += `<p><strong>Category:</strong> ${categoryName}</p>`;
            }
                
            if (description) {
                popupContent += `<p>${description}</p>`;
            }
            
            if (address) {
                popupContent += `<p class="address"><strong>Address:</strong> ${address}</p>`;
            }
            
            popupContent += `</div>`;
            
            // Create marker with custom icon
            const marker = L.marker([lat, lng], {icon: customIcon}).addTo(map);
            marker.bindPopup(popupContent);
            
            // Store marker for later reference
            markers[name] = {marker, element: locationEl, category};
            
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
                
                // Add a small delay to ensure the map is fully rendered before scrolling
                setTimeout(scrollToMap, 100);
            });
        });
        
        // Add filtering functionality
        const categoryFilter = document.getElementById('category-filter');
        const searchInput = document.getElementById('search-locations');
        
        function filterLocations() {
            const categoryValue = categoryFilter.value;
            const searchValue = searchInput.value.toLowerCase();
            currentCategory = categoryValue;
            currentPage = 1; // Reset to first page when filtering
            
            // First, reset all locations and markers to be visible
            locationElements.forEach(locationEl => {
                locationEl.classList.remove('hidden');
            });
            
            Object.values(markers).forEach(({marker}) => {
                map.addLayer(marker);
            });
            
            // If "all" is selected and no search term, show everything
            if (categoryValue === 'all' && !searchValue) {
                updatePagination();
                return;
            }
            
            // Filter locations and markers based on criteria
            locationElements.forEach(locationEl => {
                const name = locationEl.getAttribute('name').toLowerCase();
                
                // Safely get description text (handle case where element doesn't exist)
                const descriptionElement = locationEl.querySelector('.location-description');
                const description = descriptionElement ? descriptionElement.textContent.toLowerCase() : '';
                
                // Safely get address text (handle case where element doesn't exist)
                const addressElement = locationEl.querySelector('.location-address');
                const address = addressElement ? addressElement.textContent.toLowerCase() : '';
                
                // Get the marker for this location
                const markerInfo = markers[name];
                if (!markerInfo) return;
                
                // Extract base category for matching
                const baseCategory = markerInfo.category.split('-')[0];
                
                // Check if category matches (or if "all" is selected)
                const categoryMatch = categoryValue === 'all' || baseCategory === categoryValue;
                const searchMatch = !searchValue || name.includes(searchValue) || 
                                  description.includes(searchValue) || 
                                  address.includes(searchValue);
                
                if (categoryMatch && searchMatch) {
                    // Show this location and marker
                    locationEl.classList.remove('hidden');
                    map.addLayer(markerInfo.marker);
                } else {
                    // Hide this location and marker
                    locationEl.classList.add('hidden');
                    map.removeLayer(markerInfo.marker);
                }
            });
            
            // Update pagination after filtering
            updatePagination();
        }
        
        // Add event listeners
        categoryFilter.addEventListener('change', filterLocations);
        searchInput.addEventListener('input', filterLocations);
        
        // Initialize pagination
        updatePagination();
    };
    
    leafletJs.onerror = function() {
        console.error('Failed to load Leaflet library');
    };
    
    document.head.appendChild(leafletJs);
}