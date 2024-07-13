const postcssPresetEnv = require("postcss-preset-env")
const tailwindcss = require("tailwindcss")
const autoprefixer = require("autoprefixer")

module.exports = {
  plugins: [
    postcssPresetEnv({
      browsers: [">0.25%", "not ie 11", "not op_mini all"],
    }),
    require("cssnano"),
    tailwindcss,
    autoprefixer,
  ],
}
