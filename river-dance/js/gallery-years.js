/* Gallery year switcher — pills that swap which season is on screen.

   The pills are derived from the [data-gyear] blocks already in the page, in
   document order, so adding a season means pasting its sections into
   gallery.html and nothing here changes. The label on a pill comes from
   data-glabel on the first block of that season, falling back to the year.

   Without JS every season stays visible and stacked, which is also what a
   crawler sees — the switcher is a convenience, never the only way in. */
(function () {
  var groups = Array.prototype.slice.call(document.querySelectorAll('[data-gyear]'));
  var mount = document.querySelector('.gyears');
  if (!mount || groups.length < 2) return;

  var ALL = '__all';

  /* unique seasons in document order — newest first, because that is the
     order the sections are written in */
  var years = [], labels = {};
  groups.forEach(function (el) {
    var y = el.getAttribute('data-gyear');
    if (!y) return;
    if (years.indexOf(y) === -1) {
      years.push(y);
      labels[y] = el.getAttribute('data-glabel') || y;
    }
  });
  if (years.length < 2) return;

  var order = years.concat([ALL]);
  labels[ALL] = 'All';

  /* ---- build the pills ---- */
  var pills = {};
  order.forEach(function (y) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'gyear';
    b.setAttribute('role', 'tab');
    b.setAttribute('data-gy', y);
    b.textContent = labels[y];
    if (y === ALL) b.classList.add('gyear-all');
    b.addEventListener('click', function () { select(y, true); });
    mount.appendChild(b);
    pills[y] = b;
  });

  /* ---- show one season (or all of them) ---- */
  var current = null;

  function select(y, fromClick) {
    if (order.indexOf(y) === -1) y = years[0];
    current = y;

    groups.forEach(function (el) {
      el.hidden = !(y === ALL || el.getAttribute('data-gyear') === y);
    });

    order.forEach(function (k) {
      var on = k === y;
      pills[k].classList.toggle('on', on);
      pills[k].setAttribute('aria-selected', on ? 'true' : 'false');
    });

    if (fromClick) {
      try {
        history.replaceState(null, '', y === years[0] ? location.pathname : '#y-' + y);
      } catch (e) { /* file:// and old browsers — the page still works */ }

      /* if the bar has scrolled off the top, come back to it so the new
         season starts at its beginning rather than mid-grid */
      var bar = mount.parentElement;
      if (bar && bar.getBoundingClientRect().top < 0) bar.scrollIntoView();
    }
  }

  /* ---- keep the sticky bar tucked under the sticky nav ---- */
  var nav = document.querySelector('.nav');
  function measure() {
    if (!nav) return;
    document.documentElement.style.setProperty('--navh', nav.offsetHeight + 'px');
  }
  measure();
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);

  /* ---- open on the season in the hash, else the newest ---- */
  var hash = (location.hash || '').replace(/^#y-/, '');
  select(order.indexOf(hash) !== -1 ? hash : years[0], false);

  window.addEventListener('hashchange', function () {
    var h = (location.hash || '').replace(/^#y-/, '');
    if (order.indexOf(h) !== -1 && h !== current) select(h, false);
  });
})();
