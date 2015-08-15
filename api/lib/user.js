var uuid =  require('uuid');
var Promise = require('bluebird');
var bcrypt =  Promise.promisifyAll(require('bcrypt'));
var omit = require('101/omit');

var INDEXED_FIELDS = ['email', 'token'];

function userKey(id) {
    return 'ft:user:' + id;
}

function indexKey(key, value) {
    return 'ft:user-' + key +':' + value;
}


function removePassword(user) {
    return omit(user, 'password');
}

module.exports = function(redis) {
    function setUser(user) {
        redis.set(userKey(user.id), JSON.stringify(user));
    }

    function getUser(userId, includePassword) {
        return redis.get(userKey(userId)).then(function (userStr) {
            return userStr ? JSON.parse(userStr) : null;
        });
    }

    function indexFields(user) {
        var pipeline = redis.pipeline();
        INDEXED_FIELDS.forEach(function (field) {
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
        return redis.get(indexKey(index, value)).then(function (userId) {
            return userId ? getUser(userId, includePassword) : null;
        });
    }

    function update(user) {
        if (user.password) {
            return bcrypt.genSaltAsync(10).then(function(salt) {
                return bcrypt.hashAsync(user.password, salt);
            }).then(function(hash) {
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
        return findByIndex('email', newUser.email).then(function(existingUser) {
            if (existingUser) {
                var error = new Error('already exists');
                error.cause = 'conflict';
                return Promise.reject(error); // TODO this could be better
            }

            newUser.id = uuid.v4();
            return update(newUser);
        })
    }

    function authenticate(email, password) {
        return findByIndex('email', email).then(function(user) {
            if (user) {
                return bcrypt.compareAsync(password, user.password).then(function (isMatch) {
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
