import localRedis from './redis';

const INDEXED_FIELDS = ['email', 'token'];

let redis = localRedis;

// For testing:
function setRedis(newRedis) {
  redis = newRedis;
}

// Private methods

function domainKey(host) {
  return 'ft:domain:' + host;
}

function indexKey(key, value) {
  return 'ft:domain-' + key + ':' + value;
}


function setDomain(domain) {
  redis.set(domainKey(domain.host), JSON.stringify(domain));
}

function getDomain(host) {
  return redis.get(domainKey(host))
    .then(domainStr => domainStr ? JSON.parse(domainStr) : null);
}

function indexFields(domain) {
  const pipeline = redis.pipeline();
  INDEXED_FIELDS.forEach((field) => {
    if (domain[field]) {
      pipeline.set(indexKey(field, domain[field]), domain.host);
    }
  });
  pipeline.exec();
}

// Public methods
function findById(host) {
  return getDomain(host);
}

function update(domain) {
  setDomain(domain);
  indexFields(domain);

  return Promise.resolve(domain);
}

function create(domain) {
  return findById(domain.host).then((existingDomain) => {
    if (existingDomain) {
      const error = new Error('already exists');
      error.cause = 'conflict';
      return Promise.reject(error); // TODO this could be better
    }

    return update(domain);
  });
}

export default {
  create,
  update,
  findById,
  setRedis
};
