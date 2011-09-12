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

Login.prototype._listeners = function () {
  var self = this;
  // listen for user logins from anywhere that needs them.
  // Instead of emitting response events, use the remote callback reference that has passed in.
  self.on('*::userLogin', function (data, cb) {
    if (!data || !data.email || !data.password) {
      return cb(new Error('Both email and password are required.'));
    }
    self.userLogin(data.email, data.password, function (err, doc) {
      if (err) {
        return cb(err);
      }
      return cb(null, doc);
    });
  });
  self.on('*::userRegister', function (data, cb) {
    if (!data || !data.email || !data.password) {
      return cb(new Error('Both email and password are required.'));
    }
    self.userRegister(data.email, data.password, function (err, res) {
      if (err) {
        return cb(err);
      }
      return cb(null, res);
    });
  });
}

Login.prototype.emailValidate = function(email) {
  // How's this for a regex!
  return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(email);
}

Login.prototype.userLogin = function (email, password, callback) {
  var self = this;
  db.get('user-' + hashEmail(email), function (err, doc) {
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
    return callback(new Error('Not a valid email address.'));
  }

  var salt = self.saltGenerate();

  var user = {
    salt: salt,
    hash: hash(salt, password),
    email: email
  };
  db.put('user-' + hashEmail(email), user, function (err, res) {
    if (err) {
      if (err.error == 'conflict') {
        return callback(new Error('User already exists.'));
      }
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
exports.hash = hash;

function hashEmail(email) {
  return hash(settings.loginManager.saltEmail, email);
}
exports.hashEmail = hashEmail;

