var crypto = require('crypto'),
    util = require('util'),
    Hook = require('hook.io').Hook,
    settings = require('./settings'),
    db = require('./db.js').db;


var Login = exports.Login = function (options) {
  Hook.call(this, options);
  var self = this;
  self.on('hook::ready', function () {
    self._listeners();
  });
}
util.inherits(Login, Hook);

Login.USER_EXISTS = 1;
Login.INVALID_EMAIL = 2;

Login.prototype._listeners = function () {
  var self = this;
  // listen for user logins from anywhere that needs them
  self.on('*::userLogin', function (data) {
    self.userLogin(data.email, data.password, function (err, doc) {
      if (err) {
        return self.emit('loginFail', err);
      }
      self.emit('loginSuccess', doc);
    });
  });
  self.on('*::userRegister', function (data) {
    self.userRegister(data.email, data.password, function (err, res) {
      if (err) {
        return self.emit('registrationFail', err);
      }
      self.emit('registrationSuccess', res);
    });
  });
}

Login.prototype.emailValidate = function(email) {
  return /\b[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\b/.test(email);
}

Login.prototype.userLogin = function (email, password, callback) {
  var self = this;
  db.get('user-' + encodeURIComponent(email), function (err, doc) {
    if (err) {
      self.emit('error::login', err);
      return callback(err);
    }
    if (hash(doc.salt, password) === doc.hash) {
      return callback(null, doc);
    }
    callback(new Error('Invalid login.'));
  });
}

Login.prototype.saltGenerate = function () {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
  var salt = '';
  for (var i = 0; i < settings.loginManager.saltLength; i++) {
    salt += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return salt;
}

Login.prototype.userRegister = function (email, password, callback) {
  var self = this;

  email = email.toLowerCase();
  if (!this.emailValidate(email)) {
    return callback({reason: 'invalid e-mail', code: Login.INVALID_EMAIL});
  }

  var salt = self.saltGenerate();

  var user = {
    salt: salt,
    hash: hash(salt, password)
  };
  db.put('user-' + encodeURIComponent(email), user, function (err, res) {
    if (err) {
      if (err.error == 'conflict') {
        return callback({reason: 'user exists', code: Login.USER_EXISTS});
      }
      self.emit('error::register', err);
      return callback(err);
    }
    return callback(null, res);
  });
}

function hash(salt, password) {
  // Settings should be replaced with nconf, which is built into hook.io.
  // this would be something like self.config.get('login:hash')
  var hash = crypto.createHash(settings.loginManager.hash);
  hash.update(salt + password);
  return hash.digest('hex');
}

