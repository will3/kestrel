var RigidBody = Component.extend(function(){
	this.velocity = new THREE.Vector3();
	this.acceleration = new THREE.Vector3();
	this.friction = 0.98;
}).methods({
	update: function(){
		this.updatePosition();
	},

	updatePosition: function(){
		this.velocity.add(this.acceleration);
		this.velocity.multiplyScalar(this.friction);
		this.getTransform().position.add(this.velocity);
		this.acceleration.set(0, 0, 0);
	},
});