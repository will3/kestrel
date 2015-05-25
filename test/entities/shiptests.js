var injector = require("../../app/injector");
injector.loadModule(require("../testmodule"));
var Ship = require("../../app/entities/ship");
var expect = require("chai").expect;
var Component = require("../../app/component");
var _ = require("lodash");


describe("Ship", function(){
	var ship, weapons;

	beforeEach(function(){
		ship = new Ship();
		weapons = injector.get("weapons");
	})

	it("should initialize components", function(){
		expect(ship.shipController).to.exist;
		expect(ship.rigidBody).to.exist;
		expect(ship.renderComponent).to.exist;
		expect(ship.weaponController).to.exist;
	})

	describe("start", function(){
		it("should add components", function(){
			ship.start();

			expect(_.includes(ship.components, ship.shipController)).to.equal(true);
			expect(_.includes(ship.components, ship.rigidBody)).to.equal(true);
			expect(_.includes(ship.components, ship.renderComponent)).to.equal(true);
			expect(_.includes(ship.components, ship.weaponController)).to.equal(true);
		})

		it("should add weapons", function(){
			var weapon1 = {};
			var weapon2 = {};
			ship.weapons = [weapon1, weapon2];
			
			ship.start();

			expect(ship.childEntities).to.contain(weapon1);
			expect(ship.childEntities).to.contain(weapon2);
		})
	})
})