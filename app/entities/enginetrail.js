var Entity = require("../entity");
var Block = require("./block");
var Debug = require("../debug");
var MathUtils = require("../mathutils");

var EngineTrail = function(){
	var life = 10;
	var size = 3;
	var amount = 0;
	var ship = null;
	var game = null;

	var createBlock = function(velocity){
		var block = new Block();
		block.setSize(size);
		block.setLife(life);
		block.sizeOverTime(function(time){
			return size - time * (size / life);
		});

		block.setVelocity(velocity);

		return block;
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

	var engineTrail = {
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

			getGame().addEntity(createBlock(vector), this.getWorldPosition());
		}
	}

	engineTrail.__proto__ = Entity();

	return engineTrail;
}

module.exports = EngineTrail;