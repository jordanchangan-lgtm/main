/* Sudqi Planet — shared behaviour: language, header, menu, text motion, rails. */
(function () {
  var root = document.documentElement;
  var body = document.body;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var cfg = window.SP_SHOP || {};

  /* ---------- Language (Arabic default, English optional) ---------- */
  function setLang(lang) {
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    try { localStorage.setItem("sp-lang", lang); } catch (e) {}
    var t = (document.querySelector("[data-title-ar]") || body).getAttribute("data-title-" + lang);
    if (t) document.title = t;
    try {
      var url = new URL(location.href);
      if (lang === "en") url.searchParams.set("lang", "en"); else url.searchParams.delete("lang");
      history.replaceState(null, "", url);
    } catch (e) {}
    document.dispatchEvent(new CustomEvent("sp:lang", { detail: lang }));
  }
  setLang(root.lang === "en" ? "en" : "ar");
  document.querySelectorAll("[data-lang-toggle]").forEach(function (b) {
    b.addEventListener("click", function () { setLang(root.lang === "ar" ? "en" : "ar"); });
  });

  /* ---------- Year ---------- */
  var y = new Date().getFullYear();
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = el.closest(".ar") ? y.toLocaleString("ar-EG", { useGrouping: false }) : String(y);
  });

  /* ---------- Split words: each word rises out of its own mask ---------- */
  function splitNode(node, counter) {
    Array.prototype.slice.call(node.childNodes).forEach(function (child) {
      if (child.nodeType === 3) {
        var parts = child.textContent.split(/(\s+)/);
        var frag = document.createDocumentFragment();
        parts.forEach(function (p) {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
          var w = document.createElement("span"); w.className = "sw";
          var i = document.createElement("span"); i.className = "swi"; i.style.setProperty("--i", counter.n++);
          i.textContent = p; w.appendChild(i); frag.appendChild(w);
        });
        child.parentNode.replaceChild(frag, child);
      } else if (child.nodeType === 1 && !child.classList.contains("sw")) {
        splitNode(child, counter);
      }
    });
  }
  function split(el) {
    var langs = el.querySelectorAll(":scope > .ar, :scope > .en");
    if (langs.length) langs.forEach(function (l) { splitNode(l, { n: 0 }); });
    else splitNode(el, { n: 0 });
  }
  document.querySelectorAll("[data-split]").forEach(split);

  /* ---------- Reveal on scroll ---------- */
  var io = null;
  if ("IntersectionObserver" in window && !reduce) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
  }
  function reveal(el) { if (io) io.observe(el); else el.classList.add("in"); }
  document.querySelectorAll("[data-split]:not([data-hero-title]), .rv, .wipe, .clip").forEach(reveal);

  /* ---------- Word cycle ---------- */
  document.querySelectorAll("[data-cycle]").forEach(function (box) {
    var words = box.getAttribute("data-cycle").split("|");
    var k = 0;
    var w = document.createElement("span"); w.className = "cyc-w"; w.textContent = words[0];
    var m = document.createElement("span"); m.className = "cyc-w"; m.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap";
    box.appendChild(w); box.appendChild(m);
    function measure(t) { m.textContent = t; return m.getBoundingClientRect().width; }
    function fit() { var wd = measure(words[k]); if (wd) box.style.width = wd + "px"; }
    fit();
    document.addEventListener("sp:lang", function () { setTimeout(fit, 30); });
    if (reduce) return;
    setInterval(function () {
      if (!box.offsetParent) return;
      k = (k + 1) % words.length;
      w.classList.add("out");
      setTimeout(function () {
        w.classList.remove("out"); w.classList.add("pre"); w.textContent = words[k]; fit();
        void w.offsetWidth; w.classList.remove("pre");
      }, 300);
    }, 2600);
  });

  /* ---------- Header: announcement rotates, bar hides on scroll down ---------- */
  var top = document.querySelector(".top");
  var ann = document.querySelectorAll("[data-announce] p");
  if (ann.length > 1 && !reduce) {
    var ai = 0;
    setInterval(function () {
      var cur = ann[ai]; cur.classList.remove("on"); cur.classList.add("out");
      setTimeout(function () { cur.classList.remove("out"); }, 700);
      ai = (ai + 1) % ann.length; ann[ai].classList.add("on");
    }, 4200);
  }
  var lastY = 0;
  var darkTop = document.querySelector(".hero, .s-hero");
  function onScroll() {
    var sy = window.scrollY;
    var limit = darkTop ? darkTop.offsetHeight - 80 : 10;
    if (top) {
      top.classList.toggle("solid", sy > limit);
      top.classList.toggle("hide", sy > 120 && sy > lastY);
    }
    lastY = sy;
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.querySelector("[data-menu-toggle]");
  function closeMenu() { body.classList.remove("menu-open"); if (menuBtn) menuBtn.setAttribute("aria-expanded", "false"); }
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      var open = body.classList.toggle("menu-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", function (e) { if (e.target.closest(".sheet a")) closeMenu(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  }

  /* ---------- Collection links (menu sheet + footer) from the config ---------- */
  var bi = function (o) { return '<span class="ar">' + o.ar + '</span><span class="en">' + o.en + "</span>"; };
  var colsHtml = (cfg.collections || []).map(function (c) { return { href: "shop.html#" + c.id, label: bi(c) }; });
  document.querySelectorAll("[data-collection-links]").forEach(function (el) {
    el.innerHTML = colsHtml.map(function (c) { return '<a href="' + c.href + '">' + c.label + "</a>"; }).join("");
  });
  document.querySelectorAll("[data-footer-cols]").forEach(function (el) {
    el.innerHTML = '<li><a href="shop.html">' + bi({ ar: "كل المنتجات", en: "All products" }) + "</a></li>" +
      colsHtml.slice(0, 5).map(function (c) { return '<li><a href="' + c.href + '">' + c.label + "</a></li>"; }).join("");
  });

  /* ---------- Rails: drag, arrows, progress ---------- */
  function railDir() { return root.dir === "rtl" ? -1 : 1; }
  function railProgress(rail) {
    var bar = document.querySelector('[data-rail-bar="' + rail.id + '"] i');
    if (!bar) return;
    var max = rail.scrollWidth - rail.clientWidth;
    var w = rail.scrollWidth ? Math.min(100, (rail.clientWidth / rail.scrollWidth) * 100) : 100;
    var p = max > 0 ? Math.abs(rail.scrollLeft) / max : 0;
    bar.style.width = w + "%";
    bar.style.insetInlineStart = p * (100 - w) + "%";
  }
  function initRail(rail) {
    if (rail.dataset.ready) return;
    rail.dataset.ready = "1";
    rail.addEventListener("scroll", function () { railProgress(rail); }, { passive: true });
    window.addEventListener("resize", function () { railProgress(rail); });
    var down = false, sx = 0, sl = 0, moved = false;
    rail.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse") return;
      down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft;
    });
    window.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - sx;
      if (Math.abs(dx) > 5) { moved = true; rail.classList.add("drag"); }
      rail.scrollLeft = sl - dx;
    });
    window.addEventListener("pointerup", function () {
      if (!down) return; down = false;
      setTimeout(function () { rail.classList.remove("drag"); }, 0);
    });
    rail.addEventListener("click", function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    railProgress(rail);
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-rail-next], [data-rail-prev]");
    if (!b) return;
    var rail = document.getElementById(b.getAttribute("data-rail-next") || b.getAttribute("data-rail-prev"));
    if (!rail) return;
    var step = rail.clientWidth * 0.8 * railDir() * (b.hasAttribute("data-rail-prev") ? -1 : 1);
    rail.scrollBy({ left: step, behavior: reduce ? "auto" : "smooth" });
  });

  /* ---------- Tabs (pill slides to the selected tab) ---------- */
  function placePill(tabs) {
    var pill = tabs.querySelector(".pill");
    var on = tabs.querySelector('[aria-selected="true"]');
    if (!pill || !on) return;
    pill.style.left = on.offsetLeft + "px";
    pill.style.width = on.offsetWidth + "px";
  }
  document.querySelectorAll("[data-tabs]").forEach(function (tabs) {
    placePill(tabs);
    window.addEventListener("resize", function () { placePill(tabs); });
    document.addEventListener("sp:lang", function () { setTimeout(function () { placePill(tabs); }, 30); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { placePill(tabs); });
  });

  /* ---------- Product cards rise in, one after another ---------- */
  function revealCards(container) {
    container.querySelectorAll(".pc").forEach(function (c, i) {
      c.classList.add("rise"); c.style.setProperty("--i", i % 6);
      reveal(c);
    });
  }

  window.addEventListener("load", function () { root.classList.add("loaded"); });
  setTimeout(function () { root.classList.add("loaded"); }, 1600);

  window.SP = { split: split, reveal: reveal, initRail: initRail, railProgress: railProgress, placePill: placePill, revealCards: revealCards, reduce: reduce };
})();
