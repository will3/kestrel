var Laser = require("../../app/entities/laser");
var expect = require("chai").expect;
var sinon = require("sinon");
var THREE = require("THREE");
var _ = require("lodash");

describe("Laser", function() {
    var laser, actor, target, rigidBody, mockLaser;

    beforeEach(function() {
        laser = new Laser();
        actor = {
        	worldPosition: new THREE.Vector3(0, 0, 0)
        };
        target = {
            worldPosition: new THREE.Vector3(0, 0, 0)
        };
        target.position = new THREE.Vector3(100, 100, 100);
        rigidBody = {};

        laser.actor = actor;
        laser.target = target;
		laser.rigidBody = rigidBody;

        laser.createBlock = function() {
            return new Entity();
        }

        mockLaser = sinon.mock(laser);
    })

    describe("#start", function() {
        it("should create blocks", function() {
            laser.start();
            expect(laser.childEntities.length).to.equal(4);
        });

        it("should add rigid body", function() {
            laser.start();
            expect(_.includes(laser.components, rigidBody)).to.be.true;
        });

        it("should initialize velocity when distance is zero", function() {
        	actor.worldPosition = new THREE.Vector3(100, 100, 100);
        	target.worldPosition = new THREE.Vector3(100, 100, 100);
            laser.start();
            expect(laser.rigidBody.velocity.length()).to.be.gt(0);
        });

        it("should initialize velocity when distance is greater than zero", function(){
        	actor.worldPosition = new THREE.Vector3(100, 100, 100);
        	target.worldPosition = new THREE.Vector3(200, 200, 200);
        	laser.start();
        	expect(laser.rigidBody.velocity.length()).to.be.gt(0);
        })
    })

    describe("#update", function() {
        it("should remove self when no life", function() {

        })
    })

    describe("#onCollision", function(){
    	it("should not destroy if colliding object is actor", function(){
    		mockLaser.expects("destroy").never();
    		laser.onCollision(actor);
    		mockLaser.verify();
    	})

    	it("should destroy if colliding object is not actor", function(){
    		mockLaser.expects("destroy");
    		laser.onCollision({});
    		mockLaser.verify();
    	})
    })
});