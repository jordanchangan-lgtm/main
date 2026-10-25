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
  storeDomain: "",
  storefrontToken: "",
  storefrontUrl: "",
  apiVersion: "2025-01",
  currency: { ar: "د.أ", en: "JOD" },

  /* ---------- Hero films (landing page) ----------
     Three portrait films side by side on desktop; the first one on phones. */
  hero: [
    { video: "assets/video/vid14.mp4", poster: "assets/video/vid14.jpg" },
    { video: "assets/video/vid01.mp4", poster: "assets/video/vid01.jpg" },
    { video: "assets/video/vid02.mp4", poster: "assets/video/vid02.jpg" }
  ],

  /* ---------- Collections ----------
     `kind` groups them: brand lines and skin concerns.
     `tag` is the Shopify product tag that puts a product in the collection. */
  collections: [
    { id: "new", tag: "new", kind: "edit", ar: "الجديد", en: "New in", desc: { ar: "آخر ما وصل إلى كوكبنا.", en: "The latest to land on our planet." }, image: "assets/img/p/trio-2.jpg" },
    { id: "dr-althea", tag: "dr-althea", kind: "brand", ar: "Dr. Althea", en: "Dr. Althea", desc: { ar: "عناية كورية مهدّئة بتركيبة ٣٤٥.", en: "Calming Korean care built on the 345 formula." }, image: "assets/img/p/mist-7.jpg" },
    { id: "beauty-of-joseon", tag: "beauty-of-joseon", kind: "brand", ar: "Beauty of Joseon", en: "Beauty of Joseon", desc: { ar: "وصفات كورية تقليدية من الأرز والبرقوق.", en: "Traditional Korean recipes of rice and plum." }, image: "assets/img/p/sun-1.jpg" },
    { id: "clinique", tag: "clinique", kind: "brand", ar: "Clinique", en: "Clinique", desc: { ar: "عناية غنية للجسم، بلا عطور.", en: "Rich body care, fragrance-free." }, image: "assets/img/p/butter-1.jpg" },
    { id: "hydration", tag: "hydration", kind: "concern", ar: "الترطيب", en: "Hydration", desc: { ar: "لبشرةٍ عطشى تبحث عن الراحة.", en: "For thirsty skin that wants comfort." }, image: "assets/img/p/mist-3.jpg" },
    { id: "calm", tag: "calm", kind: "concern", ar: "التهدئة", en: "Calming", desc: { ar: "للبشرة الحساسة والمتعبة.", en: "For sensitive, tired skin." }, image: "assets/img/p/mist-5.jpg" },
    { id: "cleanse", tag: "cleanse", kind: "concern", ar: "التنظيف", en: "Cleansing", desc: { ar: "الخطوة الأولى في كل روتين.", en: "The first step of every routine." }, image: "assets/img/p/cleanser-1.jpg" },
    { id: "sun", tag: "sun", kind: "concern", ar: "الحماية من الشمس", en: "Sun care", desc: { ar: "الخطوة الأخيرة والأهم كل صباح.", en: "The last step, and the most important." }, image: "assets/img/p/sun-3.jpg" },
    { id: "body", tag: "body", kind: "concern", ar: "العناية بالجسم", en: "Body care", desc: { ar: "نعومة تمتد من الوجه إلى الجسم.", en: "Softness from face to body." }, image: "assets/img/p/trio-2.jpg" }
  ],

  /* ---------- Products ----------
     Descriptions are written from the brands' and retailers' published
     product information. price: null shows "السعر قريبًا / Price soon". */
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
      price: null,
      image: "assets/img/p/mist-1.jpg",
      hover: "assets/img/p/mist-3.jpg",
      gallery: ["assets/img/p/mist-1.jpg", "assets/img/p/mist-3.jpg", "assets/img/p/mist-5.jpg", "assets/img/p/mist-2.jpg"]
    },
    {
      handle: "dr-althea-345-relief-cream",
      brand: "Dr. Althea",
      collections: ["new", "dr-althea", "calm", "hydration"],
      bestseller: true,
      name: { ar: "كريم ٣٤٥ للتهدئة", en: "345 Relief Cream" },
      type: { ar: "كريم جل · ٥٠ مل", en: "Gel-cream · 50 ml" },
      tagline: { ar: "لبشرةٍ هادئة ولونٍ موحّد", en: "For calm skin and an even tone" },
      desc: {
        ar: "كريم جل خفيف يجمع النياسيناميد والبانثينول وخلاصة التين الشوكي. يدعم حاجز البشرة، ويهدّئها بعد الحبوب، ويساعد على توحيد لونها. يمتصّ بسرعة ولا يترك أثرًا دهنيًا.",
        en: "A light gel-cream with niacinamide, panthenol and prickly pear extract. It supports the skin barrier, soothes skin after breakouts and helps even out tone. It sinks in fast with no greasy finish."
      },
      key: { ar: "نياسيناميد · بانثينول · خلاصة التين الشوكي", en: "Niacinamide · Panthenol · Prickly pear extract" },
      how: { ar: "ضعي كمية صغيرة كآخر خطوة في روتين الصباح والمساء.", en: "Apply a small amount as the last step, morning and night." },
      price: null,
      image: "assets/img/p/cream-1.jpg",
      hover: "assets/img/p/cleanser-3.jpg",
      gallery: ["assets/img/p/cream-1.jpg", "assets/img/p/cleanser-3.jpg", "assets/img/p/cream-2.jpg"]
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
      price: null,
      image: "assets/img/p/sun-1.jpg",
      hover: "assets/img/p/sun-2.jpg",
      gallery: ["assets/img/p/sun-1.jpg", "assets/img/p/sun-2.jpg", "assets/img/p/sun-3.jpg"]
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
      price: null,
      image: "assets/img/p/cleanser-1.jpg",
      hover: "assets/img/p/cleanser-2.jpg",
      gallery: ["assets/img/p/cleanser-1.jpg", "assets/img/p/cleanser-2.jpg", "assets/img/p/duo-1.jpg"]
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
      price: null,
      image: "assets/img/p/butter-1.jpg",
      hover: "assets/img/p/trio-2.jpg",
      gallery: ["assets/img/p/butter-1.jpg", "assets/img/p/trio-2.jpg", "assets/img/p/butter-2.jpg"]
    }
  ]
};
