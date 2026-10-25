/* ==========================================================================
   Shopify connection — fill these in to make the store live.
   See README.md → "Connecting Shopify".

   • storeDomain      your-store.myshopify.com (always the .myshopify.com one)
   • storefrontToken  public Storefront API access token (Shopify admin →
                      Settings → Apps → Develop apps, or the Headless channel)
   • storefrontUrl    the public address of the Shopify store, used for
                      "view product" links (e.g. https://shop.sudqiplanet.com)
   • currency         shown on the sample products only

   With storeDomain + storefrontToken set, the page loads real products, prices
   and images from Shopify (Arabic and English via Shopify Translate & Adapt),
   and "Order now" sends the customer straight to Shopify checkout.

   Without them, the sample products below are shown. Give each one the
   `handle` of the matching Shopify product and set storefrontUrl, and the
   buttons will open that product on your Shopify store.
   ========================================================================== */
window.SP_SHOP = {
  storeDomain: "",
  storefrontToken: "",
  storefrontUrl: "",
  apiVersion: "2025-01",
  currency: { ar: "د.أ", en: "JOD" },

  /* Filter chips. `tag` matches a Shopify product tag (lower-case). */
  categories: [
    { id: "all", ar: "الكل", en: "All" },
    { id: "care", ar: "الترطيب", en: "Moisture", tag: "care" },
    { id: "serum", ar: "السيروم والزيوت", en: "Serums & oils", tag: "serum" },
    { id: "protect", ar: "التنظيف والحماية", en: "Cleanse & protect", tag: "protect" },
    { id: "makeup", ar: "المكياج", en: "Makeup", tag: "makeup" },
    { id: "gift", ar: "الهدايا", en: "Gifts", tag: "gift" }
  ],

  /* Sample catalogue — placeholders until Shopify is connected. */
  products: [
    {
      handle: "lunar-moisture-cream",
      category: "care",
      badge: { ar: "الأكثر طلبًا", en: "Most loved" },
      name: { ar: "كريم القمر المرطّب", en: "Lunar Moisture Cream" },
      desc: { ar: "قوام خفيف يذوب في البشرة ويمنحها نعومة تدوم طوال اليوم.", en: "A light texture that melts in and keeps skin soft all day." },
      price: 24,
      image: "assets/img/p-jar.jpg",
      hover: "assets/img/jar.jpg"
    },
    {
      handle: "golden-drop-serum",
      category: "serum",
      badge: { ar: "جديد", en: "New" },
      name: { ar: "سيروم القطرة الذهبية", en: "Golden Drop Serum" },
      desc: { ar: "قطرات مركّزة لإشراقة دافئة تبدأ من الداخل.", en: "Concentrated drops for a warm glow from within." },
      price: 28,
      image: "assets/img/serum-drop.jpg",
      hover: "assets/img/p-dropper.jpg"
    },
    {
      handle: "orbit-facial-oil",
      category: "serum",
      name: { ar: "زيت المدار للوجه", en: "Orbit Facial Oil" },
      desc: { ar: "زيت خفيف يغذّي البشرة ويترك لمعة هادئة.", en: "A weightless oil that nourishes and leaves a quiet sheen." },
      price: 26,
      image: "assets/img/p-dropper.jpg",
      hover: "assets/img/flatlay.jpg"
    },
    {
      handle: "daily-sun-veil",
      category: "protect",
      name: { ar: "واقي الشمس اليومي", en: "Daily Sun Veil" },
      desc: { ar: "حماية خفيفة كل صباح، بلا أثر أبيض.", en: "Light protection every morning, with no white cast." },
      price: 19,
      image: "assets/img/p-tube.jpg",
      hover: "assets/img/duo.jpg"
    },
    {
      handle: "soft-cloud-cleanser",
      category: "protect",
      name: { ar: "منظّف الغيمة الناعمة", en: "Soft Cloud Cleanser" },
      desc: { ar: "رغوة كريمية تنظّف بلطف وتحافظ على راحة البشرة.", en: "A creamy foam that cleanses gently and keeps skin comfortable." },
      price: 16,
      image: "assets/img/cream.jpg",
      hover: "assets/img/hand.jpg"
    },
    {
      handle: "stardust-glow-powder",
      category: "makeup",
      name: { ar: "بودرة غبار النجوم", en: "Stardust Glow Powder" },
      desc: { ar: "لمعة ناعمة تُظهر جمالكِ ولا تخفيه.", en: "A soft glow that reveals you rather than hides you." },
      price: 22,
      image: "assets/img/powder-orbit.jpg",
      hover: "assets/img/skin-face.jpg"
    },
    {
      handle: "small-world-essence",
      category: "care",
      name: { ar: "إسنس عالمكِ الصغير", en: "Small World Essence" },
      desc: { ar: "خطوة ترطيب أولى تُهيّئ البشرة لما بعدها.", en: "A first layer of hydration that prepares skin for the rest." },
      price: 21,
      image: "assets/img/p-box.jpg",
      hover: "assets/img/box.jpg"
    },
    {
      handle: "routine-in-orbit-set",
      category: "gift",
      badge: { ar: "هدية", en: "Gift" },
      name: { ar: "مجموعة روتينكِ في مدار", en: "Routine in Orbit Set" },
      desc: { ar: "نظّفي، رطّبي، احمي — في علبة هدية واحدة.", en: "Cleanse, moisturise, protect — in one gift box." },
      price: 59,
      image: "assets/img/gift.jpg",
      hover: "assets/img/thanks.jpg"
    },
    {
      handle: "sudqi-planet-tote",
      category: "gift",
      name: { ar: "حقيبة صدقي بلانيت", en: "Sudqi Planet Tote" },
      desc: { ar: "حقيبة قماشية تحمل كوكبكِ الصغير معكِ.", en: "A canvas tote to carry your small planet with you." },
      price: 12,
      image: "assets/img/tote.jpg",
      hover: "assets/img/sphere.jpg"
    }
  ]
};
