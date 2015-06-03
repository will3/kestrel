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
var KeyMap = require("./keymap");
var MouseTrap = require("Mousetrap");
var _ = require("lodash");

var container = $('#container');
var input = $('#console_text');
var game = Game.getInstance();
var console = Console.getInstance();

game.control.registerKeyFunc = function(key) {
    MouseTrap.bind(KeyMap[key], function() {
        this.keydowns.push(key);
        this.keyholds.push(key);
    }.bind(this));

    MouseTrap.bind(KeyMap[key], function() {
        _.pull(this.keyholds, key);
        this.keyups.push(key);
    }.bind(this), 'keyup');
}

game.initialize(container);

var commandMapping = {
    add: function() {
        return new AddCommand({
            "ship": function() {
                return new Ship();
            },
            "playership": function() {
                var ship = new Ship({
                    force : 0.05,
                    yawForce : 0.25,
                    yawCurve : 0.01
                });
                ship.addPlayerControl();
                return ship;
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
        "add playership",
        "add ship 150 0 150",
        "select ship0",
        "orbit playership0 200",
        "attack playership0",

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