var ShipController = require("../../app/components/shipController");
var Entity = require("../../app/entity");
var RigidBody = require("../../app/components/rigidBody");
var expect = require("chai").expect;
var sinon = require("sinon");
var Command = require("../../app/command");
var THREE = require("THREE");
var MathUtils = require("../../app/MathUtils");

describe("ShipController", function(){
	var shipController, entity, rigidBody, mockRigidBody, mockShipController,
	roll, mockRoll, pitch, mockPitch, yaw, mockYaw;

	beforeEach(function(){
		roll = new ShipController.Roll();
		mockRoll = sinon.mock(roll);
		pitch = new ShipController.Pitch();
		mockPitch = sinon.mock(pitch);
		yaw = new ShipController.Yaw(roll);
		mockYaw = sinon.mock(yaw);
		shipController = new ShipController(yaw, pitch, roll);
		entity = new Entity();
		rigidBody = new RigidBody();
		entity.getRigidBody = function(){
			return rigidBody;
		}
		mockRigidBody = sinon.mock(rigidBody);
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

		it("should update yaw", function(){
			mockYaw.expects("update");
			shipController.update();
			mockYaw.verify();
		})

		it("should update pitch", function(){
			mockPitch.expects("update");
			shipController.update();
			mockPitch.verify();
		})

		it("should update command", function(){
			var command = new Command();
			var mockCommand = sinon.mock(command);
			shipController.setCommand(command);
			mockCommand.expects("update");

			shipController.update();

			mockCommand.verify();
		})
	})

	describe("accelerate", function(){
		it("should apply acceleration to rigid body", function(){
			var rotation = new THREE.Vector3(1, 1, 1);
			entity.setRotation(rotation);
			var expectedForce = MathUtils.getUnitVector(1, 1, 1);
			expectedForce.multiplyScalar(100);
			shipController.setForce(100);
			mockRigidBody.expects("applyForce").withArgs(sinon.match(function(force){
				return force.equals(expectedForce);
			}));
			shipController.accelerate(1);
			mockRigidBody.verify();
		})
	})
})

describe("Roll", function(){
	it("should have axis Z", function(){
		var roll = new ShipController.Roll();
		expect(roll.getAxis()).to.equal("z");
	})
})

describe("Pitch", function(){
	it("should have axis Y", function(){
		var pitch = new ShipController.Pitch();
		expect(pitch.getAxis()).to.equal("y");
	})
})

describe("Yaw", function(){
	var roll = new ShipController.Roll();
	var yaw = new ShipController.Yaw(roll);

	describe("#update", function(){
		it("should update from roll", function(){
			var entity = new Entity();
			
		})
	})
})