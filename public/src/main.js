var container = $('#container');

Game.initialize(container);

Console.setInput(document.getElementById('console_text'));

Console.run("add ship");

// Console.runScenario(
// 		[
// 		"add ship",
// 		"add ship 100 0 100",
// 		"select ship1",
// 		"orbit 0 0 0 100",
// 		"select ship0",
// 		"attack ship1",
// 		]
// 	);
