var TransformComponent = require("./components/transformcomponent");
var THREE = require("THREE");
var _ = require("lodash");
var MathUtils = require("./mathutils");

var Entity = function(){
	this.name = null;
	this.transform = new TransformComponent();
	this.components = [];
	this.childEntities = [];
	this.frameAge = 0;
	this.parentEntity = null;
	this.started = false;
	this.life = null;
	this.destroyable = false;
};

Entity.prototype = {
	constructor: Entity,

	hasCollision: function(){
		if(this.rigidBody == null){
			return false;
		}

		return this.rigidBody.collisionRadius != null;
	},

	addEntity: function(entity){
		if(entity.parentEntity != null){
			throw "entity already has a parent entity";
		}

		entity.parentEntity = this;
		this.childEntities.push(entity);
	},

	removeEntity: function(entity){
		entity.destroy();
		_.pull(this.childEntities, entity);
	},

	addComponent: function(component){
		component.entity = this;
		this.components.push(component);
	},

	removeComponent: function(component){
		component.destroy();
		_.pull(this.components, component);
	},

	start: function(){
		//override to provide behaviour
	},

	update: function(){
		//override to provide behaviour
	},

	destroy: function(){
		this.components.forEach(function(component){
			component.destroy();
		});

		this.childEntities.forEach(function(childEntity){
			childEntity.destroy();
		});
	},

	get position(){
		return this.transform.position;
	},

	set position(value){
		this.transform.position = value; 
	},

	get scale(){
		return this.transform.scale;
	},

	set scale(scale){
		this.transform.scale = scale;
	},

	get rotation(){
		return this.transform.rotation;
	},
	
	set rotation(rotation){
		this.transform.rotation = rotation;
	},

	getWorldPosition: function(){
		var entity = this;
		var position = new THREE.Vector3(0, 0, 0);
		
		do{
			position.add(entity.position);
			entity = entity.parentEntity;
		}while(entity != null);

		return position;
	}
}

module.exports = Entity;