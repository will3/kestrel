var ShipController = require("../../app/components/shipcontroller");
var expect = require("chai").expect;
var sinon = require("sinon");
var THREE = require("THREE");
var MathUtils = require("../../app/mathutils");

describe("ShipController", function() {
    var shipController, entity, transform, rigidBody, mockRigidBody, mockShipController;

    beforeEach(function() {
        shipController = new ShipController();
        entity = {
            transform: {
                rotation: new THREE.Vector3(0, 0, 0)
            }
        };
        rigidBody = {
            applyForce: function() {}
        };
        engine = {};

        entity.rigidBody = rigidBody;
        mockRigidBody = sinon.mock(rigidBody);
        shipController.entity = entity;
        shipController.engines = [engine];
        mockShipController = sinon.mock(shipController);
    });

    describe("get rigid body", function() {
        it("should return rigid body of entity", function() {
            expect(shipController.rigidBody).to.equal(rigidBody);
        });
    });

    describe("accelerate", function() {
        // it("should apply acceleration to rigid body", function() {
        //     var rotation = new THREE.Vector3(1, 1, 1);
        //     entity.rotation = rotation;
        //     var expectedForce = MathUtils.getUnitVector(1, 1, 1);
        //     expectedForce.multiplyScalar(100);
        //     shipController.force = 100;
        //     mockRigidBody.expects("applyForce").withArgs(sinon.match(function(force) {
        //         return force.equals(expectedForce);
        //     }));
        //     shipController.accelerate(1);
        //     mockRigidBody.verify();
        // })

        it("should set engine amount", function(){
            shipController.accelerate(0.5);
            expect(engine.amount).to.equal(0.5);
        });
    });
});