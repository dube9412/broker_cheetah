/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.html",
    "./public/**/*.js", // If your JavaScript files in public use Tailwind classes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}