// Mairo — shared by the landing page (index.html) and the shop (shop.html).
// Hero, collection chapters, shop sets, scroll reveals, bag count, EN/AR.

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

  // Two images per set (assets/sets/).
  const FRAMES = { red: ['red-a', 'red-b'], cream: ['cream-a', 'cream-b'], pink: ['pink-a', 'pink-b'], purple: ['purple-a', 'purple-b'] };

  // Prices aren't set yet; fill these in and they appear in the shop.
  const PRICES = { tank: '', bra: '', trouser: '' };

  // ---------- Copy ----------

  const EN = {
    'p.tank': 'Asymmetric Tank', 'p.bra': 'Racerback Sports Bra', 'p.trouser': 'Wide-Leg Trouser',
    'pd.tank': 'One wide strap over the left shoulder. A single bound edge sweeps down to under the right arm, so the right shoulder stays bare.',
    'pd.bra': 'A wide scoop front and a thick, smooth under-band. The back is one closed panel that tapers to a single strap at the nape. Nothing crosses.',
    'pd.trouser': 'Cut genuinely wide and falling to the floor. A wide fold-over waistband sits high, just above the navel. No pockets, no seam down the front.',
    'k.aqua': 'Aqua', 'k.taupe': 'Taupe', 'k.burgundy': 'Burgundy', 'k.lime': 'Lime',
    'k.red': 'Red', 'k.ivory': 'Ivory', 'k.rose': 'Rose', 'k.orchid': 'Orchid',
    'k.navy': 'Navy', 'k.black': 'Black', 'k.wine': 'Wine',
    'ch.red.name': 'The Red Set', 'ch.cream.name': 'The Cream Set', 'ch.pink.name': 'The Pink Set', 'ch.purple.name': 'The Purple Set',
    'ch.red.line': 'Red on navy. Aqua on top.',
    'ch.cream.line': 'Cream on black. Taupe on top.',
    'ch.pink.line': 'Pink on pink. Burgundy on burgundy.',
    'ch.purple.line': 'Orchid on black. Lime on top.',
    'ch.red.desc': 'A red racerback bra and fold-over waistband, navy wide-leg trousers and the aqua asymmetric tank. Plain at the front. The name sits once on the back.',
    'ch.cream.desc': 'An ivory racerback bra and waistband with black wide-leg trousers, finished with the taupe asymmetric tank.',
    'ch.pink.desc': 'A rose racerback bra and waistband, wine wide-leg trousers and the burgundy asymmetric tank.',
    'ch.purple.desc': 'An orchid racerback bra and waistband, black wide-leg trousers and the lime asymmetric tank.',
    'ch.shop': 'Shop the set',
    'bag': 'Bag', 'add': 'Add to bag', 'added': 'Added',
  };

  const AR = {
    'nav.shop': 'تسوّق', 'nav.sets': 'عن مايرو', 'nav.search': 'بحث',
    'mz.shop': 'تسوّق',
    'cap.red': 'الطقم الأحمر', 'cap.cream': 'الطقم الكريمي', 'cap.pink': 'الطقم الوردي', 'cap.purple': 'الطقم البنفسجي',
    'st.who.l': 'من نحن', 'st.who.h': 'ثلاث قطع. لا أكثر.',
    'st.who.b': 'مايرو ملابس رياضية مختزلة في ثلاث قطع: قميص غير متماثل، وحمّالة صدر رياضية، وبنطال واسع. كل قطعة مفصّلة مرة واحدة، ببساطة، لتُلبس معًا.',
    'st.what.l': 'الأطقم', 'st.what.h': 'أربعة أطقم. نسّقها كما تشاء.',
    'st.what.b': 'كل قطعة متوفرة في أربعة أطقم: الأحمر والكريمي والوردي والبنفسجي. البس الطقم كاملًا، أو نسّق القطع بين الأطقم.',
    'st.point.l': 'القصّة', 'st.point.h': 'الواجهة بسيطة. دائمًا.',
    'st.point.b': 'لا شيء يتقاطع، لا شيء يتجعّد، ولا طباعة على الواجهة. الاسم مرة واحدة، صغيرًا، على الظهر.',
    'coll.eyebrow': 'المجموعة رقم ٠١', 'coll.title': 'أربعة أطقم. شمس واحدة.',
    'end.eyebrow': 'المجموعة رقم ٠١', 'end.title': 'أربعة أطقم. نسّقها كما تشاء.', 'line.text': 'ثلاث قطع. أربعة ألوان. لا شيء يتقاطع.', 'end.btn': 'تسوّق المجموعة',
    'shop.eyebrow': 'المجموعة رقم ٠١', 'shop.title': 'المتجر', 'shop.lede': 'أربعة أطقم، ثلاث قطع في كل منها. اختر الطقم كاملًا أو قطعة واحدة.',
    'c.red': 'أحمر', 'c.cream': 'كريمي', 'c.pink': 'وردي', 'c.purple': 'بنفسجي',
    'foot.lang': 'اللغة', 'foot.about': 'عن مايرو', 'foot.contact': 'تواصل',
    'foot.ig': 'إنستغرام', 'foot.shipping': 'الشحن', 'foot.returns': 'الإرجاع',
    'foot.faq': 'الأسئلة الشائعة', 'foot.legal': 'الشروط والخصوصية',
    'foot.news': 'اشترك في النشرة البريدية', 'foot.email': 'بريدك الإلكتروني',
    'p.tank': 'قميص غير متماثل', 'p.bra': 'حمّالة صدر رياضية', 'p.trouser': 'بنطال واسع',
    'pd.tank': 'حمّالة عريضة واحدة على الكتف الأيسر، وحافة مائلة واحدة تنحدر حتى أسفل الذراع الأيمن، فيبقى الكتف الأيمن مكشوفًا.',
    'pd.bra': 'واجهة مستديرة واسعة وحزام سفلي عريض وأملس. الظهر لوح واحد مغلق يضيق حتى حمّالة واحدة عند مؤخرة العنق. لا شيء يتقاطع.',
    'pd.trouser': 'قصّة واسعة فعلًا تنسدل حتى الأرض. حزام خصر عريض مطوي يرتفع فوق السرّة بقليل. بلا جيوب، وبلا خياطة في المنتصف.',
    'k.aqua': 'أزرق مائي', 'k.taupe': 'بنّي رمادي', 'k.burgundy': 'عنابي', 'k.lime': 'ليموني',
    'k.red': 'أحمر', 'k.ivory': 'عاجي', 'k.rose': 'وردي', 'k.orchid': 'أرجواني',
    'k.navy': 'كحلي', 'k.black': 'أسود', 'k.wine': 'خمري',
    'ch.red.name': 'الطقم الأحمر', 'ch.cream.name': 'الطقم الكريمي', 'ch.pink.name': 'الطقم الوردي', 'ch.purple.name': 'الطقم البنفسجي',
    'ch.red.line': 'أحمر على كحلي. أزرق مائي فوقه.',
    'ch.cream.line': 'كريمي على أسود. بنّي رمادي فوقه.',
    'ch.pink.line': 'وردي على وردي. عنابي على عنابي.',
    'ch.purple.line': 'أرجواني على أسود. ليموني فوقه.',
    'ch.red.desc': 'حمّالة صدر رياضية حمراء وحزام خصر مطوي، بنطال كحلي واسع، والقميص غير المتماثل بلون أزرق مائي. الواجهة بلا أي علامة، والاسم مرة واحدة على الظهر.',
    'ch.cream.desc': 'حمّالة صدر وحزام خصر بلون عاجي مع بنطال أسود واسع، والقميص غير المتماثل بلون بنّي رمادي.',
    'ch.pink.desc': 'حمّالة صدر وحزام خصر بلون وردي، بنطال خمري واسع، والقميص غير المتماثل بلون عنابي.',
    'ch.purple.desc': 'حمّالة صدر وحزام خصر بلون أرجواني، بنطال أسود واسع، والقميص غير المتماثل بلون ليموني.',
    'ch.shop': 'تسوّق الطقم',
    'bag': 'الحقيبة', 'add': 'أضف إلى الحقيبة', 'added': 'أُضيفت',
  };

  // Hero lines keep their markup, so they are swapped as HTML.
  const HERO_AR = {
    'he.line': 'ملابس رياضية بثلاث قطع وأربعة ألوان.',
    'he.cta': 'من نحن &#8595;',
  };
  const HERO_EN = {};
  $$('.he [data-i18n]').forEach((n) => (HERO_EN[n.dataset.i18n] = n.innerHTML));

  $$('[data-i18n]').forEach((n) => (EN[n.dataset.i18n] ??= n.textContent));
  $$('[data-i18n-ph]').forEach((n) => (EN[n.dataset.i18nPh] ??= n.placeholder));

  let lang = 'en';
  const t = (k) => (lang === 'ar' ? AR[k] : undefined) ?? EN[k] ?? k;
  const colourOf = (set, key) => PIECES.find((p) => p.key === key).colours[set];

  // ---------- Images ----------

  function img(src) {
    const el = new Image();
    el.alt = '';
    el.loading = 'lazy';
    el.decoding = 'async';
    el.src = src;
    return el;
  }

  document.addEventListener('error', (e) => {
    const el = e.target;
    if (!(el instanceof HTMLImageElement)) return;
    if (el.classList.contains('logo')) return el.classList.add('is-missing');
    el.closest('.ph')?.classList.add('is-empty');
  }, true);

  // ---------- Reveal on scroll ----------

  // Anything marked .rv gets .in once its top is 15% up the screen,
  // and keeps it: nothing disappears again on the way back.
  const revealObs = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
      }), { threshold: 0, rootMargin: '0px 0px -15% 0px' })
    : null;

  function watchReveals() {
    $$('.rv:not(.in)').forEach((el) => (revealObs ? revealObs.observe(el) : el.classList.add('in')));
  }

  // Large frames drift a little against the scroll.
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

  // ---------- Landing: collection chapters ----------

  function buildCollection() {
    const host = $('#sets');
    if (!host) return;
    host.innerHTML = '';
    SETS.forEach((set, i) => {
      const el = document.createElement('article');
      el.className = 'chap';
      el.innerHTML = `
        <div class="chap__pair rv">
          <div class="chap__img ph wipe drift" style="--ph:${colourOf(set, 'bra')[0]}"></div>
          <div class="chap__img ph wipe drift" style="--ph:${colourOf(set, 'trouser')[0]};--d:.14s"></div>
          <div class="chap__over">
            <span class="chap__no lift" style="--d:.5s">0${i + 1} / 04</span>
            <h3 class="chap__name lift" style="--d:.58s">${t('ch.' + set + '.name')}</h3>
            <p class="chap__line hand lift" style="--d:.66s">${t('ch.' + set + '.line')}</p>
          </div>
        </div>
        <div class="chap__text rv">
          <p class="chap__desc lift">${t('ch.' + set + '.desc')}</p>
          <div class="chap__chips lift" style="--d:.08s">
            ${['bra', 'tank', 'trouser'].map((k) => `<span><i style="--c:${colourOf(set, k)[0]}"></i>${t('k.' + colourOf(set, k)[1])}</span>`).join('')}
          </div>
          <a class="chap__link lift" style="--d:.16s" href="shop.html#${set}">${t('ch.shop')}</a>
        </div>`;
      $$('.chap__img', el).forEach((box, j) => box.append(img(`assets/sets/${FRAMES[set][j]}.jpg`)));
      host.appendChild(el);
    });
  }

  // ---------- Shop: one section per set, a card per piece ----------

  function buildShop() {
    const host = $('#shopSets');
    if (!host) return;
    host.innerHTML = '';
    SETS.forEach((set, i) => {
      const sec = document.createElement('section');
      sec.className = 'sset';
      sec.id = set;
      sec.innerHTML = `
        <header class="sset__head rv">
          <span class="chap__no lift">0${i + 1} / 04</span>
          <h2 class="sset__name lift" style="--d:.06s">${t('ch.' + set + '.name')}</h2>
          <p class="sset__line hand lift" style="--d:.12s">${t('ch.' + set + '.line')}</p>
          <p class="sset__desc lift" style="--d:.18s">${t('ch.' + set + '.desc')}</p>
        </header>
        <ul class="pieces">
          ${PIECES.map((p, j) => {
            const [hex, name] = p.colours[set];
            return `
            <li class="piece rv">
              <div class="piece__swatch lift" style="--c:${hex};--d:${j * 0.08}s"></div>
              <div class="piece__body lift" style="--d:${j * 0.08 + 0.06}s">
                <div class="piece__row">
                  <h3 class="piece__name">${t('p.' + p.key)}</h3>
                  <span class="piece__price">${PRICES[p.key]}</span>
                </div>
                <span class="piece__colour">${t('k.' + name)}</span>
                <p class="piece__desc">${t('pd.' + p.key)}</p>
                <button type="button" class="piece__add" data-add="${set}-${p.key}">${t('add')}</button>
              </div>
            </li>`;
          }).join('')}
        </ul>`;
      host.appendChild(sec);
    });
  }

  // ---------- Bag ----------

  let bag = 0;
  try { bag = Number(sessionStorage.getItem('mairo-bag')) || 0; } catch (e) {}
  const drawBag = () => $$('[data-bag]').forEach((el) => (el.textContent = `${t('bag')} (${bag})`));

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-add]');
    if (!b) return;
    bag += 1;
    try { sessionStorage.setItem('mairo-bag', String(bag)); } catch (err) {}
    drawBag();
    b.textContent = t('added');
    b.classList.add('is-added');
    setTimeout(() => { b.textContent = t('add'); b.classList.remove('is-added'); }, 1600);
  });

  // ---------- Hero ----------

  // Wrap every word of a rising line in its own mask.
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
    if (!$('.hero')) return;
    $$('.hero .js-rise').forEach((el) => { el.classList.remove('in'); splitWords(el); });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      $$('.hero .js-rise, .hero .js-fade').forEach((el) => el.classList.add('in'));
    }));
  }

  $$('.hv-v, .mz-v').forEach((v) => { v.muted = true; v.play?.().catch(() => {}); });

  // ---------- Language ----------

  function build() {
    buildCollection();
    buildShop();
    drawBag();
    watchReveals();
  }

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
    $$('.js-lang').forEach((b) => (b.textContent = next === 'ar' ? 'English' : 'العربية'));
    build();
    playHero();
    try { localStorage.setItem('mairo-lang', next); } catch (e) {}
  }

  $$('.js-lang, #lang2').forEach((b) => b.addEventListener('click', () => setLang(lang === 'ar' ? 'en' : 'ar')));

  // ---------- Init ----------

  $$('img').forEach((el) => {
    if (!el.complete || el.naturalWidth) return;
    if (el.classList.contains('logo')) el.classList.add('is-missing');
    else el.closest('.ph')?.classList.add('is-empty');
  });

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  build();
  playHero();

  let saved = null;
  try { saved = localStorage.getItem('mairo-lang'); } catch (e) {}
  if (saved === 'ar') setLang('ar');

  // Arriving at shop.html#set: scroll there once the sets exist.
  if (location.hash && $(location.hash)) $(location.hash).scrollIntoView();
})();
