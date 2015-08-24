import { assert } from 'chai';
import Users from '../lib/Users';

describe('Users', () => {

  const email1 = 'test@foo.com';
  const password1 = 'asdf123';
  const user1 = { email: email1, password: password1 };

  before(() => {
    Users.setRedis(redis);
  });

  describe('create', () => {
    it('create a user', () => {
      return Users.create(user1).then((user) => {
        assert.isNotNull(user);
        assert.equal(user.email, email1);
        assert.notProperty(user, 'password');


        const userKey = redis.getAsync('ft:user:' + user.id).then(user => {
          assert(user, 'user was not set')
        });

        const emailIndex = redis.getAsync('ft:user-email:' + user.email).then(userId => {
          assert.equal(userId, user.id, 'email index was not set properly');
        });

        return Promise.all([userKey, emailIndex]);
      });
    });

    it('create fails when email is already in use', () => {
      return Users.create({ email: email1, password: 'differentpassword' })
        .then(() => {
          assert.fail();
        }, (err) => {
          assert.isNotNull(err);
          assert.equal(err.cause, 'conflict');
        });
    });
  });

  const email2 = 'test2@foo.com';
  const password2 = 'jkl;456';
  const user2 = { email: email2, password: password2 };

  describe('authenticate', () => {
    before(() => {
      return Users.create(user2);
    });

    it('returns a user when auth is successful', () => {
      return Users.authenticate(email1, password1).then((user) => {
        assert.isNotNull(user);
      });
    });

    it('returns false when auth fails', () => {
      return Users.authenticate(email1, 'poopy').then((user) => {
        assert.isFalse(user);
      });
    });

  });

});
