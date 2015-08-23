/* eslint no-console: 0 */
import Hapi from 'hapi';
import controllers from './controllers';
import hapiAuthCookie from 'hapi-auth-cookie';

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ port: 1337 });

// Register the plugin
server.register(hapiAuthCookie, (err) => {
  if (err) {
    throw err;
  }

  // Set our strategy
  server.auth.strategy('session', 'cookie', {
    password: 'worldofwalmart', // TODO change this
    cookie: 'session', // Cookie name
    isSecure: false, // required for non-https applications
    ttl: 24 * 60 * 60 * 1000 // Set session to 1 day
  });
});

// Print some information about the incoming request for debugging purposes
server.ext('onRequest', (request, reply) => {
  console.log(request.path, request.query);
  return reply.continue();
});

server.route([
  {
    method: 'POST',
    path: '/login',
    config: controllers.login
  },
  {
    method: 'GET',
    path: '/logout',
    config: controllers.logout
  },
  {
    method: 'POST',
    path: '/register',
    config: controllers.register
  },
  {
    method: 'GET',
    path: '/users/me',
    config: controllers.getUser
  }
]);

// Start the server
server.start(() => {
  console.log('The server has started on port: ' + server.info.port);
});
