(function () {
    var _initialized = false;
    var CARDS_PER_PAGE = 12;
    var currentPage = 1;

    const initResourceFilter = () => {
        if (_initialized) return;
        _initialized = true;

        var path = window.location.href.split('?')[0];

        var qd = {};
        if (location.search) {
            location.search.substr(1).split("&").forEach(function (item) {
                var s = item.split("="),
                    k = s[0],
                    v = s[1] && decodeURIComponent(s[1]);
                (qd[k] = qd[k] || []).push(v);
            });
        }

        var form        = document.getElementById('resource-filter-form');
        var pageContext = form ? form.dataset.pageContext  : 'resources';
        var topicSlug   = form ? form.dataset.topicSlug   : '';
        var currentYear = form ? parseInt(form.dataset.currentYear) : new Date().getFullYear();
        var priorYear   = currentYear - 1;
        var archiveMaxYear = currentYear - 2;

        if (!qd.startDate || qd.startDate[0] === '') {
            var redirectUrl = path + '?viewType=list&startDate=2020-01-01';
            if (qd.searchTerm && qd.searchTerm[0] && qd.searchTerm[0] !== '') {
                redirectUrl += '&searchTerm=' + encodeURIComponent(qd.searchTerm[0]);
            }
            window.location.replace(redirectUrl);
            return;
        }

        var catSelect  = document.getElementById('category-filter');
        var yearSelect = document.getElementById('year-filter');

        if (qd.searchTerm && qd.searchTerm[0] && qd.searchTerm[0] !== '') {
            var searchInput = document.getElementById('search-filter');
            if (searchInput) searchInput.value = qd.searchTerm[0];
        }

        if ((pageContext === 'topics' || pageContext === 'category') && topicSlug !== '') {
            if (catSelect) {
                var opts = catSelect.querySelectorAll('option[data-slug]');
                for (var i = 0; i < opts.length; i++) {
                    if (opts[i].dataset.slug === topicSlug) {
                        catSelect.value = opts[i].value;
                        break;
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

        var hasFilters = (qd.searchTerm && qd.searchTerm[0] !== '') ||
                         (catSelect && catSelect.value !== '') ||
                         (activeYear !== '');
        var clearBtn = document.getElementById('clear-filters');
        if (clearBtn && hasFilters) clearBtn.style.display = '';

        ensurePaginationContainer();

        applyFilters();
        revealGrid();
        cleanUrl();

        if (catSelect)  catSelect.addEventListener('change',  function () { applyFilters(); });
        if (yearSelect) yearSelect.addEventListener('change', function () { applyFilters(); });

        var clearBtn2 = document.getElementById('clear-filters');
        if (clearBtn2) {
            clearBtn2.addEventListener('click', function (e) {
                e.preventDefault();
                if (catSelect)  catSelect.value = '';
                if (yearSelect) yearSelect.value = '';
                applyFilters();
                var searchInput = document.getElementById('search-filter');
                if (searchInput && searchInput.value !== '') {
                    searchInput.value = '';
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
            var params = new URLSearchParams(window.location.search);
            params.delete('viewType');
            params.delete('startDate');
            var clean = window.location.pathname;
            if (params.toString()) clean += '?' + params.toString();
            window.history.replaceState({}, '', clean);
        }

        setTimeout(function () { revealGrid(); }, 1000);

        function applyFilters() {
            var selectedCat  = catSelect  ? catSelect.value  : '';
            var selectedYear = yearSelect ? yearSelect.value : '';
            var cards = document.querySelectorAll('.resource-card');

            cards.forEach(function (card) {
                var catMatch  = true;
                var yearMatch = true;
                var cardYear  = parseInt(card.dataset.year) || 0;

                if (selectedCat !== '') {
                    var ids = (card.dataset.categoryIds || '').split(',');
                    catMatch = ids.indexOf(selectedCat) !== -1;
                }

                if (selectedYear !== '') {
                    yearMatch = card.dataset.year === selectedYear;
                } else {
                    if (pageContext === 'archives') {
                        yearMatch = cardYear <= archiveMaxYear;
                    } else {
                        yearMatch = (cardYear === currentYear || cardYear === priorYear);
                    }
                }

                card.dataset.filterVisible = (catMatch && yearMatch) ? 'true' : 'false';
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

            var btn = document.getElementById('clear-filters');
            if (btn) {
                btn.style.display = (selectedCat !== '' || selectedYear !== '') ? '' : 'none';
            }

            currentPage = 1;
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
                    renderPage();
                    var section = document.getElementById('resourcesection');
                    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
            });
        }
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