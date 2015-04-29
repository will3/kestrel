var Entity = klass(function(){
	this.name = null; //optional name
	this.innerObject = null;
	this.started = false;
	this.transform = null;
	this.components = [];

	this.destroyable = true;
}).methods({
	getTransform: function(){
		if(this.transform == null){
			this.transform = new TransformComponent();
		}

		return this.transform;
	},

	addComponent: function(component){
		this.components.push(component);
		component.entity = this;
	},

	removeComponent: function(component){
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
		
	}
});

// TestEntity.prototype = new Entity();
// TestEntity.prototype.constructor = TestEntity();
// function TestEntity(){ }

// TestEntity.prototype.initGeometry = function(){
// 	var cubeSize = 10;
// 	var geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
//  	return geometry;
// }

// TestEntity.prototype.initMaterial = function(){
// 	var material = new SolidColorMaterial(new THREE.Vector4(1.0, 0.0, 0.0, 1.0));
// 	return material;
// }