// var home = require('../app/controllers/home');
var home = require('../app/controllers/home');
var extend = require('util')._extend;
var path = require('path');

module.exports = function(app){
	app.get('/', home.index);
}
