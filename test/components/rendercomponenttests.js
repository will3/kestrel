var RenderComponent = require("../../app/components/RenderComponent");
var expect = require("chai").expect;
var sinon = require("sinon");
var THREE = require("THREE");
var Entity = require("../../app/entity");

var TestRenderComponent = function(){
	var testGeometry, testMaterial, testObject;
	var renderComponent = {
		setTestGeometry: function(value){ testGeometry = value; },
		setTestMaterial: function(value){ testMaterial = value; },
		setTestObject: function(value){ testObject = value; },
	};

	renderComponent.initGeometry = function(){
		return testGeometry;
	}

	renderComponent.initMaterial = function(){
		return testMaterial;
	}

	renderComponent.initObject = function(){
		return testObject;
	}

	renderComponent.updateTransform = function(){

	}

	renderComponent.__proto__ = RenderComponent();

	return renderComponent;
}

describe("Render Component", function(){
	var renderComponent, game, mockGame, material, geometry, scene, mockScene, entity, innerObject, mockRenderComponent;

	beforeEach(function(){
		material = { 
			getInnerMaterial: function(){
			return "innerMaterial";
			}
		};

		geometry = { };

		renderComponent = new TestRenderComponent();
		renderComponent.setTestMaterial(material);
		innerObject = new THREE.Object3D();
		renderComponent.setTestObject(innerObject);
		renderComponent.setTestGeometry(geometry);
		scene = {
			add: function(){ }
		};
		mockScene = sinon.mock(scene);
		game = {
			getScene: function(){
				return scene;
			}
		};
		mockGame = sinon.mock(game);
		renderComponent.setGame(game);
		entity = new Entity();
		renderComponent.setEntity(entity);
		mockRenderComponent = sinon.mock(renderComponent);
	})

	describe("start", function(){
		it("should initialize geometry", function(){
			mockRenderComponent.expects("initGeometry");
			renderComponent.start();
			mockRenderComponent.verify();
		})

		it("should initialize material", function(){
			mockRenderComponent.expects("initMaterial");
			renderComponent.start();
			mockRenderComponent.verify();
		})

		it("should initialize inner object", function(){
			mockRenderComponent.expects("initObject").withArgs(geometry, material);
			renderComponent.start();
			mockRenderComponent.verify();
		})

		it("should update transform", function(){
			mockRenderComponent.expects("updateTransform");
			renderComponent.start();
			mockRenderComponent.verify();
		})
	})
})