var Collision = require('../app/collision');
var expect = require('chai').expect;
var sinon = require('sinon');
var Entity = require("../app/entity");
var RigidBody = require("../app/components/rigidbody");
var THREE = require("THREE");

describe("Collision", function(){
	var collision, mockCollision, game, entities;

	beforeEach(function(){
		collision = new Collision();
		mockCollision = sinon.mock(collision);
		entities = [];
		game = {
			getEntities: function(){
				return entities;
			}
		};
		collision.game = game;
	})

	describe("#update", function(){
		// it("should visit colliable objects and perform hit tests", function(){
		// 	entities = [createCollidable(), createCollidable()];
		// 	mockCollision.expects("hitTest").once();
		// 	collision.update();
		// 	mockCollision.verify();
		// })

		it("should ignore non colliable objects", function(){
			entities = [createNonColliable(), createNonColliable()];
			mockCollision.expects("hitTest").never();
			collision.update();
			mockCollision.verify();
		})

		// it("should notify collision when hit test returns true", function(){
		// 	collision.hitTest = function(){
		// 		return true;
		// 	}

		// 	var entity1 = createCollidable(null, null, true);
		// 	var entity2 = createCollidable(null, null, true);
		// 	entities = [entity1, entity2];
		// 	var mockEntity1 = sinon.mock(entity1);
		// 	var mockEntity2 = sinon.mock(entity2);
		// 	mockEntity1.expects("onCollision");
		// 	mockEntity2.expects("onCollision");

		// 	collision.update();

		// 	mockEntity1.verify();
		// 	mockEntity2.verify();
		// })
	})

	describe("#hitTest", function(){
		// it("should return true when collision radiuses just overlap", function(){
		// 	var entity1 = createCollidable(new THREE.Vector3(100, 0, 0), 50);
		// 	var entity2 = createCollidable(new THREE.Vector3(0, 0, 0), 50);

		// 	expect(collision.hitTest(entity1, entity2)).to.equal(true);
		// })

		// it("should return true when collision radiuses overlap", function(){
		// 	var entity1 = createCollidable(new THREE.Vector3(50, 0, 0), 50);
		// 	var entity2 = createCollidable(new THREE.Vector3(0, 0, 0), 50);

		// 	expect(collision.hitTest(entity1, entity2)).to.equal(true);
		// })

		// it("should return false when collision radius don't overlap", function(){
		// 	var entity1 = createCollidable(new THREE.Vector3(101, 0, 0), 50);
		// 	var entity2 = createCollidable(new THREE.Vector3(0, 0, 0), 50);

		// 	expect(collision.hitTest(entity1, entity2)).to.equal(false);
		// })
	})

	//creates a collidable entity
	//position: if not null, set position of entity
	//collisionradius: if not null, set collision radius of rigid body
	function createCollidable(position, collisionRadius, hasOnCollision){
		var entity = new Entity();

		if(position != null){
			entity.position = position;
		}

		entity.collisionBody = {

		}

		if(hasOnCollision == true){
			entity.onCollision = function(){ };
		}

		return entity;
	}

	function createNonColliable(){
		var entity = new Entity();
		entity.hasCollision = function(){
			return false;
		}

		return entity;
	}
});