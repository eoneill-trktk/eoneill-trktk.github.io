(function() {
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

    const filterButtons = document.querySelectorAll('.facetwp-radio');
    const gridItems = document.querySelectorAll('.gb-grid-column.gb-query-loop-item');
    
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
        button.addEventListener('click', function(e) {
            const category = this.getAttribute('data-value');
            filterItems(category, this);
        });
    });
    
    const allButton = document.querySelector('.facetwp-radio[data-value=""]');
    if (allButton) {
        allButton.classList.add('checked');
    }
    
    console.log('Publication filter initialized! Click on category buttons to filter.');
})();