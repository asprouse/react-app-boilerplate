import config from 'config/server';


export default (asset, type) => {

  if (__DEV__) {
    return `${config.devEndpoint}/assets/${asset}.${type}`;
  }

  const assets = require('public/assets/manifest.json');

  return `/assets/${assets[`${asset}.${type}`]}`;
};
