import request from 'axios';
import config from 'config/server';

const host = __SERVER__ ? config.apiEndpoint : config.apiPath;

let cookieHeader = '';

function call(params) {

  const method = params.method;
  const url = `${params.host || host}${params.path}`;
  const responseType = 'json';

  const headers = {
    'Content-Type': 'application/json',
    'Accept': `application/vnd.${config.apiName}.${config.apiVersion}+json`
  };

  if (cookieHeader) {
    headers.Cookie = cookieHeader;
  }

  if (params.auth) Object.assign(headers, params.auth);

  const requestParams = { method, url, responseType, headers };

  if (params.data) requestParams.data = params.data;

  return request(requestParams);
}

function serializeCookie(obj) {
  return Object.keys(obj).map(key => key + '=' + obj[key]).join('; ');
}

function setCookie(cookie) {
  cookieHeader = typeof cookie === 'object' ? serializeCookie(cookie) : cookie;
}

export default { call, setCookie };
