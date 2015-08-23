import Joi from 'joi';
import Boom from 'boom';
import redis from './redis';
import Users from './Users';

/**
 * Responds to POST /login and logs the user in, well, soon.
 */
const login = {
  validate: {
    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }
  },
  handler(request, reply) {
    Users.authenticate(request.payload.email, request.payload.password).then((user) => {
      // If the authentication failed user will be false. If it's not false, we store the user
      // in our session and redirect the user to the hideout
      if (user) {
        request.auth.session.set(user);
        return reply(user);
      }

      return reply(Boom.unauthorized('Email and password do not match'));
    }, reply);
  }
};

/**
 * Responds to GET /logout and logs out the user
 */
const logout = {
  auth: 'session',
  handler(request, reply) {
    request.auth.session.clear();
    reply();
  }
};

/**
 * Responds to POST /register and creates a new user.
 */
const register = {
  validate: {
    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }
  },
  handler(request, reply) {
    const newUser = {
      email: request.payload.email,
      password: request.payload.password
    };

    Users.create(newUser)
      .then((user) => {
        reply(user).code(201);
      }, (error) => {
        if (error.cause === 'conflict') {
          reply(Boom.conflict('a user for ' + newUser.email + ' already exists'));
        } else {
          reply(error);
        }
      });
  }
};

export default { login, logout, register };
