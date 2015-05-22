var Entity = require("../entity");
var block = require("./block");

var ParticleSystem = function(){
	var count = 0;
	var paritcles = [];

	var size = 4;
	var velocity = new THREE.Vector3(0, 1, 0);
	var life = -1;
	var sizeOverTimeFunc;
	var velocityOverTimeFunc;
	var emissionRate = 1.0;
	var emissionInterval = null;
	var emit = function(parentEntity){
		var block = createBlock();
		block.addEntity(parentEntity);
	}

	var createBlock = function(){
		var block = new Block();
		block.setSize(size);
		block.velocity(velocity);
		block.setLife(life);
		if(sizeOverTimeFunc != null){
			block.sizeOverTime(sizeOverTimeFunc);
		}

		if(velocityOverTimeFunc != null){
			block.velocityOverTime(velocityOverTimeFunc);	
		}

		return block;
	}

	var particleSystem = {
		setSize: function(value){ size = value; },
		getSize: function(){ return size; },
		setVelocity: function(value){ velocity = value; },
		getVelocity: function(){ return velocity; },
		setLife: function(value){ life = value },
		getLife: function(){ return	life; },
		sizeOverTime: function(func){
			sizeOverTimeFunc = func;
		},
		velocityOverTime: function(func){
			velocityOverTimeFunc = func;
		},

		start: function(){
			emissionInterval = startInterval(1000.0 / emissionRate, emit(this));
		},

		update: function(){

		}
	}

	particleSystem.__proto__ = Entity();

	return particleSystem;
}