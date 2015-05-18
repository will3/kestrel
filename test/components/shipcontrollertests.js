var ShipController = require("../../app/components/shipController");
var Entity = require("../../app/entity");
var RigidBody = require("../../app/components/rigidBody");
var expect = require("chai").expect;
var sinon = require("sinon");
var Command = require("../../app/command");

describe("ShipController", function(){
	var shipController, entity, rigidBody, mockShipController,
	roll, mockRoll;

	beforeEach(function(){
		roll = new ShipController.Roll();
		mockRoll = sinon.mock(roll);
		shipController = new ShipController(roll);
		entity = new Entity();
		rigidBody = new RigidBody();
		entity.getRigidBody = function(){
			return rigidBody;
		}
		shipController.setEntity(entity);
		mockShipController = sinon.mock(shipController);
	})

	describe("get rigid body", function(){
		it("should return rigid body of entity", function(){
			expect(shipController.getRigidBody()).to.equal(rigidBody);
		})
	})

	describe("set command", function(){
		it("should destroy previous command", function(){
			var command = new Command();
			var mockCommand = sinon.mock(command);
			shipController.setCommand(command);
			mockCommand.expects("destroy");

			shipController.setCommand(new Command());

			mockCommand.verify();
		})
	})

	describe("update", function(){
		it("should update roll", function(){
			mockRoll.expects("update");
			shipController.update();
			mockRoll.verify();
		})
	})
})