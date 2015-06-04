var Command = require("../command");
var _ = require("lodash");
var Game = require("../game");

var DestroyCommand = function() {
	Command.call(this);

    this.target = null;
}

DestroyCommand.prototype = Object.create(Command.prototype);
DestroyCommand.prototype.constructor = DestroyCommand;

DestroyCommand.prototype.start = function() {
    this.game.removeEntity(this.target);
};

DestroyCommand.prototype.setParams = function(params){
    var param = params[0];
    this.target = this.game.getEntityNamed(param);
};

module.exports = DestroyCommand;