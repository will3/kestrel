var Game = require('./game.js');
var Console = require('./console');
var $ = require('jquery');

var container = $('#container');

Game.initialize(container);
Console.setInput(document.getElementById('console_text'));

Console.setCommandMapping({
		"add": 		require('./commands/addcommand'),
		"attack": 	require('./commands/attackcommand'),
		"list": 	require('./commands/listcommand'),
		"remove": 	require('./commands/destroycommand'),
		"move": 	require('./commands/movecommand'),
		"orbit": 	require('./commands/orbitcommand'),
		"select": 	require('./commands/selectcommand'),
		"align": 	require('./commands/aligncommand'),
		"stop": 	require('./commands/stopcommand'),
	});

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
		"add ship 50 0 0"
	]
);

var BlockShipBluePrint = require("./blueprints/blockshipblueprint");
var Ship = require("./entities/ship");
var ship = new Ship(new BlockShipBluePrint());
Game.addEntity(ship);
Game.nameEntity("ship", ship);

var stats = new Stats();
stats.setMode(0);

stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

document.body.appendChild(stats.domElement);

Game.setStats(stats);