import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { ink: "#0a0b0d", jade: "#1f6f5c", bone: "#efece3" },
    },
  },
  plugins: [],
} satisfies Config;
