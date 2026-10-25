/* Sudqi Planet — store page: filter chips, product grid, Shopify connection. */
(function () {
  var cfg = window.SP_SHOP || {};
  var root = document.documentElement;
  var grid = document.getElementById("products");
  var chipsEl = document.getElementById("chips");
  var countEl = document.getElementById("count");
  var noteEl = document.getElementById("store-note");
  var connected = !!(cfg.storeDomain && cfg.storefrontToken);
  var products = [];
  var active = "all";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function bi(obj, cls) {
    obj = obj || {};
    var ar = obj.ar || obj.en || "", en = obj.en || obj.ar || "";
    cls = cls ? " " + cls : "";
    return '<span class="ar' + cls + '">' + esc(ar) + '</span><span class="en' + cls + '">' + esc(en) + "</span>";
  }
  function storeBase() {
    var base = cfg.storefrontUrl || (cfg.storeDomain ? "https://" + cfg.storeDomain : "");
    return base.replace(/\/$/, "");
  }

  /* ---------- Prices ---------- */
  function money(amount, currency, lang) {
    var n = Number(amount);
    if (!currency) {
      var c = (cfg.currency || {})[lang] || "";
      var num = lang === "ar" ? n.toLocaleString("ar-EG") : n.toLocaleString("en");
      return lang === "ar" ? num + " " + c : c + " " + num;
    }
    try {
      return new Intl.NumberFormat(lang === "ar" ? "ar-JO" : "en", { style: "currency", currency: currency, maximumFractionDigits: n % 1 ? 2 : 0 }).format(n);
    } catch (e) { return currency + " " + n; }
  }

  /* ---------- Chips ---------- */
  function renderChips() {
    chipsEl.innerHTML = (cfg.categories || []).map(function (c) {
      return '<button class="chip" type="button" data-cat="' + esc(c.id) + '" aria-pressed="' + (c.id === active) + '">' + bi(c) + "</button>";
    }).join("");
  }
  chipsEl.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-cat]");
    if (!btn) return;
    setCategory(btn.getAttribute("data-cat"), true);
  });

  function setCategory(id, push) {
    var known = (cfg.categories || []).some(function (c) { return c.id === id; });
    active = known ? id : "all";
    chipsEl.querySelectorAll("[data-cat]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-cat") === active));
    });
    grid.querySelectorAll(".product").forEach(function (card) {
      var cats = (card.getAttribute("data-cats") || "").split(" ");
      card.hidden = !(active === "all" || cats.indexOf(active) > -1);
    });
    updateCount();
    if (push) {
      var url = new URL(location.href);
      url.searchParams.delete("c");
      url.hash = active === "all" ? "" : active;
      try { history.replaceState(null, "", url); } catch (e) {}
    }
  }

  function updateCount() {
    var n = grid.querySelectorAll(".product:not([hidden])").length;
    var ar = n.toLocaleString("ar-EG") + (n === 1 ? " منتج" : n === 2 ? " منتجان" : n <= 10 ? " منتجات" : " منتجًا");
    var en = n + (n === 1 ? " product" : " products");
    countEl.innerHTML = bi({ ar: ar, en: en });
  }

  /* ---------- Product cards ---------- */
  function card(p, i) {
    var buyLabel = { ar: "اطلبي الآن", en: "Order now" };
    var viewHref = p.url || (storeBase() ? storeBase() + "/products/" + encodeURIComponent(p.handle) : "#");
    var buyHref = p.buyUrl || viewHref;
    var priceAr = p.price != null ? money(p.price, p.currencyCode, "ar") : "";
    var priceEn = p.price != null ? money(p.price, p.currencyCode, "en") : "";
    var soldOut = p.available === false;
    return (
      '<article class="product reveal" style="--d:' + ((i % 3) * 0.08).toFixed(2) + 's" data-cats="' + esc(p.cats.join(" ")) + '">' +
        '<a class="product__media" href="' + esc(viewHref) + '"' + (viewHref === "#" ? "" : ' target="_blank" rel="noopener"') + ">" +
          '<img src="' + esc(p.image) + '" alt="' + esc((p.name && (p.name.ar || p.name.en)) || "") + '" loading="lazy" />' +
          (p.hover ? '<img src="' + esc(p.hover) + '" alt="" loading="lazy" aria-hidden="true" />' : "") +
          (p.badge ? '<span class="product__badge"><span class="tag">' + bi(p.badge) + "</span></span>" : "") +
        "</a>" +
        '<div class="product__info">' +
          '<h3 class="product__name">' + bi(p.name, "keep") + "</h3>" +
          '<span class="product__price">' + bi({ ar: priceAr, en: priceEn }) + "</span>" +
          (p.desc ? '<p class="product__desc">' + bi(p.desc) + "</p>" : "") +
        "</div>" +
        '<div class="product__buy">' +
          (soldOut
            ? '<span class="cta cta--lilac" aria-disabled="true">' + bi({ ar: "نفدت الكمية", en: "Sold out" }) + "</span>"
            : '<a class="cta" href="' + esc(buyHref) + '"' + (buyHref === "#" ? ' data-unlinked' : ' target="_blank" rel="noopener"') + ">" + bi(buyLabel) + "</a>") +
          '<a class="link-arrow" href="' + esc(viewHref) + '"' + (viewHref === "#" ? "" : ' target="_blank" rel="noopener"') + ">" + bi({ ar: "التفاصيل", en: "Details" }) + "</a>" +
        "</div>" +
      "</article>"
    );
  }

  function render() {
    grid.innerHTML = products.map(card).join("");
    grid.querySelectorAll(".reveal").forEach(function (el) {
      if (window.spReveal) window.spReveal(el); else el.classList.add("is-in");
    });
    setCategory(active, false);
  }

  // Before Shopify is connected, "Order now" has nowhere to go — say so instead of jumping to top.
  grid.addEventListener("click", function (e) {
    var a = e.target.closest("a[href='#']");
    if (!a) return;
    e.preventDefault();
    if (noteEl) {
      noteEl.hidden = false;
      noteEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  /* ---------- Sample catalogue ---------- */
  function fromSamples() {
    return (cfg.products || []).map(function (p) {
      return {
        handle: p.handle,
        cats: [p.category],
        badge: p.badge,
        name: p.name,
        desc: p.desc,
        price: p.price,
        image: p.image,
        hover: p.hover
      };
    });
  }

  /* ---------- Shopify Storefront API ---------- */
  var QUERY =
    "query Products($lang: LanguageCode) @inContext(language: $lang) {" +
    "  products(first: 60, sortKey: BEST_SELLING) { nodes {" +
    "    handle title description tags onlineStoreUrl availableForSale" +
    "    images(first: 2) { nodes { url(transform: { maxWidth: 900 }) altText } }" +
    "    priceRange { minVariantPrice { amount currencyCode } }" +
    "    variants(first: 1) { nodes { id } }" +
    "  } }" +
    "}";

  function fetchLang(lang) {
    return fetch("https://" + cfg.storeDomain + "/api/" + (cfg.apiVersion || "2025-01") + "/graphql.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": cfg.storefrontToken
      },
      body: JSON.stringify({ query: QUERY, variables: { lang: lang } })
    })
      .then(function (r) { return r.json(); })
      .then(function (json) {
        if (json.errors) throw new Error(JSON.stringify(json.errors));
        return json.data.products.nodes;
      });
  }

  function short(text) {
    text = (text || "").trim();
    var cut = text.split(/(?<=[.!؟?。])\s/)[0];
    return cut.length > 140 ? cut.slice(0, 137) + "…" : cut;
  }

  function fromShopify(arNodes, enNodes) {
    var enBy = {};
    enNodes.forEach(function (n) { enBy[n.handle] = n; });
    var tags = (cfg.categories || []).filter(function (c) { return c.tag; });
    return arNodes.map(function (ar) {
      var en = enBy[ar.handle] || ar;
      var lower = (ar.tags || []).map(function (t) { return t.toLowerCase(); });
      var cats = tags.filter(function (c) { return lower.indexOf(c.tag) > -1; }).map(function (c) { return c.id; });
      var imgs = (ar.images && ar.images.nodes) || [];
      var variant = ar.variants.nodes[0];
      var variantId = variant ? variant.id.split("/").pop() : null;
      var isNew = lower.indexOf("new") > -1;
      return {
        handle: ar.handle,
        cats: cats,
        badge: isNew ? { ar: "جديد", en: "New" } : null,
        name: { ar: ar.title, en: en.title },
        desc: { ar: short(ar.description), en: short(en.description) },
        price: Number(ar.priceRange.minVariantPrice.amount),
        currencyCode: ar.priceRange.minVariantPrice.currencyCode,
        image: imgs[0] ? imgs[0].url : "assets/img/p-box.jpg",
        hover: imgs[1] ? imgs[1].url : null,
        available: ar.availableForSale,
        url: ar.onlineStoreUrl || storeBase() + "/products/" + ar.handle,
        // Cart permalink: one tap from "Order now" to Shopify checkout.
        buyUrl: variantId ? "https://" + cfg.storeDomain + "/cart/" + variantId + ":1" : null
      };
    });
  }

  /* ---------- Boot ---------- */
  // Category comes from #serum-style hashes (or the older ?c=serum).
  var initial = location.hash.slice(1) || new URLSearchParams(location.search).get("c") || "all";
  window.addEventListener("hashchange", function () { setCategory(location.hash.slice(1) || "all", false); });
  active = initial;
  renderChips();

  if (connected) {
    if (noteEl) noteEl.hidden = true;
    Promise.all([fetchLang("AR"), fetchLang("EN")])
      .then(function (res) {
        products = fromShopify(res[0], res[1]);
        render();
      })
      .catch(function (err) {
        console.error("Shopify:", err);
        products = fromSamples();
        render();
      });
  } else {
    products = fromSamples();
    render();
  }

  document.addEventListener("sp:lang", updateCount);
})();
