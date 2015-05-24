var Entity = require("../entity.js");
var THREE = require("THREE");

var Ammo = function(){
	var actor = null;
	var target = null;

	var ammo = {
		destroyable: true,

		getActor: function(){ return actor; },
		setActor: function(value){ actor = value; },
		getTarget: function(){ return target; },
		setTarget: function(value){ target = value; },

		createInstance: function(){
			throw "must override";
		}
	}

	ammo.__proto__ = Entity();

	return ammo;
}

module.exports = Ammo;