var EntityRunner = require("../app/entityRunner");
var sinon = require("sinon");
var expect = require("chai").expect;
var Entity = require("../app/entity");
var Component = require("../app/component");

describe("EntityRunner", function(){
	var entityRunner, entity, mockEntity, component, mockComponent,
		childEntity, mockChildEntity, childComponent, mockChildComponent, mockEntityRunner;

	beforeEach(function(){
		entityRunner = new EntityRunner();
		entity = new Entity();
		mockEntity = sinon.mock(entity);
		component = new Component();
		mockComponent = sinon.mock(component);
		entity.addComponent(component);
		childEntity = new Entity();
		mockChildEntity = sinon.mock(childEntity);
		childComponent = new Component();
		mockChildComponent = sinon.mock(childComponent);
		childEntity.addComponent(childComponent);
		entity.addEntity(childEntity);
		childEntityNew = new Entity();
		mockChildEntityNew = sinon.mock(childEntityNew);
		componentNew = new Component();
		mockComponentNew = sinon.mock(componentNew);
		mockEntityRunner = sinon.mock(entityRunner);
	})

	describe("#addEntity", function(){
		it("should push entity", function(){
			entityRunner.addEntity(entity);
			expect(entityRunner.getEntities().length).to.equal(1);
		})

		it("should start entity", function(){
			mockEntity.expects("start");
			entityRunner.addEntity(entity);
			mockEntity.verify();
		})

		it("should start component", function(){
			mockComponent.expects("start");
			entityRunner.addEntity(entity);
			mockComponent.verify();
		})

		it("should start childEntity", function(){
			mockChildEntity.expects("start");
			entityRunner.addEntity(entity);
			mockChildEntity.verify();		
		})

		it("should start child component", function(){
			mockChildComponent.expects("start");
			entityRunner.addEntity(entity);
			mockChildComponent.verify();
		})

		it("should subsribe to entity changes", function(){
			mockEntity.expects("onAddEntity").withArgs(entityRunner.onAddEntity);
			mockEntity.expects("onRemoveEntity").withArgs(entityRunner.onRemoveEntity);
			mockEntity.expects("onAddComponent").withArgs(entityRunner.onAddComponent);
			mockEntity.expects("onRemoveComponent").withArgs(entityRunner.onRemoveComponent);

			entityRunner.addEntity(entity);
			mockEntity.verify();
		});
	})

	describe("#removeEntity", function(){
		it("should remove entity", function(){
			entityRunner.addEntity(entity);
			entityRunner.removeEntity(entity);
			expect(entityRunner.getEntities().length).to.equal(0);
		})

		it("should destroy entity", function(){
			entityRunner.addEntity(entity);
			mockEntity.expects("destroy");
			entityRunner.removeEntity(entity);
			mockEntity.verify();
		})
	})

	describe("#run", function(){
		it("should increment entity frame age", function(){
			entityRunner.addEntity(entity);
			entity.setFrameAge(99);
			entityRunner.run();
			expect(entity.getFrameAge()).to.equal(100);
		})

		it("should update entity", function(){
			entityRunner.addEntity(entity);
			mockEntity.expects("update");
			entityRunner.run();
			mockEntity.verify();
		})

		it("should update component", function(){
			entityRunner.addEntity(entity);
			mockComponent.expects("update");
			entityRunner.run();
			mockComponent.verify();
		})

		it("should increment child entity frame age", function(){
			entityRunner.addEntity(entity);
			childEntity.setFrameAge(99);
			entityRunner.run();
			expect(childEntity.getFrameAge()).to.equal(100);
		})

		it("should update child entity", function(){
			entityRunner.addEntity(entity);
			mockChildEntity.expects("update");
			entityRunner.run();
			mockChildEntity.verify();
		})

		it("should update child component", function(){
			entityRunner.addEntity(entity);
			mockChildComponent.expects("update");
			entityRunner.run();
			mockChildComponent.verify();
		})
	})

	describe("#onAddEntity", function(){
		it("should start entity", function(){
			mockEntity.expects("start");
			entityRunner.onAddEntity(entity);
			mockEntity.verify();
		})
	})

	describe("#onRemoveEntity", function(){
		it("should destroy entity", function(){
			mockEntity.expects("destroy");
			entityRunner.onRemoveEntity(entity);
			mockEntity.verify();
		})
	})

	describe("#onAddComponent", function(){
		it("should start component", function(){
			mockComponent.expects("start");
			entityRunner.onAddComponent(component);
			mockComponent.verify();
		})
	})

	describe("#onRemoveComponent", function(){
		it("should destroy component", function(){
			mockComponent.expects("destroy");
			entityRunner.onRemoveComponent(component);
			mockComponent.verify();
		})
	})
})