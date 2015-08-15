var assert = require('chai').assert;
var Promise = require('bluebird');
var UserFactory = require('../lib/user');

function FakeRedis() {
    this.state = {};
}

FakeRedis.prototype = {
    get: function(key) {
        return Promise.resolve(this.state[key]);
    },
    set: function(key, value) {
        this.state[key] = value
    },
    pipeline: function(){
        return new FakePipeline(this.state);
    }
};

function FakePipeline(state) {
    this.state = state;
    this.chain =  [];
}

FakePipeline.prototype = {
    get: function(key) {
        this.chain.push(['get', key]);
        return this;
    },
    set: function(key, value) {
        this.chain.push(['set', key, value]);
        this.state[key] = value;
        return this;
    },
    exec: function(){
        var self = this,
            result = this.chain.map(function(command){
                if(command[0] == 'get') {
                    return [null, self.state[command[1]]];
                } else {
                    return [null, 'OK'];
                }
            });

        return Promise.resolve(result);
    }
};

describe('User', function () {
    var redis, User;
    var email1 = 'test@foo.com',
        password1 = 'asdf123',
        user1 = { email: email1, password: password1 };

    beforeEach(function(){
        redis = new FakeRedis();
        User = UserFactory(redis);
    });

    describe('create', function () {
        it('create a user', function (done) {
            User.create(user1).then(function(user) {
                assert.isNotNull(user);
                assert.equal(user.email, email1);
                assert.notProperty(user, 'password');
                assert.property(redis.state, 'ft:user:' + user.id);
                assert.property(redis.state, 'ft:user-email:' + user.email);
                done();
            });
        });

        it('create fails when email is already in use', function(done) {
            User.create(user1)
                .then(function(){
                    return User.create({ email: email1, password: 'differentpassword' });
                })
                .then(function(){
                    assert.fail();
                    done();
                }, function(err){
                    assert.isNotNull(err);
                    assert.equal(err.cause, 'conflict');
                    done();
                });
        });
    });

    describe('authenticate', function () {
        it('returns a user when auth is successful', function (done) {
            User.create(user1)
                .then(function(oo) {
                    return User.authenticate(email1, password1)
                }, done)
                .then(function(user){
                    assert.isNotNull(user);
                    done();
                }, done);
        });

        it('returns false when auth fails', function (done) {
            User.create(user1)
                .then(function() {
                    return User.authenticate(email1, 'poopy')
                })
                .then(function(user){
                    assert.isFalse(user);
                    done();
                });
        });
    });
});
