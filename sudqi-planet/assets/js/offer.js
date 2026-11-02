/* ==========================================================================
   Sudqi Planet — opening offer (PLANET20)
   · a pop-up shown once to each visitor, with the code, a copy button and
     how many of the codes are left;
   · a message at the front of the announcement bar;
   · "Order now" links to the Shopify cart get ?discount=CODE, so the code is
     already applied at checkout.
   The live count comes from /api/offer (the Cloudflare worker, tools/_worker.js).
   If that isn't reachable the offer still shows, without a count. When the
   count reaches 0 the offer disappears everywhere.
   ========================================================================== */
(function () {
  var cfg = (window.SP_SHOP && window.SP_SHOP.offer) || {};
  if (!cfg.active || !cfg.code) return;

  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var SEEN = "sp-offer-seen";
  var state = { left: null, limit: cfg.limit || 20, ended: false };

  function num(n, lang) { return n.toLocaleString(lang === "ar" ? "ar-EG" : "en"); }
  function store(get, val) {
    try { if (get) return localStorage.getItem(SEEN); localStorage.setItem(SEEN, val); } catch (e) { return null; }
  }

  /* ---------- the count ---------- */
  function leftText(lang) {
    if (state.left == null) return "";
    return lang === "ar"
      ? "باقي " + num(state.left, "ar") + " من " + num(state.limit, "ar")
      : num(state.left, "en") + " of " + num(state.limit, "en") + " left";
  }
  function paintCount() {
    document.querySelectorAll("[data-offer-left]").forEach(function (el) {
      el.innerHTML = state.left == null ? "" :
        '<span class="ar">' + leftText("ar") + '</span><span class="en">' + leftText("en") + "</span>";
      el.hidden = state.left == null;
    });
    var dots = document.querySelector(".offer-dots");
    if (dots) {
      dots.hidden = state.left == null;
      dots.querySelectorAll("i").forEach(function (d, i) { d.classList.toggle("used", state.left != null && i >= state.left); });
    }
  }

  /* ---------- announcement bar ---------- */
  var bar = document.querySelector("[data-announce]");
  var barMsg = null;
  if (bar) {
    barMsg = document.createElement("p");
    barMsg.className = "ann-offer";
    barMsg.innerHTML =
      '<span class="ar">خصم ' + num(cfg.percent, "ar") + '٪ بالكود <b dir="ltr">' + cfg.code + "</b></span>" +
      '<span class="en">' + cfg.percent + '% off with code <b dir="ltr">' + cfg.code + "</b></span>" +
      ' <em data-offer-left hidden></em>';
    var on = bar.querySelector("p.on");
    if (on) on.classList.remove("on");
    barMsg.classList.add("on");
    bar.insertBefore(barMsg, bar.firstChild);
  }

  /* ---------- "Order now" carries the code into checkout ---------- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href*="/cart/"]');
    if (!a || state.ended) return;
    try {
      var u = new URL(a.href);
      if (!u.searchParams.has("discount")) { u.searchParams.set("discount", cfg.code); a.href = u.toString(); }
    } catch (err) {}
  }, true);

  /* ---------- the pop-up ---------- */
  var pop = null;
  function build() {
    var dots = "";
    for (var i = 0; i < state.limit; i++) dots += "<i></i>";
    var onShop = /shop(\.html)?$/.test(location.pathname);
    pop = document.createElement("div");
    pop.className = "offer";
    pop.setAttribute("role", "dialog");
    pop.setAttribute("aria-modal", "false");
    pop.setAttribute("aria-labelledby", "offer-title");
    pop.innerHTML =
      '<button class="offer-x" type="button" data-offer-close aria-label="Close"><span></span><span></span></button>' +
      '<div class="offer-ring" aria-hidden="true"><i></i></div>' +
      '<p class="offer-kick"><span class="ar">هدية الافتتاح</span><span class="en">Opening gift</span></p>' +
      '<h2 class="offer-title" id="offer-title">' +
        '<span class="ar">خصم ' + num(cfg.percent, "ar") + "٪ لأول " + num(state.limit, "ar") + " طلب</span>" +
        '<span class="en">' + cfg.percent + "% off the first " + state.limit + " orders</span></h2>" +
      '<p class="offer-line"><span class="ar">استخدمي الكود عند الطلب، أو اضغطي «اطلبي الآن» ويُطبَّق تلقائيًا.</span>' +
        '<span class="en">Use the code at checkout, or tap “Order now” and it’s applied for you.</span></p>' +
      '<div class="offer-code"><b dir="ltr">' + cfg.code + "</b>" +
        '<button type="button" data-offer-copy><span class="ar">انسخي</span><span class="en">Copy</span></button></div>' +
      '<div class="offer-dots" hidden aria-hidden="true">' + dots + "</div>" +
      '<p class="offer-left" data-offer-left hidden></p>' +
      '<a class="btn btn--dark offer-go" href="' + (onShop ? "#products" : "shop.html") + '"' + (onShop ? " data-offer-close" : "") + ">" +
        '<span class="ar">تسوّقي الآن</span><span class="en">Shop now</span>' +
        '<span class="arr"><svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 7h12M8 2l5 5-5 5" /></svg></span></a>';
    document.body.appendChild(pop);
    paintCount();

    pop.addEventListener("click", function (e) {
      if (e.target.closest("[data-offer-close]")) close();
      var copy = e.target.closest("[data-offer-copy]");
      if (copy) {
        var done = function () {
          copy.classList.add("ok");
          copy.innerHTML = '<span class="ar">تم النسخ</span><span class="en">Copied</span>';
          setTimeout(function () { copy.classList.remove("ok"); copy.innerHTML = '<span class="ar">انسخي</span><span class="en">Copy</span>'; }, 2200);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(cfg.code).then(done, done);
        else done();
      }
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }
  function open() {
    if (pop || state.ended || store(true) === cfg.code) return;
    build();
    store(false, cfg.code); // once per visitor, even if they never close it
    requestAnimationFrame(function () { requestAnimationFrame(function () { pop.classList.add("in"); }); });
  }
  function close() {
    if (!pop) return;
    var p = pop; pop = null;
    p.classList.remove("in"); p.classList.add("out");
    setTimeout(function () { p.remove(); }, reduce ? 0 : 700);
  }

  function end() {
    state.ended = true;
    if (barMsg) {
      var wasOn = barMsg.classList.contains("on");
      barMsg.remove();
      var first = bar.querySelector("p");
      if (wasOn && first) first.classList.add("on");
    }
    close();
  }

  /* ---------- live count, then the pop-up ---------- */
  var asked = false;
  function show() { if (!asked) { asked = true; setTimeout(open, reduce ? 300 : 1400); } }
  if (window.fetch && location.protocol.indexOf("http") === 0) {
    fetch("/api/offer", { headers: { accept: "application/json" } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (d && d.code === cfg.code && typeof d.remaining === "number") {
          state.limit = d.limit || state.limit;
          state.left = Math.max(0, d.remaining);
          if (state.left === 0) return end();
          paintCount();
        }
        show();
      })
      .catch(show);
    setTimeout(show, 2500); // never wait long on a slow count
  } else show();

  window.SPOffer = { open: function () { store(false, ""); open(); }, state: state };
})();
