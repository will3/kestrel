var _ = require("lodash");

var EntityRunner = function(){
	var entities = [];

	var runEntity = function(entity){
		if(entity.getLife() != -1){
			if(entity.getFrameAge() == entity.getLife()){
				entity.removeFromParent();
			}
		}

		if(!entity.getStarted()){
			entity.start();
			entity.setStarted(true);
		}
		entity.update();

		entity.getComponents().forEach(function(component){
			if(!component.getStarted()){
				component.start();
				component.setStarted(true);
			}
			component.update();
		});

		entity.getChildEntities().forEach(function(childEntity){
			runEntity(childEntity);
		});

		//increment frame age
		entity.setFrameAge(entity.getFrameAge() + 1);
	}

	return {
		getEntities: function(){
			return entities;
		},

		addEntity: function(entity){
			entities.push(entity);
		},

		removeEntity: function(entity){
			entity.getChildEntities().forEach(function(childEntity){
				this.removeEntity(childEntity);
			}.bind(this));

			_.remove(entities, entity);
			entity.getComponents().forEach(function(c){ c.destroy(); });
			entity.destroy();
		},

		run: function(){
			entities.forEach(function(entity){
				runEntity(entity);
			});
		},

		getEntityCount: function(){
			return entities.length;
		}
	}
}

module.exports = EntityRunner;