// var home = require('../app/controllers/home');
var home = require('../app/controllers/home');
var test = require('../test/controllers/test');
var extend = require('util')._extend;
var path = require('path');

module.exports = function(app){
	var env = process.env.NODE_ENV.trim() || 'development';

	app.get('/', home.index);
	
	if(env == 'development'){
		app.get('/test', test.index);
	}
}
