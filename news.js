(function() {
    function initNewsPage() {
        const gridWrapper = document.querySelector('.gb-grid-wrapper');
        const gridItems = document.querySelectorAll('.gb-grid-column.gb-query-loop-item');
        const itemsPerPage = 9;
        let currentPage = 1;
        
        if (!gridWrapper || gridItems.length === 0) {
            return;
        }

        const style = document.createElement('style');
        style.textContent = `
            .gb-grid-wrapper {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 20px;
                width: 100%;
            }
            
            .gb-grid-column {
                break-inside: avoid;
            }
            
            .gb-headline-news-grid-title a {
                font-size: 20px !important;
                text-decoration: none;
                color: inherit;
            }
            
            .gb-headline-news-grid-title a:hover {
                color: #0071ce;
            }
            
            .post-term-item {
                background-color: #f0f0f0;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                text-transform: uppercase;
            }
            
            /* Pagination Styles */
            .news-pagination {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 10px;
                margin: 40px 0;
                padding: 20px 0;
            }
            
            .pagination-btn {
                padding: 10px 16px;
                border: 2px solid #333872;
                background: #333872;
                color: white;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                transition: all 0.3s ease;
                min-width: 44px;
                text-align: center;
            }
            
            .pagination-btn:hover:not(:disabled) {
                background: #0071ce;
                border-color: #0071ce;
            }
            
            .pagination-btn:disabled {
                background: #cccccc;
                border-color: #cccccc;
                cursor: not-allowed;
                opacity: 0.6;
            }
            
            .pagination-info {
                font-size: 14px;
                color: #666;
                margin: 0 15px;
            }
            
            .gb-grid-column.hidden {
                display: none !important;
            }
        `;
        document.head.appendChild(style);

        function createPagination() {
            const totalPages = Math.ceil(gridItems.length / itemsPerPage);
            
            const existingPagination = document.querySelector('.news-pagination');
            if (existingPagination) {
                existingPagination.remove();
            }

            if (totalPages <= 1) {
                return; 
            }

            const paginationContainer = document.createElement('div');
            paginationContainer.className = 'news-pagination';

            const prevButton = document.createElement('button');
            prevButton.className = 'pagination-btn';
            prevButton.innerHTML = '&larr;';
            prevButton.disabled = currentPage === 1;
            prevButton.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    showPage(currentPage);
                }
            });

            const pageInfo = document.createElement('span');
            pageInfo.className = 'pagination-info';
            pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

            const nextButton = document.createElement('button');
            nextButton.className = 'pagination-btn';
            nextButton.innerHTML = '&rarr;';
            nextButton.disabled = currentPage === totalPages;
            nextButton.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    showPage(currentPage);
                }
            });

            paginationContainer.appendChild(prevButton);
            paginationContainer.appendChild(pageInfo);
            paginationContainer.appendChild(nextButton);

            gridWrapper.parentNode.insertBefore(paginationContainer, gridWrapper.nextSibling);
        }

        function showPage(page) {
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;

            gridItems.forEach((item, index) => {
                if (index >= startIndex && index < endIndex) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });

            createPagination();
        }

        showPage(currentPage);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNewsPage);
    } else {
        initNewsPage();
    }
})();