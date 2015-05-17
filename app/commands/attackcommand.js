var Command = require("../command");
var THREE = require("THREE");
var Projectile = require("../entities/projectile");
var Game = require("../game");

var AttackCommand = function(){
	var cooldown = 0;
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
			this.getActor().getShipController().setCommand(this);
			this.shoot();
		},

		update: function(){
			var shipController = this.getActor().getShipController();
			shipController.align(target.getPosition());

			if(cooldown % 50 == 0){
				this.shoot();
			}

			cooldown ++;
		},

		shoot: function(){
			var direction = new THREE.Vector3();
			var actor = this.getActor();
			direction.subVectors(target.getPosition(), actor.getPosition());
			direction.setLength(1);

			var projectile = new Projectile({
				power : 2,
				direction : direction,
			});
			
			projectile.actor = actor;
			Game.addEntity(projectile, actor.getPosition());
		},
	};

	attackCommand.__proto__ = Command();

	return attackCommand;
}

module.exports = AttackCommand;