var util = require('util'),
    http = require('http'),
    static = require('node-static'),
    dnode = require('dnode'),
    Hook = require('hook.io').Hook,
    settings = require('./settings');

var Server = exports.Server = function (options) {
  this.options = options;
  this.options.port = this.options.port || settings.server.port || 8080;
};
util.inherits(Server, Hook);

Server.prototype.start = function () {
  var self = this;

  self.file = new (static.Server)(__dirname + '/../public/');

  var server = http.createServer(function (req, res) {
    // all our files are static
    req.on('end', function () {
      self.file.serve(req, res);
    });
  });

  // have dnode listen on our http server
  dnode(function (client) {
    self.client = client;
    this.message = function (event, data) {
      console.log('Wow, an event came!', event, data);
      self.emit(event, data);
    };
  }).listen(server);
  server.listen(self.options.port);
};

