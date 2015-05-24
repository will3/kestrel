var Entity = require("../entity");
var PointSprite = require("./pointsprite");
var Debug = require("../debug");
var MathUtils = require("../mathutils");
var THREE = require("THREE");

var SmokeTrail = function(){
	var amount = 0;
	var ship = null;
	var game = null;

	var createSprite = function(velocity, size, life){
		var pointsprite = new PointSprite();
		pointsprite.setSize(size);
		pointsprite.setLife(life);
		pointsprite.sizeOverTime(function(time){
			return size - time * (size / life);
		});
		pointsprite.setVelocity(velocity);

		return pointsprite;
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

	var emit = function(position, offset, speed, size, life){
		var rotationMatrix = ship.getRotationMatrix();
		offset.applyMatrix4(rotationMatrix);

		getGame().addEntity(createSprite(speed, size, life), position.add(offset));
	}

	var smokeTrail = {
		setAmount: function(value){ amount = value; },
		getAmount: function(){ return amount; },
		setShip: function(value){ ship = value; },
		getShip: function(){ return ship; },
		setGame: setGame,

		start: function(){

		},

		update: function(){
			if(amount == 0){
				return;
			}

			var rotation = ship.getRotation();
			var vector = MathUtils.getUnitVector(rotation.x, rotation.y, rotation.z);
			vector.setLength(-1);

			emit(this.getWorldPosition(), ship.getHull().getEngineEmissionPoint(), vector, 3, 8);
		}
	}

	smokeTrail.__proto__ = Entity();

	return smokeTrail;
}

module.exports = SmokeTrail;