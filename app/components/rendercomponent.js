var Component = require("../component");
var THREE = require("THREE");
var MathUtils = require("../mathutils");
var Game = require("../game");

var RenderComponent = function(){
	var innerObject = null;
	var game = null;

	var updateTransform = function(entity, transform){
		var position = entity.getWorldPosition();
		innerObject.position.set(position.x, position.y, position.z);

		var rotation = transform.rotation;
		innerObject.rotation.setFromRotationMatrix(MathUtils.getRotationMatrix(rotation.x, rotation.y, rotation.z));

		var scale = transform.scale;
		var actualScale = innerObject.scale;
		if(!scale.equals(actualScale)){
			innerObject.scale.set(scale.x, scale.y, scale.z);
		}
	};

	var renderComponent = {
		setGame: function(value){ game = value; },
		getGame: function() { if(game == null){ game = Game; } return game; },
		getInnerObject: function(){ return innerObject; },
		setInnerObject: function(value){ innerObject = value; },

		start: function(){
			var geometry = this.initGeometry();
			var material = this.initMaterial();
			innerObject = this.initObject(geometry, material);
			this.getGame().getScene().add(innerObject);
			this.updateTransform(this.getEntity(), this.getTransform());
		},

		update: function(){
			this.updateTransform(this.getEntity(), this.getTransform());
		},

		updateTransform: updateTransform,

		destroy: function(){
			this.getGame().getScene().remove(this.innerObject);
		},

		initGeometry: function(){ throw "must override"; },

		initMaterial: function(){ throw "must override"; },

		initObject: function(geometry, material){
			return new THREE.Mesh(
				geometry,
				material.getInnerMaterial()
				);
		}
	};

	renderComponent.__proto__ = Component();

	return renderComponent;
}

module.exports = RenderComponent;