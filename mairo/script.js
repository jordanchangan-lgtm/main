// Mairo — product grid, filters, campaign strip, EN/AR, asset fallbacks.

(function () {
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // ---------- Catalogue ----------

  const SETS = ['red', 'cream', 'pink', 'purple'];

  // Each piece in each set: [hex, colour name key]. From the brief.
  const PIECES = [
    {
      key: 'tank',
      colours: { red: ['#80E0E6', 'aqua'], cream: ['#AB907B', 'taupe'], pink: ['#49121F', 'burgundy'], purple: ['#E2EBBE', 'lime'] },
    },
    {
      key: 'bra',
      colours: { red: ['#D8382C', 'red'], cream: ['#F3ECE4', 'ivory'], pink: ['#F698AC', 'rose'], purple: ['#D178D8', 'orchid'] },
    },
    {
      key: 'trouser',
      colours: { red: ['#1E2A47', 'navy'], cream: ['#1B191A', 'black'], pink: ['#4D151B', 'wine'], purple: ['#181617', 'black'] },
    },
  ];

  // Prices aren't set yet; fill these in and they appear on the cards.
  const PRICES = { tank: '', bra: '', trouser: '' };

  // ---------- Copy ----------

  const EN = {
    'p.tank': 'Asymmetric Tank', 'p.bra': 'Racerback Sports Bra', 'p.trouser': 'Wide-Leg Trouser',
    'k.aqua': 'Aqua', 'k.taupe': 'Taupe', 'k.burgundy': 'Burgundy', 'k.lime': 'Lime',
    'k.red': 'Red', 'k.ivory': 'Ivory', 'k.rose': 'Rose', 'k.orchid': 'Orchid',
    'k.navy': 'Navy', 'k.black': 'Black', 'k.wine': 'Wine',
  };

  const AR = {
    notice: 'المجموعة ٠١. ثلاث قطع، أربعة ألوان.',
    'nav.shop': 'تسوّق', 'nav.sets': 'الأطقم', 'nav.campaign': 'الحملة', 'nav.search': 'بحث', 'nav.bag': 'الحقيبة (0)',
    'hero.credit': 'المجموعة ٠١', 'hero.word': 'الظهيرة', 'cta.shop': 'تسوّق',
    'set.cream': 'الطقم الكريمي', 'set.pink': 'الطقم الوردي', 'set.purple': 'الطقم البنفسجي',
    'cta.discover': 'اكتشف', 'cta.campaign': 'شاهد الحملة',
    'shop.title': 'المجموعة ٠١', 'f.all': 'الكل',
    'c.red': 'أحمر', 'c.cream': 'كريمي', 'c.pink': 'وردي', 'c.purple': 'بنفسجي',
    'campaign.title': 'الحملة',
    'foot.lang': 'اللغة', 'foot.about': 'عن مايرو', 'foot.contact': 'تواصل',
    'foot.ig': 'إنستغرام', 'foot.shipping': 'الشحن', 'foot.returns': 'الإرجاع',
    'foot.faq': 'الأسئلة الشائعة', 'foot.legal': 'الشروط والخصوصية',
    'foot.news': 'اشترك في النشرة البريدية', 'foot.email': 'بريدك الإلكتروني',
    'p.tank': 'قميص غير متماثل', 'p.bra': 'حمّالة صدر رياضية', 'p.trouser': 'بنطال واسع',
    'k.aqua': 'أزرق مائي', 'k.taupe': 'بنّي رمادي', 'k.burgundy': 'عنابي', 'k.lime': 'ليموني',
    'k.red': 'أحمر', 'k.ivory': 'عاجي', 'k.rose': 'وردي', 'k.orchid': 'أرجواني',
    'k.navy': 'كحلي', 'k.black': 'أسود', 'k.wine': 'خمري',
  };

  $$('[data-i18n]').forEach((n) => (EN[n.dataset.i18n] ??= n.textContent));
  $$('[data-i18n-ph]').forEach((n) => (EN[n.dataset.i18nPh] ??= n.placeholder));

  let lang = 'en';
  const t = (k) => (lang === 'ar' ? AR[k] : undefined) ?? EN[k] ?? k;

  // ---------- Images ----------

  function img(src, cls) {
    const el = new Image();
    el.alt = '';
    el.loading = 'lazy';
    el.decoding = 'async';
    if (cls) el.className = cls;
    el.src = src;
    return el;
  }

  document.addEventListener('error', (e) => {
    const el = e.target;
    if (!(el instanceof HTMLImageElement)) return;
    if (el.classList.contains('logo')) return el.classList.add('is-missing');
    if (el.classList.contains('alt')) return el.remove();
    el.closest('.ph')?.classList.add('is-empty');
  }, true);

  // ---------- Product grid ----------

  let filter = 'all';

  function buildGrid() {
    const grid = $('#grid');
    grid.innerHTML = '';
    SETS.forEach((set) =>
      PIECES.forEach((p) => {
        const [hex, colour] = p.colours[set];
        const a = document.createElement('a');
        a.className = 'card';
        a.href = '#';
        a.dataset.set = set;
        a.hidden = filter !== 'all' && filter !== set;
        a.innerHTML = `
          <div class="card__img ph"></div>
          <div class="card__meta">
            <span class="card__name">${t('p.' + p.key)}</span>
            <span class="card__price">${PRICES[p.key]}</span>
            <span class="card__colour">${t('k.' + colour)}</span>
            <span class="chips">${SETS.map((s) => `<i class="${s === set ? 'on' : ''}" style="--c:${p.colours[s][0]}"></i>`).join('')}</span>
          </div>`;
        // Front on the card, back on hover.
        $('.card__img', a).append(img(`assets/product/${p.key}-${set}.jpg`), img(`assets/product/${p.key}-${set}-back.jpg`, 'alt'));
        grid.appendChild(a);
      })
    );
  }

  function setFilter(f) {
    filter = f;
    $$('#filters button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.f === f)));
    $$('.card').forEach((c) => (c.hidden = f !== 'all' && c.dataset.set !== f));
  }

  $$('#filters button').forEach((b) => b.addEventListener('click', () => setFilter(b.dataset.f)));
  $$('[data-filter]').forEach((a) => a.addEventListener('click', () => setFilter(a.dataset.filter)));

  // ---------- Campaign strip ----------

  function buildStrip() {
    const strip = $('#strip');
    for (let i = 1; i <= 17; i++) {
      const box = document.createElement('div');
      box.className = 'ph';
      box.append(img(`assets/moodboard/${String(i).padStart(2, '0')}.jpg`));
      strip.appendChild(box);
    }
    let down = false, x0 = 0, s0 = 0;
    strip.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') return;
      down = true; x0 = e.clientX; s0 = strip.scrollLeft;
      strip.classList.add('is-drag');
    });
    window.addEventListener('pointermove', (e) => down && (strip.scrollLeft = s0 - (e.clientX - x0)));
    window.addEventListener('pointerup', () => { down = false; strip.classList.remove('is-drag'); });
  }

  // ---------- Language ----------

  function setLang(next) {
    lang = next;
    root.lang = next;
    root.dir = next === 'ar' ? 'rtl' : 'ltr';
    $$('[data-i18n]').forEach((n) => (n.textContent = t(n.dataset.i18n)));
    $$('[data-i18n-ph]').forEach((n) => (n.placeholder = t(n.dataset.i18nPh)));
    $('#lang').textContent = next === 'ar' ? 'English' : 'العربية';
    buildGrid();
    try { localStorage.setItem('mairo-lang', next); } catch (e) {}
  }

  const toggle = () => setLang(lang === 'ar' ? 'en' : 'ar');
  $('#lang').addEventListener('click', toggle);
  $('#lang2').addEventListener('click', toggle);

  // ---------- Init ----------

  $$('img').forEach((el) => {
    if (!el.complete || el.naturalWidth) return;
    if (el.classList.contains('logo')) el.classList.add('is-missing');
    else el.closest('.ph')?.classList.add('is-empty');
  });

  $('#year').textContent = new Date().getFullYear();
  buildGrid();
  buildStrip();

  let saved = null;
  try { saved = localStorage.getItem('mairo-lang'); } catch (e) {}
  if (saved === 'ar') setLang('ar');
})();
