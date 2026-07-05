// ======================================================================
// Brand configuration — one object per connected brand landing page.
// The generic BrandLanding + BrandModels + BrandLocation components render
// entirely from these configs, so adding/adjusting a brand is data-only.
//
// theme keys:  deep (darkest bg) · accent (mid brand colour) ·
//              accentBright (bright brand) · glow (light glow) ·
//              mist (light body text) · white · ink
// shaderColors: 0..1 float triplets fed into the hero shader ramp.
// ======================================================================

// Changan (V-logo) assets
import CHANGAN_FACTORY from "./assets/changan-factory.jpg";
import CH_UNI_K from "./assets/changan-models/uni-k.jpg";
import CH_UNI_T from "./assets/changan-models/uni-t.jpg";
import CH_UNI_V from "./assets/changan-models/uni-v.jpg";
import CH_CS75 from "./assets/changan-models/cs75plus.jpg";
// Deepal assets
import DP_BRAND from "./assets/deepal-brand.jpg";
import DP_S07 from "./assets/deepal-models/s07.jpg";
import DP_S05 from "./assets/deepal-models/s05.jpg";
import DP_G318 from "./assets/deepal-models/g318.jpg";
// Nevo assets
import NV_BRAND from "./assets/nevo-brand.jpg";
import NV_A07 from "./assets/nevo-models/a07.jpg";
import NV_A05 from "./assets/nevo-models/a05.jpg";
import NV_Q05 from "./assets/nevo-models/q05.jpg";

// Jordan showroom data shared across the three brands (decorative radar pins).
const JORDAN_SATELLITES = [
  { name: "Irbid", x: 62, y: 24 },
  { name: "Zarqa", x: 66, y: 45 },
  { name: "Aqaba", x: 40, y: 84 },
];
const JORDAN_COORDS = "31.9539° N   35.9106° E";

export const CHANGAN = {
  slug: "changan",
  name: "Changan",
  wordmark: { text: "Changan", transform: "uppercase" },
  theme: {
    deep: "#000e2e",
    accent: "#00437C",
    accentBright: "#12A5F4",
    glow: "#7ecbff",
    mist: "#c9d6e6",
    white: "#ffffff",
    ink: "#0a0f1a",
  },
  shaderColors: {
    base: [0.0, 0.055, 0.18],
    accent: [0.07, 0.647, 0.957],
    bright: [0.75, 0.92, 1.0],
  },
  hero: { pre: "drive the world with", mark: "Changan" },
  brand: {
    eyebrow: "The Brand",
    headline: "Engineered in China, driven across the world.",
    body:
      "Founded in 1862, Changan is one of China's\noldest and largest automakers — today a\nglobal new-energy brand trusted by more than\n28 million drivers across 60+ markets.\nEvery vehicle is built in fully digital,\nlow-carbon plants — design and craft at scale.",
    image: CHANGAN_FACTORY,
  },
  models: {
    headline: "A Changan for every road.",
    items: [
      { key: "uni-k", name: "UNI-K", cat: "Flagship SUV", blurb: "Commanding stance, lounge-grade cabin and a 2.0T heart.", img: CH_UNI_K },
      { key: "uni-t", name: "UNI-T", cat: "Coupe SUV", blurb: "The design manifesto — sculpted, connected, unmistakably new.", img: CH_UNI_T },
      { key: "uni-v", name: "UNI-V", cat: "Fastback Sedan", blurb: "A driver's sedan with a fastback silhouette and real punch.", img: CH_UNI_V },
      { key: "cs75", name: "CS75 PLUS", cat: "Best-selling SUV", blurb: "The everyday flagship — space, tech and confidence for the family.", img: CH_CS75 },
    ],
  },
  location: {
    headline: "Experience Changan in Jordan.",
    showroom: "Mecca Street, Amman, Jordan",
    phone: "+962 6 000 0000",
    hours: "Sat–Thu · 9:00–19:00",
    city: "Amman",
    coords: JORDAN_COORDS,
    satellites: JORDAN_SATELLITES,
  },
};

export const DEEPAL = {
  slug: "deepal",
  name: "Deepal",
  wordmark: { text: "deepal", transform: "lowercase" },
  theme: {
    deep: "#04202a",
    accent: "#0a8a97",
    accentBright: "#18c8d6",
    glow: "#8ef0f6",
    mist: "#bfe0e4",
    white: "#ffffff",
    ink: "#04151a",
  },
  shaderColors: {
    base: [0.0, 0.09, 0.12],
    accent: [0.09, 0.78, 0.84],
    bright: [0.82, 0.98, 1.0],
  },
  hero: { pre: "drive electric with", mark: "deepal" },
  brand: {
    eyebrow: "The Brand",
    headline: "Electric intelligence, beautifully designed.",
    body:
      "Launched in 2022, Deepal is Changan's\nnew-energy brand — pure-electric and\nrange-extended SUVs and sedans built around\na smart, driver-first cockpit.\nClean sculpted design, effortless software —\nelectric mobility made simple.",
    image: DP_BRAND,
  },
  models: {
    headline: "Electric, in every shape.",
    items: [
      { key: "s07", name: "S07", cat: "Coupe SUV", blurb: "The flagship SUV — panoramic cabin, long range, smart everything.", img: DP_S07 },
      { key: "s05", name: "S05", cat: "Compact SUV", blurb: "Agile, connected and made for the city and beyond.", img: DP_S05 },
      { key: "g318", name: "G318", cat: "Adventure SUV", blurb: "Boxy, capable and electric — go off the map with confidence.", img: DP_G318 },
    ],
  },
  location: {
    headline: "Discover Deepal in Jordan.",
    showroom: "Deepal Store, Amman, Jordan",
    phone: "+962 6 000 0000",
    hours: "Sat–Thu · 9:00–19:00",
    city: "Amman",
    coords: JORDAN_COORDS,
    satellites: JORDAN_SATELLITES,
  },
};

export const NEVO = {
  slug: "nevo",
  name: "Nevo",
  wordmark: { text: "Nevo", transform: "uppercase" },
  theme: {
    deep: "#140a2e",
    accent: "#5a2fb0",
    accentBright: "#a26bff",
    glow: "#d3b8ff",
    mist: "#d6cdec",
    white: "#ffffff",
    ink: "#0d0720",
  },
  shaderColors: {
    base: [0.06, 0.02, 0.16],
    accent: [0.55, 0.35, 1.0],
    bright: [0.92, 0.86, 1.0],
  },
  hero: { pre: "power the new era with", mark: "Nevo" },
  brand: {
    eyebrow: "The Brand",
    headline: "New-energy, made for everyone.",
    body:
      "Nevo is Changan's accessible new-energy line —\nhybrid and electric sedans and SUVs\nengineered for real-world range, low running\ncosts and everyday intelligence.\nSmart, efficient and confidently styled —\nthe future, within reach.",
    image: NV_BRAND,
  },
  models: {
    headline: "The new-energy line-up.",
    items: [
      { key: "a07", name: "A07", cat: "Fastback Sedan", blurb: "Flagship sedan — sleek, spacious and seriously efficient.", img: NV_A07 },
      { key: "a05", name: "A05", cat: "Sedan", blurb: "The smart commuter — plug-in range that fits real life.", img: NV_A05 },
      { key: "q05", name: "Q05", cat: "Compact SUV", blurb: "High-riding, connected and easy to live with, every day.", img: NV_Q05 },
    ],
  },
  location: {
    headline: "Meet Nevo in Jordan.",
    showroom: "Nevo Store, Amman, Jordan",
    phone: "+962 6 000 0000",
    hours: "Sat–Thu · 9:00–19:00",
    city: "Amman",
    coords: JORDAN_COORDS,
    satellites: JORDAN_SATELLITES,
  },
};

export const BRANDS = { changan: CHANGAN, deepal: DEEPAL, nevo: NEVO };
