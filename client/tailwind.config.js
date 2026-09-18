/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        forest: "#173F35",
        emerald: "#2E7D65",
        mint: "#BFE8D5",
        cream: "#FFF9F0",
        sand: "#F4EBDD",
        coral: "#FF8066",
        golden: "#F5C96A",
        ink: "#17221E",
        muted: "#6B7771",
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
