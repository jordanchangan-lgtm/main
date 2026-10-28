/* Sudqi Planet — landing page: hero carousel, product rails, collections
   index, the brightening statement, the ritual sequence. */
(function () {
  var SP = window.SP, C = window.SPCatalog, cfg = C.cfg;
  var reduce = SP.reduce;
  var bi = C.bi, esc = C.esc;

  /* ---------- Hero films: three portrait films open one after another ---------- */
  var films = document.querySelector("[data-films]");
  var clips = cfg.hero || [];
  if (films && clips.length) {
    films.innerHTML = clips.slice(0, 3).map(function (c, i) {
      return '<figure class="film" style="--i:' + i + '"><video src="' + esc(c.video) + '" poster="' + esc(c.poster || "") +
        '" muted loop playsinline preload="' + (i ? "metadata" : "auto") + '"></video></figure>';
    }).join("");
    var vids = films.querySelectorAll("video");
    var start = function () {
      films.classList.add("in");
      vids.forEach(function (v, i) {
        if (reduce) return;
        // Phones show only the first film; skip downloading the others there.
        if (i > 0 && window.matchMedia("(max-width: 760px)").matches) return;
        setTimeout(function () { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }, 300 + i * 250);
      });
    };
    setTimeout(start, 120);
    document.addEventListener("visibilitychange", function () {
      vids.forEach(function (v) { if (document.hidden) v.pause(); else if (!reduce && v.offsetParent) v.play().catch(function () {}); });
    });
  }
  var heroTitle = document.querySelector("[data-hero-title]");
  if (heroTitle) setTimeout(function () { heroTitle.classList.add("in"); }, 200);

  /* ---------- Products ---------- */
  C.load().then(function (products) {
    var news = products.filter(function (p) { return (p.collections || []).indexOf("packages") < 0; });
    var best = products.filter(function (p) { return p.bestseller; });
    if (!news.length) news = products.slice(0, 8);
    if (!best.length) best = products.slice(0, 8);
    var sets = { new: news, best: best };

    function fill(rail, list) {
      rail.innerHTML = list.map(C.card).join("");
      SP.revealCards(rail);
      SP.initRail(rail);
      rail.scrollLeft = 0;
      SP.railProgress(rail);
    }
    var newRail = document.getElementById("new-rail");
    var pk = document.querySelector("[data-packages]");
    if (pk) {
      pk.innerHTML = products.filter(function (p) { return (p.collections || []).indexOf("packages") > -1; }).map(C.card).join("");
      SP.revealCards(pk);
    }
    var bestRail = document.getElementById("best-rail");
    if (newRail) fill(newRail, news);
    if (bestRail) fill(bestRail, best);

    // New in / Bestsellers tabs
    var tabs = document.querySelector('[data-tabs="new-rail"]');
    if (tabs) tabs.addEventListener("click", function (e) {
      var b = e.target.closest("[data-tab]");
      if (!b || b.getAttribute("aria-selected") === "true") return;
      tabs.querySelectorAll("[data-tab]").forEach(function (t) { t.setAttribute("aria-selected", String(t === b)); });
      SP.placePill(tabs);
      newRail.classList.add("fade");
      setTimeout(function () {
        fill(newRail, sets[b.getAttribute("data-tab")]);
        newRail.querySelectorAll(".pc").forEach(function (c) { c.classList.add("in"); });
        newRail.classList.remove("fade");
      }, 350);
    });

    /* ---------- Products index: hover a row, its picture follows the cursor ---------- */
    var ix = document.querySelector("[data-index]");
    var float = document.querySelector("[data-ix-float]");
    if (ix) {
      // Up to 8 picks: products marked `featured` first, then the rest in catalogue order.
      var items = news.filter(function (p) { return p.featured; }).concat(news.filter(function (p) { return !p.featured; })).slice(0, 8);
      var countEl = document.querySelector("[data-count]");
      if (countEl) countEl.textContent = String(products.length);
      var brandsEl = document.querySelector("[data-brands]");
      if (brandsEl) {
        var brands = [];
        news.forEach(function (p) { if (p.brand && brands.indexOf(p.brand) < 0) brands.push(p.brand); });
        brandsEl.innerHTML = brands.slice(0, 3).map(esc).join(" <i></i> ") +
          (brands.length ? ' <i></i> <span class="ar">والمزيد</span><span class="en">&amp; more</span>' : "");
      }
      var arrow = '<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 7h12M8 2l5 5-5 5" /></svg>';
      ix.innerHTML = items.map(function (p, i) {
        return '<button type="button" class="ix-row rv" data-qv="' + esc(p.handle) + '" data-i="' + i + '" style="--k:' + (i % 5) + '">' +
          '<span class="ix-n num">' + String(i + 1).padStart(2, "0") + "</span>" +
          '<span class="ix-name"><small class="ix-brand">' + esc(p.brand || "") + "</small>" + bi(p.name) + "</span>" +
          '<span class="ix-desc">' + bi(p.tagline || p.type || {}) + "</span>" +
          '<span class="ix-thumb"><img src="' + esc(p.image) + '" alt="" loading="lazy" /></span>' +
          '<span class="ix-price">' + C.priceHtml(p) + "</span>" +
          '<span class="ix-go">' + arrow + "</span>" +
          "</button>";
      }).join("");
      ix.querySelectorAll(".rv").forEach(SP.reveal);
      if (float) {
        float.innerHTML = items.map(function (p) { return '<img src="' + esc(p.image) + '" alt="" />'; }).join("");
        var imgs = float.querySelectorAll("img");
        ix.addEventListener("mousemove", function (e) {
          var w = float.offsetWidth, hh = float.offsetHeight;
          float.style.setProperty("--x", e.clientX - w / 2 + "px");
          float.style.setProperty("--y", e.clientY - hh / 2 + "px");
          var row = e.target.closest(".ix-row");
          if (!row) return;
          var i = +row.getAttribute("data-i");
          imgs.forEach(function (im, k) { im.classList.toggle("on", k === i); });
          float.classList.add("on");
        });
        ix.addEventListener("mouseleave", function () { float.classList.remove("on"); });
        ix.addEventListener("click", function () { float.classList.remove("on"); });
      }
    }
  });

  /* ---------- Statement: words brighten as the section is scrolled ---------- */
  var hold = document.querySelector(".st-hold");
  var bright = document.querySelector("[data-bright]");
  if (hold && bright) {
    var counts = {};
    bright.querySelectorAll(":scope > .ar, :scope > .en").forEach(function (l) {
      var words = l.textContent.trim().split(/\s+/);
      counts[l.classList.contains("ar") ? "ar" : "en"] = words.length;
      l.innerHTML = words.map(function (w, i) {
        var hi = /مدار|orbit/i.test(w) ? " hi" : "";
        return '<span class="bw' + hi + '" style="--i:' + i + '">' + esc(w) + "</span>";
      }).join(" ");
    });
    var meter = hold.querySelector(".st-meter");
    var tick = function () {
      var r = hold.getBoundingClientRect();
      var span = r.height - window.innerHeight;
      var p = Math.min(1, Math.max(0, -r.top / (span * 0.85)));
      var n = counts[document.documentElement.lang] || 30;
      bright.style.setProperty("--lead", (p * (n + 5)).toFixed(2));
      if (meter) meter.style.setProperty("--p", p.toFixed(3));
    };
    if (reduce) bright.style.setProperty("--lead", 999);
    else {
      window.addEventListener("scroll", function () { requestAnimationFrame(tick); }, { passive: true });
      document.addEventListener("sp:lang", tick);
      tick();
    }
  }

  /* ---------- Ritual: the picture follows the step in view ---------- */
  var pics = document.querySelectorAll("[data-rt-pics] .rt-pic");
  var steps = document.querySelectorAll(".rt-step");
  if (pics.length && steps.length && "IntersectionObserver" in window) {
    var stepIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var n = +e.target.getAttribute("data-step");
        steps.forEach(function (s) { s.classList.toggle("on", s === e.target); });
        pics.forEach(function (p, i) {
          p.classList.toggle("on", i === n);
          p.classList.toggle("past", i < n);
        });
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    steps.forEach(function (s) { stepIO.observe(s); });
  }
})();
