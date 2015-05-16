var Entity = require("../entity");
var RenderComponent = require("../components/rendercomponent");
var Beam = require("./beam");
var THREE = require("THREE");
var Material = require("../material");
var RigidBody = require("../components/rigidbody");
var ShipController = require("../components/shipcontroller");

var Ship = Entity.extend(function(){
	this.shipController = null;
	this.rigidBody = null;
	this.geometry = null;
	this.hasCollision = true
	this.collisionRadius = 9;
}).methods({
	start: function(){
		Ship.id ++;

		this.bluePrint = new ShipBluePrint();
		this.geometry = this.bluePrint.initGeometry();

		this.addComponent(new ShipRenderComponent(this.geometry));
		this.rigidBody = new RigidBody();
		this.addComponent(this.rigidBody);
		this.shipController = new ShipController();
		this.addComponent(this.shipController);
	},
});

var ShipBluePrint = function(){
	function getShip(){
		var wing = new Beam([0, 15], [2, 2]);
		wing.setAlignment("x");
		wing.setScale(new THREE.Vector3(1.0, 0.25, 1.0));

		wing.branch(getWeapon(), 5 , 1.4, "z");
		wing.branch(getWeapon(), -5 , 1.4, "z");

		wing.branch(getCargo(), 2, -0.5, "z");
		wing.branch(getCargo(), 0, -0.5, "z");
		wing.branch(getCargo(), -2, -0.5, "z");

		return wing;
	}

	function getSensor(){
		var beam = new Beam([0, 1, 4], [0.8, 0.8, 0]);

		return beam;
	}

	function getEngine(){
		var engine = new Beam([0, 1.5], [1.2, 1.2]);

		return engine;
	}

	function getWeapon(){
		var beam = new Beam([0, 4, 7], [1.0, 1.0, 0]);
		return beam;
	}

	function getCargo(){
		var cargo = new Beam([0, 2, 6], [1.1, 1.0, 1.0]);

		return cargo;
	}

	function getCargoAndEngine(){

	}

	return {
		initGeometry: function(){
			var ship = getShip();
			var geometry = ship.getGeometry();
			return geometry;
		},
	};
};

var ShipRenderComponent = RenderComponent.extend(function(geometry){
	this.geometry = geometry;
}).methods({
	initGeometry: function(){
		return this.geometry;
	},

	initMaterial: function(){
		return new Material.Solid(new THREE.Vector4(1.0, 1.0, 0.0, 1.0));
	}
});

module.exports = Ship;