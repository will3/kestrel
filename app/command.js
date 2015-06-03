var Game = require("./game");
var Component = require("./component");

var Command = function() {
    Component.call(this);

    this.actor = null;
    this.params = null;
    this.game = Game.getInstance();
}

Command.prototype = Object.create(Component.prototype);
Command.prototype.constructor = Command;

module.exports = Command;