var TransformComponent = Component.extend(function(){
	this.position = new THREE.Vector3();
	this.rotation = new THREE.Vector3();	//yaw pitch row
}).methods({
	getName: function(){
		return "TransformComponent";
	}
});