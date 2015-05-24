var Component = require("../component");
var THREE = require("THREE");
var Game = require("../game");
var Debug = require("../debug");

var WeaponController = function(){
	var targets = [];

	var weaponController = {
		setTarget: function(target){
			targets = [target];
		},

		getWeapons: function(){
			return this.getEntity().getWeapons();
		},

		update: function(){
			var target = targets.length > 0 ? targets[0] : null;
			if(target == null){
				return;
			}

			var weapons = this.getWeapons();
			weapons.forEach(function(weapon){
				weapon.fireIfReady(target);
			})
		}
	};

	weaponController.__proto__ = Component();

	return weaponController;
}

module.exports = WeaponController;