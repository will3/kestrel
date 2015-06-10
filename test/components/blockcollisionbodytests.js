var BlockCollisionBody = require("../../app/components/blockcollisionbody");
var BlockModel = require("../../app/blockengine/blockmodel");
var Entity = require("../../app/entity");
var RigidBody = require("../../app/components/rigidbody");
var sinon = require("sinon");
var expect = require("chai").expect;
var SphereCollisionBody = require("../../app/components/spherecollisionbody");
var THREE = require("THREE");
var Block = require("../../app/blockengine/block");

describe("BlockCollisionBody", function() {
    var model, body, entity, sphereRigidBody, mockBody, sphere, sphereEntity;
    beforeEach(function() {
        model = new BlockModel({
            halfSize: 512
        });
        body = new BlockCollisionBody(model);
        entity = new Entity();
        sphereRigidBody = new RigidBody();
        entity.addComponent(body);
        mockBody = sinon.mock(body);
        sphere = new SphereCollisionBody(5);
        sphereEntity = new Entity();
        sphereEntity.addComponent(sphere);
        sphereEntity.addComponent(sphereRigidBody);
    });

    describe("#hitTest", function() {
        context("against sphere", function() {
            it("should intepolate sphere velocity", function() {
                body.velocityIteration = 1;
                sphereRigidBody.velocity = new THREE.Vector3(5, 0, 0);
                var count = 0;
                body.hitTestSphere = function(){
                	count ++;
                	return{
                		result: false
                	};
                };

                body.hitTest(sphere);
                
                expect(count).to.equal(5);
            });
        });
    });

    describe("#hitTestSphere", function(){
    	it("should visit block chunk and test", function(){
    		model.add(2,2,2, new Block());

    		var result = body.hitTest(sphere);
    		
    	});
    });
});