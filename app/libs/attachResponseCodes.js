export default (response) => {

  const resType = response.status / 100 | 0; // eslint-disable-line no-bitwise

  response.info = resType === 1;
  response.ok = resType === 2;
  response.redirect = resType === 3;
  response.clientError = resType === 4;
  response.serverError = resType === 5;
  response.error = (resType === 4 || resType === 5);

  response.created = response.status === 201;
  response.accepted = response.status === 202;
  response.noContent = response.status === 204;
  response.badRequest = response.status === 400;
  response.unauthorized = response.status === 401;
  response.notAcceptable = response.status === 406;
  response.forbidden = response.status === 403;
  response.notFound = response.status === 404;
  response.unprocessable = response.status === 422;

  return response;
};
