var Command = require("../command");
var THREE = require("THREE");
var Game = require("../game");

var AttackCommand = function() {
	Command.call(this);

    this.target = null;
}

AttackCommand.prototype = Object.create(Command.prototype);
AttackCommand.prototype.constructor = AttackCommand;

AttackCommand.prototype.start = function() {
    var targetName = this.params[0];
    this.target = this.game.getEntity(targetName);

    this.actor.weaponController.setTarget(this.target);
};

module.exports = AttackCommand;