import { assert } from 'chai';
import Domains from '../lib/Domains';
import mockRedis from './common/mockRedis';


describe('Domains', () => {
  const redis = mockRedis();
  Domains.setRedis(redis);

  const host1 = 'fairtread.com';
  const origin1 = 'fairtread.com.s3-website-us-east-1.amazonaws.com';
  const domain1 = { host: host1, origin: origin1 };


  describe('create', () => {
    it('create a domain', () => {
      return Domains.create(domain1).then((domain) => {
        assert.isNotNull(domain);
        assert.equal(domain.host, host1);

        return redis.getAsync('ft:domain:' + domain.host).then(result => {
          assert(result);
        });

      });
    });

    it('create fails when host is already in use', () => {
      return Domains.create({ host: host1, origin: 'whatever.whatever.biz' })
        .then(() => {
          assert.fail();
        }, (err) => {
          assert.isNotNull(err);
          assert.equal(err.cause, 'conflict');
        });
    });
  });
});
