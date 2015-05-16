var Command = require("../command");
var _ = require("lodash");
var Game = require("../game");

var ListCommand = Command.extend({
}).methods({
	execute: function(){
		var entities = _.filter(Game.getEntities(), function(entity){
			return entity.name != null;
		});

		var names = [];
		entities.forEach(function(entity){ names.push(entity.name); });
			
		return names.join();
	}
});

module.exports = ListCommand;