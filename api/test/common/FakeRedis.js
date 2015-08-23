function FakePipeline(state) {
  this.state = state;
  this.chain = [];
}

FakePipeline.prototype = {
  get(key) {
    this.chain.push(['get', key]);
    return this;
  },
  set(key, value) {
    this.chain.push(['set', key, value]);
    this.state[key] = value;
    return this;
  },
  exec() {
    const result = this.chain.map((command) => {
      if (command[0] === 'get') {
        return [null, this.state[command[1]]];
      }

      return [null, 'OK'];
    });

    return Promise.resolve(result);
  }
};


function FakeRedis() {
  this.state = {};
}

FakeRedis.prototype = {
  get(key) {
    return Promise.resolve(this.state[key]);
  },
  set(key, value) {
    this.state[key] = value;
  },

  hget(key, field) {
    return Promise.reslove((this.state[key] || {})[field]);
  },

  hgetall(key) {
    return this.get(key);
  },

  hset(key, field, value) {
    if (typeof this.state[key] !== 'object') {
      this.state[key] = {};
    }

    this.state[key][field] = value;
  },

  pipeline() {
    return new FakePipeline(this.state);
  }
};

export default FakeRedis;

