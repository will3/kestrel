var Game = require('./game.js');
var Console = require('./console');
var $ = require('jquery');
var injector = require('./injector');
var appmodule = require('./appmodule');

injector.loadDependencies({
	appmodule
});

var container = $('#container');

Game.initialize(container);

// Console.runScenario(
// 		[
// 			"add ship",
// 			"add ship 150 0 150",
// 			"select ship1",
// 			"orbit ship0 150",
// 			"attack ship0",
// 			// "select ship0",
// 			// "orbit ship1 100",
// 			// "attack ship1",
// 		]
// 	);

Console.runScenario(
	[
		"add ship 0 0 0"
	]
);

var stats = new Stats();
stats.setMode(0);

stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

document.body.appendChild(stats.domElement);

Game.setStats(stats);