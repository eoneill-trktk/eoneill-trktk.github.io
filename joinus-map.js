if (window.location.pathname.includes('community-employer-partners')) {
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
    if (!document.head) {
        console.error('Document head is not available');
        return;
    }
    const leafletCss = document.createElement('link');
    leafletCss.rel = 'stylesheet';
    leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(leafletCss);
    const slickCSS = document.createElement('link');
    slickCSS.rel = 'stylesheet';
    slickCSS.href = 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css';
    document.head.appendChild(slickCSS);
    const styleTag = document.createElement('style');
    styleTag.textContent = `
        #map {
            width: 100%;
            height: 60vh; 
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
        .leaflet-popup-content::-webkit-scrollbar {
            width: 6px;
        }
        .leaflet-popup-content::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        .leaflet-popup-content::-webkit-scrollbar-thumb {
            background: #888;
        }
        .map-filter-controls {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
        }
        .map-filter-controls select {
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
    const leafletJs = document.createElement('script');
    leafletJs.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    leafletJs.onload = function() {
        const map = L.map('map').setView([42.4072, -71.3824], 8);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        const markers = {};
        let currentPage = 1;
        let itemsPerPage = 25;
        let currentCategory = 'all';
        let visibleLocations = [];
        const locationElements = document.querySelectorAll('.location');
        const categories = new Set(['all']);
        locationElements.forEach(locationEl => {
            const category = locationEl.classList[1] || '';
            if (category) {
                const baseCategory = category.split('-')[0];
                categories.add(baseCategory);
            }
        });
        const filterControls = document.createElement('div');
        filterControls.className = 'map-filter-controls';
        const categoryList = Array.from(categories).filter(c => c !== 'all').map(category => {
            const categoryName = category.replace(/-/g, ' ');
            let label = categoryName;
            if (categoryName === 'Colleges') label = 'Colleges and Universities';
            else if (categoryName === 'Business') label = 'Business Network';
            else if (categoryName === 'Human') label = 'Human Service Agencies';
            else if (categoryName === 'Massachusetts') label = 'Massachusetts and RI State Agencies';
            else if (categoryName === 'MassHire') label = 'MassHire Career Centers';
            else if (categoryName === 'Regional') label = 'Regional Employment Collaboratives';
            else if (categoryName === 'Youth') label = 'Youth and Young Adults';
            return { value: category, label };
        }).sort((a, b) => a.label.localeCompare(b.label));
        let categoryOptions = '<option value="all">All Categories</option>';
        categoryList.forEach(({ value, label }) => {
            categoryOptions += `<option value="${value}">${label}</option>`;
        });
        filterControls.innerHTML = `
            <select id="category-filter">
                ${categoryOptions}
            </select>
        `;
        const mapContainer = document.getElementById('map').parentNode;
        mapContainer.insertBefore(filterControls, document.getElementById('map'));
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'locations-pagination';
        document.querySelector('.locations-list').parentNode.appendChild(paginationContainer);
        function updatePagination() {
            visibleLocations = Array.from(locationElements).filter(locationEl => 
                !locationEl.classList.contains('hidden')
            );
            const totalPages = Math.ceil(visibleLocations.length / itemsPerPage);
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
            updateVisibleItems();
        }
        function updateVisibleItems() {
            locationElements.forEach(locationEl => {
                locationEl.classList.remove('page-hidden');
            });
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            visibleLocations.forEach((locationEl, index) => {
                if (index < startIndex || index >= endIndex) {
                    locationEl.classList.add('page-hidden');
                }
            });
        }
        function formatContactInfo(text) {
            if (!text) return text;
            return text
                .replace(/\bContact:\s*/g, '<br><strong>Contact:</strong> ')
                .replace(/\bEmail:\s*/g, '<br><strong>Email:</strong> ')
                .replace(/\bPhone:\s*/g, '<br><strong>Phone:</strong> ');
        }
        locationElements.forEach(locationEl => {
            const geo = locationEl.getAttribute('geo');
            const name = locationEl.getAttribute('name');
            const category = locationEl.classList[1] || '';
            let iconUrl = '/siteassets/markers/marker_gray.png';
            if (category.startsWith('Colleges')) iconUrl = '/siteassets/markers/marker_green.png';
            else if (category.startsWith('Human')) iconUrl = '/siteassets/markers/marker_orange.png';
            else if (category.startsWith('Business')) iconUrl = '/siteassets/markers/marker_purple.png';
            else if (category.startsWith('Massachusetts')) iconUrl = '/siteassets/markers/marker_blue.png';
            else if (category.startsWith('MassHire')) iconUrl = '/siteassets/markers/marker_gray.png';
            else if (category.startsWith('Regional')) iconUrl = '/siteassets/markers/marker_pink.png';
            else if (category.startsWith('Youth')) iconUrl = '/siteassets/markers/marker_red.png';
            const customIcon = L.icon({
                iconUrl: iconUrl,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34]
            });
            const imgElement = locationEl.querySelector('.location-image img');
            const image = imgElement ? imgElement.src : '';
            const descriptionElement = locationEl.querySelector('.location-description');
            const description = descriptionElement ? descriptionElement.textContent.trim() : '';
            const addressElement = locationEl.querySelector('.location-address');
            const address = addressElement ? addressElement.textContent.trim() : '';
            const contactInfoElement = locationEl.querySelector('.location-contact');
            let contactInfo = contactInfoElement ? contactInfoElement.innerHTML.trim() : '';
            contactInfo = formatContactInfo(contactInfo);
            const [lat, lng] = geo.split(',').map(coord => parseFloat(coord.trim()));
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
            if (contactInfo) {
                popupContent += `<div class="contact-info">${contactInfo}</div>`;
            }
            popupContent += `</div>`;
            const marker = L.marker([lat, lng], {icon: customIcon}).addTo(map);
            marker.bindPopup(popupContent);
            markers[name] = {marker, element: locationEl, category};
            marker._icon.setAttribute('geo', geo);
            marker._icon.setAttribute('name', name);
            marker.on('popupopen', function() {
                const popup = marker.getPopup();
                const popupElement = popup.getElement();
                if (popupElement) {
                    popupElement.setAttribute('geo', geo);
                    popupElement.setAttribute('name', name);
                }
            });
            locationEl.addEventListener('click', function() {
                map.setView([lat, lng], 13);
                marker.openPopup();
                setTimeout(scrollToMap, 100);
            });
        });
        const categoryFilter = document.getElementById('category-filter');
        function filterLocations() {
            const categoryValue = categoryFilter.value;
            currentCategory = categoryValue;
            currentPage = 1;
            locationElements.forEach(locationEl => {
                locationEl.classList.remove('hidden');
            });
            Object.values(markers).forEach(({marker}) => {
                map.addLayer(marker);
            });
            if (categoryValue === 'all') {
                updatePagination();
                return;
            }
            locationElements.forEach(locationEl => {
                const name = locationEl.getAttribute('name');
                const markerInfo = markers[name];
                if (!markerInfo) return;
                const baseCategory = markerInfo.category.split('-')[0];
                const categoryMatch = categoryValue === 'all' || baseCategory === categoryValue;
                if (categoryMatch) {
                    locationEl.classList.remove('hidden');
                    map.addLayer(markerInfo.marker);
                } else {
                    locationEl.classList.add('hidden');
                    map.removeLayer(markerInfo.marker);
                }
            });
            updatePagination();
        }
        categoryFilter.addEventListener('change', filterLocations);
        updatePagination();
    };
    leafletJs.onerror = function() {
        console.error('Failed to load Leaflet library');
    };
    document.head.appendChild(leafletJs);
    (function() {
      function sortLocations() {
        const container = document.querySelector('.medialistingblock.medialisttest');
        if (!container) return;
        const locations = Array.from(container.querySelectorAll(':scope > .location'));
        locations.sort((a, b) => {
          const nameA = (a.getAttribute('name') || '').toLowerCase();
          const nameB = (b.getAttribute('name') || '').toLowerCase();
          return nameA.localeCompare(nameB);
        });
        locations.forEach(el => container.appendChild(el));
      }
      const observer = new MutationObserver(() => {
        const container = document.querySelector('.medialistingblock.medialisttest');
        if (container) {
          observer.disconnect();
          sortLocations();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      if (document.readyState !== 'loading') sortLocations();
      else document.addEventListener('DOMContentLoaded', sortLocations);
    })();
}
