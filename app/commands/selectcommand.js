var Command = require("../command");
var Console = require("../console");
var Game = require("../game");

var SelectCommand = function() {
    Command.call(this);

    this.console = Console.getInstance();
    this.target = null;
};

SelectCommand.prototype = Object.create(Command.prototype);
SelectCommand.prototype.constructor = SelectCommand;

SelectCommand.prototype.start = function() {
    this.console.selectedEntity = this.target;
};

SelectCommand.prototype.setParams = function(params){
	var name = params[0]; this.target = this.game.getEntityNamed(name);
}

module.exports = SelectCommand;