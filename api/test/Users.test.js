import { assert } from 'chai';
import Users from '../lib/Users';
import FakeRedis from './common/FakeRedis';


describe('Users', () => {
  let redis;

  const email1 = 'test@foo.com';
  const password1 = 'asdf123';
  const user1 = { email: email1, password: password1 };

  beforeEach(() => {
    redis = new FakeRedis();
    Users.setRedis(redis);
  });

  describe('create', () => {
    it('create a user', (done) => {
      Users.create(user1).then((user) => {
        assert.isNotNull(user);
        assert.equal(user.email, email1);
        assert.notProperty(user, 'password');
        assert.property(redis.state, 'ft:user:' + user.id);
        assert.property(redis.state, 'ft:user-email:' + user.email);
        done();
      });
    });

    it('create fails when email is already in use', (done) => {
      Users.create(user1)
        .then(() => {
          return Users.create({ email: email1, password: 'differentpassword' });
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
      Users.create(user1)
        .then(() => {
          return Users.authenticate(email1, password1);
        }, done)
        .then((user) => {
          assert.isNotNull(user);
          done();
        }, done);
    });

    it('returns false when auth fails', (done) => {
      Users.create(user1)
        .then(() => {
          return Users.authenticate(email1, 'poopy');
        })
        .then((user) => {
          assert.isFalse(user);
          done();
        });
    });
  });
});
