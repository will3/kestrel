var PointSprite = require("./pointsprite");
var THREE = require("THREE");
var RigidBody = require("../components/rigidbody");

var Block = function(){
	var size = 4;
	var life = -1;
	var sizeOverTimeFunc = null;
	var velocity = new THREE.Vector3(0, 0, 0);
	var velocityOverTimeFunc = null;

	//component
	var transform = null;
	var rigidBody = null;

	var updateSize = function(){
		transform.getScale().set(size, size, size);
	}

	var updateVelocity = function(){
		rigidBody.getVelocity().copy(velocity);
	}

	var block = {
		setSize: function(value){ size = value; },
		getSize: function(){ return size; },
		setVelocity: function(value){ velocity = value; },
		getVelocity: function(){ return velocity; },
		setLife: function(value){ life = value },
		getLife: function(){ return	life; },
		
		getRigidBody: function(){
			if(rigidBody == null){
				rigidBody = new RigidBody();
				rigidBody.defaultFriction = 1;
			}
			return rigidBody;
		},

		start: function(){
			//add rigid body
			transform = this.getTransform();
			this.addComponent(this.getRigidBody());
			this.addComponent(this.getRenderComponent());

			//initialize size
			updateSize();

			//initialize velocity
			updateVelocity();
		},

		update: function(){
			//update age
			if(this.getFrameAge() > life && life != -1){
				this.removeFromParent();
			}

			//update size over time
			if(sizeOverTimeFunc != null){
				var newSize = sizeOverTimeFunc(this.getFrameAge());
				if(size != newSize){
					size = newSize;
					updateSize();
				}
			}

			if(velocityOverTimeFunc != null){
				var newVelocity = velocityOverTimeFunc(this.getFrameAge());
				velocity = newVelocity;
				updateVelocity();
			}
		},

		sizeOverTime: function(func){
			sizeOverTimeFunc = func;
		},

		velocityOverTime: function(func){
			velocityOverTimeFunc = func;
		},
	};

	block.__proto__ = PointSprite();

	return block;
};

module.exports = Block;