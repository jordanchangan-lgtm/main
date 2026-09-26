// Mairo — colourway switcher, EN/AR toggle, moodboard, asset fallbacks.

(function () {
  const root = document.documentElement;

  // ---------- Colourways ----------

  const SETS = {
    red: { bra: '#D8382C', tank: '#80E0E6', trouser: '#1E2A47' },
    cream: { bra: '#F3ECE4', tank: '#AB907B', trouser: '#1B191A' },
    pink: { bra: '#F698AC', tank: '#49121F', trouser: '#4D151B' },
    purple: { bra: '#D178D8', tank: '#E2EBBE', trouser: '#181617' },
  };

  // Carousel frames per set, as saved in 02 Posts/. Purple uses the
  // eye-level version of frame 1.
  const POSTS = {
    red: ['red-1.jpg', 'red-2.jpg', 'red-3.jpg'],
    cream: ['cream-1.jpg', 'cream-2.jpg', 'cream-3.jpg'],
    pink: ['pink-1.jpg', 'pink-2.jpg', 'pink-3.jpg'],
    purple: ['purple-1-eyelevel.jpg', 'purple-2.jpg', 'purple-3.jpg'],
  };

  const photoIds = ['setPhoto', 'setPhoto2', 'setPhoto3'];
  const tabs = document.querySelectorAll('[data-pick]');

  function pickSet(name) {
    root.dataset.set = name;
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t.dataset.pick === name)));
    document.querySelectorAll('[data-hex]').forEach((el) => {
      el.textContent = SETS[name][el.dataset.hex];
    });
    photoIds.forEach((id, i) => {
      const img = document.getElementById(id);
      const file = POSTS[name][i];
      img.closest('.frame').classList.remove('is-empty');
      img.closest('.frame').dataset.file = 'posts/' + file;
      img.src = 'assets/posts/' + file;
    });
  }

  tabs.forEach((t) => t.addEventListener('click', () => pickSet(t.dataset.pick)));

  // ---------- Language ----------

  const AR = {
    'nav.set': 'الطقم',
    'nav.pieces': 'القطع',
    'nav.board': 'لوحة الإلهام',
    'hero.line': 'ثلاث قطع. أربعة ألوان.',
    'set.title': 'اختاري لونًا.',
    'c.red': 'أحمر',
    'c.cream': 'كريمي',
    'c.pink': 'وردي',
    'c.purple': 'بنفسجي',
    'p.bra': 'حمّالة صدر رياضية',
    'p.tank': 'قميص غير متماثل',
    'p.trouser': 'بنطال واسع',
    'p.tank.line': 'حمّالة واحدة. خطّ مائل واحد.',
    'p.bra.line': 'الظهر. قطعة واحدة.',
    'p.trouser.line': 'واسع. بسيط. حتى الأرض.',
    'board.title': 'الظهيرة. الجصّ. اللون.',
  };

  const nodes = document.querySelectorAll('[data-i18n]');
  const EN = {};
  nodes.forEach((n) => (EN[n.dataset.i18n] = n.textContent));

  const langBtn = document.getElementById('lang');

  function setLang(lang) {
    const dict = lang === 'ar' ? AR : EN;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    nodes.forEach((n) => {
      n.textContent = dict[n.dataset.i18n] || EN[n.dataset.i18n];
    });
    langBtn.textContent = lang === 'ar' ? 'EN' : 'عربي';
    try {
      localStorage.setItem('mairo-lang', lang);
    } catch (e) {}
  }

  langBtn.addEventListener('click', () => setLang(root.lang === 'ar' ? 'en' : 'ar'));

  // ---------- Moodboard ----------

  // 17 prints in board order. Until the tiles are copied in, each shows as a
  // block of colour from the four sets and the peach ground.
  const TILE_COLOURS = ['#D8382C', '#80E0E6', '#F3ECE4', '#F698AC', '#D178D8', '#E2EBBE', '#1E2A47', '#AB907B', '#4D151B'];
  const RATIOS = ['4 / 5', '1 / 1', '3 / 4', '4 / 5', '2 / 3'];
  const grid = document.getElementById('boardGrid');

  for (let i = 1; i <= 17; i++) {
    const no = String(i).padStart(2, '0');
    const tile = document.createElement('figure');
    tile.className = 'tile';
    tile.style.setProperty('--r', ((i * 37) % 7) - 3 + 'deg');
    tile.innerHTML =
      '<div class="tile__img" style="--c:' + TILE_COLOURS[i % TILE_COLOURS.length] +
      ';--ar:' + RATIOS[i % RATIOS.length] + '">' +
      '<img src="assets/moodboard/' + no + '.jpg" alt="" loading="lazy" /></div>' +
      '<span class="tile__no">' + no + '</span>';
    grid.appendChild(tile);
  }

  // ---------- Missing-asset fallbacks ----------

  // A wordmark that hasn't been copied in yet becomes an empty outlined slot
  // at the same proportions — never typeset text.
  function logoFallback(img) {
    const slot = document.createElement('span');
    slot.className = 'logo-slot ' + img.className.replace('logo ', '');
    slot.style.aspectRatio = img.getAttribute('width') + ' / ' + img.getAttribute('height');
    slot.setAttribute('role', 'img');
    slot.setAttribute('aria-label', img.alt);
    img.replaceWith(slot);
  }

  function onImgError(e) {
    const img = e.target;
    if (!(img instanceof HTMLImageElement)) return;
    if (img.classList.contains('logo')) return logoFallback(img);
    const box = img.closest('.frame, .tile__img');
    if (box) box.classList.add('is-empty');
  }

  document.addEventListener('error', onImgError, true);
  // Catch any that failed before the listener was attached.
  document.querySelectorAll('img').forEach((img) => {
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) {
      onImgError({ target: img });
    }
  });

  // ---------- Init ----------

  document.getElementById('year').textContent = new Date().getFullYear();
  pickSet('red');

  let saved = null;
  try {
    saved = localStorage.getItem('mairo-lang');
  } catch (e) {}
  if (saved === 'ar') setLang('ar');
})();
