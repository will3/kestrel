var path = require('path');
var extend = require('util')._extend;

var development = require('./env/development');

var defaults = {
	root: path.normalize(__dirname + '/..')
}

module.exports = {
	development: extend(development, defaults),
}[process.env.NODE_ENV || 'development'];