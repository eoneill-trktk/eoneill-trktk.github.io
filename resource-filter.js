(function() {
  'use strict';
  
  const gridContainer = document.getElementById('resource-grid-container');
  const noResultsMessage = document.getElementById('no-results-message');
  const categoryFilter = document.getElementById('category-filter');
  const yearFilter = document.getElementById('year-filter');
  const searchFilter = document.getElementById('search-filter');
  const filterButton = document.getElementById('filter-button');
  const clearButton = document.getElementById('clear-filters');
  const filterForm = document.getElementById('resource-filter-form');
  
  const allCards = Array.from(document.querySelectorAll('.resource-card'));
  
  function getSelectedCategory() {
    return categoryFilter ? categoryFilter.value : '';
  }
  
  function getSelectedYear() {
    return yearFilter ? yearFilter.value : '';
  }
  
  function getSearchTerm() {
    return searchFilter ? searchFilter.value.toLowerCase().trim() : '';
  }
  
  function updateClearButton() {
    if (clearButton) {
      if (getSelectedCategory() || getSelectedYear() || getSearchTerm()) {
        clearButton.style.display = 'inline-block';
      } else {
        clearButton.style.display = 'none';
      }
    }
  }
  
  function updateUrlParams() {
    const url = new URL(window.location);
    const category = getSelectedCategory();
    const year = getSelectedYear();
    const search = searchFilter ? searchFilter.value : '';
    
    if (category) {
      url.searchParams.set('categoryFilter', category);
    } else {
      url.searchParams.delete('categoryFilter');
    }
    
    if (year) {
      url.searchParams.set('year', year);
    } else {
      url.searchParams.delete('year');
    }
    
    if (search) {
      url.searchParams.set('searchTerm', search);
    } else {
      url.searchParams.delete('searchTerm');
    }
    
    url.searchParams.set('viewType', 'list');
    window.history.replaceState({}, '', url);
  }
  
  function filterResources() {
    const selectedCategory = getSelectedCategory();
    const selectedYear = getSelectedYear();
    const searchTerm = getSearchTerm();
    
    updateClearButton();
    
    let visibleCount = 0;
    
    allCards.forEach(card => {
      let visible = true;
      
      if (selectedYear) {
        const cardYear = card.dataset.year;
        if (cardYear !== selectedYear) {
          visible = false;
        }
      }
      
      if (visible && selectedCategory) {
        const categoryIds = card.dataset.categoryIds || '';
        const categories = categoryIds.split(',').filter(id => id);
        if (!categories.includes(selectedCategory)) {
          visible = false;
        }
      }
      
      if (visible && searchTerm) {
        const title = (card.dataset.title || '').toLowerCase();
        const excerpt = (card.dataset.excerpt || '').toLowerCase();
        if (!title.includes(searchTerm) && !excerpt.includes(searchTerm)) {
          visible = false;
        }
      }
      
      if (visible) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });
    
    if (noResultsMessage) {
      noResultsMessage.style.display = visibleCount === 0 ? 'block' : 'none';
    }
    
    updateUrlParams();
  }
  
  function loadFiltersFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlYear = urlParams.get('year');
    const urlCategory = urlParams.get('categoryFilter');
    const urlSearch = urlParams.get('searchTerm');
    
    if (urlYear && yearFilter) yearFilter.value = urlYear;
    if (urlCategory && categoryFilter) categoryFilter.value = urlCategory;
    if (urlSearch && searchFilter) searchFilter.value = urlSearch;
    
    if (urlYear || urlCategory || urlSearch) {
      filterResources();
    } else {
      updateClearButton();
    }
  }
  
  // Handle form submission - filter client-side and prevent page reload
  if (filterForm) {
    filterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      filterResources();
    });
  }
  
  if (filterButton) {
    filterButton.addEventListener('click', function(e) {
      e.preventDefault();
      filterResources();
    });
  }
  
  if (clearButton) {
    clearButton.addEventListener('click', function(e) {
      e.preventDefault();
      if (categoryFilter) categoryFilter.value = '';
      if (yearFilter) yearFilter.value = '';
      if (searchFilter) searchFilter.value = '';
      filterResources();
      window.location.href = '/resources/';
    });
  }
  
  if (searchFilter) {
    searchFilter.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        filterResources();
      }
    });
  }
  
  loadFiltersFromUrl();
})();