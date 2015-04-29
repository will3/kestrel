var config = require('config');
var exphbs = require('express-handlebars');
var path = require('path');

module.exports = function(app){
	app.set('views', config.root + '/app/views');
	var hbConfig = {
		layoutsDir: path.join(app.settings.views, "layouts"),
		defaultLayout: 'main'
	}
	app.engine('handlebars', exphbs(hbConfig));
	app.set('view engine', 'handlebars');
}