import { spawn } from 'child_process';

const READY = 'ready to accept connections';

function isReady(buffer) {
  var str = buffer.toString('utf-8');
  return str.indexOf(READY) !== -1;
}

export default class RedisProcess {
  constructor(port) {
    this.port = port;
    this.child = null;
  }

  start() {
    return new Promise((resolve) => {
      const child = this.child = spawn('redis-server', ['--port', this.port]);

      child.stdout.on('data', function (data) {
        if(isReady(data)) {
          resolve();
        }
      });

      child.on('exit', function (exitCode) {
        console.log("RedisProcess exited with code: " + exitCode);
      });
    });
  }

  stop() {
    this.child.kill();
  }

}
