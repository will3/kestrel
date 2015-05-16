var Component = require("../component");
var THREE = require("THREE");
var MathUtils = require("../mathutils");

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

		this.updateTransform();
	},

	update: function(){
		this.supr();
		this.updateTransform();
	},

	updateTransform: function(){
		var position = this.entity.getWorldPosition();
		this.innerObject.position.set(position.x, position.y, position.z);

		var rotation = this.getTransform().rotation;
		this.innerObject.rotation.setFromRotationMatrix(MathUtils.getRotationMatrix(rotation.x, rotation.y, rotation.z));

		var scale = this.getTransform().scale;
		var actualScale = this.innerObject.scale;
		if(!scale.equals(actualScale)){
			this.innerObject.scale.set(scale.x, scale.y, scale.z);
		}
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

module.exports = RenderComponent;