const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/js/app.js',
    output: {
      path: path.resolve(__dirname, 'docs'),
      filename: 'js/app.js',
      publicPath: './',
      clean: true,
      assetModuleFilename: 'assets/[name][ext][query]'
    },
    devServer: {
      static: './docs',
      open: true,
      hot: true,
      port: 8081,
      watchFiles: ['src/**/*'],
      historyApiFallback: true
    },
    devtool: isProduction ? false : 'source-map',
    module: {
      rules: [
        // {  <-- Elimina esta regla para CSS, la reemplazaremos con la de SCSS
        //   test: /\.css$/i,
        //   use: [MiniCssExtractPlugin.loader, 'css-loader'],
        // },
        {
          test: /\.scss$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader", // Usa MiniCssExtractPlugin en producción para archivos CSS separados
            "css-loader",
            "sass-loader"
          ]
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
      }),
      new MiniCssExtractPlugin({
        filename: 'css/styles.css',
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: path.resolve(__dirname, 'src', 'assets', 'favicon'), to: 'assets/favicon' },
          { from: path.resolve(__dirname, 'src', 'images'), to: 'images' },
          { from: path.resolve(__dirname, 'src', '*.txt'), to: './[name].[ext]' },
        ],
      }),
      new Dotenv({
        path: './.env',
        safe: false,
        allowEmptyValues: true,
        systemvars: true,
        silent: true,
        defaults: false,
      }),
      new webpack.DefinePlugin({
        GH_TOKEN: JSON.stringify(process.env.GH_TOKEN || process.env.REACT_APP_GH_TOKEN),
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
    ],
  };
};