var Ship = require("../../app/entities/ship");
var expect = require("chai").expect;
var Component = require("../../app/component");
var _ = require("lodash");

describe("Ship", function(){
	var ship = null;

	beforeEach(function(){
		ship = new Ship();
	})

	it("should be collidable", function(){
		expect(ship.hasCollision()).to.equal(true);
	})

	it("should initialize components", function(){
		expect(ship.getShipController()).to.not.equal(null);
		expect(ship.getRigidBody()).to.not.equal(null);
		expect(ship.getRenderComponent()).to.not.equal(null);
		expect(ship.getWeaponController()).to.not.equal(null);
	})

	describe("start", function(){
		it("should add components", function(){
			ship.setShipController(new Component());
			ship.setRigidBody(new Component());
			ship.setRenderComponent(new Component());
			ship.setWeaponController(new Component());
			
			ship.start();

			expect(_.includes(ship.getComponents(), ship.getShipController())).to.equal(true);
			expect(_.includes(ship.getComponents(), ship.getRigidBody())).to.equal(true);
			expect(_.includes(ship.getComponents(), ship.getRenderComponent())).to.equal(true);
			expect(_.includes(ship.getComponents(), ship.getWeaponController())).to.equal(true);
		})

		it("should add weapons", function(){
			var weapon1 = { setParentEntity: function(){ } };
			var weapon2 = { setParentEntity: function(){ } };
			ship.setWeapons([weapon1, weapon2]);
			ship.start();
			expect(ship.getChildEntities()).to.contain(weapon1);
			expect(ship.getChildEntities()).to.contain(weapon2);
		})
	})
})