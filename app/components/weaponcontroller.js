var Component = require("../component");
var THREE = require("THREE");
var Projectile = require("../entities/projectile");
var Game = require("../game");
var Debug = require("../debug");

var WeaponController = function(){
	var targets = [];
	var cooldown = 0;

	var weaponController = {
		shoot: function(target){
			var direction = new THREE.Vector3();
			direction.subVectors(target.getPosition(), this.getEntity().getPosition());
			direction.setLength(1);

			var projectile = new Projectile();
			projectile.setDirection(direction);
			projectile.setPower(2);
			projectile.setSpeed(4);
			projectile.setActor(this.getEntity());
			
			projectile.getPosition().copy(this.getEntity().getPosition());

			Game.addEntity(projectile);
		},

		setTarget: function(target){
			targets = [target];
		},

		update: function(){
			cooldown ++;

			if(cooldown >= 50){
				var target = targets.length > 0 ? targets[0] : null;
				if(target != null){
					this.shoot(target);
				}
				cooldown = 0;
			}
		}
	};

	weaponController.__proto__ = Component();

	return weaponController;
}

module.exports = WeaponController;