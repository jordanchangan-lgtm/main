/* Sudqi Planet — store page: collection tiles as filters, product grid. */
(function () {
  var SP = window.SP, C = window.SPCatalog, cfg = C.cfg;
  var bi = C.bi, esc = C.esc;
  var grid = document.getElementById("products");
  var colsEl = document.getElementById("cols");
  var titleEl = document.getElementById("col-title");
  var countEl = document.getElementById("count");
  var all = { id: "all", ar: "كل المنتجات", en: "All products", image: "assets/img/p/trio-1.jpg" };
  var cols = [all].concat(cfg.collections || []);
  var active = "all";

  colsEl.innerHTML = cols.map(function (c, i) {
    return '<button class="s-col" type="button" data-col="' + esc(c.id) + '" aria-pressed="false">' +
      '<img src="' + esc(c.image) + '" alt="" loading="lazy" />' +
      '<span class="num">' + String(i).padStart(2, "0") + "</span>" +
      '<span class="nm">' + bi(c) + "</span></button>";
  }).join("");

  function count(n) {
    var ar = n.toLocaleString("ar-EG") + (n === 1 ? " منتج" : n === 2 ? " منتجان" : n >= 3 && n <= 10 ? " منتجات" : " منتجًا");
    countEl.innerHTML = bi({ ar: ar, en: n + (n === 1 ? " product" : " products") });
  }

  function setCol(id, push) {
    var c = cols.filter(function (x) { return x.id === id; })[0] || all;
    active = c.id;
    colsEl.querySelectorAll("[data-col]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-col") === active)); });
    titleEl.innerHTML = bi(c);
    var shown = 0;
    grid.querySelectorAll(".pc").forEach(function (card) {
      var on = active === "all" || (card.getAttribute("data-cols") || "").split(" ").indexOf(active) > -1;
      card.hidden = !on;
      if (on) {
        card.classList.remove("in");
        card.style.setProperty("--i", shown % 8);
        shown++;
      }
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { grid.querySelectorAll(".pc:not([hidden])").forEach(function (c) { c.classList.add("in"); }); });
    });
    var empty = grid.querySelector(".s-empty");
    if (empty) empty.hidden = shown > 0;
    count(shown);
    if (push) {
      try {
        var url = new URL(location.href);
        url.hash = active === "all" ? "" : active;
        history.replaceState(null, "", url);
      } catch (e) {}
    }
  }

  colsEl.addEventListener("click", function (e) {
    var b = e.target.closest("[data-col]");
    if (!b) return;
    setCol(b.getAttribute("data-col"), true);
    var bar = document.querySelector(".s-bar");
    if (bar && bar.getBoundingClientRect().top > 120) window.scrollTo({ top: window.scrollY + bar.getBoundingClientRect().top - 60, behavior: SP.reduce ? "auto" : "smooth" });
  });
  window.addEventListener("hashchange", function () { setCol(location.hash.slice(1) || "all", false); });

  C.load().then(function (products) {
    grid.innerHTML = products.map(C.card).join("") +
      '<p class="s-empty" hidden>' + bi({ ar: "لا توجد منتجات في هذه المجموعة بعد.", en: "No products in this collection yet." }) + "</p>";
    grid.querySelectorAll(".pc").forEach(function (c) { c.classList.add("rise"); });
    var start = location.hash.slice(1) || new URLSearchParams(location.search).get("c") || "all";
    if (start === "launch") { document.getElementById("store-note").hidden = false; start = "all"; }
    setCol(start, false);
  });
})();
