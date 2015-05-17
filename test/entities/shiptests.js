var Ship = require("../../app/entities/ship");
var expect = require("chai").expect;
var Component = require("../../app/component");
var _ = require("lodash");

describe("Ship", function(){
	var ship = null;

	beforeEach(function(){
		ship = new Ship();
	})

	describe("start", function(){
		it("should initialize components", function(){
			ship.setShipController(new Component());
			ship.setRigidBody(new Component());
			ship.setRenderComponent(new Component());

			ship.start();

			expect(ship.getShipController()).to.not.equal(null);
			expect(ship.getRigidBody()).to.not.equal(null);
			expect(ship.getRenderComponent()).to.not.equal(null);
			expect(_.includes(ship.getComponents(), ship.getShipController())).to.equal(true);
			expect(_.includes(ship.getComponents(), ship.getRigidBody())).to.equal(true);
			expect(_.includes(ship.getComponents(), ship.getRenderComponent())).to.equal(true);
		})
	})
})