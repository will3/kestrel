var path = require('path');
var extend = require('util')._extend;

var development = require('./env/development');

var defaults = {
	root: path.normalize(__dirname + '/..')
}

var nodeEnv = process.env.NODE_ENV == null ? null : process.env.NODE_ENV.trim();

module.exports = {
	development: extend(development, defaults),
}[nodeEnv || 'development'];