var OrbitCommand = require("../../app/commands/orbitCommand");
var THREE = require("THREE");
var expect = require("chai").expect;
var Ship = require("../../app/entities/ship");
var ShipController = require("../../app/components/ShipController");
var sinon = require("sinon");

describe("OribtCommand", function(){
	var orbitCommand = null;
	var actor = null;

	beforeEach(function(){
		orbitCommand = new OrbitCommand();
		actor = new Ship();
		orbitCommand.setActor(actor);
	})

	describe("execute", function(){
		it("parses target correctly", function(){
			orbitCommand.setParams([1, 2, 3]);
			orbitCommand.execute();
			expect(orbitCommand.getTarget().equals(new THREE.Vector3(1, 2, 3))).to.equal(true);
		})

		it("parses distance correctly", function(){
			orbitCommand.setParams([1, 2, 3, 50]);
			orbitCommand.execute();
			expect(orbitCommand.getDistance()).to.equal(50);
		})

		it("issues command to ship", function(){
			var shipController = new ShipController();
			var mockShipController = sinon.mock(shipController);
			actor.setShipController(shipController);
			mockShipController.expects("setCommand").withArgs(orbitCommand);

			orbitCommand.execute();

			mockShipController.verify();
		})
	})
})
