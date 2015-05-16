var config = require('./config');
var exphbs = require('express-handlebars');
var path = require('path');
var express = require('express');
var fs = require('fs');

module.exports = function(app){
	app.set('views', config.root + '/server/views');
	var hbConfig = {
		layoutsDir: path.join(app.settings.views, "layouts"),
		defaultLayout: 'main',
		partialsDir : path.join(config.root, '/server/views/partials'),
	}
	app.engine('handlebars', exphbs(hbConfig));
	app.set('view engine', 'handlebars');
	app.use('/public', express.static(path.join(config.root, 'public')));
}
