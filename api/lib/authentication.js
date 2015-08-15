var Joi = require('joi');
var Boom = require('boom');
var redis = require('./redis');
var User = require('./user')(redis);

/**
 * Responds to POST /login and logs the user in, well, soon.
 */
exports.login = {
    validate: {
        payload: {
            email: Joi.string().email().required(),
            password: Joi.string().required()
        }
    },
    handler: function (request, reply) {
        User.authenticate(request.payload.email, request.payload.password).then(function(user) {
            // If the authentication failed user will be false. If it's not false, we store the user
            // in our session and redirect the user to the hideout
            if (user) {
                request.auth.session.set(user);
                return reply(user);
            }

            return reply(Boom.unauthorized('Email and password do not match'));
        },function(error) {
            reply(error);
        });
    }
};

/**
 * Responds to GET /logout and logs out the user
 */
exports.logout = {
    auth: 'session',
    handler: function (request, reply) {
        request.auth.session.clear();
        reply();
    }
};

/**
 * Responds to POST /register and creates a new user.
 */
exports.register = {
    validate: {
        payload: {
            email: Joi.string().email().required(),
            password: Joi.string().required()
        }
    },
    handler: function(request, reply) {
        var newUser = {
            email: request.payload.email,
            password: request.payload.password
        };

        User.create(newUser).then(function(user) {
            reply(user).code(201);
        }, function(error){
            if(error.cause === 'conflict') {
                reply(Boom.conflict('a user for ' + newUser.email + ' already exists'));
            } else {
                reply(error);
            }
        });
    }
};
