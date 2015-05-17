var Command = require("../command");
var THREE = require("THREE");
var Projectile = require("../entities/projectile");

var AttackCommand = Command.extend(function(){
	this.cooldown = 0;
	this.actor = null;
	this.target = null;
}).methods({
	execute: function(){
		var targetName = this.params[0];
		this.target = Game.getEntity(targetName);
		this.actor.getShipController().setCommand(this);
		this.shoot();
	},

	update: function(){
		var shipController = this.actor.getShipController();
		shipController.align(this.target.getPosition());

		if(this.cooldown % 50 == 0){
			this.shoot();
		}

		this.cooldown ++;
	},

	shoot: function(){
		var direction = new THREE.Vector3();
		direction.subVectors(this.target.getPosition(), this.actor.getPosition());
		direction.setLength(1);

		var projectile = new Projectile({
			power : 2,
			direction : direction,
		});
		
		projectile.actor = this.actor;
		Game.addEntity(projectile, this.actor.getPosition());
	},
});

module.exports = AttackCommand;