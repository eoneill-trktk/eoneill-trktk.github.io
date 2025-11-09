(function() {
    function initFilter() {
        const contentTypeButtons = document.querySelectorAll('.content-type-btn');
        const publicationsDropdown = document.querySelector('.publications-dropdown .facetwp-dropdown');
        const perspectivesDropdown = document.querySelector('.perspectives-dropdown .facetwp-dropdown');
        const gridItems = document.querySelectorAll('.gb-grid-column.gb-query-loop-item');
        
        if (contentTypeButtons.length === 0) {
            console.log('Content type buttons not found, retrying...');
            setTimeout(initFilter, 100);
            return;
        }

        // Add CSS styles
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
                color: white;
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
                display: none !important;
            }
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
        color: white;
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
        display: none !important;
    }
    /* Category pill styles */
    .gb-headline-eyebrow {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
    }
        .gb-headline.gb-headline-text.gb-headline-news-grid-title a{
        font-size:20px!important;
        }
    .post-term-item {
        font-size: 16px !important;
        border-radius: 16px !important;
        display: inline-block !important;
        margin-right: 4px;
        margin-bottom: 4px;
        font-weight: 600;
        line-height: 1.2;
    }
    .better-access-pill {
        background-color: #f36f16 !important;
        color: #00074f !important;
        padding: .25em .75em !important;
    }
    .better-knowledge-pill {
        background-color: #633092 !important;
        color: #fff !important;
        padding: .25em .75em !important;
    }
    .better-performance-pill {
        background-color: #3c8221 !important;
        color: #fff !important;
        padding: .25em .75em !important;
    }
    .default-pill {
        background-color: #ccc !important;
        color: #000 !important;
    }
    .perspectives-pill {
        background-color: #333872 !important;
        color: #fff !important;
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
                if (publicationsDropdown) publicationsDropdown.value = '';
                applyFilter('');
            } else {
                document.querySelector('.publications-dropdown').classList.add('hidden');
                document.querySelector('.perspectives-dropdown').classList.remove('hidden');
                if (perspectivesDropdown) perspectivesDropdown.value = '';
                applyFilter('');
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
                const isPerspectives = item.classList.contains('perspectives') || item.getAttribute('data-content-type') === 'perspectives';
                
                if (currentContentType === 'publications') {
                    if (filterValue === '' && !isPerspectives) {
                        item.classList.remove('hidden');
                    } else if (filterValue !== '' && item.classList.contains(filterValue) && !isPerspectives) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                } else {
                    if (isPerspectives) {
                        if (filterValue === '') {
                            item.classList.remove('hidden');
                        } else {
                            if (item.classList.contains(filterValue)) {
                                item.classList.remove('hidden');
                            } else {
                                item.classList.add('hidden');
                            }
                        }
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
        
        if (publicationsDropdown) {
            publicationsDropdown.addEventListener('change', function() {
                applyFilter(this.value);
            });
        }
        
        if (perspectivesDropdown) {
            perspectivesDropdown.addEventListener('change', function() {
                applyFilter(this.value);
            });
        }
        
        filterByContentType('publications');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFilter);
    } else {
        initFilter();
    }
})();