const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

const BASE_JS = "./src/client/js/";

module.exports = {
  entry: {
    main: BASE_JS + "main.js",
    join: BASE_JS + "join.js",
    preview: BASE_JS + "preview.js",
    videoPlayer: BASE_JS + "videoPlayer.js",
    recorder: BASE_JS + "recorder.js",
    commentSection: BASE_JS + "commentSection.js",
    filter: BASE_JS + "filter.js",
    link: BASE_JS + "link.js",
    login: BASE_JS + "login.js",
    timer: BASE_JS + "timer.js",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/style.css",
    }),
    new FaviconsWebpackPlugin("./src/client/img/favicon.ico"),
  ],
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpg|ico)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "/img/[name].[ext]",
            },
          },
        ],
      },
    ],
  },
};
