/* Build the Shopify product import file from shop-config.js.
   node tools/shopify-csv.cjs   (from the sudqi-planet folder)
   Writes ../releases/sudqi-planet-shopify-products.csv
   Stock, barcodes and cost come from the purchase invoice (2149, 14/09/2026). */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
global.window = {};
eval(fs.readFileSync(path.join(ROOT, "assets/js/shop-config.js"), "utf8"));
const cfg = window.SP_SHOP;

// Studio photos, publicly hosted (Krea) so Shopify can download them on import.
const K = "https://app-uploads.krea.ai/public/";
const IMG = {
  sun: K + "60f8a43f-523d-4cc4-a0f0-178cd9569166-image.png",
  "sun-2": K + "934167b8-2698-4083-9ab0-27bf0775e4ed-image.png",
  "sun-3": K + "29ae9219-a833-4603-9bea-e7879ce11e6a-image.jpeg",
  cleanser: K + "5622c040-6953-44da-b070-deb3fe91fa90-image.jpeg",
  "cleanser-2": K + "85494d53-c004-4a2f-931f-f20f3183e8d4-image.jpeg",
  "cleanser-3": "https://app-uploads.krea.ai/52d3b88a-e3ba-49b3-b1d4-2e48d953395a/1793432893834-49b75d8d-aa93-45ab-a10d-cdf66ece180f-cleanser-3.jpeg",
  mist: K + "eae30f62-a2d6-458c-9eed-686f38896e0f-image.png",
  "mist-2": K + "ff2d934a-d7ac-4257-9f76-c4c9bb5f7ebf-image.jpeg",
  "mist-3": K + "2839e05c-52b4-47a1-8147-e11333015ed6-image.png",
  cream: K + "3a396bdf-d4c8-47f6-8f6d-50d77e9745b2-image.png",
  "cream-2": K + "a2507fb2-9eb3-4b40-ab49-c3791e5df1ef-image.jpeg",
  "cream-3": K + "e3cdf99b-dd0c-4226-a15b-b40a3690c87c-image.jpeg",
  butter: K + "8c6b7461-e0f1-4e1f-bb40-5fa5f56c9465-image.png",
  "butter-2": K + "c08e95ad-40bc-4399-a365-80da77eed5ea-image.jpeg",
  "butter-3": K + "ec3a59c5-f112-4250-b7a0-b1eb65593bcf-image.png",
  "bundle-1": K + "34ac2933-6810-4ea8-8a2a-788b8e85f65d-image.jpeg",
  "bundle-2": K + "2c395fa0-e28c-4db9-8f52-853d90e12949-image.jpeg",
  "bundle-3": K + "a72a8657-06c2-439a-87d5-4a1041e53ca3-image.png",
  "bundle-4": K + "836db316-4539-4847-8279-c544147c194b-image.png"
};
const PHOTOS = {
  "dr-althea-345-relief-cream-mist": ["mist", "mist-2", "mist-3"],
  "dr-althea-345-whitening-cream": ["cream", "cream-2", "cream-3"],
  "beauty-of-joseon-relief-sun-rice-probiotics": ["sun", "sun-2", "sun-3"],
  "beauty-of-joseon-green-plum-refreshing-cleanser": ["cleanser", "cleanser-2", "cleanser-3"],
  "clinique-deep-comfort-body-butter": ["butter", "butter-2", "butter-3"],
  "package-sun-cleanser": ["bundle-1", "sun", "cleanser"],
  "package-sun-mist": ["bundle-3", "mist", "sun"],
  "package-sun-cleanser-cream": ["bundle-2", "cleanser", "cream", "sun"],
  "package-full-routine": ["bundle-4", "mist", "cream", "cleanser", "sun"]
};
// Stock, barcode and unit cost (admin-only) per single product. Packages are
// assembled from singles, so their stock is not tracked separately.
const STOCK = {
  "dr-althea-345-whitening-cream": { qty: 30, barcode: "6750888628820", cost: 5.5 },
  "clinique-deep-comfort-body-butter": { qty: 30, barcode: "20714139193", cost: 5 },
  "dr-althea-345-relief-cream-mist": { qty: 30, barcode: "8809447256115", cost: 7 },
  "beauty-of-joseon-green-plum-refreshing-cleanser": { qty: 17, barcode: "8809738314675", cost: 6 },
  "beauty-of-joseon-relief-sun-rice-probiotics": { qty: 30, barcode: "8809782555509", cost: 7 }
};
const PACKAGE_COST = { "package-sun-cleanser": 13, "package-sun-mist": 14, "package-sun-cleanser-cream": 18.5, "package-full-routine": 25.5 };

const tagOf = Object.fromEntries(cfg.collections.map((c) => [c.id, c.tag]));
const esc = (v) => { v = v == null ? "" : String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
const H = ["Handle", "Title", "Body (HTML)", "Vendor", "Type", "Tags", "Published", "Option1 Name", "Option1 Value", "Variant SKU",
  "Variant Barcode", "Variant Inventory Tracker", "Variant Inventory Qty", "Variant Inventory Policy", "Variant Fulfillment Service",
  "Variant Price", "Variant Compare At Price", "Variant Requires Shipping", "Variant Taxable", "Cost per item",
  "Image Src", "Image Position", "Image Alt Text", "SEO Title", "SEO Description", "Status"];
const rows = [H];
for (const p of cfg.products) {
  const photos = PHOTOS[p.handle];
  if (!photos) throw new Error("No photos mapped for " + p.handle);
  const st = STOCK[p.handle];
  const tags = [...new Set([...(p.collections || []).map((c) => tagOf[c] || c), ...(p.bestseller ? ["bestseller"] : [])])].join(", ");
  const body = `<p>${p.desc.ar}</p>` + (p.key ? `<p><strong>المكوّنات الرئيسية:</strong> ${p.key.ar}</p>` : "") +
    (p.how ? `<p><strong>طريقة الاستخدام:</strong> ${p.how.ar}</p>` : "") + `<p>${p.type.ar} · السعر شامل التوصيل</p>`;
  photos.forEach((key, i) => {
    const r = Object.fromEntries(H.map((h) => [h, ""]));
    Object.assign(r, { Handle: p.handle, "Image Src": IMG[key], "Image Position": i + 1, "Image Alt Text": p.name.ar + " — " + p.name.en });
    if (i === 0) Object.assign(r, {
      Title: p.name.ar, "Body (HTML)": body, Vendor: p.brand, Type: p.type.ar, Tags: tags, Published: "TRUE",
      "Option1 Name": "Title", "Option1 Value": "Default Title", "Variant SKU": "SP-" + p.handle.split("-").map((w) => w[0]).join("").toUpperCase(),
      "Variant Barcode": st ? st.barcode : "", "Variant Inventory Tracker": st ? "shopify" : "", "Variant Inventory Qty": st ? st.qty : "",
      "Variant Inventory Policy": "deny", "Variant Fulfillment Service": "manual", "Variant Price": p.price, "Variant Compare At Price": p.compareAt || "",
      "Variant Requires Shipping": "TRUE", "Variant Taxable": "FALSE", "Cost per item": st ? st.cost : PACKAGE_COST[p.handle],
      "SEO Title": p.name.ar + " | Sudqi Planet", "SEO Description": (p.tagline ? p.tagline.ar + " — " : "") + p.desc.ar.slice(0, 110), Status: "active"
    });
    rows.push(H.map((h) => r[h]));
  });
}
const out = path.resolve(ROOT, "../releases/sudqi-planet-shopify-products.csv");
fs.writeFileSync(out, "﻿" + rows.map((r) => r.map(esc).join(",")).join("\n") + "\n");
console.log("wrote", out);
for (const p of cfg.products) {
  const st = STOCK[p.handle];
  console.log((st ? "stock " + String(st.qty).padStart(2) : "no stock") + " | " + p.price + " JOD | " + p.name.ar);
}
