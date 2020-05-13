const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
  {
    entry: {
      main: './src/client/js/main.js',
      rsw: './src/client/js/serviceworker/main.js',
    },
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|svg|jpg|gif|mp3)$/,
          use: ['file-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src', 'client', 'index.html'),
        scriptLoading: 'defer',
      }),
    ],
    resolve: {
      extensions: ['*', '.js'],
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'public'),
    },
  },
  {
    entry: './src/client/js/serviceworker/sw.js',
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|svg|jpg|gif|mp3)$/,
          use: ['file-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['*', '.js'],
    },
    output: {
      filename: 'sw.js',
      path: path.resolve(__dirname, 'public'),
    },
  },
];
