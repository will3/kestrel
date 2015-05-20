var Command = require("../command");
var _ = require("lodash");
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
				var entities = _.filter(this.getGame().getEntities(), function(entity){
					return entity.destroyable;
				});
				entities.forEach(
					function(e){
						this.getGame().removeEntity(e); 
					}.bind(this)
				);

				return;
			}

			var entity = this.getGame().getEntity(param);
			this.getGame().removeEntity(entity);
		}
	};

	destroyCommand.__proto__ = Command();

	return destroyCommand;
}

module.exports = DestroyCommand;
