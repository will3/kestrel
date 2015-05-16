var Component = require("../component");
var THREE = require("THREE");

var TransformComponent = Component.extend(function(){
	this.position = new THREE.Vector3();
	this.rotation = new THREE.Vector3();	//yaw pitch row
	this.scale = new THREE.Vector3(1, 1, 1);
}).methods({
	getName: function(){
		return "TransformComponent";
	}
});

module.exports = TransformComponent;