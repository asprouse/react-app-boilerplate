var Hapi = require('hapi');
var Authentication = require('./lib/authentication');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({ port: 1337 });

// Register the plugin
server.register(require('hapi-auth-cookie'), function (err) {
    if (err) {
        throw err;
    }

    // Set our strategy
    server.auth.strategy('session', 'cookie', {
        password: 'worldofwalmart', // TODO change this
        cookie: 'session', // Cookie name
        isSecure: false, // required for non-https applications
        ttl: 24* 60 * 60 * 1000 // Set session to 1 day
    });
});

// Print some information about the incoming request for debugging purposes
server.ext('onRequest', function (request, reply) {
    console.log(request.path, request.query);
    return reply.continue();
});

server.route([
    {
        method: 'POST',
        path: '/login',
        config: Authentication.login
    },
    {
        method: 'GET',
        path: '/logout',
        config: Authentication.logout
    },
    {
        method: 'POST',
        path: '/register',
        config: Authentication.register
    },
    {
        method: 'GET',
        path: '/test',
        config: {
            auth: 'session',
            handler: function (request, reply) {
                return reply({ success: true });
            }
        }
    }
]);

// Start the server
server.start(function() {
    console.log("The server has started on port: " + server.info.port);
});
