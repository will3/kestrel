var MoveCommand = require("../../app/commands/movecommand");
var sinon = require("sinon");
var expect = require("chai").expect;
var THREE = require("THREE");

describe("MoveCommand", function(){
	var moveCommand, actor, shipController, mockShipController;

	beforeEach(function(){
		moveCommand = new MoveCommand();
		shipController = {
			setCommand: function(){ },
			move: function(){ }
		};
		actor = {
			shipController: shipController
		};
		moveCommand.actor = actor;
		mockShipController = sinon.mock(shipController);
	})

	describe("#execute", function(){
		it("should initialize target", function(){
			moveCommand.params = [100, 100, 100];
			moveCommand.execute();
			expect(moveCommand.target.equals(new THREE.Vector3(100, 100, 100))).to.be.true;
		})

		it("should set ship controller command", function(){
			moveCommand.params = [100, 100, 100];
			mockShipController.expects("setCommand").withArgs(moveCommand);

			moveCommand.execute();

			mockShipController.verify();
		})
	})

	describe("#update", function(){
		it("should move to target", function(){
			moveCommand.params = [100, 100, 100];
			mockShipController.expects("move").withArgs(sinon.match(function(point){
				return point.equals(new THREE.Vector3(100, 100, 100));
			}));
			moveCommand.execute();
			moveCommand.update();
			mockShipController.verify();
		})
	})
})