/* ==========================================================================
   Sudqi Planet — store data
   Everything the landing page and the store page show lives here:
   the Shopify connection, the hero films, the collections and the products.
   See README.md → "Connecting Shopify".
   ========================================================================== */
window.SP_SHOP = {
  /* ---------- Shopify ----------
     storeDomain + storefrontToken  → real products, prices, stock and
     checkout are loaded from Shopify (Arabic + English via Translate & Adapt).
     storefrontUrl only             → buttons open each product on Shopify by handle. */
  storeDomain: "v11yfp-xe.myshopify.com",
  // Public Storefront API token (Headless channel): meant to be visible in the page.
  storefrontToken: "a7d50af32fab093cb579de6572543d90",
  storefrontUrl: "https://v11yfp-xe.myshopify.com",
  apiVersion: "2025-01",
  currency: { ar: "د.أ", en: "JOD" },

  /* ---------- Hero ----------
     The landing hero is assets/img/ai/hero.jpg (desktop) and hero-m.jpg (phones);
     replace those two files to change it. */

  /* ---------- Collections ----------
     `kind` groups them: brand lines and skin concerns.
     `tag` is the Shopify product tag that puts a product in the collection. */
  collections: [
    { id: "new", tag: "new", kind: "edit", ar: "الجديد", en: "New in", desc: { ar: "آخر ما وصل إلى كوكبنا.", en: "The latest to land on our planet." }, image: "assets/img/ai/hero-m.jpg" },
    { id: "dr-althea", tag: "dr-althea", kind: "brand", ar: "Dr. Althea", en: "Dr. Althea", desc: { ar: "عناية كورية مهدّئة بتركيبة ٣٤٥.", en: "Calming Korean care built on the 345 formula." }, image: "assets/img/ai/mist.jpg" },
    { id: "beauty-of-joseon", tag: "beauty-of-joseon", kind: "brand", ar: "Beauty of Joseon", en: "Beauty of Joseon", desc: { ar: "وصفات كورية تقليدية من الأرز والبرقوق.", en: "Traditional Korean recipes of rice and plum." }, image: "assets/img/ai/sun.jpg" },
    { id: "clinique", tag: "clinique", kind: "brand", ar: "Clinique", en: "Clinique", desc: { ar: "عناية غنية للجسم، بلا عطور.", en: "Rich body care, fragrance-free." }, image: "assets/img/ai/butter.jpg" },
    { id: "packages", tag: "package", kind: "edit", ar: "الباقات", en: "Packages", desc: { ar: "روتين كامل بسعرٍ أقل، والتوصيل مشمول.", en: "A full routine for less, delivery included." }, image: "assets/img/ai/bundle-4.jpg" },
    { id: "bright", tag: "bright", kind: "concern", ar: "التفتيح", en: "Brightening", desc: { ar: "لونٌ موحّد وبقعٌ أخف.", en: "A more even tone, softer spots." }, image: "assets/img/ai/cream.jpg" },
    { id: "hydration", tag: "hydration", kind: "concern", ar: "الترطيب", en: "Hydration", desc: { ar: "لبشرةٍ عطشى تبحث عن الراحة.", en: "For thirsty skin that wants comfort." }, image: "assets/img/ai/bundle-3.jpg" },
    { id: "calm", tag: "calm", kind: "concern", ar: "التهدئة", en: "Calming", desc: { ar: "للبشرة الحساسة والمتعبة.", en: "For sensitive, tired skin." }, image: "assets/img/ai/cream.jpg" },
    { id: "cleanse", tag: "cleanse", kind: "concern", ar: "التنظيف", en: "Cleansing", desc: { ar: "الخطوة الأولى في كل روتين.", en: "The first step of every routine." }, image: "assets/img/ai/cleanser.jpg" },
    { id: "sun", tag: "sun", kind: "concern", ar: "الحماية من الشمس", en: "Sun care", desc: { ar: "الخطوة الأخيرة والأهم كل صباح.", en: "The last step, and the most important." }, image: "assets/img/ai/bundle-1.jpg" },
    { id: "body", tag: "body", kind: "concern", ar: "العناية بالجسم", en: "Body care", desc: { ar: "نعومة تمتد من الوجه إلى الجسم.", en: "Softness from face to body." }, image: "assets/img/ai/butter.jpg" }
  ],

  /* ---------- Products ----------
     Descriptions are written from the brands' and retailers' published
     product information. Prices are in JOD and include delivery;
     compareAt shows the original price struck through. price: null shows
     "السعر قريبًا / Price soon". */
  products: [
    {
      handle: "dr-althea-345-relief-cream-mist",
      brand: "Dr. Althea",
      collections: ["new", "dr-althea", "hydration", "calm"],
      bestseller: true,
      badge: { ar: "جديد", en: "New" },
      name: { ar: "بخاخ الكريم ٣٤٥ للتهدئة", en: "345 Relief Cream Mist" },
      type: { ar: "بخاخ مرطّب · ١٠٠ مل", en: "Hydrating mist · 100 ml" },
      tagline: { ar: "كريم وماء في بخّة واحدة", en: "Cream and water in one spray" },
      desc: {
        ar: "بخاخ بطبقتين يجمع قوام الكريم بخفّة الماء: طبقة كريمية بماء نخالة الأرز وحمض الهيالورونيك والبانثينول، وطبقة مائية بالسنتيلا والصبار والماديكاسوسيد. يرطّب ويهدّئ البشرة الجافة والحساسة في أي وقت من اليوم، حتى فوق المكياج.",
        en: "A two-layer mist that pairs a cream layer of rice bran water, hyaluronic acid and panthenol with a water essence of centella, aloe and madecassoside. It hydrates and calms dry or sensitive skin at any time of day, even over makeup."
      },
      key: { ar: "ماء نخالة الأرز · حمض الهيالورونيك · بانثينول · سنتيلا", en: "Rice bran water · Hyaluronic acid · Panthenol · Centella" },
      how: { ar: "رجّيه جيدًا، ثم رشّيه على بُعد ٢٠ سم من الوجه.", en: "Shake well, then spray about 20 cm from the face." },
      price: 14,
      image: "assets/img/ai/mist.jpg",
      hover: "assets/img/ai/mist-2.jpg",
      gallery: ["assets/img/ai/mist.jpg", "assets/img/ai/mist-2.jpg", "assets/img/ai/mist-3.jpg"]
    },
    {
      handle: "dr-althea-345-whitening-cream",
      brand: "Dr. Althea",
      collections: ["new", "dr-althea", "calm", "bright"],
      bestseller: true,
      name: { ar: "كريم ٣٤٥ للتفتيح", en: "345 Whitening Cream" },
      type: { ar: "كريم جل · ٥٠ مل", en: "Gel-cream · 50 ml" },
      tagline: { ar: "لونٌ موحّد وبشرةٌ هادئة", en: "An even tone, calm skin" },
      desc: {
        ar: "كريم جل خفيف من تركيبة ٣٤٥ يجمع النياسيناميد والبانثينول وخلاصة التين الشوكي. يفتّح البقع الداكنة وآثار الحبوب، ويوحّد لون البشرة، ويدعم حاجزها ويهدّئها. يمتصّ بسرعة ولا يترك أثرًا دهنيًا.",
        en: "A light gel-cream from the 345 formula, with niacinamide, panthenol and prickly pear extract. It fades dark spots and post-breakout marks, evens out skin tone, and supports and calms the skin barrier. It sinks in fast with no greasy finish."
      },
      key: { ar: "نياسيناميد · بانثينول · خلاصة التين الشوكي", en: "Niacinamide · Panthenol · Prickly pear extract" },
      how: { ar: "ضعي كمية صغيرة كآخر خطوة في روتين الصباح والمساء.", en: "Apply a small amount as the last step, morning and night." },
      price: 10,
      image: "assets/img/ai/cream.jpg",
      hover: "assets/img/ai/cream-2.jpg",
      gallery: ["assets/img/ai/cream.jpg", "assets/img/ai/cream-2.jpg", "assets/img/ai/cream-3.jpg"]
    },
    {
      handle: "beauty-of-joseon-relief-sun-rice-probiotics",
      brand: "Beauty of Joseon",
      collections: ["new", "beauty-of-joseon", "sun"],
      bestseller: true,
      badge: { ar: "الأكثر طلبًا", en: "Bestseller" },
      name: { ar: "واقي الشمس بالأرز والبروبيوتيك", en: "Relief Sun: Rice + Probiotics" },
      type: { ar: "واقي شمس SPF50+ PA++++ · ٥٠ مل", en: "Sunscreen SPF50+ PA++++ · 50 ml" },
      tagline: { ar: "حماية يومية بلا أثر أبيض", en: "Daily protection, no white cast" },
      desc: {
        ar: "واقي شمس كوري مرطّب يحمي من أشعة UVA وUVB كل يوم. خلاصة الأرز والبروبيوتيك تمنح البشرة نعومة وإشراقًا، والنياسيناميد والغليسرين يحافظان على ترطيبها. قوام كريمي خفيف يمتصّ بسرعة بلا لمعة ولا أثر أبيض.",
        en: "A moisturising Korean sunscreen for everyday UVA and UVB protection. Rice extract and probiotics leave skin soft and bright, while niacinamide and glycerin keep it hydrated. A light cream that absorbs fast, with no shine and no white cast."
      },
      key: { ar: "خلاصة الأرز · بروبيوتيك · نياسيناميد · غليسرين", en: "Rice extract · Probiotics · Niacinamide · Glycerin" },
      how: { ar: "ضعيه كآخر خطوة صباحًا، وجدّديه كل ساعتين تحت الشمس.", en: "Apply as the last morning step; reapply every two hours in the sun." },
      price: 14,
      image: "assets/img/ai/sun.jpg",
      hover: "assets/img/ai/sun-2.jpg",
      gallery: ["assets/img/ai/sun.jpg", "assets/img/ai/sun-2.jpg", "assets/img/ai/sun-3.jpg"]
    },
    {
      handle: "beauty-of-joseon-green-plum-refreshing-cleanser",
      brand: "Beauty of Joseon",
      collections: ["new", "beauty-of-joseon", "cleanse"],
      name: { ar: "غسول البرقوق الأخضر المنعش", en: "Green Plum Refreshing Cleanser" },
      type: { ar: "غسول جل · ١٠٠ مل", en: "Gel cleanser · 100 ml" },
      tagline: { ar: "نظافة لطيفة بلا شدّ", en: "A gentle clean, no tightness" },
      desc: {
        ar: "غسول جل منخفض الحموضة بماء البرقوق الأخضر وخلاصة الماش. يزيل الشوائب والزيوت الزائدة بلطف، ويحافظ على توازن الماء والزيت، فتبقى البشرة منتعشة ومرتاحة بعد الغسل.",
        en: "A low-pH gel cleanser made with green plum water and mung bean extract. It gently lifts impurities and excess oil while keeping the skin's water and oil in balance, so skin feels fresh and comfortable after washing."
      },
      key: { ar: "ماء البرقوق الأخضر · خلاصة الماش", en: "Green plum water · Mung bean extract" },
      how: { ar: "دلّكي كمية صغيرة مع الماء على بشرة مبلّلة، ثم اشطفي.", en: "Lather a small amount with water on damp skin, then rinse." },
      price: 12,
      image: "assets/img/ai/cleanser.jpg",
      hover: "assets/img/ai/cleanser-2.jpg",
      gallery: ["assets/img/ai/cleanser.jpg", "assets/img/ai/cleanser-2.jpg", "assets/img/ai/cleanser-3.jpg"]
    },
    {
      handle: "clinique-deep-comfort-body-butter",
      brand: "Clinique",
      collections: ["clinique", "body", "hydration"],
      name: { ar: "زبدة الجسم ديب كومفورت", en: "Deep Comfort Body Butter" },
      type: { ar: "زبدة للجسم · ٢٠٠ مل", en: "Body butter · 200 ml" },
      tagline: { ar: "راحة غنية للبشرة الجافة جدًا", en: "Rich comfort for very dry skin" },
      desc: {
        ar: "كريم جسم غني بزبدة الشيا يذوب في البشرة الجافة فورًا، مع فيتامين E وحمض الهيالورونيك. مثالي للمناطق الخشنة كالمرفقين والركبتين والكعبين، وخالٍ من العطور.",
        en: "A rich, shea-butter body cream that melts straight into dry skin, with vitamin E and hyaluronic acid. Ideal for rough spots like elbows, knees and heels, and fragrance-free."
      },
      key: { ar: "زبدة الشيا · فيتامين E · حمض الهيالورونيك", en: "Shea butter · Vitamin E · Hyaluronic acid" },
      how: { ar: "ضعيه على بشرة نظيفة بعد الاستحمام. للجسم فقط.", en: "Smooth over clean skin after a shower. For body only." },
      price: 9,
      image: "assets/img/ai/butter.jpg",
      hover: "assets/img/ai/butter-2.jpg",
      gallery: ["assets/img/ai/butter.jpg", "assets/img/ai/butter-2.jpg", "assets/img/ai/butter-3.jpg"]
    },
    /* ---------- Packages ---------- */
    {
      handle: "package-sun-cleanser",
      brand: "Sudqi Planet",
      collections: ["packages"],
      bestseller: true,
      badge: { ar: "باقة", en: "Package" },
      name: { ar: "باقة الحماية والنظافة", en: "Cleanse + Protect Package" },
      type: { ar: "واقي الشمس + غسول البرقوق", en: "Relief Sun + Green Plum Cleanser" },
      tagline: { ar: "بداية الروتين ونهايته", en: "The first and last step" },
      desc: { ar: "غسول البرقوق الأخضر لتنظيف لطيف، وواقي الشمس بالأرز والبروبيوتيك لحماية يومية بلا أثر أبيض. الخطوتان اللتان لا يستغني عنهما أي روتين.", en: "The Green Plum Cleanser for a gentle wash and Relief Sun: Rice + Probiotics for everyday protection with no white cast: the two steps every routine needs." },
      key: { ar: "Beauty of Joseon · قطعتان", en: "Beauty of Joseon · 2 pieces" },
      how: { ar: "الغسول صباحًا ومساءً، والواقي كآخر خطوة كل صباح.", en: "Cleanser morning and night; sunscreen as the last morning step." },
      price: 23, compareAt: 26,
      image: "assets/img/ai/bundle-1.jpg",
      hover: "assets/img/ai/sun.jpg",
      gallery: ["assets/img/ai/bundle-1.jpg", "assets/img/ai/sun.jpg", "assets/img/ai/cleanser.jpg"]
    },
    {
      handle: "package-sun-mist",
      brand: "Sudqi Planet",
      collections: ["packages"],
      badge: { ar: "باقة", en: "Package" },
      name: { ar: "باقة الترطيب والحماية", en: "Hydrate + Protect Package" },
      type: { ar: "واقي الشمس + بخاخ الكريم ٣٤٥", en: "Relief Sun + 345 Relief Cream Mist" },
      tagline: { ar: "ترطيب وحماية طوال اليوم", en: "Moisture and protection all day" },
      desc: { ar: "بخاخ الكريم ٣٤٥ لترطيب وتهدئة البشرة في أي وقت، مع واقي الشمس بالأرز والبروبيوتيك لحمايتها كل صباح.", en: "The 345 Relief Cream Mist to hydrate and calm skin at any time, with Relief Sun: Rice + Probiotics to protect it every morning." },
      key: { ar: "Dr. Althea · Beauty of Joseon · قطعتان", en: "Dr. Althea · Beauty of Joseon · 2 pieces" },
      how: { ar: "رشّي البخاخ متى احتجتِ، وضعي الواقي كل صباح.", en: "Mist whenever skin needs it; sunscreen every morning." },
      price: 23, compareAt: 28,
      image: "assets/img/ai/bundle-3.jpg",
      hover: "assets/img/ai/mist.jpg",
      gallery: ["assets/img/ai/bundle-3.jpg", "assets/img/ai/mist.jpg", "assets/img/ai/sun.jpg"]
    },
    {
      handle: "package-sun-cleanser-cream",
      brand: "Sudqi Planet",
      collections: ["packages"],
      badge: { ar: "باقة", en: "Package" },
      name: { ar: "باقة النظافة والتفتيح والحماية", en: "Cleanse, Brighten + Protect Package" },
      type: { ar: "واقي الشمس + الغسول + كريم ٣٤٥", en: "Relief Sun + Cleanser + 345 Whitening Cream" },
      tagline: { ar: "روتين كامل في ثلاث خطوات", en: "A full routine in three steps" },
      desc: { ar: "نظّفي بغسول البرقوق الأخضر، وفتّحي ووحّدي لون البشرة بكريم ٣٤٥، واحميها بواقي الشمس بالأرز والبروبيوتيك.", en: "Cleanse with the Green Plum Cleanser, brighten and even out tone with the 345 Whitening Cream, and protect with Relief Sun: Rice + Probiotics." },
      key: { ar: "Dr. Althea · Beauty of Joseon · ٣ قطع", en: "Dr. Althea · Beauty of Joseon · 3 pieces" },
      how: { ar: "غسول، ثم كريم، ثم واقي الشمس صباحًا.", en: "Cleanser, then cream, then sunscreen in the morning." },
      price: 30, compareAt: 35.5,
      image: "assets/img/ai/bundle-2.jpg",
      hover: "assets/img/ai/cream.jpg",
      gallery: ["assets/img/ai/bundle-2.jpg", "assets/img/ai/cleanser.jpg", "assets/img/ai/cream.jpg", "assets/img/ai/sun.jpg"]
    },
    {
      handle: "package-full-routine",
      brand: "Sudqi Planet",
      collections: ["packages"],
      bestseller: true,
      badge: { ar: "الأوفر", en: "Best value" },
      name: { ar: "باقة الروتين الكامل", en: "The Full Routine Package" },
      type: { ar: "واقي الشمس + كريم ٣٤٥ + البخاخ + الغسول", en: "Relief Sun + 345 Cream + Mist + Cleanser" },
      tagline: { ar: "كل ما تحتاجه بشرتكِ في علبة واحدة", en: "Everything your skin needs, in one box" },
      desc: { ar: "الروتين الكامل في علبة واحدة مغلّفة كهدية: غسول البرقوق الأخضر، وبخاخ الكريم ٣٤٥، وكريم ٣٤٥ للتفتيح، وواقي الشمس بالأرز والبروبيوتيك.", en: "The whole routine in one gift-wrapped box: the Green Plum Cleanser, the 345 Relief Cream Mist, the 345 Whitening Cream and Relief Sun: Rice + Probiotics." },
      key: { ar: "Dr. Althea · Beauty of Joseon · ٤ قطع", en: "Dr. Althea · Beauty of Joseon · 4 pieces" },
      how: { ar: "غسول، بخاخ، كريم، ثم واقي الشمس صباحًا.", en: "Cleanser, mist, cream, then sunscreen in the morning." },
      price: 35, compareAt: 46,
      image: "assets/img/ai/bundle-4.jpg",
      hover: "assets/img/ai/hero.jpg",
      gallery: ["assets/img/ai/bundle-4.jpg", "assets/img/ai/mist.jpg", "assets/img/ai/cream.jpg", "assets/img/ai/cleanser.jpg", "assets/img/ai/sun.jpg"]
    }
  ]
};
