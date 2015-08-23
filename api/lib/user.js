import uuid from 'uuid';
import Promise from 'bluebird';
import omit from '101/omit';

const bcrypt = Promise.promisifyAll(require('bcrypt'));

const INDEXED_FIELDS = ['email', 'token'];

function userKey(id) {
  return 'ft:user:' + id;
}

function indexKey(key, value) {
  return 'ft:user-' + key + ':' + value;
}


function removePassword(user) {
  return omit(user, 'password');
}

export default (redis) => {
  function setUser(user) {
    redis.set(userKey(user.id), JSON.stringify(user));
  }

  function getUser(userId) {
    return redis.get(userKey(userId))
      .then(userStr => userStr ? JSON.parse(userStr) : null);
  }

  function indexFields(user) {
    const pipeline = redis.pipeline();
    INDEXED_FIELDS.forEach((field) => {
      if (user[field]) {
        pipeline.set(indexKey(field, user[field]), user.id);
      }
    });
    pipeline.exec();
  }

  function findById(userId) {
    return removePassword(getUser(userId));
  }

  function findByIndex(index, value, includePassword) {
    return redis.get(indexKey(index, value))
      .then(userId => userId ? getUser(userId, includePassword) : null);
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


  return {
    create: create,
    update: update,
    findById: findById,
    authenticate: authenticate
  };
};
