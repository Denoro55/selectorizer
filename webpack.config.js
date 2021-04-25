const path = require("path");
const webpack = require("webpack");
const htmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    lib: "./src/index.ts",
    template: "./template/script.ts",
  },
  output: {
    filename: (pathData) => {
      return pathData.chunk.name === "lib"
        ? "selectorizer.js"
        : "bundle.[contenthash].js";
    },
    // filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, "dist"),
    // publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'node_modules/ansi-styles'),
          path.resolve(__dirname, 'node_modules/strip-ansi'),
          path.resolve(__dirname, 'node_modules/ansi-regex'),
        ],
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.(jpg|jpeg|png|svg|gif)$/,
        use: ["file-loader"],
      },
    ],
  },
  resolve: {
    modules: [path.resolve("./src"), path.resolve("./node_modules"), path.resolve("./template/node_modules")],
    extensions: [".tsx", ".ts", ".js"],
    symlinks: false,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env || "development"),
    }),
    new htmlWebpackPlugin({
      title: "Selectorizer",
      chunks: ["template"],
      template: "./template/index.html",
    }),
    new CleanWebpackPlugin(),
  ],
};
