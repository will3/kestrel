var Entity = require("../entity");
var THREE = require("THREE");
var Projectile = require("./projectile");

var Weapon = function(){
	var fireInterval = 50;
	var cooldown = 50;
	var actor = null;

	var weapon = {
		setDelta: function(value){ cooldown = value; },
		getActor: function(){ return actor; },
		setActor: function(value){ actor = value; },
		shoot: function(target){
			var direction = new THREE.Vector3();
			direction.subVectors(target.getWorldPosition(), this.getWorldPosition());
			direction.setLength(1);

			var projectile = new Projectile();
			projectile.setDirection(direction);
			projectile.setPower(2);
			projectile.setSpeed(4);
			projectile.setActor(actor);
			
			projectile.setPosition(this.getWorldPosition());

			Game.addEntity(projectile);

			cooldown = 0;
		},

		start: function(){

		},

		update: function(){
			if(cooldown < fireInterval){
				cooldown ++;
			}
		},

		isReady: function(){
			return (cooldown == fireInterval);
		},

		fireIfReady: function(target){
			if(!this.isReady()){
				return;
			}

			this.shoot(target);
		}
	}

	weapon.__proto__ = Entity();

	return weapon;
}

module.exports = Weapon;