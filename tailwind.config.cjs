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
          DEFAULT: "#018ebf", // warna utama biru
          light: "#02b3e9",
        },
        success: {
          DEFAULT: "#509f08", // warna utama hijau
          light: "#81bd29",
        },
        danger: {
          DEFAULT: "#cf120e", // warna utama merah
          light: "#e71715",
        },
      },
    },
  },
  plugins: [],
};
