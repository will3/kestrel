var _ = require("lodash");

var EntityRunner = function(){
	var entities = [];

	var startEntity = function(entity){
		entity.start();
		entity.getComponents().forEach(function(component){
			component.start();
		})
		entity.getChildEntities().forEach(function(childEntity){
			startEntity(childEntity);
		})
	}

	var runEntity = function(entity){
		//increment frame age
		entity.setFrameAge(entity.getFrameAge() + 1);

		entity.update();

		entity.getComponents().forEach(function(component){
			component.update();
		});

		entity.getChildEntities().forEach(function(childEntity){
			runEntity(childEntity);
		});
	}

	return {
		getEntities: function(){
			return entities;
		},

		addEntity: function(entity){
			startEntity(entity);
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
		}
	}
}

module.exports = EntityRunner;