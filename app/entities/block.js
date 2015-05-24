var PointSprite = require("./pointsprite");
var THREE = require("THREE");
var RigidBody = require("../components/rigidbody");

var Block = function(){
	var size = 4;
	var life = -1;
	var sizeOverTimeFunc = null;
	var velocityOverTimeFunc = null;
	var opacity = 1.0;
	
	//component
	var transform = null;
	var rigidBody = null;

	var updateSize = function(){
		transform.getScale().set(size, size, size);
	}
	
	var getRigidBody = function(){
		if(rigidBody == null){
			rigidBody = new RigidBody();
			rigidBody.defaultFriction = 1;
		}
		return rigidBody;
	}

	var block = {
		setSize: function(value){ size = value; },
		getSize: function(){ return size; },
		setVelocity: function(value){ getRigidBody().setVelocity(value); },
		getVelocity: function(){ return getRigidBody().getVelocity(); },
		setLife: function(value){ life = value },
		getLife: function(){ return	life; },
		setColor: function(value){ color = value; },
		getColor: function(){ return color; },
		setOpacity: function(value){ opacity = value; },
		getOpacity: function(){ return opacity; },
		
		getRigidBody: getRigidBody,

		sizeOverTime: function(func){
			sizeOverTimeFunc = func;
		},

		velocityOverTime: function(func){
			velocityOverTimeFunc = func;
		},

		start: function(){
			//add rigid body
			transform = this.getTransform();
			this.addComponent(getRigidBody());
			this.addComponent(this.getRenderComponent());

			//initialize size
			updateSize();
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
				var velocity = velocityOverTimeFunc(this.getFrameAge());
				this.setVelocity(velocity);
			}
		}
	};

	block.__proto__ = PointSprite();

	return block;
};

module.exports = Block;