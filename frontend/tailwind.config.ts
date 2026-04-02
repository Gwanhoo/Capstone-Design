import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: "#131313",
        "surface-low": "#1c1b1b",
        "surface-lowest": "#0e0e0e",
        "surface-high": "#2a2a2a",
        "surface-highest": "#353534",
        primary: "#c3c0ff",
        "primary-container": "#4f46e5",
        tertiary: "#4cd6ff",
        "on-surface": "#e5e2e1",
        "on-surface-variant": "#c7c4d8",
        outline: "#918fa1",
        error: "#ffb4ab"
      }
    }
  },
  plugins: []
};

export default config;
