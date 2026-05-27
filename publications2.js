(function () {
  'use strict';

  var ITEMS_PER_PAGE = 9;
  var currentPage = 1;
  var filteredData = [];
  var allData = [];

  // ── Bootstrap ──────────────────────────────────────────────────────────────

  function init() {
    var target = document.getElementById('insights-grid-target');
    if (!target) { setTimeout(init, 100); return; }

    // Move any orphan items (from pagelistingblock) into the target
    document.querySelectorAll(
      '.featured-insight-item:not(#insights-grid-target .featured-insight-item)'
    ).forEach(function (item) { target.appendChild(item); });

    // Snapshot every item into a plain-data array, then wipe the DOM.
    // This is the virtual-rendering trick: we never keep more than 9
    // items in the DOM at once, regardless of total count.
    var domItems = Array.from(target.querySelectorAll('.featured-insight-item'));

    allData = domItems.map(function (item) {
      return {
        html:        item.outerHTML,
        service:     item.getAttribute('data-service') || '',
        type:        item.getAttribute('data-type')    || '',
        date:        parseDateValue(item),
        searchText:  buildSearchText(item)
      };
    });

    target.innerHTML = '';

    // Sort newest-first once; filter results inherit this order.
    allData.sort(function (a, b) { return b.date - a.date; });

    // ── Restore state from URL ──────────────────────────────────────────────
    var qp          = new URLSearchParams(location.search);
    var initType    = qp.get('type')    || '';
    var initService = qp.get('service') || '';
    var initSearch  = qp.get('q')       || '';
    var initPage    = parseInt(qp.get('page') || '1', 10);
    if (isNaN(initPage) || initPage < 1) initPage = 1;
    currentPage = initPage;

    var searchInput   = document.getElementById('featured-insights-search');
    var typeSelect    = document.getElementById('featured-insights-type');
    var serviceSelect = document.getElementById('featured-insights-services');

    if (searchInput   && initSearch)  searchInput.value   = initSearch;
    if (typeSelect    && initType)    typeSelect.value     = initType;
    if (serviceSelect && initService) serviceSelect.value  = initService;

    // ── Live filter listeners ───────────────────────────────────────────────
    if (searchInput)   searchInput.addEventListener('input',  onFilterChange);
    if (typeSelect)    typeSelect.addEventListener('change',  onFilterChange);
    if (serviceSelect) serviceSelect.addEventListener('change', onFilterChange);

    // ── Browser back / forward ──────────────────────────────────────────────
    window.addEventListener('popstate', function () {
      var p = new URLSearchParams(location.search);
      if (searchInput)   searchInput.value   = p.get('q')       || '';
      if (typeSelect)    typeSelect.value     = p.get('type')    || '';
      if (serviceSelect) serviceSelect.value  = p.get('service') || '';
      currentPage = parseInt(p.get('page') || '1', 10) || 1;
      runFilters(false);
    });

    runFilters(false);
  }

  // ── Filter pipeline ────────────────────────────────────────────────────────

  function onFilterChange() {
    currentPage = 1;
    runFilters(true);
  }

  function runFilters(push) {
    var searchInput   = document.getElementById('featured-insights-search');
    var typeSelect    = document.getElementById('featured-insights-type');
    var serviceSelect = document.getElementById('featured-insights-services');

    var q       = searchInput   ? searchInput.value.trim().toLowerCase() : '';
    var typeVal = typeSelect    ? typeSelect.value                        : '';
    var svcVal  = serviceSelect ? serviceSelect.value                    : '';

    filteredData = allData.filter(function (d) {
      return (!svcVal  || d.service === svcVal)
          && (!typeVal || d.type    === typeVal)
          && (!q       || d.searchText.indexOf(q) !== -1);
    });

    if (push) syncUrl(typeVal, svcVal, q, currentPage);
    renderPage();
  }

  // ── URL sync ───────────────────────────────────────────────────────────────

  function syncUrl(type, service, q, page) {
    var params = new URLSearchParams();
    if (type)    params.set('type',    type);
    if (service) params.set('service', service);
    if (q)       params.set('q',       q);
    if (page > 1) params.set('page',   page);
    var url = location.pathname + (params.toString() ? '?' + params.toString() : '');
    history.pushState({ type: type, service: service, q: q, page: page }, '', url);
  }

  // ── Rendering ──────────────────────────────────────────────────────────────

  function renderPage() {
    var target = document.getElementById('insights-grid-target');
    if (!target) return;

    var total = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
    if (currentPage > total) currentPage = 1;

    var start = (currentPage - 1) * ITEMS_PER_PAGE;
    var slice = filteredData.slice(start, start + ITEMS_PER_PAGE);

    target.innerHTML = slice.length
      ? slice.map(function (d) { return d.html; }).join('')
      : '<li class="no-results-message">No publications match your search or filters.</li>';

    renderPagination(total);
  }

  function renderPagination(totalPages) {
    var container = document.querySelector('.featured-insights-container');
    if (!container) return;

    var old = container.querySelector('.featured-insights-pagination');
    if (old) old.parentNode.removeChild(old);
    if (totalPages <= 1) return;

    var nav  = document.createElement('nav');
    nav.className = 'featured-insights-pagination';
    nav.setAttribute('aria-label', 'Insights pagination');

    var pages = buildPageNumbers(currentPage, totalPages);
    var html  = '<ul class="featured-insights-pagination-list">';

    if (currentPage > 1) {
      html += '<li><button class="page-link page-prev" data-page="' + (currentPage - 1) + '">&#8592; Prev</button></li>';
    }

    pages.forEach(function (p) {
      if (p === '…') {
        html += '<li class="page-ellipsis" aria-hidden="true">…</li>';
      } else {
        var active = p === currentPage;
        html += '<li><button class="page-link'
          + (active ? ' is-active' : '')
          + '" data-page="' + p + '"'
          + (active ? ' aria-current="page"' : '')
          + '>' + p + '</button></li>';
      }
    });

    if (currentPage < totalPages) {
      html += '<li><button class="page-link page-next" data-page="' + (currentPage + 1) + '">Next <span class="arrow" aria-hidden="true">&#8594;</span></button></li>';
    }

    html += '</ul>';
    nav.innerHTML = html;

    nav.querySelectorAll('.page-link[data-page]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentPage = parseInt(this.getAttribute('data-page'), 10);

        var searchInput   = document.getElementById('featured-insights-search');
        var typeSelect    = document.getElementById('featured-insights-type');
        var serviceSelect = document.getElementById('featured-insights-services');
        var typeVal = typeSelect    ? typeSelect.value                        : '';
        var svcVal  = serviceSelect ? serviceSelect.value                    : '';
        var q       = searchInput   ? searchInput.value.trim().toLowerCase() : '';

        syncUrl(typeVal, svcVal, q, currentPage);
        renderPage();

        var target = document.getElementById('insights-grid-target');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    container.appendChild(nav);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  function parseDateValue(item) {
    var el = item.querySelector('.featured-insight-date');
    if (!el) return 0;
    var d = new Date(el.textContent.trim());
    return isNaN(d.getTime()) ? 0 : d.getTime();
  }

  function buildSearchText(item) {
    var h3 = item.querySelector('h3');
    var p  = item.querySelector('.featured-insight-content p');
    return [h3 ? h3.textContent : '', p ? p.textContent : ''].join(' ').toLowerCase();
  }

  function buildPageNumbers(current, total) {
    if (total <= 7) {
      var out = [];
      for (var i = 1; i <= total; i++) out.push(i);
      return out;
    }
    var out = [];
    if (current <= 4) {
      for (var i = 1; i <= 5; i++) out.push(i);
      out.push('…'); out.push(total);
    } else if (current >= total - 3) {
      out.push(1); out.push('…');
      for (var i = total - 4; i <= total; i++) out.push(i);
    } else {
      out.push(1); out.push('…');
      for (var i = current - 1; i <= current + 1; i++) out.push(i);
      out.push('…'); out.push(total);
    }
    return out;
  }

  // ── Entry ──────────────────────────────────────────────────────────────────

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());