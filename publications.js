(function() {
    function initFilter() {
        const contentTypeButtons = document.querySelectorAll('.content-type-btn');
        const publicationsDropdown = document.querySelector('.publications-dropdown .facetwp-dropdown');
        const perspectivesDropdown = document.querySelector('.perspectives-dropdown .facetwp-dropdown');
        const gridItems = document.querySelectorAll('.gb-grid-column.gb-query-loop-item');
        
        if (contentTypeButtons.length === 0 || !publicationsDropdown || !perspectivesDropdown || gridItems.length === 0) {
            setTimeout(initFilter, 100);
            return;
        }

        const style = document.createElement('style');
        style.textContent = `
            .content-type-selector {
                margin-bottom: 20px;
            }
            .content-type-buttons {
                display: flex;
                gap: 10px;
                margin-bottom: 15px;
            }
            .content-type-btn {
                padding: 10px 20px;
                border: 2px solid #333872;
                background: #333872;
                color: #0071ce;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
                font-weight: 600;
                transition: all 0.3s ease;
            }
            .content-type-btn.active,
            .content-type-btn:hover {
                background: #0071ce;
                border: 2px solid #0071ce;
                color: white;
            }
            .facetwp-dropdown {
                padding: 10px 15px;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-size: 16px;
                background-color: white;
                cursor: pointer;
                min-width: 250px;
            }
            .facetwp-dropdown:focus {
                outline: none;
                border-color: #0071ce;
                box-shadow: 0 0 0 2px rgba(0, 113, 206, 0.2);
            }
            .publications-dropdown.hidden,
            .perspectives-dropdown.hidden {
                display: none;
            }
            .gb-grid-column.hidden {
                display: none;
            }
        `;
        document.head.appendChild(style);

        let currentContentType = 'publications';
        let currentFilter = '';

        function filterByContentType(contentType) {
            currentContentType = contentType;
            
            if (contentType === 'publications') {
                document.querySelector('.publications-dropdown').classList.remove('hidden');
                document.querySelector('.perspectives-dropdown').classList.add('hidden');
                publicationsDropdown.value = '';
                applyFilter('');
            } else {
                document.querySelector('.publications-dropdown').classList.add('hidden');
                document.querySelector('.perspectives-dropdown').classList.remove('hidden');
                perspectivesDropdown.value = 'perspectives';
                applyFilter('perspectives');
            }
            
            contentTypeButtons.forEach(btn => {
                if (btn.dataset.type === contentType) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }

        function applyFilter(filterValue) {
            currentFilter = filterValue;
            
            gridItems.forEach(item => {
                if (currentContentType === 'publications') {
                    if (filterValue === '' || item.classList.contains(filterValue)) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                } else {
                    if (item.classList.contains('perspectives')) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                }
            });
        }
        
        contentTypeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const contentType = this.dataset.type;
                filterByContentType(contentType);
            });
        });
        
        publicationsDropdown.addEventListener('change', function() {
            applyFilter(this.value);
        });
        
        perspectivesDropdown.addEventListener('change', function() {
            applyFilter('perspectives');
        });
        
        filterByContentType('publications');
    }

    initFilter();
})();