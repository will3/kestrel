var RenderComponent = require("../components/rendercomponent");
var THREE = require("three");
var MaterialLoader = require("../materialloader");
var CubeMaker = require("../utils/cubemaker");

var BlockRenderComponent = function(chunk){
	if(chunk == null){
		throw "no chunk specified"
	}

	var chunk = chunk;
	var cubeMaker = new CubeMaker();
	var baseSize = 2;
	
	var initGeometry = function(){

	}

	var blockRenderComponent = {
		initGeometry: function(){
			geometry = new THREE.Geometry();
			var cube = cubeMaker.build();
			geometry.merge(cube);
			chunk.visitBlocks(function(block, x, y, z){
				var cube = cubeMaker.build();
				cube.applyMatrix(new THREE.Matrix4().makeTranslation(x, y, z));
				cube.applyMatrix(new THREE.Matrix4().makeScale(2, 2, 2));
				geometry.merge(cube);
			});

			return geometry;
		},

		initMaterial: function(){
			return MaterialLoader.getSolidMaterial(new THREE.Vector4(1.0, 1.0, 1.0, 1.0));
		},

		initObject: function(geometry, material){
			return new THREE.Mesh(geometry, material);
		}
	};

	blockRenderComponent.__proto__ = RenderComponent();

	return blockRenderComponent;
}

module.exports = BlockRenderComponent;