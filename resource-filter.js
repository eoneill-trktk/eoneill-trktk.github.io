(function() {
  'use strict';
  
  // Get resources from JSON script tag
  const resourcesDataElement = document.getElementById('resources-data');
  if (!resourcesDataElement) return;
  
  let resources = [];
  try {
    resources = JSON.parse(resourcesDataElement.textContent);
  } catch (e) {
    console.error('Failed to parse resources data:', e);
    return;
  }
  
  // DOM elements
  const gridContainer = document.getElementById('resource-grid-container');
  const noResultsMessage = document.getElementById('no-results-message');
  const filterForm = document.getElementById('resource-filter-form');
  const categoryFilter = document.getElementById('category-filter');
  const yearFilter = document.getElementById('year-filter');
  const searchFilter = document.getElementById('search-filter');
  const filterButton = document.getElementById('filter-button');
  const clearButton = document.getElementById('clear-filters');
  
  // Function to render resource cards
  function renderResources(filteredResources) {
    if (!gridContainer) return;
    
    if (filteredResources.length === 0) {
      gridContainer.innerHTML = '';
      if (noResultsMessage) noResultsMessage.style.display = 'block';
      return;
    }
    
    if (noResultsMessage) noResultsMessage.style.display = 'none';
    
    let html = '';
    filteredResources.forEach(resource => {
      // Build categories HTML
      let categoriesHtml = '';
      if (resource.categories) {
        const categoryItems = resource.categories.split('||');
        categoriesHtml = '<div class="resource-badges">';
        categoryItems.forEach(cat => {
          const catParts = cat.split('::');
          const catName = catParts[1] || '';
          const catClass = catName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '').replace(/--/g, '-');
          categoriesHtml += `<span class="resource-badge topic-${catClass}">${catName}</span>`;
        });
        categoriesHtml += '</div>';
      }
      
      html += `
        <article class="resource-card">
          <a class="resource-thumb" href="${resource.url}">
            <img loading="lazy" width="768" height="329" src="${resource.image}" class="resource-thumb__img" alt="Resource thumbnail" style="aspect-ratio: 768/329; object-fit: cover;">
          </a>
          <div class="resource-body">
            ${categoriesHtml}
            <h3 class="resource-title">
              <a href="${resource.url}">${resource.title}</a>
            </h3>
            <div class="resource-excerpt">${resource.excerpt || ''}</div>
            <div class="resource-date">${resource.date || ''}</div>
          </div>
        </article>
      `;
    });
    
    gridContainer.innerHTML = html;
  }
  
  // Function to filter resources
  function filterResources() {
    const selectedCategory = categoryFilter ? categoryFilter.value : '';
    const selectedYear = yearFilter ? yearFilter.value : '';
    const searchTerm = searchFilter ? searchFilter.value.toLowerCase().trim() : '';
    
    // Show/hide clear button
    if (clearButton) {
      if (selectedCategory || selectedYear || searchTerm) {
        clearButton.style.display = 'inline-block';
      } else {
        clearButton.style.display = 'none';
      }
    }
    
    const filtered = resources.filter(resource => {
      // Year filter
      if (selectedYear && resource.year !== selectedYear) {
        return false;
      }
      
      // Category filter
      if (selectedCategory) {
        let hasCategory = false;
        if (resource.categories) {
          const categoryItems = resource.categories.split('||');
          categoryItems.forEach(cat => {
            const catId = cat.split('::')[0];
            if (catId === selectedCategory) {
              hasCategory = true;
            }
          });
        }
        if (!hasCategory) return false;
      }
      
      // Search filter
      if (searchTerm) {
        const titleMatch = resource.title.toLowerCase().includes(searchTerm);
        const excerptMatch = resource.excerpt.toLowerCase().includes(searchTerm);
        if (!titleMatch && !excerptMatch) return false;
      }
      
      return true;
    });
    
    // Sort by date (newest first) - parse dates for proper sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });
    
    renderResources(filtered);
  }
  
  // Function to clear all filters
  function clearFilters() {
    if (categoryFilter) categoryFilter.value = '';
    if (yearFilter) yearFilter.value = '';
    if (searchFilter) searchFilter.value = '';
    filterResources();
  }
  
  // Initial render
  renderResources(resources);
  
  // Event listeners
  if (filterButton) {
    filterButton.addEventListener('click', filterResources);
  }
  
  if (clearButton) {
    clearButton.addEventListener('click', clearFilters);
  }
  
  // Allow Enter key in search field to trigger filter
  if (searchFilter) {
    searchFilter.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        filterResources();
      }
    });
  }
  
  // Check URL parameters on page load
  function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlYear = urlParams.get('year');
    const urlCategory = urlParams.get('categoryFilter');
    const urlSearch = urlParams.get('searchTerm');
    
    if (urlYear && yearFilter) yearFilter.value = urlYear;
    if (urlCategory && categoryFilter) categoryFilter.value = urlCategory;
    if (urlSearch && searchFilter) searchFilter.value = urlSearch;
    
    if (urlYear || urlCategory || urlSearch) {
      filterResources();
    }
  }
  
  checkUrlParams();
})();