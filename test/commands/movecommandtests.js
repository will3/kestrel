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

	describe("#start", function(){
		it("should initialize target", function(){
			moveCommand.params = [100, 100, 100];
			moveCommand.start();
			expect(moveCommand.target.equals(new THREE.Vector3(100, 100, 100))).to.be.true;
		})
	})

	describe("#update", function(){
		it("should move to target", function(){
			moveCommand.params = [100, 100, 100];
			mockShipController.expects("move").withArgs(sinon.match(function(point){
				return point.equals(new THREE.Vector3(100, 100, 100));
			}));
			moveCommand.start();
			moveCommand.update();
			mockShipController.verify();
		})
	})
})