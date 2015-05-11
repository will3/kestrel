var Entity = klass(function(){
	this.name = null; //optional name
	this.innerObject = null;
	this.transform = null;
	this.components = [];
	this.childEntities = [];

	this.destroyable = true;
	this.frameAge = 0;
	this.parentEntity = null;
}).methods({
	getTransform: function(){
		if(this.transform == null){
			this.transform = new TransformComponent();
		}

		return this.transform;
	},

	addEntity: function(entity){
		if(entity.parentEntity != null){
			throw "entity " + this.name + " already has a parent entity named: " + entity.parentEntity.name;
		}

		entity.parentEntity = this;
		entity.start();
		this.childEntities.push(entity);
	},

	removeEntity: function(entity){
		entity.destroy();
		this.childEntities.remove(entity);
	},

	addComponent: function(component){
		component.entity = this;
		component.start();
		this.components.push(component);
	},

	removeComponent: function(component){
		component.destroy();
		this.components.remove(component);
	},

	getComponent: function(name){
		var components = $.grep(this.components, function(e){ return e.getName() == name });
		if(components == null || components.length == 0){
			throw "cannot find entity with name: " + name;
		}

		if(components.length > 1){
			throw "more than one component of name: " + name + " found";
		}

		return components[0];
	},

	start: function(){

	},

	update: function(){
		
	},

	destroy: function(){
		this.components.forEach(function(component){
			component.destroy();
		});

		this.childEntities.forEach(function(childEntity){
			childEntity.destroy();
		});
	},

	removeFromParent: function(){
		if(this.parentEntity != null){
			this.parentEntity.removeEntity(this);
		}else{
			Game.removeEntity(this);
		}
	},

	setPosition: function(position){
		this.getTransform().position.copy(position);
	},

	getPosition: function(position){
		return this.getTransform().position;
	},
});
