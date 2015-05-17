var Entity = require("../app/entity");
var Component = require("../app/component");
var expect = require("chai").expect;
var sinon = require("sinon");
var THREE = require("THREE");
var Game = require("../app/game");

describe('Entity', function(){
	var entity = null;
	var game = null;
	
	beforeEach(function(){
		entity = new Entity();
		game = Game;
	});

	describe('get transform', function(){
		it('initialize with default if empty', function(){
			entity = new Entity();

			expect(entity.getTransform()).to.not.equal(null);
		});
	});

	describe('set parent entity', function(){
		it('should throw if parent entity already exists', function(){
			entity = new Entity();
			var parent1 = new Entity();
			var parent2 = new Entity();

			entity.setParentEntity(parent1);

			expect(function(){
				entity.setParentEntity(parent2);
			}).to.throw("entity already has a parent entity");
		});
	});

	describe('add entity', function(){
		it('should set parent', function(){
			entity = new Entity();
			var child = mockEntity();
			child.expects("setParentEntity");

			entity.addEntity(child.object);

			child.verify();
		});

		it('should start child entity', function(){
			entity = new Entity();
			var child = mockEntity();
			child.expects("start");

			entity.addEntity(child.object);

			child.verify();
		});

		it('should push child entity', function(){
			entity = new Entity();
			entity.addEntity(new Entity());
			expect(entity.getChildEntities().length).to.equal(1);
		});
	});

	describe('remove entity', function(){
		it('should destroy entity and remove', function(){
			var child = mockEntity();
			var entity = entityWithChildEntity(child.object);
			child.expects("destroy");

			entity.removeEntity(child.object);

			child.verify();
		});

		it('should remove entity', function(){
			var child = mockEntity();
			var entity = entityWithChildEntity(child.object);

			entity.removeEntity(child.object);

			expect(entity.getChildEntities().length).to.equal(0);
		});
	});

	describe('add component', function(){
		it('should set entity', function(){
			var component = mockComponent();
			var entity = new Entity();

			entity.addComponent(component.object);

			expect(component.object.entity).to.equal(entity);
		});

		it('should start component', function(){
			var component = mockComponent();
			var entity = new Entity();
			component.expects("start");

			entity.addComponent(component.object);

			component.verify();
		});

		it('should add component', function(){
			var component = mockComponent();
			var entity = new Entity();

			entity.addComponent(component.object);

			expect(entity.getComponents().length).to.equal(1);
		});
	});

	describe('remove component', function(){
		it('should destroy component', function(){
			var component = mockComponent();
			entity.addComponent(component.object);
			component.expects('destroy');

			entity.removeComponent(component.object);
			
			component.verify();
		});

		it('should remove component', function(){
			var component = new Component();
			entity.addComponent(component);

			entity.removeComponent(component);

			expect(entity.getComponents().length).to.equal(0);
		});
	});

	describe('destroy', function(){
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
		});

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
	});

	describe('remove from parent', function(){
		context('has parent entity', function(){
			it('removes from parent', function(){
				var entity = new Entity();
				var parent = mockEntity();
				parent.object.addEntity(entity);
				parent.expects("removeEntity").withArgs(entity);

				entity.removeFromParent();

				parent.verify();
			});
		});

		context("doesn't have parent entity", function(){
			it('removes from Game', function(){
				var entity = new Entity();
				var mockGame = sinon.mock(game);
				mockGame.expects("removeEntity").withArgs(entity);

				entity.removeFromParent();

				mockGame.verify();
			});
		});
	});

	describe('get world position', function(){
		it('increments from parent position', function(){
			var entity = new Entity();
			var parent = new Entity();
			var grandparent = new Entity();
			grandparent.addEntity(parent);
			parent.addEntity(entity);
			grandparent.setPosition(new THREE.Vector3(300, 300, 300));
			parent.setPosition(new THREE.Vector3(20, 20, 20));
			entity.setPosition(new THREE.Vector3(1, 1, 1));

			var worldPosition = entity.getWorldPosition();

			expect(worldPosition.equals(new THREE.Vector3(321, 321, 321))).to.equal(true);
		});
	});

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
