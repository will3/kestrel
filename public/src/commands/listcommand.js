var ListCommand = Command.extend({
}).methods({
	getOp: function(){
		return "list";
	},

	execute: function(){
		var params = this.params;
		var entityName = params == null ? null : params[0];
		var propertyName = params == null ? null : params[1];

		var entity = entityName == null ? null : Game.getEntity(entityName);

		if(propertyName == null){
			var entities = null;

			if(entityName == null){
				entities = Game.getNamedEntities();
			}else{
				entities = entity.childEntities;
			}

			if(entities.length == 0){
				return "nothing found";
			}

			var names = [];
			entities.forEach(function(entity){ names.push(entity.name); });
			
			return names.join();
		}else{
			return entity[propertyName];
		}


	}
})