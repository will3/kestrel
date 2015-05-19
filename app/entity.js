var TransformComponent = require("./components/transformcomponent");
var THREE = require("THREE");
var _ = require("lodash");

var Entity = function(){
	var name = null; //optional name
	var innerObject = null;
	var transform = null;
	var components = [];
	var childEntities = [];

	var destroyable = true;
	var hasCollision = false;

	var frameAge = 0;
	var parentEntity = null;

	var game = null;

	var onAddEntity = null;
	var onRemoveEntity = null;
	var onAddComponent = null;
	var onRemoveComponent = null;

	return {
		getFrameAge: function(){ return frameAge; },
		setFrameAge: function(value){ frameAge = value; },
		getGame: function(){ if(game == null){ game = Game; } return game; },
		setGame: function(value){ game = value;},
		onAddEntity: function(value){ onAddEntity = value; },
		onRemoveEntity: function(value){ onRemoveEntity = value; },
		onAddComponent: function(value){ onAddComponent = value; },
		onRemoveComponent: function(value){ onRemoveComponent = value; },

		hasCollision: function(){
			if(this.getRigidBody == null){
				return false;
			}

			var rigidBody = this.getRigidBody();

			return rigidBody.getCollisionRadius() != null;
		},

		getTransform: function(){
			if(transform == null){
				transform = new TransformComponent();
			}

			return transform;
		},

		getParentEntity: function(){
			return parentEntity;
		},

		setParentEntity: function(value){
			if(parentEntity != null){
				throw "entity already has a parent entity";
			}

			parentEntity = value;
		},

		getChildEntities: function(){
			return childEntities;
		},

		getComponents: function(){
			return components;
		},

		addEntity: function(entity){
			entity.setParentEntity(this);
			childEntities.push(entity);
			if(onAddEntity != null){
				onAddEntity(entity);
			}
		},

		removeEntity: function(entity){
			entity.destroy();
			_.pull(childEntities, entity);
			if(onRemoveEntity != null){
				onRemoveEntity(entity);
			}
		},

		addComponent: function(component){
			component.setEntity(this);
			components.push(component);
			if(onAddComponent != null){
				onAddComponent(component);
			}
		},

		removeComponent: function(component){
			component.destroy();
			_.pull(components, component);
			if(onRemoveComponent != null){
				onRemoveComponent(component);
			}
		},

		start: function(){

		},

		update: function(){
			
		},

		destroy: function(){
			components.forEach(function(component){
				component.destroy();
			});

			childEntities.forEach(function(childEntity){
				childEntity.destroy();
			});
		},

		removeFromParent: function(){
			if(parentEntity != null){
				parentEntity.removeEntity(this);
			}else{
				this.getGame().removeEntity(this);
			}
		},

		getPosition: function(){
			return this.getTransform().getPosition();
		},

		setPosition: function(position){
			this.getTransform().setPosition(position);
		},

		getScale: function(){
			return this.getTransform().getScale();
		},

		setScale: function(scale){
			this.getTransform().setScale(scale);
		},

		getRotation: function(){
			return this.getTransform().getRotation();
		},
		
		setRotation: function(rotation){
			this.getTransform().setRotation(rotation);
		},

		getWorldPosition: function(){
			var entity = this;
			var position = new THREE.Vector3();
			
			do{
				position.add(entity.getPosition());
				entity = entity.getParentEntity();
			}while(entity != null);

			return position;
		},
	};
}

module.exports = Entity;