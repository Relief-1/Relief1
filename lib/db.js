var cradle = require('cradle');
var settings = require('./settings');

var connection = new cradle.Connection(settings.db.couch.host, 
    settings.db.couch.port, settings.db.couch.options);

var db = connection.database(settings.db.couch.database);
db.exists(function (err, exists) {
  exists || db.create();
});

exports.connection = connection;
exports.db = db;

