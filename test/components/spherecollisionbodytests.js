var SphereCollisionBody = require("../../app/components/spherecollisionbody");
var Entity = require("../../app/entity");
var THREE = require("THREE");
var expect = require("chai").expect;

describe("SphereCollisionBody", function(){
	describe("#hitTest", function(){
		context("against sphere", function(){
			it("should return true when colliding", function(){
				var entity1 = new Entity();
				entity1.position = new THREE.Vector3(0,0,0);
				var entity2 = new Entity();
				entity2.position = new THREE.Vector3(9,0,0);
				var sphere1 = new SphereCollisionBody(5);
				var sphere2 = new SphereCollisionBody(5);
				entity1.addComponent(sphere1);
				entity2.addComponent(sphere2);

				var hitTest = sphere1.hitTest(sphere2);

				expect(hitTest.result).to.be.true;
			});

			it("should return false when not colliding", function(){
				var entity1 = new Entity();
				entity1.position = new THREE.Vector3(0,0,0);
				var entity2 = new Entity();
				entity2.position = new THREE.Vector3(10,0,0);
				var sphere1 = new SphereCollisionBody(5);
				var sphere2 = new SphereCollisionBody(5);
				entity1.addComponent(sphere1);
				entity2.addComponent(sphere2);

				var hitTest = sphere1.hitTest(sphere2);

				expect(hitTest.result).to.be.false;
			});
		});
	});
});