(function() {
  function alphabetizeGallery(gallery) {
    const items = Array.from(gallery.querySelectorAll('.wwl-gallery__item'));
    if (items.length === 0) return;
    
    items.sort((a, b) => {
      const altA = a.querySelector('img')?.alt || '';
      const altB = b.querySelector('img')?.alt || '';
      return altA.localeCompare(altB);
    });
    
    items.forEach(item => gallery.appendChild(item));
  }
  
  function alphabetizeAllGalleries() {
    const galleries = document.querySelectorAll('.wwl-gallery');
    galleries.forEach(gallery => alphabetizeGallery(gallery));
  }
  
  const galleries = document.querySelectorAll('.wwl-gallery');
  if (galleries.length > 0) {
    alphabetizeAllGalleries();
  } else {
    const observer = new MutationObserver(function() {
      const foundGalleries = document.querySelectorAll('.wwl-gallery');
      if (foundGalleries.length > 0) {
        alphabetizeAllGalleries();
        observer.disconnect();
      }
    });
    
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
})();