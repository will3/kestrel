var RenderComponent = require("../../app/components/rendercomponent");
var expect = require("chai").expect;
var sinon = require("sinon");
var THREE = require("THREE");
var Entity = require("../../app/entity");

describe("Render Component", function(){
	var renderComponent, game, mockGame, material, geometry, 
		scene, mockScene, entity, innerObject, mockRenderComponent;

	beforeEach(function(){
		material = { };

		geometry = { };

		renderComponent = new RenderComponent();
		renderComponent.initGeometry = function(){
			return geometry;
		}

		renderComponent.initMaterial = function(){
			return material;
		}

		innerObject = new THREE.Object3D();

		renderComponent.initObject = function(geometry, material){
			return innerObject;
		}

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
		renderComponent.game = game;
		entity = new Entity();
		renderComponent.entity = entity;
		mockRenderComponent = sinon.mock(renderComponent);
	});

	describe("#update transform", function(){
		it("should update inner object position", function(){
			entity.position = new THREE.Vector3(100, 100, 100);
			renderComponent.initObject = function(){ return innerObject; };
			renderComponent.start();
			renderComponent.updateTransform(entity);
			expect(innerObject.position.equals(new THREE.Vector3(100, 100, 100))).to.equal(true);
		})

		// it("should update inner object rotation", function(){
		// 	entity.rotation = new THREE.Vector3(1, 1, 1);
		// 	renderComponent.initObject = function(){ return innerObject; };
		// 	renderComponent.start();
		// 	renderComponent.updateTransform(entity);
			
		// 	expectFloatEquals(innerObject.rotation.x, 1.2368);
		// 	expectFloatEquals(innerObject.rotation.y, 0.4719);
		// 	expectFloatEquals(innerObject.rotation.z, 0.0810);
		// 	expect(innerObject.rotation.order).to.equal("XYZ");
		// })

		it("should update inner object scale", function(){
			entity.scale = new THREE.Vector3(4, 4, 4);
			renderComponent.initObject = function(){ return innerObject; };
			renderComponent.start();
			renderComponent.updateTransform(entity);
			expect(innerObject.scale.equals(new THREE.Vector3(4, 4, 4)));
		});
	});
});