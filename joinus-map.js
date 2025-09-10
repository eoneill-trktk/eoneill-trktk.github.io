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

    // Add debugging console
    const debugDiv = document.createElement('div');
    debugDiv.id = 'debug-console';
    debugDiv.style = 'position:fixed; bottom:0; left:0; right:0; background:#333; color:#fff; padding:10px; z-index:9999; font-family:monospace; font-size:12px; max-height:200px; overflow:auto;';
    document.body.appendChild(debugDiv);
    
    function debugLog(message) {
        const debugConsole = document.getElementById('debug-console');
        debugConsole.innerHTML += '<div>' + new Date().toLocaleTimeString() + ': ' + message + '</div>';
        debugConsole.scrollTop = debugConsole.scrollHeight;
    }

    debugLog('Script loaded for /join-us/ page');

    // Add Leaflet JS
    const leafletJs = document.createElement('script');
    leafletJs.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    leafletJs.onload = function() {
        debugLog('Leaflet library loaded successfully');
        
        // Initialize the map
        const map = L.map('map').setView([42.4072, -71.3824], 8);
        debugLog('Map initialized');

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        debugLog('Tile layer added to map');

        // Create an object to store markers by name for easy access
        const markers = {};
        let currentPage = 1;
        let itemsPerPage = 2;
        let currentCategory = 'all';
        let visibleLocations = [];

        // Get all location elements
        const locationElements = document.querySelectorAll('.location');
        debugLog('Found ' + locationElements.length + ' location elements');
        
        if (locationElements.length === 0) {
            debugLog('ERROR: No elements with class "location" found');
            return;
        }

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
        debugLog('Categories found: ' + Array.from(categories).join(', '));
        
        // Create filter controls
        const filterControls = document.createElement('div');
        filterControls.className = 'map-filter-controls';
        filterControls.style = 'display:flex; gap:1rem; margin-bottom:1rem; flex-wrap:wrap;';
        
        // Build category options
        let categoryOptions = '<option value="all">All Categories</option>';
        categories.forEach(category => {
            if (category !== 'all') {
                const categoryName = category.replace(/-/g, ' ');
                categoryOptions += `<option value="${category}">${categoryName}</option>`;
            }
        });
        
        filterControls.innerHTML = `
            <select id="category-filter" style="padding:0.5rem; border:1px solid #ddd; border-radius:4px; font-size:0.9rem;">
                ${categoryOptions}
            </select>
            <input type="text" id="search-locations" placeholder="Search organizations..." style="padding:0.5rem; border:1px solid #ddd; border-radius:4px; font-size:0.9rem;">
        `;
        
        // Insert filter controls before the map
        const mapContainer = document.getElementById('map').parentNode;
        mapContainer.insertBefore(filterControls, document.getElementById('map'));
        debugLog('Filter controls added to page');
        
        // Create pagination container
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'locations-pagination';
        paginationContainer.style = 'display:flex; justify-content:center; margin-top:20px; gap:8px;';
        document.querySelector('.locations-list').parentNode.appendChild(paginationContainer);
        debugLog('Pagination container added to page');
        
        // Function to update pagination
        function updatePagination() {
            // Get visible locations
            visibleLocations = Array.from(locationElements).filter(locationEl => 
                !locationEl.classList.contains('hidden')
            );
            
            debugLog('Visible locations after filtering: ' + visibleLocations.length);
            
            // Calculate total pages
            const totalPages = Math.ceil(visibleLocations.length / itemsPerPage);
            debugLog('Total pages: ' + totalPages);
            
            // Update pagination buttons
            paginationContainer.innerHTML = '';
            
            for (let i = 1; i <= totalPages; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.className = `pagination-btn`;
                pageBtn.style = 'padding:8px 12px; background:#f0f0f0; border:1px solid #ddd; border-radius:4px; cursor:pointer;';
                if (i === currentPage) {
                    pageBtn.style.background = '#00074F';
                    pageBtn.style.color = 'white';
                    pageBtn.style.borderColor = '#00074F';
                }
                pageBtn.textContent = i;
                pageBtn.addEventListener('click', () => {
                    debugLog('Page button clicked: ' + i);
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
                    debugLog('Adding page-hidden to location: ' + locationEl.getAttribute('name'));
                }
            });
            
            debugLog('Updated visible items for page ' + currentPage + ' (showing ' + 
                    Math.min(itemsPerPage, visibleLocations.length - startIndex) + ' items)');
        }
        
        // Loop through each location element
        locationElements.forEach((locationEl, index) => {
            debugLog('Processing location element #' + index);
            
            // Extract data from the element
            const geo = locationEl.getAttribute('geo');
            if (!geo) {
                debugLog('ERROR: No geo attribute found for element #' + index);
                return;
            }
            
            const name = locationEl.getAttribute('name');
            if (!name) {
                debugLog('ERROR: No name attribute found for element #' + index);
                return;
            }
            
            const category = locationEl.classList[1] || '';
            debugLog('Element #' + index + ' category: ' + category);
            
            // Parse coordinates
            const coords = geo.split(',');
            if (coords.length !== 2) {
                debugLog('ERROR: Invalid geo format for element #' + index);
                return;
            }
            
            const lat = parseFloat(coords[0].trim());
            const lng = parseFloat(coords[1].trim());
            
            if (isNaN(lat) || isNaN(lng)) {
                debugLog('ERROR: Invalid coordinates for element #' + index + ': ' + lat + ', ' + lng);
                return;
            }
            
            // Create marker
            const marker = L.marker([lat, lng]).addTo(map);
            debugLog('Marker created for element #' + index);
            
            // Create simple popup content
            const popupContent = `<div><strong>${name}</strong></div>`;
            marker.bindPopup(popupContent);
            debugLog('Popup bound to marker for element #' + index);
            
            // Store marker for later reference - use the exact name from the attribute
            markers[name] = {marker, element: locationEl, category};
            debugLog('Marker stored for: ' + name);
            
            // Make location elements clickable to open corresponding popup and scroll to map
            locationEl.addEventListener('click', function() {
                map.setView([lat, lng], 13);
                marker.openPopup();
                setTimeout(scrollToMap, 100);
            });
        });
        
        // Add filtering functionality
        const categoryFilter = document.getElementById('category-filter');
        const searchInput = document.getElementById('search-locations');
        
        debugLog('Category filter element: ' + (categoryFilter ? 'found' : 'not found'));
        debugLog('Search input element: ' + (searchInput ? 'found' : 'not found'));
        
        function filterLocations() {
            const categoryValue = categoryFilter.value;
            const searchValue = searchInput.value.toLowerCase();
            
            debugLog('Filtering - Category: ' + categoryValue + ', Search: ' + searchValue);
            
            currentCategory = categoryValue;
            currentPage = 1; // Reset to first page when filtering
            
            // First, reset all locations and markers
            locationElements.forEach(locationEl => {
                locationEl.classList.remove('hidden');
                debugLog('Removing hidden class from: ' + locationEl.getAttribute('name'));
            });
            
            Object.values(markers).forEach(({marker}) => {
                map.addLayer(marker);
            });
            
            // If "all" is selected and no search term, show everything
            if (categoryValue === 'all' && !searchValue) {
                debugLog('Showing all locations (no filters applied)');
                updatePagination();
                return;
            }
            
            // Filter locations and markers based on criteria
            locationElements.forEach(locationEl => {
                const name = locationEl.getAttribute('name');
                const nameLower = name.toLowerCase();
                
                // Safely get description text (handle case where element doesn't exist)
                const descriptionElement = locationEl.querySelector('.location-description');
                const description = descriptionElement ? descriptionElement.textContent.toLowerCase() : '';
                
                // Safely get address text (handle case where element doesn't exist)
                const addressElement = locationEl.querySelector('.location-address');
                const address = addressElement ? addressElement.textContent.toLowerCase() : '';
                
                // Get the marker for this location - use the exact name from the attribute
                const markerInfo = markers[name];
                if (!markerInfo) {
                    debugLog('WARNING: No marker info found for: ' + name);
                    debugLog('Available markers: ' + Object.keys(markers).join(', '));
                    return;
                }
                
                // Extract base category for matching
                const baseCategory = markerInfo.category.split('-')[0];
                
                // Check if category matches (or if "all" is selected)
                const categoryMatch = categoryValue === 'all' || baseCategory === categoryValue;
                const searchMatch = !searchValue || nameLower.includes(searchValue) || 
                                  description.includes(searchValue) || 
                                  address.includes(searchValue);
                
                debugLog('Checking: ' + name + ' - Category match: ' + categoryMatch + ', Search match: ' + searchMatch);
                
                if (categoryMatch && searchMatch) {
                    // Show this location and marker
                    locationEl.classList.remove('hidden');
                    map.addLayer(markerInfo.marker);
                    debugLog('Showing: ' + name);
                } else {
                    // Hide this location and marker
                    locationEl.classList.add('hidden');
                    map.removeLayer(markerInfo.marker);
                    debugLog('Hiding: ' + name);
                }
            });
            
            debugLog('Finished applying filters');
            // Update pagination after filtering
            updatePagination();
        }
        
        // Add event listeners with debug logging
        categoryFilter.addEventListener('change', function() {
            debugLog('Category filter changed to: ' + this.value);
            filterLocations();
        });
        
        searchInput.addEventListener('input', function() {
            debugLog('Search input changed to: ' + this.value);
            filterLocations();
        });
        
        debugLog('Event listeners attached to filter controls');
        
        // Initialize pagination
        updatePagination();
    };
    
    leafletJs.onerror = function() {
        debugLog('ERROR: Failed to load Leaflet library');
    };
    
    document.head.appendChild(leafletJs);
}