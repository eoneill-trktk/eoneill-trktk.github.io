(function() {
  const url = window.location.href;

  if (url.includes('resources') || url.includes('news')) {
    const iframes = document.querySelectorAll('iframe[src*="youtube.com/embed"]');

    if (!iframes.length) return;

    iframes.forEach(function(iframe) {
      const wrap = document.createElement('div');
      wrap.className = 'video-wrap';
      iframe.parentNode.insertBefore(wrap, iframe);
      wrap.appendChild(iframe);
    });

    const style = document.createElement('style');
    style.innerHTML = '.video-wrap { position: relative; width: 100%; padding-bottom: 56.25%; } .video-wrap iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }';
    document.head.appendChild(style);
  }
})();