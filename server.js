var express = require('express');
var assert = require('assert');
var app = express();
var port = process.env.PORT || 2999;

require('./config/routes')(app);
require('./config/express')(app);

app.listen(port);

console.log('app started on port' + port);
