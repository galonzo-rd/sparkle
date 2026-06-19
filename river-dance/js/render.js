/* ============================================================
   render.js — fills the pages from data/event.js (window.RD)
   You shouldn't need to edit this file to change the event.
   Edit data/event.js instead; this just paints it onto the pages.
   ============================================================ */
(function () {
  if (!window.RD) { console.warn("RD data not loaded"); return; }
  var E = RD.event;

  /* ---------- small helpers ---------- */
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function artist(name){
    var loc = '';
    name = name.replace(/\s*\(([^)]+)\)\s*$/, function(m, c){ loc = ' <span class="loc">(' + esc(c) + ')</span>'; return ''; });
    return esc(name).split(' × ').join(' <span class="x">×</span> ') + loc;
  }
  function nameOnly(name){ return name.replace(/\s*\([^)]+\)\s*$/, ''); }
  var NUMWORD = {1:"One",2:"Two",3:"Three",4:"Four"};

  var datesVenueLine = E.datesDisplay + " · " + E.venue + " · " + E.river;
  var legalLine      = "© " + E.year + " " + E.siteName + " · " + E.datesShort + " · " + E.venue + ", " + E.city;
  var contactDates   = E.datesDisplay + ". " + (NUMWORD[E.nights] || E.nights) + " nights. Don't sleep on it.";

  function statsHTML(arr){
    return arr.map(function(s){
      return '<div><div class="bignum">'+esc(s.num)+'</div><div class="label">'+esc(s.label)+'</div></div>';
    }).join('');
  }

  /* ---------- renderers keyed by data-rd ---------- */
  var R = {
    "hero.eyebrow":    function(el){ el.textContent = E.heroEyebrow; },
    "hero.datesVenue": function(el){ el.innerHTML = esc(E.datesDisplay) + " · " + esc(E.venue) + " · " + esc(E.river); },
    "hero.tagline":    function(el){ el.textContent = E.tagline; },
    "contact.dates":   function(el){ el.textContent = contactDates; },

    "home.stats":      function(el){ el.innerHTML = statsHTML(RD.homeStats); },
    "sponsors.stats":  function(el){ el.innerHTML = statsHTML(RD.sponsors.stats); },

    "lineup.teaser": function(el){
      var names = [];
      RD.lineup.nights.forEach(function(n){
        n.acts.forEach(function(a){ names.push(nameOnly(a)); });
      });
      el.innerHTML = names.map(function(s){ return esc(s).split(' × ').join(' <span class="x">×</span> '); }).join(' · ');
    },

    "lineup.poster": function(el){
      el.innerHTML = RD.lineup.nights.map(function(n){
        var html = '<div class="poster-night">';
        html += '<div class="poster-night-head">'+esc(n.day)+' · '+esc(n.date)+
                ' <span class="end">'+esc(n.endNote)+'</span></div>';
        html += '<div class="poster-acts">';
        // display closer on top: reverse the chronological list
        n.acts.slice().reverse().forEach(function(a){
          var isHead = n.headliner && nameOnly(a) === n.headliner;
          html += '<div class="poster-act'+(isHead?' marquee':'')+'">'+artist(a)+'</div>';
        });
        html += '</div>';
        return html + '</div>';
      }).join('');
    },

    "schedule": function(el){
      el.innerHTML = RD.schedule.map(function(d){
        var rows = d.rows.map(function(r){
          return '<tr><td class="time">'+esc(r[0])+'</td><td>'+esc(r[1])+'</td></tr>';
        }).join('');
        return '<div class="sched-day"><h3>'+esc(d.day)+' · '+esc(d.date)+'</h3><table>'+rows+'</table></div>';
      }).join('');
    },

    "sponsors.tiers": function(el){
      el.innerHTML = RD.sponsors.tiers.map(function(t){
        var perks = t.perks.map(function(p){ return '<li>'+esc(p)+'</li>'; }).join('');
        return '<div class="tier'+(t.featured?' featured':'')+'">'+
                 '<span class="tier-num">'+esc(t.name)+'</span>'+
                 '<div class="tier-price">'+esc(t.price)+'</div>'+
                 '<ul>'+perks+'</ul>'+
               '</div>';
      }).join('');
    },

    "about.timeline": function(el){
      el.innerHTML = RD.timeline.map(function(c){
        if (c.type === "now")
          return '<a class="year-chip now" href="'+esc(E.ticketsUrl)+'" target="_blank" rel="noopener">'+esc(c.label)+'</a>';
        if (c.type === "hiatus")
          return '<span class="year-chip hiatus">'+esc(c.label)+'</span>';
        return '<span class="year-chip">'+esc(c.label)+'</span>';
      }).join('');
    }
  };

  /* ---------- run ---------- */
  function run(){
    // explicit hooks
    document.querySelectorAll('[data-rd]').forEach(function(el){
      var fn = R[el.getAttribute('data-rd')];
      if (fn) fn(el);
    });

    // global swaps (no per-element tagging needed)
    document.querySelectorAll('a[href*="prekindle.com/event"]').forEach(function(a){ a.href = E.ticketsUrl; });
    document.querySelectorAll('a[href*="youtu.be"], a[href*="youtube.com/watch"]').forEach(function(a){ a.href = "https://youtu.be/" + E.recapVideoId; });
    document.querySelectorAll('iframe[src*="youtube.com/embed"]').forEach(function(f){ f.src = "https://www.youtube.com/embed/" + E.recapVideoId; });
    document.querySelectorAll('.legal').forEach(function(el){ el.textContent = legalLine; });

    // page title
    var dt = document.body.getAttribute('data-title');
    document.title = dt ? (dt + " · " + E.siteName + " " + E.year)
                        : (E.siteName + " · " + E.datesShort + " · " + E.river);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();
