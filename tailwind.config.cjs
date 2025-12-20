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
          DEFAULT: "#2098d5",
          light: "#1a648a",
        },
        success: {
          DEFAULT: "#7bb927",
          light: "#519d05",
        },
        danger: {
          DEFAULT: "#e81417",
          light: "#cd0f09",
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
