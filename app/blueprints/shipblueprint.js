var THREE = require("THREE");
var Beam = require("../entities/beam");
var extend = require("extend");

var ShipBluePrint = function(){
	var hull = null;

	function getHull(){
		if(hull != null){
			return hull;
		}

		hull = new Beam([0, 16], [2, 2]);
		hull.setAlignment("x");
		hull.setScale(new THREE.Vector3(1.0, 0.25, 1.0));

		var weapon1 = getWeapon();
		var weapon2 = getWeapon();
		var cargo1 = getCargo();
		var cargo2 = getCargo();
		var cargo3 = getCargo();

		hull.branch(weapon1, 5 , 1.5, "z");
		hull.branch(weapon2, -5 , 1.5, "z");

		hull.branch(cargo1, 2, -0.5, "z");
		hull.branch(cargo2, 0, -0.5, "z");
		hull.branch(cargo3, -2, -0.5, "z");

		extend(hull, {
			weapon1: weapon1,
			weapon2: weapon2,
			cargo1: cargo1,
			cargo2: cargo2,
			cargo3: cargo3,			
		});

		return hull;
	}

	function getWeapon(){
		var beam = new Beam([0, 4, 7], [1.0, 1.0, 0]);
		return beam;
	}

	function getCargo(){
		var cargo = new Beam([0, 6], [1.0, 1.0]);

		return cargo;
	}

	return {
		build: function(){
			return getHull();
		},

		getGeometry: function(){
			return getHull().getGeometry();
		},

		getMaterial: function(){
			return null;
		}
	}
}

module.exports = ShipBluePrint;