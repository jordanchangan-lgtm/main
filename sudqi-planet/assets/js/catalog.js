/* Sudqi Planet — catalogue: loads products (Shopify or the sample list in
   shop-config.js) and renders product cards. Used by both pages. */
(function () {
  var cfg = window.SP_SHOP || {};
  var connected = !!(cfg.storeDomain && cfg.storefrontToken);

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
    return (cfg.storefrontUrl || (cfg.storeDomain ? "https://" + cfg.storeDomain : "")).replace(/\/$/, "");
  }
  function money(amount, currency, lang) {
    var n = Number(amount);
    if (!currency) {
      var c = (cfg.currency || {})[lang] || "";
      var num = lang === "ar" ? n.toLocaleString("ar-EG", { maximumFractionDigits: 2 }) : n.toLocaleString("en", { maximumFractionDigits: 2 });
      return lang === "ar" ? num + " " + c : c + " " + num;
    }
    try {
      return new Intl.NumberFormat(lang === "ar" ? "ar-JO" : "en", { style: "currency", currency: currency, maximumFractionDigits: n % 1 ? 2 : 0 }).format(n);
    } catch (e) { return currency + " " + n; }
  }

  /* Price with the original struck through and the saving, when there is one */
  function priceHtml(p) {
    if (p.price == null) return bi({ ar: "السعر قريبًا", en: "Price soon" }, "soon");
    var now = bi({ ar: money(p.price, p.currencyCode, "ar"), en: money(p.price, p.currencyCode, "en") });
    if (!p.compareAt || p.compareAt <= p.price) return now;
    var save = Math.round((p.compareAt - p.price) * 10) / 10;
    return now + ' <s class="was">' + bi({ ar: money(p.compareAt, p.currencyCode, "ar"), en: money(p.compareAt, p.currencyCode, "en") }) + "</s>" +
      ' <span class="save">' + bi({ ar: "وفّري " + money(save, p.currencyCode, "ar"), en: "Save " + money(save, p.currencyCode, "en") }) + "</span>";
  }

  /* ---------- product card ---------- */
  function card(p, i) {
    var viewHref = p.url || (!connected && storeBase() ? storeBase() + "/products/" + encodeURIComponent(p.handle) : "#");
    var buyHref = p.buyUrl || viewHref;
    var ext = function (h) { return h === "#" ? "" : ' target="_blank" rel="noopener"'; };
    var price = priceHtml(p);
    var soldOut = p.available === false;
    return (
      '<article class="pc" style="--i:' + (i || 0) + '" data-cols="' + esc((p.collections || []).join(" ")) + '">' +
        '<div class="pc-media">' +
          '<button class="pc-img" type="button" data-qv="' + esc(p.handle) + '" tabindex="-1" aria-hidden="true">' +
            '<img src="' + esc(p.image) + '" alt="" loading="lazy" />' +
            (p.hover ? '<img class="pc-alt" src="' + esc(p.hover) + '" alt="" loading="lazy" />' : "") +
          "</button>" +
          (p.badge ? '<span class="pc-badge">' + bi(p.badge) + "</span>" : "") +
          (soldOut
            ? '<span class="pc-add is-off">' + bi({ ar: "نفدت الكمية", en: "Sold out" }) + "</span>"
            : '<a class="pc-add" href="' + esc(buyHref) + '"' + ext(buyHref) + (buyHref === "#" ? " data-unlinked" : "") + ">" + bi({ ar: "اطلبي الآن", en: "Order now" }) + "<i></i></a>") +
        "</div>" +
        '<div class="pc-info">' +
          '<p class="pc-type">' + (p.brand ? '<span class="pc-brand">' + esc(p.brand) + "</span>" : "") + (p.type ? bi(p.type) : "") + "</p>" +
          '<h3 class="pc-name"><button type="button" data-qv="' + esc(p.handle) + '">' + bi(p.name) + "</button></h3>" +
          (p.tagline ? '<p class="pc-tag">' + bi(p.tagline) + "</p>" : "") +
          '<p class="pc-price">' + price + "</p>" +
        "</div>" +
      "</article>"
    );
  }

  /* ---------- Shopify Storefront API ---------- */
  var QUERY =
    "query Products($lang: LanguageCode) @inContext(language: $lang) {" +
    "  products(first: 100, sortKey: BEST_SELLING) { nodes {" +
    "    handle title description productType vendor tags onlineStoreUrl availableForSale" +
    "    images(first: 2) { nodes { url(transform: { maxWidth: 1000 }) altText } }" +
    "    priceRange { minVariantPrice { amount currencyCode } } compareAtPriceRange { maxVariantPrice { amount } }" +
    "    variants(first: 1) { nodes { id } }" +
    "  } }" +
    "}";
  function fetchLang(lang) {
    return fetch("https://" + cfg.storeDomain + "/api/" + (cfg.apiVersion || "2025-01") + "/graphql.json", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": cfg.storefrontToken },
      body: JSON.stringify({ query: QUERY, variables: { lang: lang } })
    }).then(function (r) { return r.json(); }).then(function (json) {
      if (json.errors) throw new Error(JSON.stringify(json.errors));
      return json.data.products.nodes;
    });
  }
  function short(text) {
    text = (text || "").trim();
    return text;
  }
  function fromShopify(arNodes, enNodes) {
    var enBy = {};
    enNodes.forEach(function (n) { enBy[n.handle] = n; });
    return arNodes.map(function (ar, idx) {
      var en = enBy[ar.handle] || ar;
      var lower = (ar.tags || []).map(function (t) { return t.toLowerCase(); });
      var cols = (cfg.collections || []).filter(function (c) { return lower.indexOf(c.tag) > -1; }).map(function (c) { return c.id; });
      var imgs = (ar.images && ar.images.nodes) || [];
      var variant = ar.variants.nodes[0];
      var variantId = variant ? variant.id.split("/").pop() : null;
      return {
        handle: ar.handle,
        collections: cols,
        bestseller: idx < 4 || lower.indexOf("bestseller") > -1,
        badge: lower.indexOf("new") > -1 ? { ar: "جديد", en: "New" } : null,
        name: { ar: ar.title, en: en.title },
        type: ar.productType ? { ar: ar.productType, en: en.productType } : null,
        brand: ar.vendor || "",
        desc: { ar: short(ar.description), en: short(en.description) },
        price: Number(ar.priceRange.minVariantPrice.amount),
        currencyCode: ar.priceRange.minVariantPrice.currencyCode,
        compareAt: ar.compareAtPriceRange ? Number(ar.compareAtPriceRange.maxVariantPrice.amount) || null : null,
        image: imgs[0] ? imgs[0].url : "assets/img/p-box.jpg",
        hover: imgs[1] ? imgs[1].url : null,
        available: ar.availableForSale,
        url: ar.onlineStoreUrl || storeBase() + "/products/" + ar.handle,
        buyUrl: variantId ? "https://" + cfg.storeDomain + "/cart/" + variantId + ":1" : null
      };
    });
  }

  var loading = null;
  /* Shopify is the source of truth for what is on sale, prices, stock and
     checkout. A Shopify product whose handle matches one in shop-config.js
     keeps the site's bilingual copy and studio photography. */
  function merge(shopify) {
    var local = {};
    (cfg.products || []).forEach(function (p) { local[p.handle] = p; });
    return shopify.map(function (s) {
      var l = local[s.handle];
      if (!l) return s;
      var cols = (l.collections || []).slice();
      (s.collections || []).forEach(function (c) { if (cols.indexOf(c) < 0) cols.push(c); });
      return Object.assign({}, l, {
        collections: cols,
        price: s.price,
        compareAt: s.compareAt,
        currencyCode: s.currencyCode,
        available: s.available,
        url: s.url,
        buyUrl: s.buyUrl
      });
    });
  }

  function load() {
    if (loading) return loading;
    var samples = (cfg.products || []).slice();
    var done = function (l) { list = l; return l; };
    if (!connected) return (loading = Promise.resolve(samples).then(done));
    loading = Promise.all([fetchLang("AR"), fetchLang("EN")])
      .then(function (res) { return fromShopify(res[0], res[1]); })
      // Until the store has products published to this channel, keep showing the site's list.
      .then(function (l) { return l.length ? merge(l) : samples; })
      .then(done)
      .catch(function (err) { console.error("Shopify:", err); return done(samples); });
    return loading;
  }

  /* ---------- Quick view: a drawer with the full product story ---------- */
  var list = [];
  var drawer = null;
  function buildDrawer() {
    drawer = document.createElement("div");
    drawer.className = "qv";
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-modal", "true");
    drawer.innerHTML = '<div class="qv-scrim" data-qv-close></div><div class="qv-panel"><button class="qv-x" type="button" data-qv-close aria-label="Close"><svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M2 2l10 10M12 2 2 12" /></svg></button><div class="qv-body"></div></div>';
    document.body.appendChild(drawer);
    drawer.addEventListener("click", function (e) { if (e.target.closest("[data-qv-close]")) closeQV(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeQV(); });
  }
  function openQV(handle) {
    var p = list.filter(function (x) { return x.handle === handle; })[0];
    if (!p) return;
    if (!drawer) buildDrawer();
    var viewHref = p.url || (!connected && storeBase() ? storeBase() + "/products/" + encodeURIComponent(p.handle) : "#");
    var buyHref = p.buyUrl || viewHref;
    var ext = function (h) { return h === "#" ? "" : ' target="_blank" rel="noopener"'; };
    var gal = (p.gallery && p.gallery.length ? p.gallery : [p.image, p.hover].filter(Boolean));
    var price = priceHtml(p) + (p.price != null ? '<span class="qv-ship">' + bi({ ar: "شامل التوصيل", en: "Delivery included" }) + "</span>" : "");
    drawer.querySelector(".qv-body").innerHTML =
      '<div class="qv-gal">' + gal.map(function (g, i) { return '<figure style="--i:' + i + '"><img src="' + esc(g) + '" alt="" /></figure>'; }).join("") + "</div>" +
      '<div class="qv-info">' +
        '<p class="qv-brand">' + esc(p.brand || "") + "</p>" +
        '<h2 class="qv-name">' + bi(p.name) + "</h2>" +
        (p.type ? '<p class="qv-type">' + bi(p.type) + "</p>" : "") +
        '<p class="qv-price">' + price + "</p>" +
        (p.desc ? '<p class="qv-desc">' + bi(p.desc) + "</p>" : "") +
        '<dl class="qv-facts">' +
          (p.key ? "<div><dt>" + bi({ ar: "المكوّنات الرئيسية", en: "Key ingredients" }) + "</dt><dd>" + bi(p.key) + "</dd></div>" : "") +
          (p.how ? "<div><dt>" + bi({ ar: "طريقة الاستخدام", en: "How to use" }) + "</dt><dd>" + bi(p.how) + "</dd></div>" : "") +
        "</dl>" +
        (p.available === false
          ? '<span class="btn btn--dark is-off">' + bi({ ar: "نفدت الكمية", en: "Sold out" }) + "</span>"
          : '<a class="btn btn--dark qv-buy" href="' + esc(buyHref) + '"' + ext(buyHref) + ">" + bi({ ar: "اطلبي الآن", en: "Order now" }) + '<span class="arr"><svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 7h12M8 2l5 5-5 5" /></svg></span></a>') +
      "</div>";
    drawer.querySelector(".qv-body").scrollTop = 0;
    document.documentElement.classList.add("qv-open");
    requestAnimationFrame(function () { drawer.classList.add("on"); });
  }
  function closeQV() {
    if (!drawer) return;
    drawer.classList.remove("on");
    document.documentElement.classList.remove("qv-open");
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("[data-qv]");
    if (!t || (t.closest(".rail") && t.closest(".rail").classList.contains("drag"))) return;
    e.preventDefault();
    openQV(t.getAttribute("data-qv"));
  });

  // Before Shopify is connected the buttons have nowhere to go: show the launch note instead.
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest(".pc a[href='#'], .qv a[href='#']");
    if (!a) return;
    e.preventDefault();
    var note = document.getElementById("store-note");
    if (note) { closeQV(); note.hidden = false; note.scrollIntoView({ behavior: "smooth", block: "center" }); }
    else location.href = "shop.html#launch";
  });

  window.SPCatalog = { load: load, card: card, priceHtml: priceHtml, bi: bi, esc: esc, connected: connected, cfg: cfg };
})();
