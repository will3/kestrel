var Command = require("../command");
var _ = require("lodash");
var Game = require("../game");

var ListCommand = function(){
	var listCommand = {
		execute: function(){
			var entities = _.filter(Game.getEntities(), function(entity){
				return entity.name != null;
			});

			var names = [];
			entities.forEach(function(entity){ names.push(entity.name); });
				
			return names.join();
		}
	};

	listCommand.__proto__ = Command();

	return listCommand;
}

module.exports = ListCommand;