var Entity = require("../entity");
var THREE = require("THREE");
var extend = require("extend");

var Weapon = function(ammo){
	var fireInterval = 50;
	var cooldown = 50;
	var actor = null;
	var game = null;
	var ammo = ammo;
	
	var weapon = {
		setDelta: function(value){ cooldown = value; },
		getActor: function(){ return actor; },
		setActor: function(value){ actor = value; },
		setGame: function(value){ game = value; },
		getGame: function(){ if(game == null){ game = Game; } return game; },
		setAmmo: function(value){ ammo = value; },
		getAmmo: function(){ return ammo; },
		
		shoot: function(target){
			var newAmmo = ammo.createInstance();
			newAmmo.setActor(actor);
			newAmmo.setTarget(target);
			newAmmo.setPosition(actor.getWorldPosition());

			this.getGame().addEntity(newAmmo);

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