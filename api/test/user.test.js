import { assert } from 'chai';
import userFactory from '../lib/user';
import FakeRedis from './common/FakeRedis';


describe('User', () => {
  let redis;
  let User;
  const email1 = 'test@foo.com';
  const password1 = 'asdf123';
  const user1 = { email: email1, password: password1 };

  beforeEach(() => {
    redis = new FakeRedis();
    User = userFactory(redis);
  });

  describe('create', () => {
    it('create a user', (done) => {
      User.create(user1).then((user) => {
        assert.isNotNull(user);
        assert.equal(user.email, email1);
        assert.notProperty(user, 'password');
        assert.property(redis.state, 'ft:user:' + user.id);
        assert.property(redis.state, 'ft:user-email:' + user.email);
        done();
      });
    });

    it('create fails when email is already in use', (done) => {
      User.create(user1)
        .then(() => {
          return User.create({ email: email1, password: 'differentpassword' });
        })
        .then(() => {
          assert.fail();
          done();
        }, (err) => {
          assert.isNotNull(err);
          assert.equal(err.cause, 'conflict');
          done();
        });
    });
  });

  describe('authenticate', () => {
    it('returns a user when auth is successful', (done) => {
      User.create(user1)
        .then(() => {
          return User.authenticate(email1, password1);
        }, done)
        .then((user) => {
          assert.isNotNull(user);
          done();
        }, done);
    });

    it('returns false when auth fails', (done) => {
      User.create(user1)
        .then(() => {
          return User.authenticate(email1, 'poopy');
        })
        .then((user) => {
          assert.isFalse(user);
          done();
        });
    });
  });
});
