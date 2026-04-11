(function () {
    var _initialized = false;

    const initResourceFilter = () => {
        if (_initialized) return;
        _initialized = true;

        var path = window.location.href.split('?')[0];

        // Parse current query string
        var qd = {};
        if (location.search) {
            location.search.substr(1).split("&").forEach(function (item) {
                var s = item.split("="),
                    k = s[0],
                    v = s[1] && decodeURIComponent(s[1]);
                (qd[k] = qd[k] || []).push(v);
            });
        }

        // Read page context from the form data attributes (set in eventHeader.liquid)
        var form        = document.getElementById('resource-filter-form');
        var pageContext = form ? form.dataset.pageContext  : 'resources';
        var topicSlug   = form ? form.dataset.topicSlug   : '';
        var currentYear = form ? parseInt(form.dataset.currentYear) : new Date().getFullYear();
        var priorYear   = currentYear - 1;
        var archiveMaxYear = currentYear - 2; // e.g. 2024 when currentYear=2026

        // Resource/news/topics pages have no future EventStartDate — redirect once
        // with a far-past startDate so the server returns all pages.
        // Archives bypasses PageListingModel entirely so no redirect needed.
        if (pageContext !== 'archives' && (!qd.startDate || qd.startDate[0] === '')) {
            var redirectUrl = path + '?viewType=list&startDate=2020-01-01';
            if (qd.searchTerm && qd.searchTerm[0] && qd.searchTerm[0] !== '') {
                redirectUrl += '&searchTerm=' + encodeURIComponent(qd.searchTerm[0]);
            }
            window.location.replace(redirectUrl);
            return;
        }

        var catSelect  = document.getElementById('category-filter');
        var yearSelect = document.getElementById('year-filter');

        // ── Restore search input from URL ────────────────────────────────────
        if (qd.searchTerm && qd.searchTerm[0] && qd.searchTerm[0] !== '') {
            var searchInput = document.getElementById('search-filter');
            if (searchInput) searchInput.value = qd.searchTerm[0];
        }

        // ── Topics/Category context: auto-select from URL slug ───────────────
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

        // ── Restore category from URL (manual filter applied) ────────────────
        if (qd.categoryFilter && qd.categoryFilter[0] && qd.categoryFilter[0] !== '') {
            if (catSelect) catSelect.value = qd.categoryFilter[0];
        }

        // ── Restore year from URL ────────────────────────────────────────────
        var activeYear = '';
        if (qd.year && qd.year[0] && qd.year[0] !== '') {
            activeYear = qd.year[0];
            if (yearSelect) yearSelect.value = activeYear;
        }

        // ── Show/hide Clear All ──────────────────────────────────────────────
        var hasFilters = (qd.searchTerm && qd.searchTerm[0] !== '') ||
                         (catSelect && catSelect.value !== '') ||
                         (activeYear !== '');
        var clearBtn = document.getElementById('clear-filters');
        if (clearBtn && hasFilters) clearBtn.style.display = '';

        // ── Apply all filters (runs immediately on load) ─────────────────────
        applyFilters();

        // ── Wire up change listeners ─────────────────────────────────────────
        if (catSelect)  catSelect.addEventListener('change', applyFilters);
        if (yearSelect) yearSelect.addEventListener('change', applyFilters);

        // ── Clear All ────────────────────────────────────────────────────────
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

        // ── applyFilters ─────────────────────────────────────────────────────
        function applyFilters() {
            var selectedCat  = catSelect  ? catSelect.value  : '';
            var selectedYear = yearSelect ? yearSelect.value : '';
            var cards = document.querySelectorAll('.resource-card');
            var anyVisible = false;

            cards.forEach(function (card) {
                var catMatch  = true;
                var yearMatch = true;
                var cardYear  = parseInt(card.dataset.year) || 0;

                // Category filter
                if (selectedCat !== '') {
                    var ids = (card.dataset.categoryIds || '').split(',');
                    catMatch = ids.indexOf(selectedCat) !== -1;
                }

                // Year filter — explicit dropdown selection
                if (selectedYear !== '') {
                    yearMatch = card.dataset.year === selectedYear;
                } else {
                    // No dropdown selection — apply context-based default range
                    if (pageContext === 'archives') {
                        // Archives: only show archiveMaxYear (e.g. 2024) and before
                        yearMatch = cardYear <= archiveMaxYear;
                    } else {
                        // Resources / topics / news: only show current + prior year
                        yearMatch = (cardYear === currentYear || cardYear === priorYear);
                    }
                }

                var visible = catMatch && yearMatch;
                card.style.display = visible ? '' : 'none';
                if (visible) anyVisible = true;
            });

            var noResults = document.getElementById('no-results-message');
            if (noResults) noResults.style.display = anyVisible ? 'none' : '';

            // Show/hide clear button
            var btn = document.getElementById('clear-filters');
            if (btn) {
                btn.style.display = (selectedCat !== '' || selectedYear !== '') ? '' : 'none';
            }
        }
    };

    if (document.readyState === "complete" || document.readyState === "interactive") {
        initResourceFilter();
    } else {
        window.addEventListener("DOMContentLoaded", initResourceFilter);
    }

})();

// ── Global helpers ────────────────────────────────────────────────────────────

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
