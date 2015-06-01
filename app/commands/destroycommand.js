var Command = require("../command");
var _ = require("lodash");
var Game = require("../game");

var DestroyCommand = function() {
	Command.call(this);
    this.game = Game.instance;
}

DestroyCommand.prototype = Object.create(Command.prototype);
DestroyCommand.prototype.constructor = DestroyCommand;

DestroyCommand.prototype.execute = function() {
    var param = this.params == null ? null : this.params[0];

    if (param == "all") {
        var entities = _.filter(this.game.getEntities(), function(entity) {
            return entity.destroyable;
        });
        entities.forEach(
            function(e) {
                this.game.removeEntity(e);
            }.bind(this)
        );

        return;
    }

    var entity = this.game.getEntity(param);
    this.game.removeEntity(entity);
};


module.exports = DestroyCommand;