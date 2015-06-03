var Entity = require("../app/entity");
var Component = require("../app/component");
var expect = require("chai").expect;
var sinon = require("sinon");
var THREE = require("THREE");
var RigidBody = require("../app/components/rigidbody");

describe('Entity', function(){
	var entity = null;
	
	beforeEach(function(){
		entity = new Entity();
	})

	describe('#getTransform', function(){
		it('initialize with default if empty', function(){
			entity = new Entity();

			expect(entity.transform).to.not.equal(null);
		})
	})

	describe('#addEntity', function(){
		it('should set parent', function(){
			entity = new Entity();
			var child = new Entity();

			entity.addEntity(child);

			expect(child.parent).to.equal(entity);
		})

		it('should push child entity', function(){
			entity = new Entity();
			entity.addEntity(new Entity());
			expect(entity.childEntities.length).to.equal(1);
		})

		it('should throw if entity already has parent', function(){
			entity = new Entity();
			var child = new Entity();
			var parent = new Entity();
			parent.addEntity(child);
			expect(function(){
				entity.addEntity(child);
			}).to.throw("entity already has a parent entity");
		})
	})

	describe('#removeEntity', function(){
		it('should destroy entity and remove', function(){
			var child = mockEntity();
			var entity = entityWithChildEntity(child.object);
			child.expects("destroy");

			entity.removeEntity(child.object);

			child.verify();
		})

		it('should remove entity', function(){
			var child = mockEntity();
			var entity = entityWithChildEntity(child.object);

			entity.removeEntity(child.object);

			expect(entity.childEntities.length).to.equal(0);
		})
	})

	describe('#addComponent', function(){
		it('should set entity', function(){
			var component = new Component();
			var entity = new Entity();

			entity.addComponent(component);

			expect(component.entity).to.equal(entity);
		})

		it('should add component', function(){
			var component = new Component();
			var entity = new Entity();

			entity.addComponent(component);

			expect(entity.components.length).to.equal(1);
		})
	})

	describe('#removeComponent', function(){
		it('should destroy component', function(){
			var component = mockComponent();
			entity.addComponent(component.object);
			component.expects('destroy');

			entity.removeComponent(component.object);
			
			component.verify();
		})

		it('should remove component', function(){
			var component = new Component();
			entity.addComponent(component);

			entity.removeComponent(component);

			expect(entity.components.length).to.equal(0);
		})
	})

	describe('#destroy', function(){
		it('should destroy components', function(){
			var component1 = mockComponent();
			var component2 = mockComponent();
			var entity = new Entity();
			entity.addComponent(component1.object);
			entity.addComponent(component2.object);
			component1.expects("destroy");
			component2.expects("destroy");

			entity.destroy();

			component1.verify();
			component2.verify();
		})

		it('should destroy child entities', function(){
			var entity1 = mockEntity();
			var entity2 = mockEntity();
			var entity = new Entity();
			entity.addEntity(entity1.object);
			entity.addEntity(entity2.object);
			entity1.expects("destroy");
			entity2.expects("destroy");

			entity.destroy();

			entity1.verify();
			entity2.verify();
		})
	})

	describe("#getWorldPosition", function(){
		it("should increment from parent position", function(){
			var entity = new Entity();
			var parent = new Entity();
			var grandparent = new Entity();
			grandparent.addEntity(parent);
			parent.addEntity(entity);
			grandparent.position = new THREE.Vector3(300, 300, 300);
			parent.position = new THREE.Vector3(20, 20, 20);
			entity.position = new THREE.Vector3(1, 1, 1);

			var worldPosition = entity.worldPosition;

			expect(worldPosition.equals(new THREE.Vector3(321, 321, 321))).to.be.true;
		})
	})

	function mockEntity(){
		return sinon.mock(new Entity());
	};

	function mockComponent(){
		return sinon.mock(new Component());
	}

	function entityWithChildEntity(childEntity){
		var entity = new Entity();
		entity.addEntity(childEntity);
		return entity;
	}
});
