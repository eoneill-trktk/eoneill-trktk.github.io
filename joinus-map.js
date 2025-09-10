if (window.location.pathname.includes('/join-us/')) {
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
        
        // Check if map element exists
        const mapElement = document.getElementById('map');
        if (!mapElement) {
            debugLog('ERROR: No element with ID "map" found');
            return;
        }
        debugLog('Map element found');
        
        // Initialize the map
        const map = L.map('map').setView([42.4072, -71.3824], 8);
        debugLog('Map initialized');

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        debugLog('Tile layer added to map');

        // Get all location elements
        const locationElements = document.querySelectorAll('.location');
        debugLog('Found ' + locationElements.length + ' location elements');
        
        if (locationElements.length === 0) {
            debugLog('ERROR: No elements with class "location" found');
            return;
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
            debugLog('Element #' + index + ' geo attribute: ' + geo);
            
            const name = locationEl.getAttribute('name');
            if (!name) {
                debugLog('ERROR: No name attribute found for element #' + index);
                return;
            }
            debugLog('Element #' + index + ' name attribute: ' + name);
            
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
            debugLog('Element #' + index + ' coordinates: ' + lat + ', ' + lng);
            
            // Create marker with extracted data
            try {
                const marker = L.marker([lat, lng]).addTo(map);
                debugLog('Marker created for element #' + index);
                
                // Create simple popup content
                const popupContent = `<div><strong>${name}</strong></div>`;
                marker.bindPopup(popupContent);
                debugLog('Popup bound to marker for element #' + index);
                
                // Add geo and name attributes to the marker icon
                marker._icon.setAttribute('geo', geo);
                marker._icon.setAttribute('name', name);
                debugLog('Attributes added to marker for element #' + index);
                
            } catch (e) {
                debugLog('ERROR: Failed to create marker for element #' + index + ': ' + e.message);
            }
        });
        
        debugLog('Finished processing all location elements');
    };
    
    leafletJs.onerror = function() {
        debugLog('ERROR: Failed to load Leaflet library');
    };
    
    document.head.appendChild(leafletJs);
}
