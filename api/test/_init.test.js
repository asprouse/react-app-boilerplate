import Redis from 'redis';
import Promise from 'bluebird';
import RedisProcess from './common/RedisProcess';

const port = 12345;
const redisServer = new RedisProcess(port);


global.redis = null;

let error = '';

redisServer.start()
  .then(() => {
    global.redis = Promise.promisifyAll(Redis.createClient(port));
    run();
  })
  .catch(() => {
    error = 'An error occurred starting Redis. Dependant tests appear pending';
    run();
  });


after(() => {
  redisServer.stop();
  if(error) {
    console.warn(error);
  }
});
