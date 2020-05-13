const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
  {
    entry: {
      main: './src/client/js/main.js',
      rsw: './src/client/js/serviceworker/serviceworker.js',
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
        template: path.resolve(__dirname, 'src', 'client', 'html', 'index.html'),
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
  {
    entry: './src/client/js/404/404.js',
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
        filename: '404.html',
        template: path.resolve(__dirname, 'src', 'client', 'html', '404.html'),
        scriptLoading: 'defer',
      }),
    ],
    resolve: {
      extensions: ['*', '.js'],
    },
    output: {
      filename: '404.js',
      path: path.resolve(__dirname, 'public'),
    },
  },
  {
    entry: './src/client/js/offline/offline.js',
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
        filename: 'offline.html',
        template: path.resolve(__dirname, 'src', 'client', 'html', 'offline.html'),
        scriptLoading: 'defer',
      }),
    ],
    resolve: {
      extensions: ['*', '.js'],
    },
    output: {
      filename: 'offline.js',
      path: path.resolve(__dirname, 'public'),
    },
  },
];
