var Command = require("../command");
var Console = require("../console");
var Game = require("../game");

var SelectCommand = function() {
    Command.call(this);

    this.console = Console.getInstance();
};

SelectCommand.prototype = Object.create(Command.prototype);
SelectCommand.prototype.constructor = SelectCommand;

SelectCommand.prototype.start = function() {
    var entity = this.game.getEntity(this.params[0]);
    this.console.selectedEntity = entity;
};

module.exports = SelectCommand;