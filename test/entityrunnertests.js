var EntityRunner = require("../app/entityrunner");
var sinon = require("sinon");
var expect = require("chai").expect;
var Entity = require("../app/entity");
var Component = require("../app/component");
var injector = require("../app/injector");
injector.loadModule(require("./testmodule"));

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
			expect(entityRunner.entities.length).to.equal(1);
		})
	})

	describe("#removeEntity", function(){
		it("should remove entity", function(){
			entityRunner.addEntity(entity);
			entityRunner.removeEntity(entity);
			expect(entityRunner.entities.length).to.equal(0);
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
			entity.frameAge = 99;
			entityRunner.run();
			expect(entity.frameAge).to.equal(100);
		})

		it("should start entity", function(){
			entityRunner.addEntity(entity);
			mockEntity.expects("start");
			entityRunner.run();
			mockEntity.verify();
		})

		it("should start component", function(){
			entityRunner.addEntity(entity);
			mockComponent.expects("start");
			entityRunner.run();
			mockComponent.verify();
		})

		it("should start childEntity", function(){
			entityRunner.addEntity(entity);
			mockChildEntity.expects("start");
			entityRunner.run();
			mockChildEntity.verify();		
		})

		it("should start child component", function(){
			entityRunner.addEntity(entity);
			mockChildComponent.expects("start");
			entityRunner.run();
			mockChildComponent.verify();
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
			childEntity.frameAge = 99;
			entityRunner.run();
			expect(childEntity.frameAge).to.equal(100);
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
})