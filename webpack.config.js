const path = require('path');
const express = require('express');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;

const isProduction = process.env.NODE_ENV === 'production';

const main = isProduction ? 'main.prod.ts' : 'main.dev.ts';

const paths = {
  src: path.resolve(__dirname, 'src'),
  scss: path.resolve(__dirname, 'src/scss'),
  res: path.resolve(__dirname, 'res'),
  output: path.resolve(__dirname, 'www')
};

const entry = {
  polyfills: path.resolve(paths.src, 'polyfills.ts'),
  vendor: path.resolve(paths.src, 'vendor.ts'),
  main: path.resolve(paths.src, main),
  ionic: path.resolve(paths.src, 'scss/ionic/index.scss'),
  app: path.resolve(paths.src, 'scss/app/index.scss')
};

const output = {
  path: paths.output,
  filename: '[name].js'
};

const plugins = [
  new ForkCheckerPlugin(),
  new webpack.ContextReplacementPlugin(/angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/),
  new webpack.optimize.CommonsChunkPlugin({ name: ['vendor', 'polyfills'] }),
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
  new ExtractTextPlugin('[name][hash].css'),
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
  { test: /\.json$/, loader: 'json' },
  {
    test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?v=[\w\.-]*)?$/,
    loader: 'file?name=fonts/[name].[hash].[ext]?'
  }
];

module.exports = {
  devtool: isProduction ? 'cheap-source-map' : 'source-map',
  entry,
  output,
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: [paths.src, 'node_modules']
  },
  module: { loaders },
  plugins,
  devServer: {
    stats: 'minimal',
    setup: function (app) {
      app.use('/', express.static(path.join(__dirname, 'res')));
      app.use(express.static(path.join(__dirname, 'platforms/browser/platform_www')));
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

