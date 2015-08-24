import Redis from 'redis';
import Promise from 'bluebird';

export default Promise.promisifyAll(Redis.createClient());
