import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0b0d",
        paper: "#F3EFE6",
        bone: "#efece3",
        sand: "#d9c6a8",
        jade: "#1E5E45",
        jadeLit: "#2F8261",
        jadeDeep: "#143E2E",
        olive: "#222a22",
        metal: "#B68A4E",
        metalLit: "#D9B57B",
      },
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
