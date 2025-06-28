/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        meddark: "#004434",
        medgreen: "#008d7a",
        primary: "#2d6a4f",
        "primary-light": "#40916c",
      },
    },
  },
  plugins: [],
};
