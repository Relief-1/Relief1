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
  // listen for user logins from anywhere that needs them
  self.on('*::userLogin', function (data) {
    self.userLogin(data.email, data.password, function (err, doc) {
      if (err) {
        return console.error(err.stack);
      }
      self.emit('loginSuccess', doc);
    });
  });
}

Login.prototype.userLogin = function (email, password, callback) {
  db.get('user-' + encodeURIComponent(email), function (err, doc) {
    if (err) {
      return callback(err);
    }
    // Settings should be replaced with nconf, which is built into hook.io.
    // this would be something like self.config.get('login:hash')
    var hash = crypto.createHash(settings.loginManager.hash);
    hash.update(doc.salt + password);
    if (hash.digest('hex') === doc.hash) {
      return callback(null, doc);
    }
    callback(new Error('Invalid login.'));
  });
}







