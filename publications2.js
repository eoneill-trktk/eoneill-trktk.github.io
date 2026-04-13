(function () {
  'use strict';

  var ITEMS_PER_PAGE = 9;
  var currentPage = 1;
  var filteredItems = [];
  var allItems = [];

  function init() {
    var target = document.getElementById('insights-grid-target');
    if (!target) {
      setTimeout(init, 100);
      return;
    }

    var orphans = document.querySelectorAll(
      '.featured-insight-item:not(#insights-grid-target .featured-insight-item)'
    );
    orphans.forEach(function (item) {
      target.appendChild(item);
    });

    allItems = Array.from(target.querySelectorAll('.featured-insight-item'));

    var searchInput   = document.getElementById('featured-insights-search');
    var typeSelect    = document.getElementById('featured-insights-type');
    var serviceSelect = document.getElementById('featured-insights-services');

    if (searchInput)   searchInput.addEventListener('input',  applyFilters);
    if (typeSelect)    typeSelect.addEventListener('change',  applyFilters);
    if (serviceSelect) serviceSelect.addEventListener('change', applyFilters);

    filteredItems = allItems.slice();
    renderPage();
  }

  function applyFilters() {
    var searchInput   = document.getElementById('featured-insights-search');
    var typeSelect    = document.getElementById('featured-insights-type');
    var serviceSelect = document.getElementById('featured-insights-services');

    var searchVal  = searchInput   ? searchInput.value.trim().toLowerCase()  : '';
    var typeVal    = typeSelect    ? typeSelect.value                          : '';
    var serviceVal = serviceSelect ? serviceSelect.value                       : '';

    filteredItems = allItems.filter(function (item) {
      var itemService = item.getAttribute('data-service') || '';
      var itemType    = item.getAttribute('data-type')    || '';

      var serviceMatch = !serviceVal || itemService === serviceVal;
      var typeMatch    = !typeVal    || itemType    === typeVal;
      var searchMatch  = !searchVal  || getSearchableText(item).indexOf(searchVal) !== -1;

      return serviceMatch && typeMatch && searchMatch;
    });

    currentPage = 1;
    renderPage();
  }

  function getSearchableText(item) {
    var h3 = item.querySelector('h3');
    var p  = item.querySelector('.featured-insight-content p');
    return [
      h3 ? h3.textContent : '',
      p  ? p.textContent  : ''
    ].join(' ').toLowerCase();
  }

  function renderPage() {
    var start = (currentPage - 1) * ITEMS_PER_PAGE;
    var end   = start + ITEMS_PER_PAGE;

    allItems.forEach(function (item) {
      item.classList.add('hidden');
    });

    filteredItems.slice(start, end).forEach(function (item) {
      item.classList.remove('hidden');
    });

    renderNoResults();
    renderPagination();
  }

  function renderNoResults() {
    var target = document.getElementById('insights-grid-target');
    if (!target) return;
    var existing = target.querySelector('.no-results-message');

    if (filteredItems.length === 0) {
      if (!existing) {
        var msg = document.createElement('li');
        msg.className = 'no-results-message';
        msg.textContent = 'No publications match your search or filters.';
        target.appendChild(msg);
      }
    } else {
      if (existing) existing.parentNode.removeChild(existing);
    }
  }

  function renderPagination() {
    var totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    var container  = document.querySelector('.featured-insights-container');
    if (!container) return;

    var existing = container.querySelector('.featured-insights-pagination');
    if (existing) existing.parentNode.removeChild(existing);
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
        html += '<li><button class="page-link' + (active ? ' is-active' : '') + '" data-page="' + p + '"' + (active ? ' aria-current="page"' : '') + '>' + p + '</button></li>';
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
        renderPage();
        var target = document.getElementById('insights-grid-target');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    container.appendChild(nav);
  }

  function buildPageNumbers(current, total) {
    if (total <= 7) {
      var pages = [];
      for (var i = 1; i <= total; i++) pages.push(i);
      return pages;
    }
    var out = [];
    if (current <= 4) {
      for (var i = 1; i <= 5; i++) out.push(i);
      out.push('…');
      out.push(total);
    } else if (current >= total - 3) {
      out.push(1);
      out.push('…');
      for (var i = total - 4; i <= total; i++) out.push(i);
    } else {
      out.push(1);
      out.push('…');
      for (var i = current - 1; i <= current + 1; i++) out.push(i);
      out.push('…');
      out.push(total);
    }
    return out;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
