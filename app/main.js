var $ = require('jquery');
var Game = require("./game");
var Console = require("./console");
var KeyMap = require("./keymap");
var MouseTrap = require("Mousetrap");
var _ = require("lodash");
var CommandMapping = require("./commandmapping");
var AddCommand = require("./commands/addcommand");

window["THREE"] = require("THREE");
require("../three-master/examples/js/shaders/ConvolutionShader.js");
require("../three-master/examples/js/shaders/CopyShader.js");
require("../three-master/examples/js/shaders/FXAAShader.js");
require("../three-master/examples/js/shaders/HorizontalBlurShader.js");
require("../three-master/examples/js/shaders/VerticalBlurShader.js");
require("../three-master/examples/js/shaders/AdditiveBlendShader.js");
require("../three-master/examples/js/postprocessing/EffectComposer.js");
require("../three-master/examples/js/postprocessing/MaskPass.js");
require("../three-master/examples/js/postprocessing/RenderPass.js");
require("../three-master/examples/js/postprocessing/ShaderPass.js");
require("../three-master/examples/js/postprocessing/BloomPass.js");

var container = $('#container');
// <input type="text" id="console_text">
// var input = $('#console_text');
var game = Game.getInstance();
game.window = window;

var console = Console.getInstance();

game.seedRandom("kestrel");

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

console.commandMapping = CommandMapping;

// console.hookInput(input);

console.runScenario(
    [
        "add playership",
        // "add ship 150 0 150",
        // "select ship0",
        // "orbit playership0 300"
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