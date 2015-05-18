var Component = require("../component");
var THREE = require("THREE");
var Projectile = require("../entities/projectile");
var Game = require("../game");
var Debug = require("../debug");

<<<<<<< HEAD
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
=======
var WeaponController = Component.extend(function(){
	this.targets = [];
	this.cooldown = 0;
}).methods({
	shoot: function(target){
		var direction = new THREE.Vector3();
		direction.subVectors(target.getPosition(), this.entity.getPosition());
		direction.setLength(1);

		var projectile = new Projectile();
		projectile.setDirection(direction);
		projectile.setPower(2);
		projectile.setSpeed(4);
		projectile.setActor(this.entity);
		
		projectile.getPosition().copy(this.entity.getPosition());

		Game.addEntity(projectile);
	},

	setTarget: function(target){
		this.targets = [target];
	},

	update: function(){
		this.cooldown ++;

		if(this.cooldown >= 50){
			var target = this.targets.length > 0 ? this.targets[0] : null;
			if(target != null){
				this.shoot(target);
			}
			this.cooldown = 0;
		}
	}
});
>>>>>>> fa8cd2210bf54d8d2eef756246136a0c6170bf92

module.exports = WeaponController;