import uuid from 'uuid';
import Promise from 'bluebird';
import omit from '101/omit';
import localRedis from './redis';

const bcrypt = Promise.promisifyAll(require('bcrypt'));
const INDEXED_FIELDS = ['email', 'token'];

let redis = localRedis;

// For testing:
function setRedis(newRedis) {
  redis = newRedis;
}

// Private methods

function userKey(id) {
  return 'ft:user:' + id;
}

function indexKey(key, value) {
  return 'ft:user-' + key + ':' + value;
}


function removePassword(user) {
  return omit(user, 'password');
}


function setUser(user) {
  redis.set(userKey(user.id), JSON.stringify(user));
}

function getUser(userId) {
  return redis.getAsync(userKey(userId))
    .then(userStr => userStr ? JSON.parse(userStr) : null);
}

function indexFields(user) {
  INDEXED_FIELDS.forEach((field) => {
    if (user[field]) {
      redis.set(indexKey(field, user[field]), user.id);
    }
  });
}

// Public methods

function findByIndex(index, value, includePassword) {
  return redis.getAsync(indexKey(index, value))
    .then(userId => userId ? getUser(userId, includePassword) : null);
}

function findById(userId) {
  return getUser(userId).then(removePassword);
}

function update(user) {
  if (user.password) {
    return bcrypt.genSaltAsync(10)
      .then(salt => bcrypt.hashAsync(user.password, salt))
      .then((hash) => {
        user.password = hash;
        setUser(user);
        indexFields(user);

        return removePassword(user);
      });
  }

  setUser(user);
  indexFields(user);

  return Promise.resolve(user);
}

function create(newUser) {
  return findByIndex('email', newUser.email).then((existingUser) => {
    if (existingUser) {
      const error = new Error('already exists');
      error.cause = 'conflict';
      return Promise.reject(error); // TODO this could be better
    }

    newUser.id = uuid.v4();
    return update(newUser);
  });
}

function authenticate(email, password) {
  return findByIndex('email', email).then((user) => {
    if (user) {
      return bcrypt.compareAsync(password, user.password).then((isMatch) => {
        return isMatch ? removePassword(user) : false;
      });
    }

    return false;
  });
}

export default {
  create,
  update,
  findById,
  authenticate,
  setRedis
};
