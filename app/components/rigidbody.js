var Component = require("../component");
var THREE = require("THREE");

var RigidBody = function(){
	var velocity = new THREE.Vector3();
	var acceleration = new THREE.Vector3();
	var friction = 0.98;
	var defaultFriction = 0.98;
	var collisionRadius = null;

	var rigidBody = {
		getCollisionRadius: function(){ return collisionRadius; },
		setCollisionRadius: function(value){ collisionRadius = value; },
		getVelocity: function(){ return velocity; },
		setVelocity: function(value){ velocity = value; },
		getAcceleration: function(){ return acceleration; },
		setAcceleration: function(value){ acceleration = value; },
		setDefaultFriction: function(value){ 
			defaultFriction = value;
			friction = value;
		},
		getDefaultFriction: function(){ return defaultFriction; },
		getFriction: function(){ return friction; },

		start: function(){
			friction = defaultFriction;
		},

		update: function(){
			this.updatePosition();
		},

		updatePosition: function(){
			velocity.add(acceleration);
			velocity.multiplyScalar(friction);
			this.getTransform().getPosition().add(velocity);

			acceleration.set(0, 0, 0);
			friction = defaultFriction;
		},

		applyForce: function(force){
			acceleration.add(force);
		},

		applyFriction: function(frictionToApply){
			friction *= frictionToApply;
		}
	};

	rigidBody.__proto__ = Component();

	return rigidBody;
}

module.exports = RigidBody;