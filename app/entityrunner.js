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

	var onAddEntity = function(entity){
		entity.start();
	}

	var onRemoveEntity = function(entity){
		entity.destroy();
	}

	var onAddComponent = function(component){
		component.start();
	}

	var onRemoveComponent = function(component){
		component.destroy();
	}

	return {
		onAddEntity: onAddEntity,
		onRemoveEntity: onRemoveEntity,
		onAddComponent: onAddComponent,
		onRemoveComponent: onRemoveComponent,

		getEntities: function(){
			return entities;
		},

		addEntity: function(entity){
			entity.onAddEntity(this.onAddEntity);
			entity.onRemoveEntity(this.onRemoveEntity);
			entity.onAddComponent(this.onAddComponent);
			entity.onRemoveComponent(this.onRemoveComponent);
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