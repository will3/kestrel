var Command = require("../command");
var _ = require("lodash");
var assert = require("assert");
var Game = require("../game");

var ListCommand = function() {
    Command.call(this);

    this.game = Game.instance;
}

ListCommand.prototype = Object.create(Command.prototype);
ListCommand.prototype.constructor = ListCommand;

ListCommand.prototype.execute = function() {
	assert(this.game != null, "game cannot be empty");

    var entities = _.filter(this.game.getEntities(), function(entity) {
        return entity.name != null;
    });

    var names = [];
    entities.forEach(function(entity) {
        names.push(entity.name);
    });

    if(names.length == 0){
        return "nothing found";
    }

    return names.join(", ");
};

module.exports = ListCommand;