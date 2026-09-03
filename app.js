/* ==========================================================================
   BAPPACHE AAGMAN — interaction engine
   Four cards, one fixed viewport, no scrolling. The guest sets the pace.
   ========================================================================== */
(function () {
  'use strict';

  /* config.js declares `const invitation`, which lives in script scope rather
     than on window — read the binding directly, with a safe fallback. */
  var CFG = (function () {
    try { if (typeof invitation !== 'undefined' && invitation) return invitation; } catch (e) {}
    return window.invitation || {};
  })();

  var NAV   = CFG.navigation || {};
  var MEDIA = CFG.media || {};

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var REDUCED = motionQuery.matches;

  var body     = document.body;
  var stage    = document.getElementById('stage');
  var deck     = document.getElementById('deck');
  var teach    = document.getElementById('teach');
  var hint     = document.getElementById('hint');
  var prevBtn  = document.getElementById('prevBtn');
  var nextBtn  = document.getElementById('nextBtn');
  var beads    = document.getElementById('beads');
  var srStatus = document.getElementById('srStatus');
  var musicBtn = document.getElementById('musicBtn');

  /* ---------------------------------------------------------------- utils */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function svgIn(cls, markup) { var n = el('div', cls); n.innerHTML = markup; return n; }
  function r(node) { node.setAttribute('data-r', ''); return node; }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function text(v, fb) { return (typeof v === 'string' && v.length) ? v : (fb || ''); }


  /* ---------------------------------------------------------- decoration */
  function art(cls, src, alt) {
    if (!src) return null;
    var n = el('div', cls);
    var img = new Image();
    img.alt = alt || ''; img.decoding = 'async'; img.src = src;
    img.addEventListener('error', function () { if (n.parentNode) n.parentNode.removeChild(n); });
    n.appendChild(img);
    return n;
  }
  function rule() { return art('rule', MEDIA.divider) || el('div', 'rule'); }


  /* ================================================================ world
     Marigold garlands overhead, incense smoke, embers off the diyas — and
     flower petals falling across every single card. */
  (function world() {
    var host = document.getElementById('garlands');
    if (MEDIA.garland) {
      var wide = window.innerWidth > 430;
      /* left as a share of the screen, then how far each one hangs */
      var xs  = wide ? [1, 12, 23, 34, 45, 56, 67, 78, 89, 97] : [1, 15, 29, 43, 57, 71, 85, 96];
      var hs  = wide ? [46, 20, 30, 17, 25, 18, 28, 19, 22, 44] : [45, 19, 27, 16, 24, 18, 23, 43];
      for (var i = 0; i < xs.length; i++) {
        var m = art('mala', MEDIA.garland);
        if (!m) break;
        m.style.left = xs[i] + '%';
        m.style.width = 'clamp(28px, 8.4vw, 44px)';
        m.style.marginLeft = 'calc(clamp(28px, 8.4vw, 44px) / -2)';
        m.style.height = hs[i] + 'vh';
        m.style.overflow = 'hidden';
        m.style.animationDuration = (6.2 + (i % 4) * 0.9).toFixed(1) + 's';
        m.style.animationDelay = (-(i * 0.7)).toFixed(1) + 's';
        host.appendChild(m);
      }
    }

    /* petals fall whatever the motion setting — they are the invitation's
       heartbeat; reduced motion only slows them right down. */
    var pets = document.getElementById('petals');
    var kinds = ['', ' petal--rose', ' petal--white'];
    var count = window.innerWidth < 420 ? 14 : 20;
    for (var p = 0; p < count; p++) {
      var n = el('div', 'petal' + kinds[p % 3]);
      var w = 9 + Math.random() * 13;
      n.style.width = w.toFixed(1) + 'px';
      n.style.height = (w * (0.62 + Math.random() * 0.26)).toFixed(1) + 'px';
      n.style.left = (Math.random() * 102 - 1).toFixed(1) + '%';
      n.style.setProperty('--dx', (Math.random() * 150 - 75).toFixed(0) + 'px');
      n.style.opacity = (0.55 + Math.random() * 0.4).toFixed(2);
      n.style.animationDuration = (9 + Math.random() * 11).toFixed(1) + 's';
      n.style.animationDelay = (-Math.random() * 18).toFixed(1) + 's';
      var spin = el('i');
      n.appendChild(spin);
      spin.style.animationDuration = (2.6 + Math.random() * 4).toFixed(1) + 's';
      spin.style.animationDirection = p % 2 ? 'reverse' : 'normal';
      pets.appendChild(n);
    }

    if (REDUCED) return;

    var air = document.getElementById('air');
    for (var k = 0; k < 3; k++) {
      var sm = el('div', 'smoke');
      sm.style.left = (18 + k * 30) + '%';
      sm.style.setProperty('--sx', (Math.random() * 70 - 35).toFixed(0) + 'px');
      sm.style.animationDuration = (13 + k * 4) + 's';
      sm.style.animationDelay = (-k * 5) + 's';
      air.appendChild(sm);
    }
    var embers = window.innerWidth < 420 ? 12 : 18;
    for (var e = 0; e < embers; e++) {
      var em = el('div', 'ember');
      var sz = 2 + Math.random() * 3.4;
      em.style.width = sz.toFixed(1) + 'px';
      em.style.height = sz.toFixed(1) + 'px';
      em.style.left = (Math.random() * 100).toFixed(1) + '%';
      em.style.bottom = '-6vh';
      em.style.setProperty('--dx', (Math.random() * 90 - 45).toFixed(0) + 'px');
      em.style.setProperty('--pop', (0.4 + Math.random() * 0.5).toFixed(2));
      em.style.animationDuration = (11 + Math.random() * 13).toFixed(1) + 's';
      em.style.animationDelay = (-Math.random() * 20).toFixed(1) + 's';
      air.appendChild(em);
    }
  })();


  /* ================================================================= media */
  function picture(cfg) {
    var wrap = el('div', cfg.cls || 'media');
    var chances = (cfg.video ? 1 : 0) + (cfg.poster ? 1 : 0);
    function lost() { chances--; if (chances <= 0 && cfg.onEmpty) cfg.onEmpty(); }
    if (!chances && cfg.onEmpty) window.setTimeout(cfg.onEmpty, 0);

    var poster = null, video = null;
    if (cfg.poster) {
      poster = new Image();
      poster.alt = ''; poster.decoding = 'async';
      poster.style.opacity = '0'; poster.style.transition = 'opacity .9s ease';
      poster.addEventListener('load', function () { poster.style.opacity = '1'; });
      poster.addEventListener('error', function () {
        if (poster.parentNode) poster.parentNode.removeChild(poster);
        lost();
      });
      wrap.appendChild(poster);
    }
    if (cfg.video) {
      video = document.createElement('video');
      video.muted = true; video.defaultMuted = true; video.loop = true; video.playsInline = true;
      video.setAttribute('muted', ''); video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', ''); video.setAttribute('aria-hidden', 'true');
      video.preload = 'none';
      video.style.opacity = '0'; video.style.transition = 'opacity 1.1s ease';
      var dead = false;
      var drop = function () {
        if (dead) return; dead = true;
        if (video.parentNode) video.parentNode.removeChild(video);
        lost();
      };
      video.addEventListener('error', drop);
      video.addEventListener('loadeddata', function () {
        video.style.opacity = '1';
        if (poster) window.setTimeout(function () { poster.style.display = 'none'; }, 1200);
      });
      wrap.appendChild(video);
    }

    var primed = false;
    return {
      node: wrap,
      prime: function () {
        if (primed) return;
        primed = true;
        if (poster && !poster.src) poster.src = cfg.poster;
        if (video && !video.src) {
          video.preload = 'auto'; video.src = cfg.video;
          window.setTimeout(function () { if (video.readyState < 2) drop(); }, 9000);
        }
      },
      play: function () {
        if (!video || !video.parentNode) return;
        var p = video.play(); if (p && p.catch) p.catch(function () {});
      },
      pause: function () { if (video && !video.paused) { try { video.pause(); } catch (e) {} } }
    };
  }


  /* ================================================================= cards */
  var cards = [];

  function shell(content, label) {
    var card = el('div', 'card');
    card.setAttribute('role', 'group');
    card.setAttribute('aria-roledescription', 'invitation card');
    card.setAttribute('aria-label', label);

    var tilt = el('div', 'card__tilt');
    var face = el('div', 'card__face');

    /* the photograph, softened, so no card is ever a flat panel */
    if (MEDIA.reflection) {
      var refl = el('div', 'card__reflect');
      refl.style.backgroundImage = 'url("' + MEDIA.reflection + '")';
      face.appendChild(refl);
    }
    var tl = art('card__corner card__corner--tl', MEDIA.corner);
    var br = art('card__corner card__corner--br', MEDIA.corner);
    if (tl) face.appendChild(tl);
    if (br) face.appendChild(br);

    face.appendChild(content);

    face.appendChild(el('div', 'card__sheen'));
    tilt.appendChild(face);
    card.appendChild(tilt);

    var bits = content.querySelectorAll('[data-r]');
    for (var i = 0; i < bits.length; i++) bits[i].style.setProperty('--i', i);
    return card;
  }

  /* ---- a photograph filling the card, words set inside it ---- */
  function cardPhoto(d) {
    var c = el('div', 'c c--aagman');

    var pic = picture({
      cls: 'shrine',
      poster: d.image || MEDIA.hero,
      onEmpty: function () { pic.node.appendChild(el('div', 'shrine__void', 'GANPATI BAPPA MORYA')); }
    });
    c.appendChild(pic.node);
    c.appendChild(el('div', 'shrine__scrim'));

    var top = el('div', 'plate plate--top');
    if (d.mantra)  top.appendChild(r(el('p', 'mantra', d.mantra)));
    if (d.welcome) top.appendChild(r(el('p', 'welcome', d.welcome)));
    c.appendChild(top);

    var foot = el('div', 'plate plate--foot');
    if (d.lead)  foot.appendChild(r(el('p', 'lead', d.lead)));
    if (d.title) foot.appendChild(r(el('h1', 'display', d.title)));
    if (d.name)  foot.appendChild(r(el('p', 'namecard', d.name)));
    if (d.dates) foot.appendChild(r(el('p', 'dates', d.dates)));
    c.appendChild(foot);

    return { content: c, media: pic, label: d.title || 'You are invited' };
  }

  /* ---- events down a gold line ---- */
  function cardTimeline(d) {
    var c = el('div', 'c c--utsav');
    if (d.eyebrow) c.appendChild(r(el('p', 'eyebrow', d.eyebrow)));
    if (d.title)   c.appendChild(r(el('h2', 'display display--sm', d.title)));
    c.appendChild(rule());

    var rows = Array.isArray(d.events) ? d.events : [];
    var line = el('div', 'tl');
    /* the card tightens its own type as more events are added */
    line.setAttribute('data-rows', String(Math.min(rows.length, 9)));
    rows.forEach(function (row, i) {
      var ev = el('div', 'ev ' + (i % 2 ? 'ev--r' : 'ev--l'));
      var box = el('div', 'ev__box');
      if (row.label) box.appendChild(el('p', 'ev__label', row.label));
      if (row.name)  box.appendChild(el('p', 'ev__name', row.name));
      if (row.date)  box.appendChild(el('p', 'ev__date', row.date));
      if (row.time)  box.appendChild(el('p', 'ev__time', row.time));
      if (row.extra) box.appendChild(el('p', 'ev__extra', row.extra));
      ev.appendChild(box);
      ev.appendChild(el('span', 'ev__dot'));
      line.appendChild(r(ev));
    });
    c.appendChild(line);
    return { content: c, label: d.title || 'Festival' };
  }

  /* ---- a paragraph, an address and a button ---- */
  function cardMessage(d) {
    var c = el('div', 'c c--invite');
    if (d.eyebrow) c.appendChild(r(el('p', 'eyebrow', d.eyebrow)));
    if (d.title)   c.appendChild(r(el('h2', 'display display--sm', d.title)));

    var paras = Array.isArray(d.paragraphs) ? d.paragraphs : (d.paragraphs ? [d.paragraphs] : []);
    if (paras.length) {
      var note = el('div', 'note');
      paras.forEach(function (t) { note.appendChild(el('p', 'prose', t)); });
      c.appendChild(r(note));
    }

    var addr = Array.isArray(d.addressLines) ? d.addressLines : (d.addressLines ? [d.addressLines] : []);
    if (addr.length || d.locationEyebrow || d.buttonText) c.appendChild(rule());
    if (d.locationEyebrow) c.appendChild(r(el('p', 'eyebrow', d.locationEyebrow)));

    if (addr.length) {
      var a = el('p', 'address');
      addr.forEach(function (linetext, i) {
        if (i) a.appendChild(el('br'));
        a.appendChild(document.createTextNode(linetext));
      });
      c.appendChild(r(a));
    }

    if (d.buttonText) {
      var link = document.createElement('a');
      link.className = 'maps';
      link.href = text(d.buttonUrl, '#');
      link.target = '_blank'; link.rel = 'noopener noreferrer';
      link.appendChild(document.createTextNode(d.buttonText));
      link.insertAdjacentHTML('beforeend',
        '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
        '<path d="M14 4h6v6M20 4l-8.5 8.5M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" ' +
        'stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>');
      c.appendChild(r(link));
    }
    if (d.signoff) c.appendChild(r(el('p', 'signoff', d.signoff)));
    return { content: c, label: d.title || 'Invitation' };
  }

  /* ---- the address, on a small drawn map ---- */
  var MAP =
    '<svg class="map__art" viewBox="0 0 300 200" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">' +
      '<g stroke="currentColor" stroke-linecap="round">' +
        /* the wide roads */
        '<path d="M-10 132H310" stroke-width="9" opacity=".5"/>' +
        '<path d="M196-10V210"  stroke-width="8" opacity=".5"/>' +
        '<path d="M-10 58C60 58 96 44 150 44S250 62 310 62" stroke-width="7" opacity=".42"/>' +
        /* the smaller lanes */
        '<path d="M64-10V210"   stroke-width="3" opacity=".3"/>' +
        '<path d="M-10 176H310" stroke-width="3" opacity=".28"/>' +
        '<path d="M120 132V210" stroke-width="3" opacity=".28"/>' +
        '<path d="M248 62V132"  stroke-width="3" opacity=".26"/>' +
        '<path d="M-10 96H64"   stroke-width="2.4" opacity=".24"/>' +
        '<path d="M196 96H310"  stroke-width="2.4" opacity=".24"/>' +
      '</g>' +
      /* blocks between the roads */
      '<g fill="currentColor" opacity=".1">' +
        '<rect x="76" y="70" width="34" height="24" rx="3"/>' +
        '<rect x="124" y="70" width="30" height="24" rx="3"/>' +
        '<rect x="208" y="146" width="30" height="20" rx="3"/>' +
        '<rect x="76" y="146" width="32" height="20" rx="3"/>' +
      '</g>' +
      /* a river running through */
      '<path d="M-10 20C50 30 70 8 120 14S210 40 260 26 310 14 310 14" ' +
            'stroke="currentColor" stroke-width="12" opacity=".13" stroke-linecap="round"/>' +
    '</svg>';

  function cardLocation(d) {
    var c = el('div', 'c c--place');
    if (d.eyebrow) c.appendChild(r(el('p', 'eyebrow', d.eyebrow)));
    if (d.title)   c.appendChild(r(el('h2', 'display display--sm', d.title)));
    c.appendChild(rule());

    var map = el('div', 'map');
    map.insertAdjacentHTML('beforeend', MAP);
    map.appendChild(el('div', 'map__grid'));
    var pin = el('div', 'map__pin');
    pin.appendChild(el('span', 'map__pulse'));
    pin.insertAdjacentHTML('beforeend',
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="M12 22s7.5-6.9 7.5-12.3A7.5 7.5 0 0 0 4.5 9.7C4.5 15.1 12 22 12 22Z" ' +
      'fill="currentColor"/><circle cx="12" cy="9.6" r="2.9" fill="#2A1204"/></svg>');
    map.appendChild(pin);
    c.appendChild(r(map));

    var addr = Array.isArray(d.addressLines) ? d.addressLines : (d.addressLines ? [d.addressLines] : []);
    if (addr.length) {
      var a = el('p', 'address');
      addr.forEach(function (t, i) {
        if (i) a.appendChild(el('br'));
        a.appendChild(document.createTextNode(t));
      });
      c.appendChild(r(a));
    }
    if (d.landmark) c.appendChild(r(el('p', 'landmark', d.landmark)));

    if (d.buttonText) {
      var link = document.createElement('a');
      link.className = 'maps';
      link.href = text(d.buttonUrl, '#');
      link.target = '_blank'; link.rel = 'noopener noreferrer';
      link.appendChild(document.createTextNode(d.buttonText));
      link.insertAdjacentHTML('beforeend',
        '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
        '<path d="M14 4h6v6M20 4l-8.5 8.5M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" ' +
        'stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>');
      c.appendChild(r(link));
    }
    return { content: c, label: d.title || 'Venue' };
  }

  /* ---- a closing blessing over the photograph ---- */
  function cardBlessing(d) {
    var c = el('div', 'c c--bless');
    var pic = picture({ video: d.video || MEDIA.blessingVideo, poster: d.image || MEDIA.hero });
    c.appendChild(pic.node);

    if (d.eyebrow) c.appendChild(r(el('p', 'eyebrow', d.eyebrow)));
    if (d.title)   c.appendChild(r(el('h2', 'display display--sm', d.title)));
    c.appendChild(rule());
    c.appendChild(el('div', 'spacer'));
    if (d.message) c.appendChild(r(el('p', 'bless', d.message)));
    c.appendChild(el('div', 'spacer'));
    if (d.signoff) c.appendChild(r(el('p', 'signoff', d.signoff)));
    if (d.name)    c.appendChild(r(el('p', 'namecard', d.name)));
    return { content: c, media: pic, label: d.title || 'Blessings' };
  }


  /* ------------------------------------------------------------ assemble
     The deck is built from the cards list in edit/content.js. Add a block
     there and a card appears here, dots and all. */
  var KINDS = {
    photo:    cardPhoto,
    timeline: cardTimeline,
    message:  cardMessage,
    location: cardLocation,
    blessing: cardBlessing
  };

  var DEFS = Array.isArray(CFG.cards) && CFG.cards.length ? CFG.cards : [{ type: 'message', title: 'Invitation' }];
  var floatLayer = el('div', 'deck__float');
  deck.appendChild(floatLayer);

  DEFS.forEach(function (def, i) {
    var make = KINDS[def && def.type] || cardMessage;
    var spec = make(def || {});
    var node = shell(spec.content, (i + 1) + ' of ' + DEFS.length + ' — ' + spec.label);
    floatLayer.appendChild(node);
    cards.push({
      node: node,
      tilt: node.querySelector('.card__tilt'),
      sheen: node.querySelector('.card__sheen'),
      media: spec.media || null,
      label: spec.label
    });
  });

  var N = cards.length;

  for (var d = 0; d < N; d++) {
    (function (idx) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'bead';
      b.appendChild(el('i'));
      b.setAttribute('aria-label', 'Card ' + (idx + 1) + ' of ' + N);
      b.addEventListener('click', function () { goTo(idx); });
      beads.appendChild(b);
    })(d);
  }
  var beadEls = beads.querySelectorAll('.bead');
  document.getElementById('nextWord').textContent = text(NAV.nextText, 'Next');
  prevBtn.setAttribute('aria-label', text(NAV.previousText, 'Back') + ' — previous card');
  nextBtn.setAttribute('aria-label', text(NAV.nextText, 'Next') + ' — next card');


  /* ================================================================ stack */
  var KEY_FLAT = [
    { k: -1, x: -110, y: 0, z: 0, ry: 0, rz: 0, s: 1,    o: 0, b: 0 },
    { k:  0, x:    0, y: 0, z: 0, ry: 0, rz: 0, s: 1,    o: 1, b: 0 },
    { k:  1, x:    0, y: 0, z: 0, ry: 0, rz: 0, s: .97,  o: 0, b: 0 },
    { k:  2, x:    0, y: 0, z: 0, ry: 0, rz: 0, s: .95,  o: 0, b: 0 },
    { k:  3, x:    0, y: 0, z: 0, ry: 0, rz: 0, s: .93,  o: 0, b: 0 }
  ];

  /* y is a share of the card's own height — large enough that the cards
     underneath genuinely show below the one in front. */
  var KEY_DEEP = [
    { k: -1, x: -114, y: -1.0, z:   60, ry: 12, rz: -5, s: .970, o: 0,   b: 3.0 },
    { k:  0, x:    0, y:    0, z:   36, ry:  0, rz:  0, s: 1,    o: 1,   b: 0   },
    { k:  1, x:    0, y:  9.4, z:  -66, ry:  0, rz:  0, s: .945, o: 1,   b: .6  },
    { k:  2, x:    0, y: 16.5, z: -140, ry:  0, rz:  0, s: .900, o: .78, b: 1.6 },
    { k:  3, x:    0, y: 22.0, z: -215, ry:  0, rz:  0, s: .870, o: 0,   b: 2.6 }
  ];
  var KEY = REDUCED ? KEY_FLAT : KEY_DEEP;

  function sample(eff) {
    var e = clamp(eff, -1, 3);
    var i = Math.floor(e) + 1;
    if (i >= KEY.length - 1) i = KEY.length - 2;
    var a = KEY[i], b = KEY[i + 1];
    var u = (e - a.k) / (b.k - a.k);
    return {
      x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, z: a.z + (b.z - a.z) * u,
      ry: a.ry + (b.ry - a.ry) * u, rz: a.rz + (b.rz - a.rz) * u,
      s: a.s + (b.s - a.s) * u, o: a.o + (b.o - a.o) * u, b: a.b + (b.b - a.b) * u
    };
  }

  var live = false;
  var cur = 0, t = 0, vel = 0;
  var tiltX = 0, tiltY = 0, tiltTX = 0, tiltTY = 0;
  var root = document.documentElement;
  var lastPar = 9;

  function render() {
    var par = Math.round(t * 1000) / 1000;
    if (par !== lastPar) { lastPar = par; root.style.setProperty('--par', par); }

    for (var i = 0; i < N; i++) {
      var rel = i - cur, eff, flip = false;
      if (t >= 0) { eff = rel - t; }
      else {
        var u = -t;
        if (rel <= 0) { eff = -rel - u; flip = true; } else { eff = rel + u; }
      }

      var rec = cards[i], card = rec.node;
      if (eff <= -1.02 || eff >= 2.985) {
        if (card.getAttribute('data-hidden') !== '1') card.setAttribute('data-hidden', '1');
        continue;
      }
      if (card.getAttribute('data-hidden') === '1') card.removeAttribute('data-hidden');

      var v = sample(eff);
      var x = v.x, ry = v.ry, rz = v.rz;
      if (flip && eff < 0) { x = -x; ry = -ry; rz = -rz; }

      /* a card being pushed away stays solid for most of the journey and only
         dissolves once it has genuinely left the stage */
      if (eff < 0 && !REDUCED) {
        var p = clamp((-eff - 0.5) / 0.5, 0, 1);
        v.o = 1 - p * p;
        v.b = 3 * p;
      }

      var st = card.style;
      st.setProperty('--x', x.toFixed(2) + '%');
      st.setProperty('--y', v.y.toFixed(2) + '%');
      st.setProperty('--z', v.z.toFixed(1) + 'px');
      st.setProperty('--ry', ry.toFixed(2) + 'deg');
      st.setProperty('--rz', rz.toFixed(2) + 'deg');
      st.setProperty('--s', v.s.toFixed(4));
      st.setProperty('--o', v.o.toFixed(3));

      if (i === cur) {
        rec.tilt.style.setProperty('--tiltX', tiltX.toFixed(2) + 'deg');
        rec.tilt.style.setProperty('--tiltY', tiltY.toFixed(2) + 'deg');
        if (rec.sheen) rec.sheen.style.setProperty('--gx', (-t * 48 + tiltY * 4).toFixed(1) + 'px');
      } else if (rec.tilt.style.getPropertyValue('--tiltX') !== '0deg') {
        rec.tilt.style.setProperty('--tiltX', '0deg');
        rec.tilt.style.setProperty('--tiltY', '0deg');
      }
    }
  }


  /* =============================================================== spring */
  var raf = 0, target = 0, springing = false, lastTime = 0;
  var STIFF = REDUCED ? 420 : 208;
  var DAMP  = REDUCED ? 44  : 27;

  function tick(now) {
    raf = 0;
    var dt = lastTime ? Math.min(0.034, (now - lastTime) / 1000) : 0.016;
    lastTime = now;
    var busy = false;

    if (springing) {
      var steps = Math.max(1, Math.ceil(dt / (1 / 240)));
      var h = dt / steps;
      for (var s = 0; s < steps; s++) {
        var acc = -STIFF * (t - target) - DAMP * vel;
        vel += acc * h; t += vel * h;
      }
      if (target !== 0 && Math.abs(t) >= 0.985) commit(target > 0 ? 1 : -1);
      else if (target === 0 && Math.abs(t) < 0.0006 && Math.abs(vel) < 0.03) { t = 0; vel = 0; springing = false; }
      else busy = true;
    }

    var kf = 1 - Math.pow(0.0015, dt);
    tiltX += (tiltTX - tiltX) * kf;
    tiltY += (tiltTY - tiltY) * kf;
    if (Math.abs(tiltX - tiltTX) > .012 || Math.abs(tiltY - tiltTY) > .012) busy = true;

    render();
    if (busy || drag.on) start();
    else { lastTime = 0; syncVideo(); }
  }
  function start() { if (!raf) raf = requestAnimationFrame(tick); }
  function settle(to) { target = to; springing = true; lastTime = 0; start(); }

  function commit(dir) {
    var next = clamp(cur + dir, 0, N - 1);
    t = 0; vel = 0; springing = false; target = 0;
    if (next !== cur) { cur = next; activate(cur); onNavigated(); }
    render();
  }

  function goTo(index) {
    if (!live) return;
    var next = clamp(index, 0, N - 1);
    if (next === cur) return;
    if (Math.abs(next - cur) === 1) { step(next > cur ? 1 : -1); return; }
    cur = next; t = 0; vel = 0; springing = false; target = 0;
    activate(cur); render(); onNavigated();
  }


  /* ================================================================ video
     Only ever decode one, and never while the cards are moving — that is
     exactly when the compositor needs the headroom. */
  function syncVideo() {
    var busy = drag.on || springing;
    for (var j = 0; j < N; j++) {
      var m = cards[j].media;
      if (!m) continue;
      if (j === cur && !busy) m.play(); else m.pause();
    }
  }


  /* ============================================================= activate */
  function activate(i) {
    body.setAttribute('data-card', String(i + 1));
    for (var j = 0; j < N; j++) {
      cards[j].node.setAttribute('aria-hidden', j === i ? 'false' : 'true');
      if (cards[j].media && Math.abs(j - i) <= 1) cards[j].media.prime();
    }
    var card = cards[i].node;
    card.classList.remove('is-entering');
    void card.offsetWidth;
    card.classList.add('is-entering');

    for (var k = 0; k < beadEls.length; k++) {
      beadEls[k].setAttribute('aria-current', k === i ? 'true' : 'false');
      beadEls[k].classList.toggle('is-past', k < i);
    }
    syncVideo();
    prevBtn.setAttribute('aria-disabled', i === 0 ? 'true' : 'false');
    nextBtn.setAttribute('aria-disabled', i === N - 1 ? 'true' : 'false');
    srStatus.textContent = 'Card ' + (i + 1) + ' of ' + N + '. ' + cards[i].label + '.';
  }


  /* ============================================================= guidance
     The hand shows the swipe on every card except the last one, where there
     is nothing further to go to. It repeats longest on the first card, so
     nobody misses it. */
  var moves = 0, teachTimer = 0, teachEnd = 0;
  var hand = teach.querySelector('.teach__hand');

  function setHint(msg) {
    if (!msg) { hint.classList.remove('is-on'); return; }
    hint.textContent = msg; hint.classList.add('is-on');
  }

  function showTeach() {
    if (cur >= N - 1) { hideHand(); setHint(''); return; }

    var first = (cur === 0);
    teach.hidden = false;
    teach.classList.toggle('teach--first', first);

    /* restart the loop from the beginning each time a card arrives */
    if (hand) { hand.style.animation = 'none'; void hand.offsetWidth; hand.style.animation = ''; }

    /* the card leans with the hand, so the one behind it shows itself */
    for (var j = 0; j < N; j++) cards[j].node.classList.remove('is-hinting');
    var top = cards[cur].node;
    top.classList.toggle('hint--first', first);
    void top.offsetWidth;
    top.classList.add('is-hinting');

    setHint(first ? text(NAV.swipeInstruction, 'Swipe to continue')
                  : text(NAV.swipeMore, 'Swipe for more'));
    nextBtn.classList.toggle('is-inviting', first);

    window.clearTimeout(teachEnd);
    /* four passes on the first card, two on the rest */
    var loops = first ? 4 : 2;
    teachEnd = window.setTimeout(hideHand, REDUCED ? 2600 : (loops * 3200 + 400));
  }

  function hideHand() {
    window.clearTimeout(teachEnd);
    teach.hidden = true;
    nextBtn.classList.remove('is-inviting');
    /* let go of the card the moment a finger touches it */
    for (var j = 0; j < N; j++) cards[j].node.classList.remove('is-hinting');
  }

  /* every card asks again, a moment after it settles */
  function cueTeach() {
    window.clearTimeout(teachTimer);
    hideHand();
    if (cur >= N - 1) { setHint(''); return; }
    teachTimer = window.setTimeout(showTeach, moves === 0 ? 1100 : 850);
  }

  function onNavigated() {
    moves++;
    cueTeach();
  }


  /* ============================================================== gesture */
  var drag = { on: false, id: null, x0: 0, y0: 0, t0: 0, axis: null, lastN: 0, lastT: 0, vx: 0, span: 0 };
  var box = null;
  function remeasure() { box = deck.getBoundingClientRect(); }
  function width() { return (box && box.width) || 320; }
  function height() { return (box && box.height) || 560; }
  function canGo(dir) { return dir > 0 ? cur < N - 1 : cur > 0; }
  function resist(raw) {
    if (raw > 0 && !canGo(1))  return Math.min(raw * .26, .15);
    if (raw < 0 && !canGo(-1)) return Math.max(raw * .26, -.15);
    return clamp(raw, -1, 1);
  }

  stage.addEventListener('pointerdown', function (e) {
    if (!live) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    /* Open in Maps, and anything else tappable, must get its own click.
       Capturing the pointer here would swallow it. */
    if (e.target.closest && e.target.closest('a, button')) return;
    drag.on = true; drag.id = e.pointerId;
    drag.x0 = e.clientX; drag.y0 = e.clientY; drag.t0 = t;
    drag.axis = null; drag.lastN = e.clientX; drag.lastT = e.timeStamp; drag.vx = 0;
    drag.span = width();
    springing = false; vel = 0;
    hideHand();
    syncVideo(); remeasure();
    start();
  });

  stage.addEventListener('pointermove', function (e) {
    if (drag.on && e.pointerId === drag.id) {
      var dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
      if (!drag.axis && (Math.abs(dx) > 7 || Math.abs(dy) > 7)) {
        drag.axis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
        /* now that it is a real drag, keep the pointer for ourselves */
        try { stage.setPointerCapture(e.pointerId); } catch (err) {}
        /* start measuring speed along the axis the guest actually chose */
        drag.lastN = drag.axis === 'x' ? e.clientX : e.clientY;
        drag.lastT = e.timeStamp;
        drag.span  = drag.axis === 'x' ? width() : height();
      }
      if (drag.axis) {
        e.preventDefault();
        /* Left/right and up/down both move the deck. Whichever way the guest
           swipes, the card still travels sideways — that is the animation
           they were shown. Swipe left or up for the next card. */
        var along = drag.axis === 'x' ? -dx / width() : -dy / height();
        t = resist(drag.t0 + along);

        var now = drag.axis === 'x' ? e.clientX : e.clientY;
        var span = drag.axis === 'x' ? width() : height();
        var dtms = e.timeStamp - drag.lastT;
        if (dtms > 0) {
          drag.vx = drag.vx * .72 + ((now - drag.lastN) / dtms * 1000) * .28;
          drag.lastN = now; drag.lastT = e.timeStamp;
          drag.span = span;
        }
      }
    }
    if (!REDUCED) {
      if (!box) remeasure();
      var nx = clamp((e.clientX - (box.left + box.width / 2)) / (box.width / 2), -1, 1);
      var ny = clamp((e.clientY - (box.top + box.height / 2)) / (box.height / 2), -1, 1);
      tiltTY = nx * 3.4; tiltTX = -ny * 2.6;
      start();
    }
  });

  function release(e) {
    if (!drag.on || (e && e.pointerId !== drag.id)) return;
    drag.on = false;
    if (drag.axis) { try { stage.releasePointerCapture(drag.id); } catch (err) {} }
    tiltTX = 0; tiltTY = 0;

    var w = drag.span || width();
    var vt = -drag.vx / w;
    /* A flick is fast AND deliberate. A hesitant nudge — which is what an
       unsure guest produces — must always fall back to the card's home. */
    var flick = Math.abs(drag.vx) > 480 && Math.abs(vt) > 1.35 && Math.abs(t) > .10;
    var far = Math.abs(t) > .26;
    var dir = 0;
    if (flick) dir = vt > 0 ? 1 : -1;
    else if (far) dir = t > 0 ? 1 : -1;
    if (dir !== 0 && t * dir < -0.12) dir = 0;

    if (dir !== 0 && canGo(dir)) { vel = vt; settle(dir); }
    else { vel = vt * .4; settle(0); }
  }
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);
  stage.addEventListener('pointerleave', function () {
    if (!REDUCED && !drag.on) { tiltTX = 0; tiltTY = 0; start(); }
  });
  stage.addEventListener('dragstart', function (e) { e.preventDefault(); });


  /* ============================================================== buttons */
  function step(dir) {
    if (!live) return;
    /* Tapping again while a card is still travelling should not be swallowed —
       land the one in flight, then start the next. One tap, one card. */
    if (springing && target !== 0) commit(target > 0 ? 1 : -1);
    if (!canGo(dir)) return;
    vel = dir * 1.5;
    settle(dir);
  }
  nextBtn.addEventListener('click', function () { step(1); });
  prevBtn.addEventListener('click', function () { step(-1); });

  document.addEventListener('keydown', function (e) {
    if (!live) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); step(1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); step(-1); }
    else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    else if (e.key === 'End') { e.preventDefault(); goTo(N - 1); }
  });


  /* ================================================================ music
     It should simply be playing. Browsers block sound until the visitor has
     touched the page, so: try immediately, and if the browser says no, arm it
     to start on the very first touch — which is the curtain or the first
     swipe, moments later either way. */
  var startMusic = function () {};

  (function music() {
    if (!MEDIA.music) { musicBtn.remove(); return; }

    var audio = new Audio();
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0;
    var ready = false, wanted = false, fader = 0;

    audio.addEventListener('canplaythrough', function () { ready = true; musicBtn.hidden = false; });
    audio.addEventListener('canplay', function () { ready = true; musicBtn.hidden = false; });
    audio.addEventListener('loadedmetadata', function () { musicBtn.hidden = false; });
    audio.addEventListener('error', function () { musicBtn.hidden = true; });
    audio.src = MEDIA.music;

    function fade(to, done) {
      window.clearInterval(fader);
      fader = window.setInterval(function () {
        var stepv = to > audio.volume ? .09 : -.08;
        var next = audio.volume + stepv;
        if ((stepv > 0 && next >= to) || (stepv < 0 && next <= to)) {
          audio.volume = to; window.clearInterval(fader); if (done) done();
        } else audio.volume = clamp(next, 0, 1);
      }, 50);
    }
    function lit() {
      musicBtn.hidden = false;
      musicBtn.classList.add('is-playing');
      musicBtn.setAttribute('aria-pressed', 'true');
      musicBtn.setAttribute('aria-label', 'Pause music');
      audio.volume = .16;          /* audible at once, then eased up */
      fade(.55);
    }
    function dim() {
      musicBtn.classList.remove('is-playing');
      musicBtn.setAttribute('aria-pressed', 'false');
      musicBtn.setAttribute('aria-label', 'Play music');
    }

    /* one listener, removed the moment it has done its job */
    function armFirstTouch() {
      var go = function () {
        document.removeEventListener('pointerdown', go, true);
        document.removeEventListener('keydown', go, true);
        if (wanted) attempt();
      };
      document.addEventListener('pointerdown', go, true);
      document.addEventListener('keydown', go, true);
    }

    function attempt() {
      var p = audio.play();
      if (p && p.then) p.then(lit).catch(armFirstTouch); else lit();
    }

    startMusic = function () {
      wanted = true;
      attempt();                                   /* the tap is still live */
      if (!ready) audio.addEventListener('canplay', function () {
        if (wanted && audio.paused) attempt();
      }, { once: true });
    };

    musicBtn.addEventListener('click', function () {
      if (audio.paused) { wanted = true; attempt(); }
      else { wanted = false; fade(0, function () { audio.pause(); dim(); }); }
    });

    /* a backgrounded tab should go quiet */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && !audio.paused) audio.pause();
      else if (!document.hidden && wanted && audio.paused) attempt();
    });
  })();


  /* ============================================================= viewport */
  function measure() {
    root.style.setProperty('--appH', window.innerHeight + 'px');
    box = null;
  }
  measure();
  window.addEventListener('resize', measure);
  window.addEventListener('orientationchange', function () { window.setTimeout(measure, 240); });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      for (var j = 0; j < N; j++) if (cards[j].media) cards[j].media.pause();
    } else if (live) { lastTime = 0; if (springing) start(); syncVideo(); }
  });

  if (motionQuery.addEventListener) {
    motionQuery.addEventListener('change', function (e) {
      REDUCED = e.matches;
      KEY = REDUCED ? KEY_FLAT : KEY_DEEP;
      tiltTX = tiltTY = tiltX = tiltY = 0;
      render();
    });
  }


  /* =============================================================== curtain
     A card hangs on the curtain and the guest opens it themselves. That tap
     is also what lets the browser play sound, so the music starts with it. */
  if (CFG.pageTitle) document.title = CFG.pageTitle;

  var CUR = CFG.curtain || {};
  var curtain  = document.getElementById('curtain');
  var openBtn  = document.getElementById('openBtn');
  var cMarkBox = document.getElementById('curtainMark');

  function fill(id, value) {
    var n = document.getElementById(id);
    if (!n) return;
    if (value) n.textContent = value; else n.remove();
  }
  if (MEDIA.paper) curtain.style.setProperty('--paper', 'url("' + MEDIA.paper + '")');

  fill('curtainMantra',  CUR.mantra);
  fill('curtainInvites', CUR.invites);
  fill('curtainNote',    CUR.note);
  fill('openLabel',      text(CUR.button, 'Open Invitation'));
  openBtn.setAttribute('aria-label', text(CUR.button, 'Open Invitation'));

  if (MEDIA.mark) {
    var cm = new Image();
    cm.alt = ''; cm.src = MEDIA.mark;
    cm.addEventListener('error', function () { cMarkBox.remove(); });
    cMarkBox.appendChild(cm);
  } else cMarkBox.remove();

  var opened = false;
  function open() {
    if (opened) return;
    opened = true;

    /* fire this first, while the tap is still the browser's "user gesture" */
    startMusic();

    if (cards[0].media) cards[0].media.prime();
    body.classList.add('is-opening');
    window.setTimeout(function () {
      body.classList.add('is-open');
      curtain.setAttribute('aria-hidden', 'true');
      live = true;
      activate(0);
      render();
      var frame = document.getElementById('frame');
      frame.setAttribute('tabindex', '-1');
      try { frame.focus({ preventScroll: true }); } catch (e) {}
      cueTeach();
    }, REDUCED ? 360 : 1500);
  }

  openBtn.addEventListener('click', open);

  render();
})();
