(function() {
    function initFilter() {
        const filterButtons = document.querySelectorAll('.facetwp-radio');
        const gridItems = document.querySelectorAll('.gb-grid-column.gb-query-loop-item');
        
        if (filterButtons.length === 0 || gridItems.length === 0) {
            console.log('Waiting for filter elements to load...');
            setTimeout(initFilter, 100);
            return;
        }

        const style = document.createElement('style');
        style.textContent = `
            .facetwp-type-radio .facetwp-radio.checked {
                background-color: #0071ce;
            }
            .gb-grid-column.hidden {
                display: none;
            }
        `;
        document.head.appendChild(style);

        function filterItems(category, clickedButton) {
            filterButtons.forEach(btn => {
                btn.classList.remove('checked');
            });
            clickedButton.classList.add('checked');
            
            gridItems.forEach(item => {
                if (category === '' || item.classList.contains(category)) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        }
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const category = this.getAttribute('data-value');
                filterItems(category, this);
            });
        });
        
        const allButton = document.querySelector('.facetwp-radio[data-value=""]');
        if (allButton) {
            allButton.classList.add('checked');
        }
        
        console.log('Publication filter initialized! Click on category buttons to filter.');
    }

    initFilter();
})();