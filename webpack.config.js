const path = require('path');
const express = require('express');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const paths = {
  src: path.resolve(__dirname, 'src'),
  scss: path.resolve(__dirname, 'src/scss'),
  res: path.resolve(__dirname, 'res'),
  output: path.resolve(__dirname, 'www')
};

const entry = {
  polyfills: path.resolve(paths.src, 'polyfills.ts'),
  vendor: path.resolve(paths.src, 'vendor.ts'),
  main: path.resolve(paths.src, 'main.ts'),
  styles: [
    path.resolve(paths.src, 'scss/ionic/index.scss'),
    path.resolve(paths.src, 'scss/app/index.scss')
  ]
};

const output = {
  path: paths.output,
  filename: '[name].js'
};

const plugins = [
  new ForkCheckerPlugin(),
  new webpack.ContextReplacementPlugin(/angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/, __dirname),
  new webpack.optimize.CommonsChunkPlugin({ name: ['polyfills', 'vendor'].reverse() }),
  new HtmlWebpackPlugin({ template: path.resolve(paths.src, 'index.html'), chunksSortMode: 'dependency' }),
  new webpack.LoaderOptionsPlugin({
    minimize: isProduction,
    debug: !isProduction,
    options: {
      sassLoader: {
        includePaths: [
          paths.scss,
          path.resolve(__dirname, 'node_modules/ionicons/dist/scss')
        ]
      },
      context: '/',
      output
    }
  }),
  new webpack.DefinePlugin({
    'process.env': {
      'ENV': JSON.stringify(process.env.NODE_ENV),
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }
  }),
  new ExtractTextPlugin('styles.css'),
  new CopyWebpackPlugin([{ from: paths.res, to: paths.output }])
];

const loaders = [
  {
    test: /\.ts$/,
    loaders: ['awesome-typescript-loader', 'angular2-template-loader'],
  },
  { test: /\.html$/, loader: 'html' },
  {
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract({
      loader: ['css?sourceMap', 'sass?sourceMap']
    })
  },
  {
    test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?v=[\w\.-]*)?$/,
    loader: 'file?name=fonts/[name].[hash].[ext]?'
  }
];

module.exports = {
  devtool: isProduction ? 'eval' : 'source-map',
  entry,
  output,
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: [paths.src, 'node_modules']
  },
  module: { loaders },
  plugins,
  devServer: {
    stats: 'errors-only',
    inline: true,
    historyApiFallback: true,
    setup: function (app) {
      // Setting up some static routes to use cordova browser platform files
      app.use(express.static(path.join(__dirname, 'platforms/browser/platform_www')));
      app.use(express.static(path.join(__dirname, 'res')));
      app.get('/config.xml', (req, res) => res.sendFile(path.join(__dirname, '/config.xml')));
    },
    outputPath: paths.output
  },
  node: {
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};

