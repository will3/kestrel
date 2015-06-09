var Entity = require("../entity");

var ModelEntity = function(){
	Entity.call(this);
};

ModelEntity.prototype = Object.create(Entity.prototype);
ModelEntity.prototype.constructor = ModelEntity;

module.exports = ModelEntity;