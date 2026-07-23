/* Gallery lightbox — click any gallery photo to view it full-size.
   Vanilla JS, no dependencies. Navigates within one gallery section at a time. */
(function () {
  var grids = document.querySelectorAll('.gallery-grid');
  if (!grids.length) return;

  var overlay = null, imgEl, capEl, countEl;
  var items = [], idx = 0, touchX = null;

  function build() {
    overlay = document.createElement('div');
    overlay.className = 'lb-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Photo viewer');
    overlay.innerHTML =
      '<button class="lb-btn lb-close" aria-label="Close">&times;</button>' +
      '<button class="lb-btn lb-prev" aria-label="Previous photo">&#8249;</button>' +
      '<img alt="">' +
      '<button class="lb-btn lb-next" aria-label="Next photo">&#8250;</button>' +
      '<div class="lb-caption"></div>' +
      '<div class="lb-count"></div>';
    document.body.appendChild(overlay);

    imgEl = overlay.querySelector('img');
    capEl = overlay.querySelector('.lb-caption');
    countEl = overlay.querySelector('.lb-count');

    overlay.querySelector('.lb-close').addEventListener('click', close);
    overlay.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
    overlay.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay || e.target === imgEl) close(); });

    overlay.addEventListener('touchstart', function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
    overlay.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) > 45) show(dx < 0 ? idx + 1 : idx - 1);
    }, { passive: true });

    document.addEventListener('keydown', function (e) {
      if (!overlay || overlay.style.display !== 'flex') return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  function show(i) {
    idx = (i + items.length) % items.length;
    imgEl.src = items[idx].src;
    imgEl.alt = items[idx].alt || '';
    capEl.textContent = items[idx].alt || '';
    countEl.textContent = (idx + 1) + ' / ' + items.length;
    // preload neighbors for snappy arrows
    [idx + 1, idx - 1].forEach(function (n) {
      var p = new Image();
      p.src = items[(n + items.length) % items.length].src;
    });
  }

  function open(list, i) {
    if (!overlay) build();
    items = list;
    overlay.style.display = 'flex';
    document.body.classList.add('lb-open');
    show(i);
  }

  function close() {
    overlay.style.display = 'none';
    document.body.classList.remove('lb-open');
  }

  grids.forEach(function (grid) {
    var imgs = Array.prototype.slice.call(grid.querySelectorAll('img'));
    imgs.forEach(function (im, i) {
      im.parentElement.addEventListener('click', function () { open(imgs, i); });
    });
  });
})();
