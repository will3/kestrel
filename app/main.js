var $ = require('jquery');
var AddCommand = require("./commands/addcommand");
var AttackCommand = require("./commands/attackcommand");
var ListCommand = require("./commands/listcommand");
var DestroyCommand = require("./commands/destroycommand");
var MoveCommand = require("./commands/movecommand");
var OrbitCommand = require("./commands/orbitcommand");
var SelectCommand = require("./commands/selectcommand");
var AlignCommand = require("./commands/aligncommand");
var Game = require("./game");
var Ship = require("./entities/ship");
var Console = require("./console");

var container = $('#container');
var input = $('#console_text');
var game = Game.getInstance();
var console = Console.getInstance();
var Mousetrap = require("Mousetrap");

game.initialize(container);

var commandMapping = {
    add: function() {
        return new AddCommand({
            ship: function() {
                return new Ship();
            }
        });
    },
    attack: function() {
        return new AttackCommand();
    },
    list: function() {
        return new ListCommand();
    },
    remove: function() {
        return new DestroyCommand();
    },
    move: function() {
        return new MoveCommand();
    },
    orbit: function() {
        return new OrbitCommand();
    },
    select: function() {
        return new SelectCommand();
    },
    align: function() {
        return new AlignCommand();
    }
};

console.commandMapping = commandMapping;

console.hookInput(input);

console.runScenario(
    [
        "add ship",
        "add ship 150 0 150",
        "select ship1",
        "orbit ship0 200",
        "attack ship0",

        // "add ship -150 0 150",
        // "select ship2",
        // "orbit ship0 200",
        // "attack ship0",

        // "add ship -150 0 -150",
        // "select ship3",
        // "orbit ship0 200",
        // "attack ship0",
        // "select ship0",
        // "orbit ship1 100",
        // "attack ship1",
    ]
);

var stats = new Stats();
stats.setMode(0);

stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

document.body.appendChild(stats.domElement);

game.stats = stats;

Mousetrap.bind('`', function() {
    console.focus();
}.bind(this), 'keyup');