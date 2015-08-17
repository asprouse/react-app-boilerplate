/* eslint no-process-env: 0 */

export default {
    env: process.env.NODE_ENV  || 'development',

    devHost: 'localhost',
    devPort: 3001,
    apiPort: 1337,

    apiName: 'isomorphic-comments',
    apiVersion: 'v1',

    apiPath: '/api',

    loginCookie: 'api_login',
    tokenCookie: 'api_token',

    loginHeader: 'X-User-Email',
    tokenHeader: 'X-User-Token'
};
