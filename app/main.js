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

Console.runScenario(
		[
			"add ship",
			"select ship0",
			"orbit 0 0 0",
		]
	);

// 		// "add ship",
// 		// "add ship 100 0 100",
// 		// "select ship1",
// 		// "orbit 0 0 0 100",
// 		// "select ship0",
// 		// "attack ship1",