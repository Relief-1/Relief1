var crypto = require('crypto');
var settings = require('./settings');
var db = require('./db.js').db;

exports.WRONG_PASSWORD = 1;
exports.NO_SUCH_USER = 2;

function login(email, password, callback) {
  db.get('user-' + encodeURIComponent(email), function (err, doc) {
    if (!err) {
      var hash = crypto.createHash(settings.loginManager.hash);
      hash.update(doc.salt + password);
      if (hash.digest('hex') == doc.hash)
        callback(null, doc);
      else
        callback(exports.WRONG_PASSWORD, null);
    }
    else 
      callback(exports.NO_SUCH_USER);
  });
}
exports.login = login;

