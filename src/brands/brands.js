// ======================================================================
// Brand configuration — one object per connected brand landing page.
// Generic BrandLanding + BrandGallery + BrandLocation render entirely from
// these configs, so adding/adjusting a brand is data-only.
//
// theme keys:  deep (darkest bg) · accent (mid brand colour) ·
//              accentBright (bright brand) · glow (light glow) ·
//              mist (light body text) · white · ink
// gallery item: { img, title, sub, note, pos }
// ======================================================================

// Changan (V-logo) assets
import CHANGAN_FACTORY from "./assets/changan-factory.jpg";
import CH_UNI_K from "./assets/changan-models/uni-k.jpg";
import CH_UNI_T from "./assets/changan-models/uni-t.jpg";
import CH_UNI_V from "./assets/changan-models/uni-v.jpg";
import CH_CS75 from "./assets/changan-models/cs75plus.jpg";
import CH_CS55 from "./assets/changan-models/cs55.jpg";
import CH_ALSVIN from "./assets/changan-models/alsvin.jpg";
// Deepal assets
import DP_BRAND from "./assets/deepal-brand.jpg";
import DP_S07 from "./assets/deepal-models/s07.jpg";
import DP_S05 from "./assets/deepal-models/s05.jpg";
import DP_G318 from "./assets/deepal-models/g318.jpg";
import DP_SL03 from "./assets/deepal-models/sl03.jpg";
import DP_L07 from "./assets/deepal-models/l07.jpg";
// Nevo assets
import NV_BRAND from "./assets/nevo-brand.jpg";
import NV_A07 from "./assets/nevo-models/a07.jpg";
import NV_A05 from "./assets/nevo-models/a05.jpg";
import NV_Q05 from "./assets/nevo-models/q05.jpg";
import NV_A06 from "./assets/nevo-models/a06.jpg";
import NV_E07 from "./assets/nevo-models/e07.jpg";

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
    deep: "#000e2e", accent: "#00437C", accentBright: "#12A5F4",
    glow: "#7ecbff", mist: "#c9d6e6", white: "#ffffff", ink: "#0a0f1a",
  },
  shaderColors: { base: [0.0, 0.055, 0.18], accent: [0.07, 0.647, 0.957], bright: [0.75, 0.92, 1.0] },
  hero: { pre: "drive the world with", mark: "Changan" },
  brandGallery: {
    eyebrow: "The Brand",
    headline: "Engineered in China, driven across the world.",
    description:
      "Founded in 1862, Changan is one of China's largest automakers — an intelligent, new-energy brand trusted by 28 million+ drivers across 60+ markets.",
    items: [
      { img: CHANGAN_FACTORY, title: "Manufacturing", sub: "Fully digital, low-carbon plants", pos: "center" },
      { img: CH_UNI_K, title: "UNI-K", sub: "Flagship SUV", pos: "center" },
      { img: CH_UNI_T, title: "UNI-T", sub: "Coupe SUV", pos: "center" },
      { img: CH_UNI_V, title: "UNI-V", sub: "Fastback Sedan", pos: "center" },
      { img: CH_CS75, title: "CS75 PLUS", sub: "Best-selling SUV", pos: "center" },
      { img: CH_CS55, title: "CS55 PLUS", sub: "Smart SUV", pos: "center" },
      { img: CH_ALSVIN, title: "Alsvin", sub: "Compact Sedan", pos: "center" },
    ],
  },
  modelsGallery: {
    eyebrow: "The Range",
    headline: "A Changan for every road.",
    items: [
      { img: CH_UNI_K, title: "UNI-K", sub: "Flagship SUV", note: "Commanding stance, lounge-grade cabin, 2.0T.", pos: "center" },
      { img: CH_UNI_T, title: "UNI-T", sub: "Coupe SUV", note: "The design manifesto — sculpted and connected.", pos: "center" },
      { img: CH_UNI_V, title: "UNI-V", sub: "Fastback Sedan", note: "A driver's sedan with real punch.", pos: "center" },
      { img: CH_CS75, title: "CS75 PLUS", sub: "Best-selling SUV", note: "Space, tech and confidence for the family.", pos: "center" },
    ],
  },
  location: {
    headline: "Experience Changan in Jordan.",
    showroom: "Mecca Street, Amman, Jordan",
    phone: "+962 6 000 0000", hours: "Sat–Thu · 9:00–19:00",
    city: "Amman", coords: JORDAN_COORDS, satellites: JORDAN_SATELLITES,
  },
};

export const DEEPAL = {
  slug: "deepal",
  name: "Deepal",
  wordmark: { text: "deepal", transform: "lowercase" },
  theme: {
    deep: "#04202a", accent: "#0a8a97", accentBright: "#18c8d6",
    glow: "#8ef0f6", mist: "#bfe0e4", white: "#ffffff", ink: "#04151a",
  },
  shaderColors: { base: [0.0, 0.09, 0.12], accent: [0.09, 0.78, 0.84], bright: [0.82, 0.98, 1.0] },
  hero: { pre: "drive electric with", mark: "deepal" },
  brandGallery: {
    eyebrow: "The Brand",
    headline: "Electric intelligence, beautifully designed.",
    description:
      "Launched in 2022, Deepal is Changan's new-energy brand — pure-electric and range-extended SUVs and sedans built around a smart, driver-first cockpit.",
    items: [
      { img: DP_BRAND, title: "S07", sub: "Design", pos: "center" },
      { img: DP_S07, title: "S07", sub: "Coupe SUV", pos: "center" },
      { img: DP_S05, title: "S05", sub: "Compact SUV", pos: "center" },
      { img: DP_G318, title: "G318", sub: "Adventure SUV", pos: "center" },
      { img: DP_SL03, title: "SL03", sub: "Sedan", pos: "center" },
      { img: DP_L07, title: "L07", sub: "Sport Sedan", pos: "center" },
    ],
  },
  modelsGallery: {
    eyebrow: "The Range",
    headline: "Electric, in every shape.",
    items: [
      { img: DP_S07, title: "S07", sub: "Coupe SUV", note: "Panoramic cabin, long range, smart everything.", pos: "center" },
      { img: DP_S05, title: "S05", sub: "Compact SUV", note: "Agile, connected and made for the city.", pos: "center" },
      { img: DP_G318, title: "G318", sub: "Adventure SUV", note: "Boxy, capable and electric — off the map.", pos: "center" },
      { img: DP_SL03, title: "SL03", sub: "Sedan", note: "The clean-sheet electric sedan.", pos: "center" },
    ],
  },
  location: {
    headline: "Discover Deepal in Jordan.",
    showroom: "Deepal Store, Amman, Jordan",
    phone: "+962 6 000 0000", hours: "Sat–Thu · 9:00–19:00",
    city: "Amman", coords: JORDAN_COORDS, satellites: JORDAN_SATELLITES,
  },
};

export const NEVO = {
  slug: "nevo",
  name: "Nevo",
  wordmark: { text: "Nevo", transform: "uppercase" },
  theme: {
    deep: "#140a2e", accent: "#5a2fb0", accentBright: "#a26bff",
    glow: "#d3b8ff", mist: "#d6cdec", white: "#ffffff", ink: "#0d0720",
  },
  shaderColors: { base: [0.06, 0.02, 0.16], accent: [0.55, 0.35, 1.0], bright: [0.92, 0.86, 1.0] },
  hero: { pre: "power the new era with", mark: "Nevo" },
  brandGallery: {
    eyebrow: "The Brand",
    headline: "New-energy, made for everyone.",
    description:
      "Nevo is Changan's accessible new-energy line — hybrid and electric sedans and SUVs engineered for real-world range, low running costs and everyday intelligence.",
    items: [
      { img: NV_BRAND, title: "A07", sub: "Design", pos: "center" },
      { img: NV_A07, title: "A07", sub: "Fastback Sedan", pos: "center" },
      { img: NV_A05, title: "A05", sub: "Sedan", pos: "center" },
      { img: NV_Q05, title: "Q05", sub: "Compact SUV", pos: "center" },
      { img: NV_A06, title: "A06", sub: "Sedan", pos: "center" },
      { img: NV_E07, title: "E07", sub: "Electric SUV", pos: "center" },
    ],
  },
  modelsGallery: {
    eyebrow: "The Range",
    headline: "The new-energy line-up.",
    items: [
      { img: NV_A07, title: "A07", sub: "Fastback Sedan", note: "Sleek, spacious and seriously efficient.", pos: "center" },
      { img: NV_A05, title: "A05", sub: "Sedan", note: "The smart commuter — plug-in range for real life.", pos: "center" },
      { img: NV_Q05, title: "Q05", sub: "Compact SUV", note: "High-riding, connected and easy to live with.", pos: "center" },
      { img: NV_A06, title: "A06", sub: "Sedan", note: "Aero-styled comfort with everyday range.", pos: "center" },
    ],
  },
  location: {
    headline: "Meet Nevo in Jordan.",
    showroom: "Nevo Store, Amman, Jordan",
    phone: "+962 6 000 0000", hours: "Sat–Thu · 9:00–19:00",
    city: "Amman", coords: JORDAN_COORDS, satellites: JORDAN_SATELLITES,
  },
};

export const BRANDS = { changan: CHANGAN, deepal: DEEPAL, nevo: NEVO };
