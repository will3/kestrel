var PointSprite = require("./pointsprite");
var THREE = require("THREE");
var RigidBody = require("../components/rigidbody");

var Block = PointSprite.extend(function(){
	this.size = 4;
	this.life = -1;
	this.sizeOverTimeFunc = null;
	this.velocity = new THREE.Vector3(0, 0, 0);
	this.velocityOverTimeFunc = null;

	//component
	this.rigidBody = null;
}).methods({
	start: function(){
		this.supr();
		
		//add rigid body
		this.rigidBody = new RigidBody();
		this.rigidBody.defaultFriction = 1;
		this.addComponent(this.rigidBody);

		//initialize size
		this.updateSize();

		//initialize velocity
		this.updateVelocity();
	},

	update: function(){
		this.supr();

		//update age
		if(this.frameAge > this.life && this.life != -1){
			this.removeFromParent();
		}

		//update size over time
		if(this.sizeOverTimeFunc != null){
			var size = this.sizeOverTimeFunc(this.frameAge);
			if(this.size != size){
				this.size = size;
				this.updateSize();
			}
		}

		if(this.velocityOverTimeFunc != null){
			var velocity = this.velocityOverTimeFunc(this.frameAge);
			this.velocity = velocity;
			this.updateVelocity();
		}
	},

	updateSize: function(){
		this.getTransform().scale.set(this.size, this.size, this.size);
	},

	updateVelocity: function(){
		this.rigidBody.velocity.copy(this.velocity);
	},

	sizeOverTime: function(func){
		this.sizeOverTimeFunc = func;
	},

	velocityOverTime: function(func){
		this.velocityOverTimeFunc = func;
	},
});

module.exports = Block;