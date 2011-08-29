exports.common = {
  db: {
    couch: {
      host: '127.0.0.1',
      port: 5984,
      database: 'relief1',
      options: {
        cache: true
      }
    }
  },
  loginManager: {
    hash: 'sha512',
    saltLength: 16
  }
};

exports.production = {};
exports.development = {};

exports.test = {
  db: {
    couch: {
      options: {
        cache: false
      }
    }
  }
};

