const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const paths = {
  www: path.join(__dirname, 'www'),
  src: path.join(__dirname, 'src'),
  app: path.join(__dirname, 'src/app')
};

const devtool = isProduction
  ? '#cheap-eval-source-map'
  : '#source-map';

const mainEntries = isProduction
  ? [path.resolve(paths.src, 'main.ts')]
  : [
    path.resolve(paths.src, 'main.ts'),
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/dev-server'
  ];

module.exports = {
  entry: {
    polyfills: path.resolve(paths.src, 'polyfills.ts'),
    vendors: path.resolve(paths.src, 'vendor.ts'),
    main: mainEntries,
    style: path.join(paths.src, 'scss', 'index.scss')
  },
  output: {
    path: paths.www,
    filename: '[name].js'
  },
  devtool: devtool,
  resolve: {
    extensions: ['', '.ts', '.js', '.html', '.scss', '.png'],
    moduleDirectories: [
      'node_modules',
      'node_modules/ionic-angular',
      'node_modules/ionicons/dist/scss/'
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new HtmlWebpackPlugin({
      template: path.join(paths.src, 'index.html'),
      inject: 'body'
    }),
    new ExtractTextPlugin('styles.[hash].css')
  ],
  module: {
    loaders: [
      {
        test: /\.ts$/,
        exclude: /(node_modules)/,
        loaders: ['awesome-typescript-loader', 'angular2-template-loader'],
      },
      { test: /\.html$/, loader: 'html' },
      // {
      //   test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      //   loader: 'file?name=fonts/[name].[hash].[ext]?'
      // },
      { test: /\.json$/, loader: 'json' },

      // handle css files for global and module scopes
      {
        test: /\.css$/,
        exclude: paths.app,
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap!postcss')
      },
      { test: /\.css$/, include: paths.app, loader: 'raw!postcss' },

      // handle scss files for global and module scopes
      {
        test: /\.scss$/,
        exclude: paths.app,
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap!postcss!sass')
      },
      { test: /\.scss$/, include: paths.app, loader: 'raw!postcss!sass' },
      {
        test: [/ionicons\.svg/, /ionicons\.eot/, /ionicons\.ttf/, /ionicons\.woff/, /roboto-bold\.woff/, /roboto-medium\.woff/, /roboto-light\.woff/, /roboto-regular\.woff/, /roboto-bold\.ttf/, /roboto-medium\.ttf/, /roboto-light\.ttf/, /roboto-regular\.ttf/, /noto-sans-bold\.ttf/, /noto-sans-regular\.ttf/],
        loader: 'file?name=fonts/[name].[ext]'
      }
    ]
  },
  sassLoader: {
    includePaths: [
      'node_modules/ionic-angular',
      'node_modules/ionicons/dist/scss'
    ]
  }
};
