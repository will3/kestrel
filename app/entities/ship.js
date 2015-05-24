var Entity = require("../entity");
var RenderComponent = require("../components/rendercomponent");
var Beam = require("./beam");
var THREE = require("THREE");
var RigidBody = require("../components/rigidbody");
var ShipController = require("../components/shipcontroller");
var WeaponController = require("../components/weaponcontroller");
var Weapon = require("./weapon");
var SmokeTrail = require("./smoketrail");
var extend = require("extend");
var Laser = require("./laser");
var Missile = require("./missile");
var MaterialLoader = require("../materialloader");

var Ship = function(){
	var shipController = null;
	var rigidBody = null;
	var renderComponent = null;
	var weaponController = null;
	var weapons = null;
	var smokeTrail = null;
	var bluePrint = null;
	var hull = null;

	var ship = {
		destroyable: true,

		getHull: function(){ return hull; },
		getWeaponController: function(){
			if(weaponController == null){
				weaponController = new WeaponController();
			}
			return weaponController;
		},

		getBluePrint: function(){
			if(bluePrint == null){ 
				bluePrint = new ShipBluePrint(); 
			}
			return bluePrint;
		},

		setWeaponController: function(value){
			weaponController = value;
		},

		getShipController: function(){ 
			if(shipController == null){
				shipController = new ShipController();
			}
			return shipController; 
		},

		setShipController: function(value){
			shipController = value;
		},

		getRigidBody: function(){ 
			if(rigidBody == null){
				rigidBody = new RigidBody();
				rigidBody.setCollisionRadius(9);
			}
			return rigidBody; 
		},

		getWeapons: function(){
			if(weapons == null){
				var laser = new Laser();
				var missile = new Missile();

				weapons = [];

				// var weapon1 = new Weapon(laser);
				// weapon1.setActor(this);
				// weapon1.setDelta(0);
				// weapons.push(weapon1);

				// var weapon2 = new Weapon(laser);
				// weapon2.setActor(this);
				// weapon2.setDelta(8);
				// weapons.push(weapon2);

				var weapon1 = new Weapon(missile);
				weapon1.setActor(this);
				weapon1.setDelta(0);
				weapons.push(weapon1);

				var weapon2 = new Weapon(missile);
				weapon2.setActor(this);
				weapon2.setDelta(8);
				weapons.push(weapon2);

				// var weapon3 = new Weapon(missile);
				// weapon3.setActor(this);
				// weapons.push(weapon3);
			}

			return weapons;
		},

		setWeapons: function(value){
			weapons = value;
		},

		setRigidBody: function(value){
			rigidBody = value;
		},

		getRenderComponent: function(){ 
			if(renderComponent == null){
				hull = this.getBluePrint().build();
				renderComponent = new ShipRenderComponent(hull);
			}
			return renderComponent;
		},

		setRenderComponent: function(value){
			renderComponent = value;
		},
		
		start: function(){
			Ship.id ++;

			this.addComponent(this.getRenderComponent());
			this.addComponent(this.getRigidBody());
			this.addComponent(this.getShipController());
			this.addComponent(this.getWeaponController());

			this.getWeapons().forEach(function(weapon){
				this.addEntity(weapon);
			}.bind(this));

			smokeTrail = new SmokeTrail();
			smokeTrail.setShip(this);
			this.addEntity(smokeTrail);
		},

		update: function(){
			smokeTrail.setAmount(shipController.getEngineAmount());
		}
	};

	ship.__proto__ = Entity();

	return ship;
}

var ShipBluePrint = function(){
	function getHull(){
		var hull = new Beam([0, 15], [2, 2]);
		hull.setAlignment("x");
		hull.setScale(new THREE.Vector3(1.0, 0.25, 1.0));

		var weapon1 = getWeapon();
		var weapon2 = getWeapon();
		var cargo1 = getCargo();
		var cargo2 = getCargo();
		var cargo3 = getCargo();

		hull.branch(weapon1, 5 , 1.4, "z");
		hull.branch(weapon2, -5 , 1.4, "z");

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
		build: function(){
			return getHull();
		}
	};
};

var ShipRenderComponent = function(hull){
	var hull = hull;

	var shipRenderComponent = {
		initGeometry: function(){
			return hull.getGeometry();
		},

		initMaterial: function(){
			return MaterialLoader.getSolidMaterial(new THREE.Vector4(1.0, 1.0, 1.0, 1.0));
		}
	}

	shipRenderComponent.__proto__ = RenderComponent();

	return shipRenderComponent;
}

module.exports = Ship;