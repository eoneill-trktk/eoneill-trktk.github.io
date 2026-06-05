(function () {
  'use strict';

  var ITEMS_PER_PAGE = 9;
  var currentPage = 1;
  var filteredData = [];
  var allData = [];

  function init() {
    var target = document.getElementById('insights-grid-target');
    if (!target) { setTimeout(init, 100); return; }

    document.querySelectorAll(
      '.featured-insight-item:not(#insights-grid-target .featured-insight-item)'
    ).forEach(function (item) { target.appendChild(item); });

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

    allData.sort(function(a, b) {
      return b.date - a.date;
    });

    var qp          = new URLSearchParams(location.search);
    var initType    = qp.get('type')    || '';
    var initService = qp.get('service') || '';
    var initSearch  = qp.get('q')       || '';
    var initPage    = parseInt(qp.get('page') || '1', 10);
    if (isNaN(initPage) || initPage < 1) initPage = 1;
    currentPage = initPage;

    var searchInput = document.getElementById('featured-insights-search');
    if (searchInput && initSearch) searchInput.value = initSearch;

    // Set active state on accordion filter items from URL params
    if (initType || initService) {
      var filterLinks = document.querySelectorAll('#insights-filter a[data-catname]');
      filterLinks.forEach(function(link) {
        var parent = (link.getAttribute('data-catparent') || '').toLowerCase();
        var name   = link.getAttribute('data-catname') || '';
        var handle = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        if ((parent === 'type' && handle === initType) ||
            (parent === 'service' && handle === initService)) {
          setActiveCatLink(link);
        }
      });
    }

    // Wire accordion filter links
    document.querySelectorAll('#insights-filter a[data-catname]').forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var parent  = (link.getAttribute('data-catparent') || '').toLowerCase();
        var name    = link.getAttribute('data-catname') || '';
        var handle  = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        var searchInput = document.getElementById('featured-insights-search');

        // Toggle off if already active
        if (link.getAttribute('aria-pressed') === 'true') {
          link.setAttribute('aria-pressed', 'false');
          link.classList.remove('active');
          removeSelectedItem(link.id);
          currentPage = 1;
          runFilters(true);
          return;
        }

        // Clear any existing filter of same parent group first
        document.querySelectorAll('#insights-filter a[data-catparent="' + link.getAttribute('data-catparent') + '"]').forEach(function(sibling) {
          sibling.setAttribute('aria-pressed', 'false');
          sibling.classList.remove('active');
          removeSelectedItem(sibling.id);
        });

        setActiveCatLink(link);
        currentPage = 1;
        runFilters(true);
      });
    });

    if (searchInput) searchInput.addEventListener('input', onFilterChange);

    window.addEventListener('popstate', function () {
      var p = new URLSearchParams(location.search);
      if (searchInput) searchInput.value = p.get('q') || '';
      // Reset all active states
      document.querySelectorAll('#insights-filter a[data-catname]').forEach(function(l) {
        l.setAttribute('aria-pressed', 'false');
        l.classList.remove('active');
      });
      var selBox = document.getElementById('insights-selecteditems');
      if (selBox) selBox.innerHTML = '';
      var selParent = document.getElementById('insights-selecteditemsbox');
      if (selParent) selParent.classList.add('hide');
      currentPage = parseInt(p.get('page') || '1', 10) || 1;
      runFilters(false);
    });

    runFilters(false);
  }

  function setActiveCatLink(link) {
    link.setAttribute('aria-pressed', 'true');
    link.classList.add('active');
    var selBox    = document.getElementById('insights-selecteditems');
    var selParent = document.getElementById('insights-selecteditemsbox');
    if (selBox && selParent) {
      selParent.classList.remove('hide');
      var existing = selBox.querySelector('[data-refid="' + link.id + '"]');
      if (!existing) {
        var div = document.createElement('div');
        div.setAttribute('data-refid', link.id);
        div.innerHTML = link.textContent + " <i class='fa-solid fa-xmark'></i>";
        div.addEventListener('click', function() {
          link.setAttribute('aria-pressed', 'false');
          link.classList.remove('active');
          removeSelectedItem(link.id);
          currentPage = 1;
          runFilters(true);
        });
        selBox.appendChild(div);
      }
    }
  }

  function removeSelectedItem(linkId) {
    var selBox = document.getElementById('insights-selecteditems');
    if (!selBox) return;
    var existing = selBox.querySelector('[data-refid="' + linkId + '"]');
    if (existing) existing.parentNode.removeChild(existing);
    if (selBox.children.length === 0) {
      var selParent = document.getElementById('insights-selecteditemsbox');
      if (selParent) selParent.classList.add('hide');
    }
  }

  function onFilterChange() {
    currentPage = 1;
    runFilters(true);
  }

  function getActiveFilters() {
    var typeVal = '';
    var svcVal  = '';
    document.querySelectorAll('#insights-filter a[aria-pressed="true"]').forEach(function(link) {
      var parent = (link.getAttribute('data-catparent') || '').toLowerCase();
      var name   = link.getAttribute('data-catname') || '';
      var handle = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      if (parent === 'type')    typeVal = handle;
      if (parent === 'service') svcVal  = handle;
    });
    return { typeVal: typeVal, svcVal: svcVal };
  }

  function runFilters(push) {
    var searchInput = document.getElementById('featured-insights-search');
    var q = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var active = getActiveFilters();

    filteredData = allData.filter(function (d) {
      return (!active.svcVal  || d.service === active.svcVal)
          && (!active.typeVal || d.type    === active.typeVal)
          && (!q              || d.searchText.indexOf(q) !== -1);
    });

    if (push) syncUrl(active.typeVal, active.svcVal, q, currentPage);
    renderPage();
  }

  function syncUrl(type, service, q, page) {
    var params = new URLSearchParams();
    if (type)    params.set('type',    type);
    if (service) params.set('service', service);
    if (q)       params.set('q',       q);
    if (page > 1) params.set('page',   page);
    var url = location.pathname + (params.toString() ? '?' + params.toString() : '');
    history.pushState({ type: type, service: service, q: q, page: page }, '', url);
  }

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

    var nav = document.createElement('nav');
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
        var active  = getActiveFilters();
        var searchInput = document.getElementById('featured-insights-search');
        var q = searchInput ? searchInput.value.trim().toLowerCase() : '';
        syncUrl(active.typeVal, active.svcVal, q, currentPage);
        renderPage();
        var t = document.getElementById('insights-grid-target');
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    container.appendChild(nav);
  }

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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());