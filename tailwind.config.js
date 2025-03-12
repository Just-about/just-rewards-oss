const sharedConfig = require("@ja-packages/config/tailwind.config");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...sharedConfig,
  mode: "jit",
  darkMode: "class",
  content: ["./src/**/*.tsx"],
  plugins: [],
};
