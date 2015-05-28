var $ = require('jquery');
var injector = require("./injection/injection").defaultInjector;
var AppModule = require('./appmodule');
var appModule = new AppModule();

injector.loadModule(appModule);

var container = $('#container');
var input = document.getElementById('console_text');
var game = injector.get("game");
game.initialize(container);

var console = injector.get("console");
console.hookInput(input);

// console.runScenario(
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

console.runScenario(
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

game.stats = stats;