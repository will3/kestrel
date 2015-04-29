var express = require('express');

var app = express();
var port = process.env.PORT || 3000;

require('./config/routes')(app);
require('./config/express')(app);

app.listen(port);

console.log('app started on port' + port);
