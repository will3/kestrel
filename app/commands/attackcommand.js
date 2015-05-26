var Command = require("../command");
var THREE = require("THREE");
var Game = require("../game");
var assert = require("assert");

var AttackCommand = function() {
	Command.call(this);

    this.target = null;
    this.game = null;
}

AttackCommand.prototype = Object.create(Command.prototype);
AttackCommand.prototype.constructor = AttackCommand;

AttackCommand.prototype.execute = function() {
    assert(this.game != null, "game cannot be empty");
	assert(this.actor != null, "actor cannot be empty");

    var targetName = this.params[0];
    this.target = this.game.getEntity(targetName);

    this.actor.weaponController.setTarget(this.target);
};

module.exports = AttackCommand;