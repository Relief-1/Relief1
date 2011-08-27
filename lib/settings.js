var Settings = require('settings');

var file = __dirname + '/../config/environment.js';

function reload(env) {
  module.exports = new Settings(file).getEnvironment(env);
  module.exports.__reload = reload;
}

reload('development');

