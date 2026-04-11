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

        // Resource pages have no future EventStartDate so the server returns
        // nothing without a past startDate. Redirect once on bare page load.
        if (!qd.startDate || qd.startDate[0] === '') {
            var redirectUrl = path + '?viewType=list&startDate=2020-01-01';
            if (qd.searchTerm && qd.searchTerm[0] && qd.searchTerm[0] !== '') {
                redirectUrl += '&searchTerm=' + encodeURIComponent(qd.searchTerm[0]);
            }
            if (qd.categoryFilter) {
                qd.categoryFilter.forEach(function (c) {
                    if (c !== '') redirectUrl += '&categoryFilter=' + c;
                });
            }
            if (qd.year && qd.year[0] && qd.year[0] !== '') {
                redirectUrl += '&year=' + qd.year[0];
            }
            window.location.replace(redirectUrl);
            return;
        }

        // ── Restore form state from URL ──────────────────────────────────────

        // Category select
        if (qd.categoryFilter && qd.categoryFilter[0] && qd.categoryFilter[0] !== '') {
            var catSelect = document.getElementById('category-filter');
            if (catSelect) catSelect.value = qd.categoryFilter[0];
        }

        // Year select (client-side only — server ignores this param)
        var activeYear = '';
        if (qd.year && qd.year[0] && qd.year[0] !== '') {
            activeYear = qd.year[0];
            var yearSelect = document.getElementById('year-filter');
            if (yearSelect) yearSelect.value = activeYear;
        }

        // Search input
        if (qd.searchTerm && qd.searchTerm[0] && qd.searchTerm[0] !== '') {
            var searchInput = document.getElementById('search-filter');
            if (searchInput) searchInput.value = qd.searchTerm[0];
        }

        // ── Show/hide Clear All ──────────────────────────────────────────────
        var hasFilters = (qd.categoryFilter && qd.categoryFilter[0] !== '') ||
                         (qd.year && qd.year[0] !== '') ||
                         (qd.searchTerm && qd.searchTerm[0] !== '');
        var clearBtn = document.getElementById('clear-filters');
        if (clearBtn && hasFilters) {
            clearBtn.style.display = '';
        }

        // ── Client-side year filtering ───────────────────────────────────────
        if (activeYear !== '') {
            applyYearFilter(activeYear);
        }

        // ── Form submit: inject startDate so server stays happy ──────────────
        var form = document.getElementById('resource-filter-form');
        if (form) {
            form.addEventListener('submit', function (e) {
                // Ensure startDate hidden input is present
                var existing = form.querySelector('input[name="startDate"]');
                if (!existing) {
                    var sd = document.createElement('input');
                    sd.type = 'hidden';
                    sd.name = 'startDate';
                    sd.value = '2020-01-01';
                    form.appendChild(sd);
                }
            });
        }
    };

    // Filter rendered cards by year client-side
    function applyYearFilter(year) {
        var cards = document.querySelectorAll('.resource-card');
        var anyVisible = false;
        cards.forEach(function (card) {
            if (year === '' || card.dataset.year === year) {
                card.style.display = '';
                anyVisible = true;
            } else {
                card.style.display = 'none';
            }
        });
        var noResults = document.getElementById('no-results-message');
        if (noResults) {
            noResults.style.display = anyVisible ? 'none' : '';
        }
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        initResourceFilter();
    } else {
        window.addEventListener("DOMContentLoaded", initResourceFilter);
    }

})();

// ── Global helpers ───────────────────────────────────────────────────────────

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
