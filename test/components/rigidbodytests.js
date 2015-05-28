var RigidBody = require("../../app/components/rigidbody");
var expect = require("chai").expect;
var sinon = require("sinon");
var THREE = require("THREE");
var Entity = require("../../app/entity");
var Component = require("../../app/component");

describe("RigidBody", function() {
    var rigidBody;

    beforeEach(function() {
        rigidBody = new RigidBody();
        rigidBody.defaultFriction = 1;
        rigidBody.friction = 1;

        var entity = new Entity();
        rigidBody.entity = entity;
    })

    describe("start", function() {
        it("should apply default friction to friction", function() {
            rigidBody.defaultFriction = 0.5;
            rigidBody.friction = 1;
            rigidBody.start();
            expect(rigidBody.friction).to.equal(0.5);
        })
    })

    describe("update", function() {
        it("should update velocity from acceleration", function() {
            rigidBody.applyForce(new THREE.Vector3(1, 1, 1));
            rigidBody.friction = 1;
            rigidBody.update();
            expect(rigidBody.velocity.equals(new THREE.Vector3(1, 1, 1))).to.equal(true);
        })

        it("should update position from velocity", function() {
            rigidBody.velocity = new THREE.Vector3(1, 1, 1);
            rigidBody.friction = 1;
            rigidBody.update();
            expect(rigidBody.transform.position.equals(new THREE.Vector3(1, 1, 1))).to.equal(true);
        })

        it("should apply friction to velocity", function() {
            rigidBody.defaultFriction = 1;
            rigidBody.friction = 1;
            rigidBody.applyFriction(0.5);
            rigidBody.velocity = new THREE.Vector3(1, 1, 1);
            rigidBody.update();
            expect(rigidBody.velocity.equals(new THREE.Vector3(0.5, 0.5, 0.5))).to.equal(true);
        })

        it("should reset acceleration", function() {
            rigidBody.acceleration = new THREE.Vector3(1, 1, 1);
            rigidBody.update();
            expect(rigidBody.acceleration.equals(new THREE.Vector3(0, 0, 0))).to.equal(true);
        })

        it("should reset friction", function() {
            rigidBody.defaultFriction = 0.95;
            rigidBody.applyFriction(0.5);
            rigidBody.update();
            expect(rigidBody.friction).to.equal(0.95);
        })
    })
})