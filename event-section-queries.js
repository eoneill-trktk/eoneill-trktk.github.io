(function () {
    var _initialized = false;
    var CARDS_PER_PAGE = 12;
    var currentPage = 1;

    const initResourceFilter = () => {
        if (_initialized) return;
        _initialized = true;

        var path = window.location.pathname;

        var params = new URLSearchParams(location.search);
        var qd = {};
        params.forEach(function(v, k) {
            (qd[k] = qd[k] || []).push(v);
        });

        var form        = document.getElementById('resource-filter-form');
        var pageContext = form ? form.dataset.pageContext  : 'resources';
        var topicSlug   = form ? form.dataset.topicSlug   : '';
        var currentYear = form ? parseInt(form.dataset.currentYear) : new Date().getFullYear();
        var priorYear   = currentYear - 1;
        var archiveMaxYear = currentYear - 2;

        // startDate redirect — preserves all meaningful params so back/bookmark navigation works
        if (!qd.startDate || qd.startDate[0] === '') {
            var redirectUrl = path + '?viewType=list&startDate=2020-01-01';
            if (qd.searchTerm    && qd.searchTerm[0]    && qd.searchTerm[0]    !== '') redirectUrl += '&searchTerm='    + encodeURIComponent(qd.searchTerm[0]);
            if (qd.year          && qd.year[0]          && qd.year[0]          !== '') redirectUrl += '&year='          + encodeURIComponent(qd.year[0]);
            if (qd.categoryFilter && qd.categoryFilter[0] && qd.categoryFilter[0] !== '') redirectUrl += '&categoryFilter=' + encodeURIComponent(qd.categoryFilter[0]);
            window.location.replace(redirectUrl);
            return;
        }

        // Read page from URL on load
        if (qd.page && qd.page[0]) {
            var parsed = parseInt(qd.page[0]);
            if (!isNaN(parsed) && parsed > 0) currentPage = parsed;
        }

        var catSelect   = document.getElementById('category-filter');
        var yearSelect  = document.getElementById('year-filter');
        var searchInput = document.getElementById('search-filter');

        // Restore form state from URL params
        if (qd.searchTerm && qd.searchTerm[0] && qd.searchTerm[0] !== '') {
            if (searchInput) searchInput.value = qd.searchTerm[0];
        }

        if ((pageContext === 'topics' || pageContext === 'category') && topicSlug !== '') {
            if (catSelect) {
                var opts = catSelect.querySelectorAll('option[data-slug]');
                var matched = false;
                for (var i = 0; i < opts.length; i++) {
                    if (opts[i].dataset.slug === topicSlug) {
                        catSelect.value = opts[i].value;
                        matched = true;
                        break;
                    }
                }
                if (!matched) {
                    var singularSlug = topicSlug.replace(/s$/, '');
                    for (var i = 0; i < opts.length; i++) {
                        if (opts[i].dataset.slug === singularSlug) {
                            catSelect.value = opts[i].value;
                            break;
                        }
                    }
                }
            }
        }

        if (qd.categoryFilter && qd.categoryFilter[0] && qd.categoryFilter[0] !== '') {
            if (catSelect) catSelect.value = qd.categoryFilter[0];
        }

        var activeYear = '';
        if (qd.year && qd.year[0] && qd.year[0] !== '') {
            activeYear = qd.year[0];
            if (yearSelect) yearSelect.value = activeYear;
        }

        var searchTermFromUrl = (qd.searchTerm && qd.searchTerm[0]) ? qd.searchTerm[0] : '';

        // ── Clear All visibility on load ────────────────────────────────────────
        var hasFilters;
        if (pageContext === 'category' || pageContext === 'topics') {
            var initSlug = catSelect && catSelect.selectedIndex >= 0
                ? (catSelect.options[catSelect.selectedIndex].getAttribute('data-slug') || '')
                : '';
            hasFilters = (searchTermFromUrl !== '') ||
                         (initSlug !== '' && initSlug !== topicSlug) ||
                         (activeYear !== '');
        } else {
            hasFilters = (searchTermFromUrl !== '') ||
                         (catSelect && catSelect.value !== '') ||
                         (activeYear !== '');
        }
        var clearBtn = document.getElementById('clear-filters');
        if (clearBtn && hasFilters) clearBtn.style.display = '';

        ensurePaginationContainer();
        applyFilters();
        revealGrid();
        cleanUrl();

        // ── Submit handler — always navigates with URL params ───────────────────
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();

                var selectedOpt = catSelect ? catSelect.options[catSelect.selectedIndex] : null;
                var slug   = selectedOpt ? (selectedOpt.getAttribute('data-slug') || '') : '';
                var catVal = catSelect ? catSelect.value : '';
                var yearVal   = yearSelect  ? yearSelect.value        : '';
                var searchVal = searchInput ? searchInput.value.trim() : '';

                // Base params that bypass the startDate redirect on the destination page
                var destParams = ['viewType=list', 'startDate=2020-01-01'];
                if (yearVal)   destParams.push('year='       + encodeURIComponent(yearVal));
                if (searchVal) destParams.push('searchTerm=' + encodeURIComponent(searchVal));

                // news / category: category dropdown drives navigation to category URL
                if (pageContext === 'news' || pageContext === 'category') {
                    if (slug && slug !== topicSlug) {
                        // Different category selected — go to that category's page
                        window.location.href = '/category/' + slug + '/?' + destParams.join('&');
                        return;
                    }
                    if (!slug && pageContext === 'category') {
                        // "All MTF News" selected on a category page — back to news landing
                        window.location.replace('/all-mtf-news/?' + destParams.join('&'));
                        return;
                    }
                    // Same category (or no category change on news landing): reload with params
                    window.location.href = path + '?' + destParams.join('&');
                    return;
                }

                // All other contexts (topics, resources, archives):
                // reload current page with params so state is in the URL
                if (catVal) destParams.push('categoryFilter=' + encodeURIComponent(catVal));
                window.location.href = path + '?' + destParams.join('&');
            });
        }

        // ── Change listeners removed — Filter/Enter required everywhere ─────────

        // ── Clear All ───────────────────────────────────────────────────────────
        var clearBtn2 = document.getElementById('clear-filters');
        if (clearBtn2) {
            clearBtn2.addEventListener('click', function (e) {
                e.preventDefault();
                if (pageContext === 'category') {
                    window.location.replace('/all-mtf-news/?viewType=list&startDate=2020-01-01');
                } else {
                    window.location.replace(path + '?viewType=list&startDate=2020-01-01');
                }
            });
        }

        function revealGrid() {
            var grid = document.getElementById('resource-grid-container');
            if (grid) grid.classList.add('js-ready');
        }

        function cleanUrl() {
            if (!window.history || !window.history.replaceState) return;
            var urlParams = new URLSearchParams(window.location.search);
            urlParams.delete('viewType');
            urlParams.delete('startDate');
            if (currentPage <= 1) urlParams.delete('page');
            var clean = window.location.pathname;
            if (urlParams.toString()) clean += '?' + urlParams.toString();
            window.history.replaceState({}, '', clean);
        }

        setTimeout(function () { revealGrid(); }, 1000);

        function applyFilters() {
            var selectedCat  = catSelect  ? catSelect.value  : '';
            var selectedYear = yearSelect ? yearSelect.value : '';
            var searchTerm   = searchInput ? searchInput.value.trim().toLowerCase() : '';
            var cards = document.querySelectorAll('.resource-card');

            cards.forEach(function (card) {
                var catMatch    = true;
                var yearMatch   = true;
                var searchMatch = true;
                var cardYear    = parseInt(card.dataset.year) || 0;

                if (selectedCat !== '') {
                    var ids = (card.dataset.categoryIds || '').split(',');
                    catMatch = ids.indexOf(selectedCat) !== -1;
                }

                if (selectedYear !== '') {
                    yearMatch = card.dataset.year === selectedYear;
                } else {
                    if (pageContext === 'archives') {
                        yearMatch = cardYear <= archiveMaxYear;
                    } else if (pageContext === 'topics') {
                        yearMatch = true;
                    } else {
                        yearMatch = (cardYear === currentYear || cardYear === priorYear);
                    }
                }

                if (searchTerm !== '') {
                    var title   = (card.dataset.title   || '').toLowerCase();
                    var excerpt = (card.dataset.excerpt || '').toLowerCase();
                    searchMatch = title.includes(searchTerm) || excerpt.includes(searchTerm);
                }

                card.dataset.filterVisible = (catMatch && yearMatch && searchMatch) ? 'true' : 'false';
            });

            var grid = document.getElementById('resource-grid-container');
            if (grid) {
                var allCards = Array.prototype.slice.call(grid.querySelectorAll('.resource-card'));
                allCards.sort(function (a, b) {
                    var da = a.dataset.date || '';
                    var db = b.dataset.date || '';
                    return db.localeCompare(da);
                });
                allCards.forEach(function (card) { grid.appendChild(card); });
            }

            // ── Clear All visibility after filter runs ──────────────────────────
            var btn = document.getElementById('clear-filters');
            if (btn) {
                var currentSearch = searchInput ? searchInput.value.trim() : '';
                var showClear;
                if (pageContext === 'category' || pageContext === 'topics') {
                    var currentSlug = catSelect && catSelect.selectedIndex >= 0
                        ? (catSelect.options[catSelect.selectedIndex].getAttribute('data-slug') || '')
                        : '';
                    showClear = currentSearch !== '' ||
                                (currentSlug !== '' && currentSlug !== topicSlug) ||
                                selectedYear !== '';
                } else {
                    showClear = selectedCat !== '' || selectedYear !== '' || currentSearch !== '';
                }
                btn.style.display = showClear ? '' : 'none';
            }

            renderPage();
        }

        function ensurePaginationContainer() {
            if (document.getElementById('mtf-pagination')) return;
            var nav = document.createElement('nav');
            nav.id = 'mtf-pagination';
            nav.className = 'pagination';
            var noResults = document.getElementById('no-results-message');
            var grid      = document.getElementById('resource-grid-container');
            if (noResults && noResults.parentNode) {
                noResults.parentNode.insertBefore(nav, noResults.nextSibling);
            } else if (grid && grid.parentNode) {
                grid.parentNode.insertBefore(nav, grid.nextSibling);
            }
        }

        function pushPageToUrl(p) {
            if (!window.history || !window.history.pushState) return;
            var newUrl = window.location.pathname;
            if (p > 1) newUrl += '?page=' + p;
            window.history.pushState({ page: p }, '', newUrl);
        }

        function renderPage() {
            var allCards     = Array.prototype.slice.call(document.querySelectorAll('.resource-card'));
            var visibleCards = allCards.filter(function (c) { return c.dataset.filterVisible === 'true'; });
            var totalVisible = visibleCards.length;
            var totalPages   = Math.max(1, Math.ceil(totalVisible / CARDS_PER_PAGE));

            if (currentPage > totalPages) currentPage = 1;

            var startIdx = (currentPage - 1) * CARDS_PER_PAGE;
            var endIdx   = startIdx + CARDS_PER_PAGE;

            allCards.forEach(function (card) { card.style.display = 'none'; });
            visibleCards.forEach(function (card, i) {
                card.style.display = (i >= startIdx && i < endIdx) ? '' : 'none';
            });

            var noResults = document.getElementById('no-results-message');
            if (noResults) noResults.style.display = totalVisible === 0 ? '' : 'none';

            renderPaginationNav(totalPages, totalVisible);
        }

        function renderPaginationNav(totalPages, totalVisible) {
            var nav = document.getElementById('mtf-pagination');
            if (!nav) return;

            if (totalPages <= 1) {
                nav.innerHTML = '';
                return;
            }

            var html = '';

            if (currentPage > 1) {
                html += '<a class="prev page-numbers" href="#" data-page="' + (currentPage - 1) + '">« Previous</a>';
            }

            for (var p = 1; p <= totalPages; p++) {
                if (p === currentPage) {
                    html += '<span aria-current="page" class="page-numbers current">' + p + '</span>';
                } else {
                    html += '<a class="page-numbers" href="#" data-page="' + p + '">' + p + '</a>';
                }
            }

            if (currentPage < totalPages) {
                html += '<a class="next page-numbers" href="#" data-page="' + (currentPage + 1) + '">Next »</a>';
            }

            nav.innerHTML = html;

            nav.querySelectorAll('a[data-page]').forEach(function (link) {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    currentPage = parseInt(this.dataset.page);
                    pushPageToUrl(currentPage);
                    renderPage();
                    var section = document.getElementById('resourcesection');
                    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
            });
        }

        // Handle browser back/forward
        window.addEventListener('popstate', function (e) {
            var p = (e.state && e.state.page) ? e.state.page : 1;
            currentPage = p;
            renderPage();
        });
    };

    if (document.readyState === "complete" || document.readyState === "interactive") {
        initResourceFilter();
    } else {
        window.addEventListener("DOMContentLoaded", initResourceFilter);
    }

})();

function opencategorylist(thischild, ele) {
    if (!thischild) return;
    if (thischild.classList.contains("closed")) {
        thischild.classList.remove("closed");
        thischild.classList.add("opened");
        ele.classList.remove("fa-plus");
        ele.classList.add("fa-minus");
    } else {
        thischild.classList.remove("opened");
        thischild.classList.add("closed");
        ele.classList.add("fa-plus");
        ele.classList.remove("fa-minus");
    }
}