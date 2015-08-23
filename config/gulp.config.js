import webpackConfig from './webpack.config.js';
import webpackCallback from './webpack.callback.js';

const _public = './public';
const _assets = './assets';


export default (isDevBuild) => {

  return {

    webpack: {
      config: webpackConfig(isDevBuild),
      cb: webpackCallback
    },

    server: {
      paths: ['./server.babel.js']
    },

    images: {
      src: _assets + '/images/**',
      dest: _public + '/images/',
      imagemin: {}
    },

    copy: {
      from: _assets,
      files: [
        [ '/fonts'],
        [ '/svg'],
        [ '/tinies/*', '/' ]
      ],
      to: _public
    },

    watch: {
      root: _assets,
      files: [
        '/fonts/**',
        '/images/**',
        '/json/**'
      ]
    },

    clean: [ _public ],

    devServer: 'webpack-dev-server.js'

  };

};
