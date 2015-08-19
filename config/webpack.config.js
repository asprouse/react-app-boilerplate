import webpack from 'webpack';
import Extract from 'extract-text-webpack-plugin';
import Gzip from 'compression-webpack-plugin';
import Manifest from 'webpack-manifest-plugin';
import ChunkManifest from 'chunk-manifest-webpack-plugin';
import path from 'path';

import appConfig    from '../config/server';
import vendorDeps from './vendors';

const ENTRY_POINT = './app/client.js';
const BABEL_LOADER = 'babel?stage=0';


function fileName(name, dev) {
  return '[' + name + ']' + (dev ? '' : '-[chunkhash]') + '.js'
}

function appEntry(dev) {
  if (dev) {
    return [
      `webpack-dev-server/client?${appConfig.devEndpoint}`,
      'webpack/hot/only-dev-server',
      ENTRY_POINT
    ]
  }

  return ENTRY_POINT
}


function commonPlugins(dev) {
  return [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      chunks: ['app'],
      filename: 'vendor' + (dev ? '' : '-[chunkhash]') + '.js',
      minChunks: Infinity
    }),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEV__: dev,
      __DEVTOOLS__: dev,
      'process.env': {
        'NODE_ENV': JSON.stringify(dev ? 'development' : 'production')
      }
    })
  ];
}

function devPlugins() {
  return [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ].concat(commonPlugins(true));
}

function prodPlugins() {
  return [ new Extract('[name]-[chunkhash].css') ]
    .concat(commonPlugins(false))
    .concat([
      new webpack.optimize.DedupePlugin(),
      new Manifest(),
      new ChunkManifest({
        filename: 'chunk-manifest.json',
        manifestVariable: '__CHUNKS__'
      }),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          'warnings': false,
          'drop_debugger': true,
          'drop_console': true,
          'pure_funcs': ['console.log']
        }
      }),
      new Gzip({
        asset: '{file}.gz',
        algorithm: 'gzip',
        regExp: /\.js$|\.css$/
      })
    ]);
}


function jsLoader(dev) {
  return dev ? ['react-hot', BABEL_LOADER] : [BABEL_LOADER];
}

function styleLoader(loader, dev) {
  return dev ? 'style!' + loader : Extract.extract('style', loader)
}


export default function(dev) {
  return {

    entry: {
      app: appEntry(dev),
      vendor: vendorDeps.app
    },

    output: {
      path: path.join(process.cwd(), 'public', 'assets'),
      filename: fileName('name', dev),
      chunkFilename: fileName('name', dev),
      publicPath: appConfig.devEndpoint + '/assets'
    },

    resolve: {
      alias: {
        'app': path.join(process.cwd(), 'app'),
        'config': path.join(process.cwd(), 'config'),
        'public': path.join(process.cwd(), 'public')
      },
      extensions: ['', '.js', '.jsx']
    },

    devtool: dev ? '#eval' : false,
    debug: dev,
    progress: true,
    node: {
      fs: 'empty'
    },

    plugins: dev ? devPlugins() : prodPlugins(),

    module: {
      noParse: /\.min\.js$/,
      loaders: [
        {
          test: /\.jsx?$/,
          loaders: jsLoader(dev),
          exclude: /node_modules/
        },
        {
          test: /\.styl$/,
          loader: styleLoader('css!autoprefixer?{browsers:["last 2 version"], cascade:false}!stylus', dev)
        },
        {
          test: /\.css$/,
          loader: styleLoader('css!autoprefixer?{browsers:["last 2 version"], cascade:false}', dev)
        }
      ]
    }
  };
}
