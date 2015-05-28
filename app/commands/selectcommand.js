var Command = require("../command");
var Console = require("../console");

var SelectCommand = function() {
    Command.call(this);

    this.game = null;
    this.console = null;
};

SelectCommand.prototype = Object.create(Command.prototype);
SelectCommand.prototype.constructor = SelectCommand;

SelectCommand.prototype.execute = function() {
    var entity = this.game.getEntity(this.params[0]);
    this.console.selectedEntity = entity;
};

module.exports = SelectCommand;