var EntityRunner = klass(function(){
	this.entities = [];
}).methods({
	addEntity: function(entity){
		this.entities.push(entity);
	},

	removeEntity: function(entity){
		this.entities.remove(entity);

		entity.components.forEach(function(c){ c.destroy(); });
		entity.destroy();

	},

	run: function(){
		this.entities.forEach(function(entity){
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
		});
	}
});