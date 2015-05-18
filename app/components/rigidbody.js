var Component = require("../component");
var THREE = require("THREE");

var RigidBody = function(){
	var velocity = new THREE.Vector3();
	var acceleration = new THREE.Vector3();
	var friction = 0.98;
	var defaultFriction = 0.98;

	var rigidBody = {
		setVelocity: function(value){ velocity = value; },
		getVelocity: function(){ return velocity; },
		setAcceleration: function(value){ acceleration = value; },
		getAcceleration: function(){ return acceleration; },
		setDefaultFriction: function(value){ 
			friction = value;
			defaultFriction = value; 
		},
		getDefaultFriction: function(){ return defaultFriction; },
		getFriction: function(){ return friction; },

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