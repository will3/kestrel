var AlignCommand = require("../../app/commands/AlignCommand");
var Ship = require("../../app/entities/Ship");
var expect = require("chai").expect;
var THREE = require("THREE");
var sinon = require("sinon");
var ShipController = require("../../app/components/ShipController");

describe("Align Command", function(){
	var alignCommand, actor, shipController, mockShipController;

	beforeEach(function(){
		alignCommand = new AlignCommand();
		actor = new Ship();
		alignCommand.setActor(actor);
		shipController = new ShipController();
		actor.setShipController(shipController);
		mockShipController = sinon.mock(shipController);
	})

	describe("execute", function(){
		it("should parse target correctly", function(){
			alignCommand.setParams(["100", "100", "100"]);
			alignCommand.execute();
			expect(alignCommand.getTarget().equals(new THREE.Vector3(100, 100, 100))).to.equal(true);
		})

		it("should issue command", function(){
			alignCommand.setParams(["100", "100", "100"]);
			alignCommand.execute();
			mockShipController.expects("setCommand").withArgs(alignCommand);

			alignCommand.execute();

			mockShipController.verify();
		})
	})

	describe("on update", function(){
		it("should align", function(){
			alignCommand.setParams(["100", "100", "100"]);
			alignCommand.execute();
			mockShipController.expects("align").withArgs(matchingVector(100, 100, 100));

			alignCommand.update();

			mockShipController.verify();
		})
	})

	function matchingVector(x, y, z){
		return sinon.match(function(target){
			return target.equals(new THREE.Vector3(x, y, z));
		});
	}
})

