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

  // The four chapters of the collection, in order. Frames are the carousel
  // posts: 1 is the model in location, 2 the still-life, 3 the odd angle.
  // The four chapters of the collection, two frames each, cleaned of their
  // post overlays and rendered at 4K (assets/sets/).
  const CHAPTERS = [
    { set: 'red', frames: ['red-a', 'red-b'] },
    { set: 'cream', frames: ['cream-a', 'cream-b'] },
    { set: 'pink', frames: ['pink-a', 'pink-b'] },
    { set: 'purple', frames: ['purple-a', 'purple-b'] },
  ];

  // Prices aren't set yet; fill these in and they appear on the cards.
  const PRICES = { tank: '', bra: '', trouser: '' };

  // ---------- Copy ----------

  const EN = {
    'p.tank': 'Asymmetric Tank', 'p.bra': 'Racerback Sports Bra', 'p.trouser': 'Wide-Leg Trouser',
    'k.aqua': 'Aqua', 'k.taupe': 'Taupe', 'k.burgundy': 'Burgundy', 'k.lime': 'Lime',
    'k.red': 'Red', 'k.ivory': 'Ivory', 'k.rose': 'Rose', 'k.orchid': 'Orchid',
    'k.navy': 'Navy', 'k.black': 'Black', 'k.wine': 'Wine',
    'ch.red.name': 'The Red Set', 'ch.cream.name': 'The Cream Set', 'ch.pink.name': 'The Pink Set', 'ch.purple.name': 'The Purple Set',
    'ch.red.line': 'Red on navy. Aqua on top.',
    'ch.cream.line': 'Cream on black. Taupe on top.',
    'ch.pink.line': 'Pink on pink. Burgundy on burgundy.',
    'ch.purple.line': 'Orchid on black. Lime on top.',
    'ch.red.desc': 'A red racerback bra and fold-over waistband, navy wide-leg trousers and the aqua asymmetric tank. Plain at the front. The name sits once on the back.',
    'ch.cream.desc': 'An ivory racerback bra and waistband with black wide-leg trousers, finished with the taupe asymmetric tank. The quietest of the four.',
    'ch.pink.desc': 'A rose racerback bra and waistband, wine wide-leg trousers and the burgundy asymmetric tank. One colour family, three depths.',
    'ch.purple.desc': 'An orchid racerback bra and waistband, black wide-leg trousers and the lime asymmetric tank. The loudest of the four.',
    'ch.shop': 'Shop the set',
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
    'coll.eyebrow': 'المجموعة رقم ٠١', 'coll.title': 'أربعة أطقم. شمس واحدة.',
    'ch.red.name': 'الطقم الأحمر', 'ch.cream.name': 'الطقم الكريمي', 'ch.pink.name': 'الطقم الوردي', 'ch.purple.name': 'الطقم البنفسجي',
    'ch.red.line': 'أحمر على كحلي. أزرق مائي فوقه.',
    'ch.cream.line': 'كريمي على أسود. بنّي رمادي فوقه.',
    'ch.pink.line': 'وردي على وردي. عنابي على عنابي.',
    'ch.purple.line': 'أرجواني على أسود. ليموني فوقه.',
    'ch.red.desc': 'حمّالة صدر رياضية حمراء وحزام خصر مطوي، بنطال كحلي واسع، والقميص غير المتماثل بلون أزرق مائي. الواجهة بلا أي علامة، والاسم مرة واحدة على الظهر.',
    'ch.cream.desc': 'حمّالة صدر وحزام خصر بلون عاجي مع بنطال أسود واسع، والقميص غير المتماثل بلون بنّي رمادي. أهدأ الأطقم الأربعة.',
    'ch.pink.desc': 'حمّالة صدر وحزام خصر بلون وردي، بنطال خمري واسع، والقميص غير المتماثل بلون عنابي. عائلة لونية واحدة بثلاث درجات.',
    'ch.purple.desc': 'حمّالة صدر وحزام خصر بلون أرجواني، بنطال أسود واسع، والقميص غير المتماثل بلون ليموني. أجرأ الأطقم الأربعة.',
    'ch.shop': 'تسوّق الطقم',
  };

  // Hero lines keep their line breaks, so they are swapped as HTML.
  const HERO_AR = {
    'he.line': 'ملابس رياضية بأربعة ألوان. مفصّلة لشمس حادة.',
    'he.cta': 'المجموعة &#8595;',
  };
  const HERO_EN = {};
  $$('.he [data-i18n]').forEach((n) => (HERO_EN[n.dataset.i18n] = n.innerHTML));

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
        a.className = 'card rv';
        a.href = '#';
        a.dataset.set = set;
        a.hidden = filter !== 'all' && filter !== set;
        a.innerHTML = `
          <div class="card__img ph wipe"></div>
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
    watchReveals();
  }

  function setFilter(f) {
    filter = f;
    $$('#filters button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.f === f)));
    $$('.card').forEach((c) => (c.hidden = f !== 'all' && c.dataset.set !== f));
  }

  $$('#filters button').forEach((b) => b.addEventListener('click', () => setFilter(b.dataset.f)));
  $$('[data-filter]').forEach((a) => a.addEventListener('click', () => setFilter(a.dataset.filter)));

  // ---------- Collection ----------

  function buildCollection() {
    const host = $('#sets');
    host.innerHTML = '';
    CHAPTERS.forEach((c, i) => {
      const col = (k) => PIECES.find((p) => p.key === k).colours[c.set];
      const el = document.createElement('article');
      el.className = 'chap';
      el.innerHTML = `
        <div class="chap__pair rv">
          <div class="chap__img ph wipe drift" style="--ph:${col('bra')[0]}"></div>
          <div class="chap__img ph wipe drift" style="--ph:${col('trouser')[0]};--d:.14s"></div>
          <div class="chap__over">
            <span class="chap__no lift" style="--d:.5s">0${i + 1} / 04</span>
            <h3 class="chap__name lift" style="--d:.58s">${t('ch.' + c.set + '.name')}</h3>
            <p class="chap__line hand lift" style="--d:.66s">${t('ch.' + c.set + '.line')}</p>
          </div>
        </div>
        <div class="chap__text rv">
          <p class="chap__desc lift">${t('ch.' + c.set + '.desc')}</p>
          <div class="chap__chips lift" style="--d:.08s">
            ${['bra', 'tank', 'trouser'].map((k) => `<span><i style="--c:${col(k)[0]}"></i>${t('k.' + col(k)[1])}</span>`).join('')}
          </div>
          <a class="chap__link lift" style="--d:.16s" href="#shop" data-filter="${c.set}">${t('ch.shop')}</a>
        </div>`;
      $$('.chap__img', el).forEach((box, j) => box.append(img(`assets/sets/${c.frames[j]}.jpg`)));
      $('[data-filter]', el).addEventListener('click', () => setFilter(c.set));
      host.appendChild(el);
    });
    watchReveals();
  }

  // Reveal on scroll: anything marked .rv gets .in once it is a fifth of
  // the way into view, and keeps it.
  const revealObs = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
      }), { threshold: 0.2, rootMargin: '0px 0px -8% 0px' })
    : null;

  function watchReveals() {
    $$('.rv:not(.in)').forEach((el) => (revealObs ? revealObs.observe(el) : el.classList.add('in')));
  }

  // The large frames drift a little against the scroll.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ticking = false;
  function drift() {
    ticking = false;
    const vh = window.innerHeight;
    $$('.drift').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const p = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.setProperty('--py', (p * -28).toFixed(1) + 'px');
    });
  }
  if (!reduceMotion) window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(drift); } }, { passive: true });

  // ---------- Campaign strip ----------

  function buildStrip() {
    const strip = $('#strip');
    strip.classList.add('rv');
    for (let i = 1; i <= 17; i++) {
      const box = document.createElement('div');
      box.className = 'ph wipe';
      box.append(img(`assets/moodboard/${String(i).padStart(2, '0')}.jpg`));
      strip.appendChild(box);
    }
    watchReveals();
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
    $$('[data-i18n]').forEach((n) => {
      const k = n.dataset.i18n;
      if (k in HERO_EN) n.innerHTML = next === 'ar' ? HERO_AR[k] : HERO_EN[k];
      else n.textContent = t(k);
    });
    $$('[data-i18n-ph]').forEach((n) => (n.placeholder = t(n.dataset.i18nPh)));
    $('#lang').textContent = next === 'ar' ? 'English' : 'العربية';
    buildGrid();
    buildCollection();
    playHero();
    try { localStorage.setItem('mairo-lang', next); } catch (e) {}
  }

  const toggle = () => setLang(lang === 'ar' ? 'en' : 'ar');
  $('#lang').addEventListener('click', toggle);
  $('#lang2').addEventListener('click', toggle);

  // ---------- Hero ----------

  // Wrap every word of a rising line in its own mask. <br> is kept.
  function splitWords(el) {
    let w = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) return frag.append(part);
            const m = document.createElement('span');
            m.className = 'hm';
            m.innerHTML = `<span class="hm-in" style="--w:${w++}"></span>`;
            m.firstChild.textContent = part;
            frag.append(m);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    };
    walk(el);
  }

  function playHero() {
    $$('.hero .js-rise').forEach((el) => { el.classList.remove('in'); splitWords(el); });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      $$('.hero .js-rise, .hero .js-rule, .hero .js-fade').forEach((el) => el.classList.add('in'));
    }));
  }

  // Start whichever film matches the screen; muted autoplay is allowed.
  $$('.hv-v').forEach((v) => { v.muted = true; v.play?.().catch(() => {}); });

  // ---------- Init ----------

  $$('img').forEach((el) => {
    if (!el.complete || el.naturalWidth) return;
    if (el.classList.contains('logo')) el.classList.add('is-missing');
    else el.closest('.ph')?.classList.add('is-empty');
  });

  $('#year').textContent = new Date().getFullYear();
  buildGrid();
  buildCollection();
  buildStrip();
  playHero();
  watchReveals();

  let saved = null;
  try { saved = localStorage.getItem('mairo-lang'); } catch (e) {}
  if (saved === 'ar') setLang('ar');
})();
