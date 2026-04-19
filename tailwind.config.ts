import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./providers/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#E8650A",
        lava: "#FF7A35",
        ember: "#FFAA4C"
      },
      boxShadow: {
        soft: "0 10px 40px rgba(232,101,10,0.15)"
      }
    }
  },
  plugins: []
};

export default config;
