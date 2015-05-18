var _ = require("lodash");

var EntityRunner = function(){
	var entities = [];

	return {
		getEntities: function(){
			return entities;
		},

		addEntity: function(entity){
			entities.push(entity);
		},

		removeEntity: function(entity){
			var that = this;
			entity.getChildEntities().forEach(function(childEntity){
				that.removeEntity(childEntity);
			});

			_.remove(entities, entity);
			entity.getComponents().forEach(function(c){ c.destroy(); });
			entity.destroy();
		},

		run: function(){
			var that = this;
			entities.forEach(function(entity){
				that.runEntity(entity);
			});
		},

		runEntity: function(entity){
			//increment frame age
			entity.setFrameAge(entity.getFrameAge() + 1);

			entity.update();

			entity.getComponents().forEach(function(component){
				component.update();
			});

			var that = this;
			entity.getChildEntities().forEach(function(childEntity){
				that.runEntity(childEntity);
			});
		}
	}
}

module.exports = EntityRunner;