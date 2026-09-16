/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B1F2A",
        "ink-soft": "#5C7079",
        base: "#F5FAFB",
        line: "#E1E9EB",
        gold: "#FFB627",
        "gold-soft": "#FFF3DA",
        crawl: "#0090C3",
        "crawl-soft": "#DCF0F8",
        costas: "#8B5CF6",
        "costas-soft": "#EDE6FE",
        borboleta: "#FF6B35",
        "borboleta-soft": "#FFE7DC",
        peito: "#2EC4B6",
        "peito-soft": "#DBF7F4",
      },
      fontFamily: {
        display: ["Oswald", "sans-serif"],
      },
    },
  },
  plugins: [],
};