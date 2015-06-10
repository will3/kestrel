var THREE = require("THREE");
var RigidBody = require("../components/rigidbody");
var Ammo = require("./ammo");
var PointSprite = require("./pointsprite");
var MathUtils = require("../mathutils");

var Missile = function(){
	var rigidBody = null;
	var launchSpeed = 0.8;
	var launchForce = 0.0;
	var force = 0.2;
	var direction = null;
	var fuse = 50;
	var launchFriction = 0.97;
	var friction = 0.95;
	var launchNoiseAmount = 0.02;
	var noiseAmount = 0.1;

	var missile = {
		createInstance: function(){
			return new Missile();
		},

		getRigidBody: function(){ 
			if(rigidBody == null){
				rigidBody = new RigidBody();
				rigidBody.setDefaultFriction(launchFriction);
				// rigidBody.setCollisionRadius(1);
			}

			return rigidBody;
		},
		setRigidBody: function(value){ rigidBody = value; },

		start: function(){
			direction = new THREE.Vector3(
				Math.random() - 0.5, 
				Math.random() - 0.5, 
				Math.random() - 0.5
				);
			direction.setLength(1);

			this.addComponent(this.getRigidBody());
			var velocity = new THREE.Vector3().copy(direction).setLength(launchSpeed);
			this.getRigidBody().setVelocity(velocity);

			var sprite = new PointSprite();
			sprite.setSize(2);
			this.addEntity(sprite);
		},

		update: function(){
			var isLaunching = this.getFrameAge() < fuse;
			var forceToApply = isLaunching ? launchForce : force;
			var frictionToApply = isLaunching ? launchFriction : friction;
			var noiseToApply = isLaunching ? launchNoiseAmount : noiseAmount;

			if(!isLaunching){
				var position = this.worldPosition;
				var targetPosition = this.getTarget().worldPosition;
				direction = new THREE.Vector3().subVectors(targetPosition, position);
			}

			this.getRigidBody().setDefaultFriction(frictionToApply);
			var forceVector = new THREE.Vector3().copy(direction).setLength(forceToApply);
			var noise = MathUtils.randomVector(noiseToApply);
			forceVector.add(noise);
			this.getRigidBody().applyForce(
				forceVector
				);
		},

		onCollision: function(entity){
			if(entity == this.getActor()){
				return;
			}
		}
	}

	missile.__proto__ = Ammo();
	
	return missile;
}

module.exports = Missile;