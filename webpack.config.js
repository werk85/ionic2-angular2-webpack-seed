const path = require('path');
const express = require('express');
const autoprefixer = require('autoprefixer');

const AotPlugin = require('@ngtools/webpack').AotPlugin;
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;

//=========================================================
//  CONSTANTS
//---------------------------------------------------------
const IS_PROD = process.env.NODE_ENV === 'production';
const IS_DEV = !IS_PROD;
const IS_TEST = process.env.npm_lifecycle_event === ('test' || 'test-watch');
const PATHS = {
  src: path.resolve(__dirname, 'src'),
  scss: path.resolve(__dirname, 'src/scss'),
  res: path.resolve(__dirname, 'res'),
  output: path.resolve(__dirname, 'www')
};
const APP_CONSTANTS = {
  'process.env': {
    ENV: JSON.stringify(process.env.NODE_ENV),
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
  }
}

//=========================================================
//  CONFIG ENTRIES
//---------------------------------------------------------
const loaderMap = {
  aot: {
    test: /\.ts$/,
    loaders: ['@ngtools/webpack']
  },
  typescript: {
    test: /\.ts$/,
    loaders: ['awesome-typescript-loader', 'angular2-template-loader'],
  },
  html: {
    test: /\.html$/,
    loader: 'raw'
  },
  styles: {
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract('css?-autoprefixer!postcss!sass'),
    include: PATHS.scss
  },
  ignoreStyles: {
    test: /\.scss$/,
    loader: 'ignore-loader'
  },
  json: {
    test: /\.json$/,
    loader: 'json'
  },
  assets: {
    test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?v=[\w\.-]*)?$/,
    loader: 'file?name=fonts/[name].[hash].[ext]?'
  }
};

const output = {
  path: PATHS.output,
  filename: '[name].js'
};

//=========================================================
//  CONFIG
//---------------------------------------------------------
const config = module.exports = {
  entry: {
    polyfills: path.resolve(PATHS.src, 'polyfills.ts'),
    vendor: path.resolve(PATHS.src, 'vendor.ts'),
    main: path.resolve(PATHS.src, 'main.ts'),
    style: path.resolve(PATHS.scss, 'vendor.scss'),
    app: path.resolve(PATHS.scss, 'app/index.scss')
  },
  output,
  plugins: [
    new ExtractTextPlugin('[name][hash].css'),
    new ForkCheckerPlugin(),
    new ContextReplacementPlugin(/angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/),
    new LoaderOptionsPlugin({
      minimize: IS_PROD,
      debug: !IS_PROD,
      options: {
        sassLoader: {
          includePaths: [
            PATHS.scss,
            path.resolve(__dirname, 'node_modules/ionicons/dist/scss')
          ]
        },
        postcss: [autoprefixer({ browsers: ['last 3 versions'] })],
        context: '/',
        output
      }
    }),
    new DefinePlugin(APP_CONSTANTS)
  ],
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: [PATHS.src, 'node_modules']
  },
  module: {
    loaders: [
      loaderMap.json,
      loaderMap.html,
      loaderMap.assets
    ]
  },
  node: {
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};

//=========================================================
//  DEVELOP CONFIG
//---------------------------------------------------------
if (IS_DEV && !IS_TEST) {
  config.devtool = 'cheap-source-map';
  config.plugins = config.plugins.concat([
    new CommonsChunkPlugin({ name: ['vendor', 'polyfills'] }),
    new HtmlWebpackPlugin({ template: path.resolve(PATHS.src, 'index.html'), chunksSortMode: 'dependency' })
  ]);
  config.module.loaders = config.module.loaders.concat([
    loaderMap.typescript,
    loaderMap.styles
  ]);
  config.devServer =  {
    stats: 'minimal',
    setup: function (app) {
      app.use('/', express.static(PATHS.res));
      app.use(express.static(path.join(__dirname, 'platforms/browser/platform_www')));
      app.get('/config.xml', (req, res) => res.sendFile(path.join(__dirname, '/config.xml')));
    },
    outputPath: PATHS.output
  }
}

//=========================================================
//  PRODUCTION CONFIG
//---------------------------------------------------------
if (IS_PROD) {
  config.devtool = 'source-map';
  config.plugins = config.plugins.concat([
    new AotPlugin({
      tsConfigPath: './tsconfig.json',
      entryModule: 'src/app/AppModule#AppModule'
    }),
    new CopyWebpackPlugin([{ from: PATHS.res, to: PATHS.output }]),
    new CommonsChunkPlugin({ name: ['vendor', 'polyfills'] }),
    new HtmlWebpackPlugin({ template: path.resolve(PATHS.src, 'index.html'), chunksSortMode: 'dependency' })
  ]);
  config.module.loaders = config.module.loaders.concat([
    loaderMap.aot,
    loaderMap.styles
  ]);
}

//=========================================================
//  TEST CONFIG
//---------------------------------------------------------
if (IS_TEST) {
  config.devtool = 'cheap-source-map';
  config.module.loaders = config.module.loaders.concat([
    loaderMap.typescript,
    loaderMap.ignoreStyles
  ]);
}
