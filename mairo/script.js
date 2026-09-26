// Mairo — sets, colour story, pieces, campaign strip, EN/AR, asset fallbacks.

(function () {
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // ---------- Data ----------

  const SETS = {
    red: { bra: '#D8382C', tank: '#80E0E6', trouser: '#1E2A47', frames: ['red-1', 'red-2', 'red-3'] },
    cream: { bra: '#F3ECE4', tank: '#AB907B', trouser: '#1B191A', frames: ['cream-1', 'cream-2', 'cream-3'] },
    pink: { bra: '#F698AC', tank: '#49121F', trouser: '#4D151B', frames: ['pink-1', 'pink-2', 'pink-3'] },
    purple: { bra: '#D178D8', tank: '#E2EBBE', trouser: '#181617', frames: ['purple-1-eyelevel', 'purple-2', 'purple-3'] },
  };
  const ORDER = ['red', 'cream', 'pink', 'purple'];

  const PIECES = [
    { key: 'tank', name: 'p.tank', line: 'p.tank.line' },
    { key: 'bra', name: 'p.bra', line: 'p.bra.line' },
    { key: 'trouser', name: 'p.trouser', line: 'p.trouser.line' },
  ];

  const STORY = {
    red: 'story.red',
    cream: 'story.cream',
    pink: 'story.pink',
    purple: 'story.purple',
  };

  const EN = {
    'c.red': 'Red', 'c.cream': 'Cream', 'c.pink': 'Pink', 'c.purple': 'Purple',
    'p.tank': 'Asymmetric tank', 'p.bra': 'Racerback sports bra', 'p.trouser': 'Wide-leg trousers',
    'p.tank.line': 'One strap. One diagonal.',
    'p.bra.line': 'The back. One piece.',
    'p.trouser.line': 'Wide. Plain. To the floor.',
    'story.red': 'One panel. Nothing crosses.',
    'story.cream': 'The back. One piece.',
    'story.pink': 'Fold everything. Nothing creases.',
    'story.purple': 'Wide to the floor.',
    'set.suffix': 'set',
    'ticker': ['Three pieces. Four colours.', 'Red. Cream. Pink. Purple.', 'Midday. Plaster. Colour.'],
  };

  const AR = {
    'nav.sets': 'الأطقم', 'nav.pieces': 'القطع', 'nav.campaign': 'الحملة', 'nav.bag': 'الحقيبة (0)',
    'hero.line': 'ثلاث قطع. أربعة ألوان.',
    'cta.shop': 'تسوّق الطقم', 'cta.campaign': 'شاهد الحملة', 'cta.shopshort': 'تسوّق',
    'sets.title': 'الأطقم', 'sets.count': '٤ ألوان',
    'pieces.title': 'القطع', 'pieces.count': '٣ تصاميم',
    'campaign.title': 'الحملة', 'campaign.line': 'الظهيرة. الجصّ. اللون.',
    'foot.join': 'انضمّ إلى القائمة.', 'foot.submit': 'اشترك',
    'foot.ig': 'إنستغرام', 'foot.contact': 'تواصل', 'foot.shipping': 'الشحن',
    'c.red': 'أحمر', 'c.cream': 'كريمي', 'c.pink': 'وردي', 'c.purple': 'بنفسجي',
    'p.tank': 'قميص غير متماثل', 'p.bra': 'حمّالة صدر رياضية', 'p.trouser': 'بنطال واسع',
    'p.tank.line': 'حمّالة واحدة. خطّ مائل واحد.',
    'p.bra.line': 'الظهر. قطعة واحدة.',
    'p.trouser.line': 'واسع. بسيط. حتى الأرض.',
    'story.red': 'لوح واحد. لا شيء يتقاطع.',
    'story.cream': 'الظهر. قطعة واحدة.',
    'story.pink': 'اطوِ كل شيء. لا شيء يتجعّد.',
    'story.purple': 'واسع حتى الأرض.',
    'set.suffix': 'طقم',
    'ticker': ['ثلاث قطع. أربعة ألوان.', 'أحمر. كريمي. وردي. بنفسجي.', 'الظهيرة. الجصّ. اللون.'],
  };

  // Static strings in the HTML become the English dictionary.
  $$('[data-i18n]').forEach((n) => (EN[n.dataset.i18n] ??= n.textContent));

  let lang = 'en';
  const t = (k) => (lang === 'ar' ? AR[k] : undefined) ?? EN[k];

  // ---------- Image helper ----------

  // Every photo sits on a colour field; a missing file just leaves the field.
  function img(src, cls = '') {
    const el = new Image();
    el.alt = '';
    el.loading = 'lazy';
    el.decoding = 'async';
    if (cls) el.className = cls;
    el.src = src;
    return el;
  }

  function markLoaded(el) {
    const box = el.closest('.ph');
    if (!box) return;
    if (el.naturalWidth) box.classList.add('has-img');
  }

  document.addEventListener('load', (e) => e.target instanceof HTMLImageElement && markLoaded(e.target), true);
  document.addEventListener('error', (e) => {
    const el = e.target;
    if (!(el instanceof HTMLImageElement)) return;
    if (el.classList.contains('logo')) return el.classList.add('is-missing');
    const box = el.closest('.ph');
    if (box && !el.classList.contains('alt')) box.classList.add('is-empty');
    else el.remove();
  }, true);

  // ---------- Ticker ----------

  function buildTicker() {
    const track = $('#ticker');
    const lines = t('ticker');
    const dots = ORDER.map((s) => SETS[s].bra);
    let html = '';
    for (let r = 0; r < 4; r++) {
      lines.forEach((l, i) => (html += `<span style="--dot:${dots[(i + r) % 4]}">${l}</span>`));
    }
    track.innerHTML = html;
  }

  // ---------- Sets grid ----------

  function buildSets() {
    const grid = $('#setsGrid');
    grid.innerHTML = '';
    ORDER.forEach((name) => {
      const s = SETS[name];
      const a = document.createElement('a');
      a.href = '#pieces';
      a.className = 'setcard';
      a.dataset.pick = name;
      a.innerHTML = `
        <div class="setcard__img ph" style="--ph:${s.bra}">
          <div class="setcard__blocks"><i style="background:${s.bra}"></i><i style="background:${s.tank}"></i><i style="background:${s.trouser}"></i></div>
        </div>
        <div class="setcard__info">
          <span class="setcard__name">${t('c.' + name)} ${t('set.suffix')}</span>
          <span class="dots"><i style="background:${s.bra}"></i><i style="background:${s.tank}"></i><i style="background:${s.trouser}"></i></span>
        </div>`;
      const box = $('.setcard__img', a);
      box.append(img(`assets/posts/${s.frames[0]}.jpg`), img(`assets/posts/${s.frames[2]}.jpg`, 'alt'));
      grid.appendChild(a);
    });
  }

  // ---------- Pieces ----------

  const chosen = { tank: 'red', bra: 'red', trouser: 'red' };

  function pieceImage(card, piece, set) {
    const box = $('.piece__img', card);
    box.style.setProperty('--ph', SETS[set][piece.key]);
    box.classList.remove('is-empty', 'has-img');
    $$('img', box).forEach((i) => i.remove());
    box.append(img(`assets/product/${piece.key}-${set}.jpg`));
    $$('.swatches button', card).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.set === set)));
  }

  function buildPieces() {
    const grid = $('#piecesGrid');
    grid.innerHTML = '';
    PIECES.forEach((p) => {
      const card = document.createElement('article');
      card.className = 'piece';
      card.innerHTML = `
        <div class="piece__img ph"></div>
        <div class="piece__info">
          <span class="piece__name">${t(p.name)}</span>
          <span class="swatches">${ORDER.map(
            (s) => `<button type="button" data-set="${s}" style="--c:${SETS[s][p.key]}" aria-label="${t('c.' + s)}"></button>`
          ).join('')}</span>
          <span class="piece__line">${t(p.line)}</span>
        </div>`;
      $$('.swatches button', card).forEach((b) =>
        b.addEventListener('click', () => {
          chosen[p.key] = b.dataset.set;
          pieceImage(card, p, b.dataset.set);
        })
      );
      pieceImage(card, p, chosen[p.key]);
      grid.appendChild(card);
    });
  }

  // Picking a set anywhere sets all three pieces to it.
  document.addEventListener('click', (e) => {
    const pick = e.target.closest('[data-pick]');
    if (!pick) return;
    PIECES.forEach((p) => (chosen[p.key] = pick.dataset.pick));
    buildPieces();
  });

  // ---------- Colour story ----------

  let storySet = 'red';

  function setStory(name) {
    storySet = name;
    const stage = $('.story__stage');
    stage.dataset.set = name;
    const line = $('#storyLine');
    line.classList.add('is-out');
    setTimeout(() => {
      line.textContent = t(STORY[name]);
      $('#storyName').textContent = t('c.' + name);
      line.classList.remove('is-out');
    }, 250);
  }

  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => en.isIntersecting && en.target.dataset.step !== storySet && setStory(en.target.dataset.step)),
    { rootMargin: '-50% 0px -50% 0px' }
  );
  $$('[data-step]').forEach((s) => io.observe(s));

  // ---------- Campaign strip ----------

  function buildStrip() {
    const strip = $('#strip');
    const colours = ORDER.flatMap((s) => [SETS[s].bra, SETS[s].tank, SETS[s].trouser]).concat('#F0AB96');
    const shapes = ['p', 's', 'p', 'l', 'p', 's'];
    for (let i = 1; i <= 17; i++) {
      const no = String(i).padStart(2, '0');
      const f = document.createElement('figure');
      f.className = `print ph print--${shapes[i % shapes.length]}`;
      f.style.margin = '0';
      f.style.setProperty('--ph', colours[(i * 5) % colours.length]);
      f.append(img(`assets/moodboard/${no}.jpg`));
      f.insertAdjacentHTML('beforeend', `<span class="print__no">${no} / 17</span>`);
      strip.appendChild(f);
    }

    // Drag to scroll on desktop.
    let down = false, x0 = 0, s0 = 0;
    strip.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') return;
      down = true; x0 = e.clientX; s0 = strip.scrollLeft;
      strip.classList.add('is-drag');
    });
    window.addEventListener('pointermove', (e) => down && (strip.scrollLeft = s0 - (e.clientX - x0)));
    window.addEventListener('pointerup', () => { down = false; strip.classList.remove('is-drag'); });
  }

  // ---------- Header ----------

  const head = $('#head');
  const hero = $('.hero');
  const onScroll = () => head.classList.toggle('is-solid', hero.getBoundingClientRect().bottom <= head.offsetHeight);
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- Language ----------

  function setLang(next) {
    lang = next;
    root.lang = next;
    root.dir = next === 'ar' ? 'rtl' : 'ltr';
    $$('[data-i18n]').forEach((n) => (n.textContent = t(n.dataset.i18n)));
    $('#lang').textContent = next === 'ar' ? 'English' : 'عربي';
    buildTicker();
    buildSets();
    buildPieces();
    $('#storyLine').textContent = t(STORY[storySet]);
    $('#storyName').textContent = t('c.' + storySet);
    try { localStorage.setItem('mairo-lang', next); } catch (e) {}
  }

  $('#lang').addEventListener('click', () => setLang(lang === 'ar' ? 'en' : 'ar'));

  // ---------- Init ----------

  // Mark images already present in the HTML.
  $$('img').forEach((el) => {
    if (!el.complete) return;
    if (el.naturalWidth) markLoaded(el);
    else if (el.classList.contains('logo')) el.classList.add('is-missing');
    else el.closest('.ph')?.classList.add('is-empty');
  });

  buildTicker();
  buildSets();
  buildPieces();
  buildStrip();
  $('.story__stage').dataset.set = 'red';
  onScroll();

  let saved = null;
  try { saved = localStorage.getItem('mairo-lang'); } catch (e) {}
  if (saved === 'ar') setLang('ar');
})();
