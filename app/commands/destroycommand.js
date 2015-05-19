var Command = require("../command");
var $ = require("jquery");
var Game = require("../game");

var DestroyCommand = function(){
	var game = null;

	var destroyCommand = {
		setGame: function(value){ game = value; },
		getGame: function(){ if(game == null){ game = Game; } return game; },
		execute:function(){
			var params = this.getParams();
			var param = params == null ? null : params[0];
			
			if(param == "all"){
				var entities = $.grep(this.getGame().getEntities(), function(e){ return e.destroyable; })
				entities.forEach(function(e){this.getGame().removeEntity(e); }.bind(this));

				return;
			}

			var entity = Game.getEntity(param);
			this.getGame().removeEntity(entity);
		}
	};

	destroyCommand.__proto__ = Command();

	return destroyCommand;
}

module.exports = DestroyCommand;
