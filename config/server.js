/* eslint no-process-env: 0 */

export default {
  env: process.env.NODE_ENV || 'development',

  bundle: 'app',

  devHost: 'localhost',
  devPort: 3001,
  apiPort: 1337,
  appPort: process.env.APP_PORT || 3500,

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
