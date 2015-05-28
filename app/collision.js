var Entity = require("./entity");
var _ = require("lodash");
var THREE = require("THREE");
var Game = require("./game");

var Collision = function(){
	Entity.call(this);
	this.game = null;
}

Collision.prototype = Object.create(Entity.prototype);
Collision.prototype.constructor = Collision;

//visit collidable entities
Collision.prototype.visitEntities = function(callback){
	var entities = _.filter(this.game.getEntities(), function(entity){ 
		return entity.hasCollision();
	});
	
	for(var i = 0; i < entities.length; i++){
		for(var j = 0; j < i; j ++){
			if(i == j){
				continue;
			}

			callback(entities[i], entities[j]);
		}
	}
};

Collision.prototype.hitTest = function(a, b){
	var distanceVector = new THREE.Vector3();
	distanceVector.subVectors(b.position, a.position);
	var distance = distanceVector.length();
	if(distance == 0){
		distanceVector = new THREE.Vector3(Math.random(), Math.random(), Math.random());
		distanceVector.setLength(1);
		distance = 1;
	}

	var collisionDistance = a.rigidBody.collisionRadius + b.rigidBody.collisionRadius;

	return distance <= collisionDistance;
};

Collision.prototype.start = function(){

};

Collision.prototype.update = function(){
	this.visitEntities(function(a, b){
		if(this.hitTest(a, b)){
			if(a.onCollision != null){
				a.onCollision(b);
			}

			if(b.onCollision != null){
				b.onCollision(a);
			}
		}
	}.bind(this));
};

module.exports = Collision;
