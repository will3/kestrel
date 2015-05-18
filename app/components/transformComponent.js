var Component = require("../component");
var THREE = require("THREE");

var TransformComponent = function(){
	var position = new THREE.Vector3();
	var rotation = new THREE.Vector3();	//yaw pitch row
	var scale = new THREE.Vector3(1, 1, 1);

	var transformComponent = {
		getPosition: function(){ return position; },
		setPosition: function(value){ position = value; },
		getRotation: function(){ return	rotation; },
		setRotation: function(value){ rotation = value; },
		getScale: function(){ return scale; },
		setScale: function(value){ scale = value},
	};

	transformComponent.__proto__ = Component();

	return transformComponent;
}

module.exports = TransformComponent;