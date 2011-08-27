var Settings = require('settings');

var file = __dirname + '/../config/environment.js';
module.exports = new Settings(file).getEnvironment('development');

