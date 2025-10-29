(function() {
    function initFilter() {
        const dropdown = document.querySelector('.facetwp-dropdown');
        const gridItems = document.querySelectorAll('.gb-grid-column.gb-query-loop-item');
        
        if (!dropdown || gridItems.length === 0) {
            console.log('Waiting for filter elements to load...');
            setTimeout(initFilter, 100);
            return;
        }

        const style = document.createElement('style');
        style.textContent = `
            .gb-grid-column.hidden {
                display: none;
            }
            .facetwp-dropdown {
                padding: 8px 12px;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-size: 16px;
                background-color: white;
                cursor: pointer;
            }
            .facetwp-dropdown:focus {
                outline: none;
                border-color: #0071ce;
                box-shadow: 0 0 0 2px rgba(0, 113, 206, 0.2);
            }
        `;
        document.head.appendChild(style);

        function filterItems(category) {
            gridItems.forEach(item => {
                if (category === '' || item.classList.contains(category)) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        }
        
        dropdown.addEventListener('change', function() {
            const category = this.value;
            filterItems(category);
        });
        
        // Initialize with all items visible
        filterItems('');
    }

    initFilter();
})();