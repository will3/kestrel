var Command = require("../command");
var $ = require("jquery");

var DestroyCommand = function(){
	var destroyCommand = {
		execute:function(){
			var params = this.getParams();
			var param = params == null ? null : params[0];
			
			if(param == "all"){
				var entities = $.grep(Game.getEntities(), function(e){ return e.destroyable; })
				entities.forEach(function(e){ Game.removeEntity(e); });

				return;
			}

			var entity = Game.getEntity(param);
			Game.removeEntity(entity);
		}
	};

	destroyCommand.__proto__ = Command();

	return destroyCommand;
}

module.exports = DestroyCommand;
