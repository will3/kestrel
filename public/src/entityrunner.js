var EntityRunner = klass(function(){
	this.entities = [];
}).methods({
	addEntity: function(entity){
		this.entities.push(entity);
	},

	removeEntity: function(entity){
		var that = this;
		entity.childEntities.forEach(function(childEntity){
			that.removeEntity(childEntity);
		});

		this.entities.remove(entity);
		entity.components.forEach(function(c){ c.destroy(); });
		entity.destroy();
	},

	run: function(){
		var that = this;
		this.entities.forEach(function(entity){
			that.runEntity(entity);
		});
	},

	runEntity: function(entity){
		if(!entity.started){
			entity.start();
			entity.started = true;
		}
		entity.update();
		entity.components.forEach(function(component){
			if(!component.started){
				component.start();
				component.started = true;
			}
			component.update();
		});

		var that = this;
		entity.childEntities.forEach(function(childEntity){
			that.runEntity(childEntity);
		});
	},
});