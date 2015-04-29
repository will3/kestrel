var ListCommand = Command.extend({

}).methods({
	getOp: function(){
		return "list";
	},

	execute: function(){
		var entities = Game.getNamedEntities();
		if(entities.length == 0){
			return "nothing found";
		}

		var names = [];
		entities.forEach(function(entity){ names.push(entity.name); });
		
		return names.join();
	}
})