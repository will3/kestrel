var RigidBody = require("../../app/components/rigidBody");
var expect = require("chai").expect;
var sinon = require("sinon");
var THREE = require("THREE");
var Entity = require("../../app/entity");

describe("RigidBody", function(){
	var rigidBody;

	beforeEach(function(){
		rigidBody = new RigidBody();
		rigidBody.setDefaultFriction(1);

		var entity = new Entity();
		rigidBody.setEntity(entity);
	})

	describe("update", function(){
		it("should update velocity from acceleration", function(){
			rigidBody.applyForce(new THREE.Vector3(1, 1, 1));
			rigidBody.update();
			expect(rigidBody.getVelocity().equals(new THREE.Vector3(1, 1, 1))).to.equal(true);	
		})

		it("should update position from velocity", function(){
			rigidBody.setVelocity(new THREE.Vector3(1, 1, 1));
			rigidBody.update();
			expect(getPosition().equals(new THREE.Vector3(1, 1, 1))).to.equal(true);
		})

		it("should apply friction to velocity", function(){
			rigidBody.setDefaultFriction(1);
			rigidBody.applyFriction(0.5);
			rigidBody.setVelocity(new THREE.Vector3(1, 1, 1));
			rigidBody.update();
			expect(rigidBody.getVelocity().equals(new THREE.Vector3(0.5, 0.5, 0.5))).to.equal(true);
		})

		it("should reset acceleration", function(){
			rigidBody.setAcceleration(new THREE.Vector3(1, 1, 1));
			rigidBody.update();
			expect(rigidBody.getAcceleration().equals(new THREE.Vector3(0, 0, 0))).to.equal(true);
		})

		it("should reset friction", function(){
			rigidBody.setDefaultFriction(0.95);
			rigidBody.applyFriction(0.5);
			rigidBody.update();
			expect(rigidBody.getFriction()).to.equal(0.95);
		})
	})

	function getPosition(){
		return rigidBody.getTransform().getPosition();
	}
})