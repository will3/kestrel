var Component = require("../component");
var THREE = require("THREE");
var Projectile = require("../entities/projectile");
var Game = require("../game");
var Debug = require("../debug");

var WeaponController = Component.extend(function(){
	this.targets = [];
	this.cooldown = 0;
}).methods({
	shoot: function(target){
		var direction = new THREE.Vector3();
		direction.subVectors(target.getPosition(), this.entity.getPosition());
		direction.setLength(1);

		var projectile = new Projectile({
			power : 2,
			direction : direction,
		});
		
		projectile.actor = this.entity;
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

module.exports = WeaponController;