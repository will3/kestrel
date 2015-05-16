var Component = require("../component");
var THREE = require("THREE");

var RigidBody = Component.extend(function(){
	this.velocity = new THREE.Vector3();
	this.acceleration = new THREE.Vector3();
	this.friction = 0.98;
	this.defaultFriction = 0.98;
}).methods({
	update: function(){
		this.updatePosition();
	},

	updatePosition: function(){
		this.velocity.add(this.acceleration);
		this.velocity.multiplyScalar(this.friction);
		this.getTransform().position.add(this.velocity);

		this.acceleration.set(0, 0, 0);
		this.friction = this.defaultFriction;
	},

	applyForce: function(force){
		this.acceleration.add(force);
	},

	applyFriction: function(friction){
		this.friction *= friction;
	}
});

module.exports = RigidBody;