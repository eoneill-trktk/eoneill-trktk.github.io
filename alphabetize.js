(function() {
  function alphabetizeGallery() {
    const gallery = document.querySelector('.wwl-gallery');
    if (!gallery) return;
    
    const items = Array.from(gallery.querySelectorAll('.wwl-gallery__item'));
    if (items.length === 0) return;
    
    items.sort((a, b) => {
      const altA = a.querySelector('img')?.alt || '';
      const altB = b.querySelector('img')?.alt || '';
      return altA.localeCompare(altB);
    });
    
    items.forEach(item => gallery.appendChild(item));
  }
  
  if (document.querySelector('.wwl-gallery')) {
    alphabetizeGallery();
  } else {
    const observer = new MutationObserver(function() {
      if (document.querySelector('.wwl-gallery')) {
        alphabetizeGallery();
        observer.disconnect();
      }
    });
    
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
})();