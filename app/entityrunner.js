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
			entity.childEntities.forEach(function(childEntity){
				that.removeEntity(childEntity);
			});

			_.remove(entities, entity);
			entity.components.forEach(function(c){ c.destroy(); });
			entity.destroy();
		},

		run: function(){
			var that = this;
			entities.forEach(function(entity){
				that.runEntity(entity);
			});
		},

		runEntity: function(entity){
			entity.update();
			entity.frameAge ++;
			entity.components.forEach(function(component){
				component.update();
			});

			var that = this;
			entity.childEntities.forEach(function(childEntity){
				that.runEntity(childEntity);
			});
		}
	}
}

module.exports = EntityRunner;