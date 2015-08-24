import Redis from 'fakeredis';
import Promise from 'bluebird';

export default function mockRedis() {
  return Promise.promisifyAll(Redis.createClient());
}
