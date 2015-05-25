var Component = require("../component");
var THREE = require("THREE");
var MathUtils = require("../mathutils");
var Game = require("../game");
var _ = require("lodash");

var RenderComponent = function(){
	var innerObject = null;
	var game = null;

	var updateTransform = function(entity){
		var transform = entity.getTransform();

		if(innerObject == null){
			return;
		}

		var position = entity.getWorldPosition();
		innerObject.position.set(position.x, position.y, position.z);

		var rotation = transform.getRotation();
		innerObject.rotation.setFromRotationMatrix(MathUtils.getRotationMatrix(rotation.x, rotation.y, rotation.z));

		var scale = transform.getScale();
		var actualScale = innerObject.scale;
		if(!scale.equals(actualScale)){
			innerObject.scale.set(scale.x, scale.y, scale.z);
		}
	};

	var renderComponent = {
		setGame: function(value){ game = value; },
		getGame: function() { if(game == null){ game = Game; } return game; },
		start: function(){
			innerObject = this.initObject();
			this.getGame().getScene().add(innerObject);
			this.updateTransform(this.getEntity());
		},

		update: function(){
			this.updateTransform(this.getEntity());
		},

		updateTransform: updateTransform,

		destroy: function(){
			this.getGame().getScene().remove(innerObject);
		},

		initObject: function(){
			throw "must override";
		}
	};

	renderComponent.__proto__ = Component();

	return renderComponent;
}

module.exports = RenderComponent;