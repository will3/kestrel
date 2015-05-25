var ShipController = require("../../app/components/shipcontroller");
var Entity = require("../../app/entity");
var RigidBody = require("../../app/components/rigidbody");
var expect = require("chai").expect;
var sinon = require("sinon");
var Command = require("../../app/command");
var THREE = require("THREE");
var MathUtils = require("../../app/mathutils");

describe("ShipController", function(){
	var shipController, entity, rigidBody, mockRigidBody, mockShipController;

	beforeEach(function(){
		shipController = new ShipController();
		entity = new Entity();
		rigidBody = new RigidBody();
		entity.rigidBody = rigidBody;
		mockRigidBody = sinon.mock(rigidBody);
		shipController.entity = entity;
		mockShipController = sinon.mock(shipController);
	})

	describe("get rigid body", function(){
		it("should return rigid body of entity", function(){
			expect(shipController.rigidBody).to.equal(rigidBody);
		})
	})

	describe("set command", function(){
		it("should destroy previous command", function(){
			var command = new Command();
			var mockCommand = sinon.mock(command);
			shipController.command = command;
			mockCommand.expects("destroy");

			shipController.command = new Command();

			mockCommand.verify();
		})
	})

	describe("update", function(){
		it("should update command", function(){
			var command = new Command();
			var mockCommand = sinon.mock(command);
			shipController.command = command;
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
