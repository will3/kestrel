var Entity = require("../entity");
var THREE = require("THREE");
var Block = require("./block");
var RigidBody = require("../components/rigidbody");

var PartileSystem = function() {
	var rigidBody = null;
	var direction = null;
	var speed = 0;
	var velocity = null;

	var partileSystem = {
		setDirection: function(value) { direction = value; },
		getDirection: function() { return direction; },
		setSpeed: function(value) { speed = value; },
		getSpeed: function() { return speed; },
		getVelocity: function(){
			if(velocity != null){
				return velocity;
			}
			if(direction == null || speed == 0){
				return null;
			}
			velocity = new THREE.Vector3();
			velocity.copy(direction);
			velocity.setLength(speed);
			return velocity;
		},

		//default to nothing, override to add collision
		getCollisionRadius: function(){
			return null;
		},

		getRigidBody: function(){ 
			if(rigidBody == null){
				rigidBody = new RigidBody();
				rigidBody.setDefaultFriction(1);
				rigidBody.setCollisionRadius(this.getCollisionRadius());
			}
			return rigidBody;
		},

		start: function(){
			this.addComponent(this.getRigidBody());

			this.emit(0);
		},

		emit: function(time){
			throw "must override";
		},

		update: function(){
			this.emit(this.getFrameAge());
		},
	};

	partileSystem.__proto__ = Entity();

	return partileSystem;
}

module.exports = PartileSystem;