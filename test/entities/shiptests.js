var Ship = require("../../app/entities/ship");
var expect = require("chai").expect;
var Component = require("../../app/component");
var _ = require("lodash");

describe("Ship", function(){
	var ship = null;

	beforeEach(function(){
		ship = new Ship();
	})

	it("should initialize components", function(){
		expect(ship.getShipController()).to.not.equal(null);
		expect(ship.getRigidBody()).to.not.equal(null);
		expect(ship.getRenderComponent()).to.not.equal(null);
		expect(ship.getWeaponController()).to.not.equal(null);
	})

	describe("start", function(){
		it("should add components", function(){
			ship.start();

			ship.setShipController(new Component());
			ship.setRigidBody(new Component());
			ship.setRenderComponent(new Component());
			ship.setWeaponController(new Component());
			expect(_.includes(ship.getComponents(), ship.getShipController())).to.equal(true);
			expect(_.includes(ship.getComponents(), ship.getRigidBody())).to.equal(true);
			expect(_.includes(ship.getComponents(), ship.getRenderComponent())).to.equal(true);
			expect(_.includes(ship.getComponents(), ship.getWeaponController())).to.equal(true);
		})
	})
})