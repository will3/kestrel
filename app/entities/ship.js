var Entity = require("../entity");
var RenderComponent = require("../components/rendercomponent");
var Beam = require("./beam");
var THREE = require("THREE");
var RigidBody = require("../components/rigidbody");
var ShipController = require("../components/shipcontroller");
var WeaponController = require("../components/weaponcontroller");
var Weapon = require("./weapon");
var SmokeTrail = require("./smoketrail");
var Laser = require("./laser");
var Missile = require("./missile");
var MaterialLoader = require("../materialloader");
var ShipBluePrint = require("../blueprints/shipblueprint");

var Ship = function(bluePrint){
	var shipController = null;
	var rigidBody = null;
	var renderComponent = null;
	var weaponController = null;
	var weapons = null;
	var smokeTrail = null;
	var bluePrint = bluePrint || new ShipBluePrint();
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

				var weapon1 = new Weapon(laser);
				weapon1.setActor(this);
				weapon1.setDelta(0);
				weapons.push(weapon1);

				var weapon2 = new Weapon(laser);
				weapon2.setActor(this);
				weapon2.setDelta(8);
				weapons.push(weapon2);

				// var weapon1 = new Weapon(missile);
				// weapon1.setActor(this);
				// weapon1.setDelta(0);
				// weapons.push(weapon1);
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
				renderComponent = new ShipRenderComponent(bluePrint.build());
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

var ShipRenderComponent = function(product){
	var product = product;

	var shipRenderComponent = {
		initObject: function(){
			var material = MaterialLoader.getSolidMaterial(new THREE.Vector4(1.0, 1.0, 1.0, 1.0));
			var geometry = product.getGeometry();

			return new THREE.Mesh(geometry, material);
		}
	}

	shipRenderComponent.__proto__ = RenderComponent();

	return shipRenderComponent;
}

module.exports = Ship;