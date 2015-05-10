var ListCommand = Command.extend({
}).methods({
	getOp: function(){
		return "list";
	},

	execute: function(){
		var entities = _.filter(Game.getEntities(), function(entity){
			return entity.name != null;
		});

		var names = [];
		entities.forEach(function(entity){ names.push(entity.name); });
			
		return names.join();
	}
})