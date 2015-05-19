var Entity = require("./entity");
var _ = require("lodash");
var THREE = require("THREE");

var Collision = function(){
	var game = null;

	//visit collidable entities
	var visitEntities = function(callback){
		var entities = _.filter(getGame().getEntities(), function(entity){ 
			return entity.hasCollision; 
		});
		for(var i = 0; i < entities.length; i++){
			for(var j = 0; j < i; j ++){
				if(i == j){
					continue;
				}

				callback(entities[i], entities[j]);
			}
		}
	}

	var getGame = function(){
		if(game == null){
			game = Game;
		}	
		return game;
	}

	var setGame = function(value){
		game = value;
	}

	var hitTest = function(a, b){
		var distanceVector = new THREE.Vector3();
		distanceVector.subVectors(b.getPosition(), a.getPosition());
		var distance = distanceVector.length();
		if(distance == 0){
			distanceVector = new THREE.Vector3(Math.random(), Math.random(), Math.random());
			distanceVector.setLength(1);
			distance = 1;
		}

		var collisionDistance = a.getRigidBody().getCollisionRadius() + b.getRigidBody().getCollisionRadius();

		return distance <= collisionDistance;
	}

	var collision = {
		getGame: getGame,
		setGame: setGame,
		visitEntities: visitEntities,
		hitTest: hitTest,

		start: function(){

		},

		update: function(){
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
		}
	};

	collision.__proto__ = Entity();

	return collision;
}

module.exports = Collision;
