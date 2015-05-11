var DestroyCommand = Command.extend({

}).methods({
	execute:function(){
		var param = this.params[0];
		
		if(param == "all"){
			var entities = $.grep(Game.getEntities(), function(e){ return e.destroyable; })
			entities.forEach(function(e){ Game.removeEntity(e); });

			return;
		}

		var entity = Game.getEntity(param);
		Game.removeEntity(entity);
	}
});