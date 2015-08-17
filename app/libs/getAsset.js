import config   from 'config/server.app';


export default (asset, type) => {

  if (__DEV__) {

    return `http://${config.devHost}:${config.devPort}/assets/${asset}.${type}`;

  } else {

    const assets = require('public/assets/manifest.json');

    return `/assets/${assets[`${asset}.${type}`]}`;

  }

}
