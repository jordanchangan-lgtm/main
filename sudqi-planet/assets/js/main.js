/* Sudqi Planet — shared behaviour: language, header, menu, reveals. */
(function () {
  var root = document.documentElement;
  var body = document.body;

  /* ---------- Language (Arabic default, English optional) ---------- */
  function setLang(lang) {
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    try { localStorage.setItem("sp-lang", lang); } catch (e) {}
    var title = (document.querySelector("[data-title-ar]") || body).getAttribute("data-title-" + lang);
    if (title) document.title = title;
    // Keep ?lang= in the URL in sync so shared links open in the same language.
    try {
      var url = new URL(location.href);
      if (lang === "en") url.searchParams.set("lang", "en");
      else url.searchParams.delete("lang");
      history.replaceState(null, "", url);
    } catch (e) {}
    document.dispatchEvent(new CustomEvent("sp:lang", { detail: lang }));
  }
  setLang(root.lang === "en" ? "en" : "ar");

  document.querySelectorAll("[data-lang-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLang(root.lang === "ar" ? "en" : "ar");
    });
  });

  // Carry the active language across internal page links.
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || root.lang !== "en") return;
    var href = a.getAttribute("href");
    if (!/^(index|shop)\.html/.test(href)) return;
    var url = new URL(href, location.href);
    url.searchParams.set("lang", "en");
    a.href = url.pathname.split("/").pop() + url.search + url.hash;
  });

  /* ---------- Year ---------- */
  var y = new Date().getFullYear();
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = el.closest(".ar") ? y.toLocaleString("ar-EG", { useGrouping: false }) : String(y);
  });

  /* ---------- Header state ---------- */
  var header = document.querySelector(".header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.querySelector("[data-menu-toggle]");
  function closeMenu() {
    body.classList.remove("menu-open");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
  }
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      var open = body.classList.toggle("menu-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".mobile-menu a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  }

  /* ---------- Reveal on scroll ---------- */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-in"); });
  }
  window.spReveal = function (el) {
    if (io) io.observe(el); else el.classList.add("is-in");
  };
})();
