/* eslint no-process-env: 0 */
import getUrlConfig from './getUrlConfig';

const APP_URL_CONFIG = getUrlConfig('app', 'http', 'localhost', process.env.APP_PORT || 3500);
const DEV_URL_CONFIG = getUrlConfig('dev', 'http', 'localhost', 3001);
const API_URL_CONFIG = getUrlConfig('api', 'http', 'localhost', 1337);

export default {
  ...APP_URL_CONFIG,
  ...DEV_URL_CONFIG,
  ...API_URL_CONFIG,

  env: process.env.NODE_ENV || 'development',

  bundle: 'app',
  apiName: 'isomorphic-comments',
  apiVersion: 'v1',

  apiPath: '/api',

  loginCookie: 'api_login',
  tokenCookie: 'api_token',

  loginHeader: 'X-User-Email',
  tokenHeader: 'X-User-Token',


  googleAnalyticsId: 'UA-36704000-7',
  facebookAppId: '123456789012345'
};
