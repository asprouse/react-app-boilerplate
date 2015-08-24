import Redis from 'redis';
import Promise from 'bluebird';
import RedisProcess from './common/RedisProcess';

const port = 12345;
const redisServer = new RedisProcess(port);

redisServer.start().then(() => {
  console.log('Redis started on port ' + port);
  global.redis = Promise.promisifyAll(Redis.createClient(port));
  run();
});


after(() => {
  redisServer.stop();
  console.log('Redis stopped');
});
