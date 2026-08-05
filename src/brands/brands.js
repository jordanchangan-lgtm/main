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
import DP_S07B from "./assets/deepal-models/s07b.jpg";
// Nevo assets
import NV_BRAND from "./assets/nevo-brand.jpg";
import NV_A07 from "./assets/nevo-models/a07.jpg";
import NV_A05 from "./assets/nevo-models/a05.jpg";
import NV_Q05 from "./assets/nevo-models/q05.jpg";
import NV_A06 from "./assets/nevo-models/a06.jpg";
import NV_E07 from "./assets/nevo-models/e07.jpg";
import NV_A07B from "./assets/nevo-models/a07b.jpg";

// Shared Jordan showrooms — same four locations for all brands. `location` is
// [lat, long] for the interactive globe markers.
const JORDAN_SHOWROOMS = [
  { name: "Amman — Flagship", address: "Mecca St, Building No. 146", location: [31.955, 35.87] },
  { name: "Amman — Tabarbour", address: "Al Shahid St, Tabarbour", location: [32.02, 35.95] },
  { name: "Aqaba", address: "Aqaba Showroom", location: [29.532, 35.006] },
  { name: "Irbid", address: "Irbid Showroom", location: [32.556, 35.847] },
];

export const CHANGAN = {
  slug: "changan",
  name: "Changan",
  heroShadow: "#1e63c8",
  heroWordColor: "#ffffff", // white
  // TODO: replace with Changan Eado EV 2026 (dark-background) shots once provided.
  galleryImages: [CH_UNI_K, CH_UNI_T, CH_UNI_V, CH_CS75, CH_CS55],
  wordmark: { text: "Changan", transform: "uppercase" },
  theme: {
    deep: "#000e2e", accent: "#7D848E", accentBright: "#8B929C",
    glow: "#b8bfc9", mist: "#c9d6e6", white: "#ffffff", ink: "#0a1420",
    muted: "#5b6675", paper: "#ffffff",
  },
  shaderColors: { base: [0.0, 0.055, 0.18], accent: [0.07, 0.647, 0.957], bright: [0.75, 0.92, 1.0] },
  hero: { pre: "drive world with", mark: "Changan" },
  description: {
    eyebrow: "The Brand",
    headline: "Engineered in China, driven across the world.",
    body:
      "Founded in 1862, Changan is one of China's oldest and largest automakers — today an intelligent, new-energy brand trusted by more than 28 million drivers across 60+ markets, built in fully digital, low-carbon plants.",
    images: [
      { src: CH_UNI_K, alt: "Changan UNI-K" },
      { src: CHANGAN_FACTORY, alt: "Changan manufacturing" },
      { src: CH_UNI_T, alt: "Changan UNI-T" },
      { src: CH_UNI_V, alt: "Changan UNI-V" },
      { src: CH_CS75, alt: "Changan CS75 PLUS" },
      { src: CH_CS55, alt: "Changan CS55 PLUS" },
      { src: CH_ALSVIN, alt: "Changan Alsvin" },
    ],
  },
  modelsGallery: {
    eyebrow: "The Range",
    headline: "A Changan for every road.",
    items: [
      // NOTE: images are placeholders until the real Eado photos arrive.
      { img: CH_UNI_V, title: "Eado DT", sub: "Compact Sedan", note: "Sharp, efficient and connected — the everyday Changan sedan.", pos: "center" },
      { img: CH_ALSVIN, title: "Eado Plus EV", sub: "Electric Sedan", note: "Pure-electric range with the same confident Eado design.", pos: "center" },
    ],
  },
  location: {
    headline: "Experience Changan in Jordan.",
    phone: "+962 6 000 0000", hours: "Sat–Thu · 9:00–19:00",
    showrooms: JORDAN_SHOWROOMS,
    globe: { base: [0.82, 0.88, 0.96], marker: [0.02, 0.42, 0.86], glow: [0.86, 0.92, 1.0] },
  },
};

export const DEEPAL = {
  slug: "deepal",
  name: "Deepal",
  heroShadow: "#1e63c8",
  heroWordColor: "#ffffff", // white
  // Deepal gallery — G318, S07, S05 (GCC).
  galleryImages: [DP_G318, DP_S07, DP_S07B, DP_S05],
  wordmark: { text: "deepal", transform: "uppercase" },
  theme: {
    deep: "#000e2e", accent: "#7D848E", accentBright: "#8B929C",
    glow: "#b8bfc9", mist: "#c9d6e6", white: "#ffffff", ink: "#0a1420",
    muted: "#5b6675", paper: "#ffffff",
  },
  shaderColors: { base: [0.0, 0.055, 0.18], accent: [0.07, 0.647, 0.957], bright: [0.75, 0.92, 1.0] },
  hero: { pre: "drive electric with", mark: "deepal" },
  description: {
    eyebrow: "The Brand",
    headline: "Electric intelligence, beautifully designed.",
    body:
      "Launched in 2022, Deepal is Changan's new-energy brand — pure-electric and range-extended SUVs and sedans built around a smart, driver-first cockpit, with clean sculpted design and effortless software.",
    images: [
      { src: DP_BRAND, alt: "Deepal S07" },
      { src: DP_S07, alt: "Deepal S07" },
      { src: DP_S05, alt: "Deepal S05" },
      { src: DP_G318, alt: "Deepal G318" },
      { src: DP_SL03, alt: "Deepal SL03" },
      { src: DP_L07, alt: "Deepal L07" },
      { src: DP_S07B, alt: "Deepal S07" },
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
    phone: "+962 6 000 0000", hours: "Sat–Thu · 9:00–19:00",
    showrooms: JORDAN_SHOWROOMS,
    globe: { base: [0.82, 0.88, 0.96], marker: [0.02, 0.42, 0.86], glow: [0.86, 0.92, 1.0] },
  },
};

export const NEVO = {
  slug: "nevo",
  name: "Nevo",
  heroShadow: "#1e63c8",
  heroWordColor: "#ffffff", // white
  // Nevo gallery — all Q05 (GCC).
  galleryImages: [NV_Q05],
  wordmark: { text: "Nevo", transform: "uppercase" },
  theme: {
    deep: "#000e2e", accent: "#7D848E", accentBright: "#8B929C",
    glow: "#b8bfc9", mist: "#c9d6e6", white: "#ffffff", ink: "#0a1420",
    muted: "#5b6675", paper: "#ffffff",
  },
  shaderColors: { base: [0.0, 0.055, 0.18], accent: [0.07, 0.647, 0.957], bright: [0.75, 0.92, 1.0] },
  hero: { pre: "power new era with", mark: "Nevo" },
  description: {
    eyebrow: "The Brand",
    headline: "New-energy, made for everyone.",
    body:
      "Nevo is Changan's accessible new-energy line — hybrid and electric sedans and SUVs engineered for real-world range, low running costs and everyday intelligence, confidently styled and within reach.",
    images: [
      { src: NV_BRAND, alt: "Nevo A07" },
      { src: NV_A07, alt: "Nevo A07" },
      { src: NV_A07B, alt: "Nevo A07" },
      { src: NV_A05, alt: "Nevo A05" },
      { src: NV_Q05, alt: "Nevo Q05" },
      { src: NV_A06, alt: "Nevo A06" },
      { src: NV_E07, alt: "Nevo E07" },
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
    phone: "+962 6 000 0000", hours: "Sat–Thu · 9:00–19:00",
    showrooms: JORDAN_SHOWROOMS,
    globe: { base: [0.82, 0.88, 0.96], marker: [0.02, 0.42, 0.86], glow: [0.86, 0.92, 1.0] },
  },
};

export const BRANDS = { changan: CHANGAN, deepal: DEEPAL, nevo: NEVO };
