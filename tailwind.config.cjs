/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1a648a",
          light: "#2098d5",
        },
        success: {
          DEFAULT: "#7bb927",
          light: "#519d05",
        },
        danger: {
          DEFAULT: "#cd0f09",
          light: "#e81417",
        },
        grayd: {
          DEFAULT: "#F0F0F0",
          light: "#fafafa",
        },
      },
    },
  },
  plugins: [],
};
