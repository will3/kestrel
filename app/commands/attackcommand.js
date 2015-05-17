var Command = require("../command");
var THREE = require("THREE");
var Projectile = require("../entities/projectile");
var Game = require("../game");

var AttackCommand = function(){
	var target = null;
	var game = null;

	var attackCommand = {
		getGame: function(){
			if(game == null){
				game = Game;
			}
			return game;
		},

		setGame: function(value){
			game = value;
		},

		getTarget: function(){
			return target;
		},

		execute: function(){
			var params = this.getParams();
			var targetName = params[0];
			target = this.getGame().getEntity(targetName);
			
			this.getActor().getWeaponController().setTarget(target);
		},
	};

	attackCommand.__proto__ = Command();

	return attackCommand;
}

module.exports = AttackCommand;