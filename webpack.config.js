const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = {
  mode: "development",
  entry: {
    app: "./src/index.tsx",
    background: "./src/background.ts",
    content: "./src/content.ts",
  },
  output: {
    filename: (pathData) => {
      console.log("[webpack***] ", pathData.chunk.name)
      return pathData.chunk.name === 'app' 
        ? 'static/[name].[hash].js'
        : '[name].js';
    },
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ["ts-loader"],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: "styles",
          test: /\.css$/,
          chunks: "all",
          enforce: true,
        },
        vendor: {
          chunks: "initial",
          test: "vendor",
          name: "vendor",
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html",
      favicon: "public/favicon.ico",
    }),

    // Create the stylesheet under 'styles' directory
    new MiniCssExtractPlugin({
      filename: "styles/styles.[hash].css",
    }),

    new CopyWebpackPlugin({
      patterns: [
        { from: "./public/manifest.json", to: "manifest.json" },
        { from: "./public/icons", to: "icons" },
      ],
    }),
  ],
}
