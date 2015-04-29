var RenderComponent = Component.extend(function(){
	this.innerObject = null;
}).methods({
	getName: function(){
		return "RenderComponent";
	},

	start: function(){
		var geometry = this.initGeometry();
		var material = this.initMaterial();
		this.innerObject = this.initObject(geometry, material);
		Game.getScene().add(this.innerObject);
	},

	update: function(){
		var position = this.getTransform().position;
		this.innerObject.position.set(position.x, position.y, position.z);

		var rotation = this.getTransform().rotation;
		this.innerObject.rotation.setFromRotationMatrix(MathUtils.getRotationMatrix(rotation.x, rotation.y, rotation.z));

		// this.innerObject.updateMatrix();
	},

	destroy: function(){
		Game.getScene().remove(this.innerObject);
	},

	initGeometry: function(){ throw "must override"; },

	initMaterial: function(){ throw "must override"; },

	initObject: function(geometry, material){
		return new THREE.Mesh(
			geometry,
			material.getInnerMaterial()
			);
	}
});