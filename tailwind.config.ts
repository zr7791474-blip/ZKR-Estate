import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fef5f0",
          100: "#fceae2",
          200: "#f8cfc4",
          300: "#f5b5a7",
          400: "#f29a89",
          500: "#ef7f6b",
          600: "#C65A1E",
          700: "#b54a15",
          800: "#8a3810",
          900: "#5f2608"
        },
        accent: {
          50: "#f0f5fb",
          100: "#e0eaf7",
          200: "#c1d5ef",
          300: "#a2c0e7",
          400: "#83abdf",
          500: "#6496d7",
          600: "#0F4C81",
          700: "#0e4375",
          800: "#0a2e52",
          900: "#061939"
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"]
      }
    }
  },
  plugins: []
};

export default config;