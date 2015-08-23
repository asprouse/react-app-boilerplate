import request from 'axios';

import config from 'config/server';

let cookie = '';

function call(params) {

  const method = params.method;
  const url = `${params.host || config.apiEndpoint}${params.path}`;
  const responseType = 'json';

  const headers = {
    'Content-Type': 'application/json',
    'Accept': `application/vnd.${config.apiName}.${config.apiVersion}+json`
  };

  if (cookie) {
    headers.Cookie = cookie;
  }

  if (params.auth) Object.assign(headers, params.auth);

  const requestParams = { method, url, responseType, headers };

  if (params.data) requestParams.data = params.data;

  return request(requestParams);
}

function serializeCookie(obj) {
  return Object.keys(obj).map(key => key + '=' + obj[key]).join('; ');
}

function setCookie(newCookie) {
  cookie = typeof newCookie === 'object' ? serializeCookie(newCookie) : newCookie;
}

export default { call, setCookie };
