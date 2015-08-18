import webpackConfig   from './webpack.config';
import webpackCallback    from './webpack.callback';

const _public = './public';
const _assets = './assets';


export default (isDevBuild) => {

  return {

    webpack: {
      config: webpackConfig(isDevBuild),
      cb    : webpackCallback
    },

    server: {
      paths: ['./server.app.js']
    },

    images: {
      src     : _assets + '/images/**',
      dest    : _public + '/images/',
      imagemin: {}
    },

    copy: {
      from : _assets,
      files: [
        [ '/fonts'                   ],
        [ '/tinies/favicon.ico', '/' ],
        [ '/tinies/robots.txt',  '/' ]
      ],
      to: _public
    },

    watch: {
      root : _assets,
      files: [
        '/fonts/**',
        '/images/**',
        '/json/**'
      ]
    },

    clean: [ _public ]

  };

}
