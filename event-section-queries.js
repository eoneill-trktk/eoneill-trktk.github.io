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

        // Resource pages have no future EventStartDate — redirect once with
        // a far-past startDate so the server returns all resources.
        if (!qd.startDate || qd.startDate[0] === '') {
            var redirectUrl = path + '?viewType=list&startDate=2020-01-01';
            if (qd.searchTerm && qd.searchTerm[0] && qd.searchTerm[0] !== '') {
                redirectUrl += '&searchTerm=' + encodeURIComponent(qd.searchTerm[0]);
            }
            window.location.replace(redirectUrl);
            return;
        }

        // ── Restore search input from URL ────────────────────────────────────
        if (qd.searchTerm && qd.searchTerm[0] && qd.searchTerm[0] !== '') {
            var searchInput = document.getElementById('search-filter');
            if (searchInput) searchInput.value = qd.searchTerm[0];
        }

        // ── Show/hide Clear All ──────────────────────────────────────────────
        var hasFilters = (qd.searchTerm && qd.searchTerm[0] !== '');
        var clearBtn = document.getElementById('clear-filters');
        if (clearBtn && hasFilters) clearBtn.style.display = '';

        // ── Wire up client-side filtering ────────────────────────────────────
        var catSelect  = document.getElementById('category-filter');
        var yearSelect = document.getElementById('year-filter');

        function applyFilters() {
            var selectedCat  = catSelect  ? catSelect.value  : '';
            var selectedYear = yearSelect ? yearSelect.value : '';

            var cards = document.querySelectorAll('.resource-card');
            var anyVisible = false;

            cards.forEach(function (card) {
                var catMatch  = true;
                var yearMatch = true;

                if (selectedCat !== '') {
                    var ids = (card.dataset.categoryIds || '').split(',');
                    catMatch = ids.indexOf(selectedCat) !== -1;
                }

                if (selectedYear !== '') {
                    yearMatch = card.dataset.year === selectedYear;
                }

                var visible = catMatch && yearMatch;
                card.style.display = visible ? '' : 'none';
                if (visible) anyVisible = true;
            });

            var noResults = document.getElementById('no-results-message');
            if (noResults) noResults.style.display = anyVisible ? 'none' : '';

            // Show/hide clear button
            var clearBtn = document.getElementById('clear-filters');
            if (clearBtn) {
                clearBtn.style.display = (selectedCat !== '' || selectedYear !== '') ? '' : 'none';
            }
        }

        if (catSelect)  catSelect.addEventListener('change', applyFilters);
        if (yearSelect) yearSelect.addEventListener('change', applyFilters);

        // Clear All resets selects and shows all cards
        var clearBtn2 = document.getElementById('clear-filters');
        if (clearBtn2) {
            clearBtn2.addEventListener('click', function (e) {
                e.preventDefault();
                if (catSelect)  catSelect.value  = '';
                if (yearSelect) yearSelect.value = '';
                applyFilters();
                // Also clear search and reload without searchTerm
                var searchInput = document.getElementById('search-filter');
                if (searchInput && searchInput.value !== '') {
                    searchInput.value = '';
                    window.location.replace(path + '?viewType=list&startDate=2020-01-01');
                }
            });
        }
    };

    if (document.readyState === "complete" || document.readyState === "interactive") {
        initResourceFilter();
    } else {
        window.addEventListener("DOMContentLoaded", initResourceFilter);
    }

})();
