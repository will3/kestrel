var Command = require("../command");
var THREE = require("THREE");
var Game = require("../game");

var AttackCommand = function() {
    Command.call(this);

    this.type = "attack";
    this.hasActor = true;
    this.target = null;
}

AttackCommand.prototype = Object.create(Command.prototype);
AttackCommand.prototype.constructor = AttackCommand;

AttackCommand.prototype.start = function() {

};

AttackCommand.prototype.update = function(){
	this.actor.weaponController.fireIfReady(this.target);
}

AttackCommand.prototype.setParams = function(params) {
    var targetName = params[0];
    this.target = this.game.getEntityNamed(targetName);
}

module.exports = AttackCommand;