var Entity = require("../entity");
var MaterialLoader = require("../materialloader");
var THREE = require("THREE");
var Block = require("./block");

var BlockCollection = function(){
	var renderComponent = null;
	var size = 1;
	var map = [[[
		//object at 0 0 0
	]]];

	var childCollections = [];

	this.type = "BlockCollection";

	var grid = new THREE.Vector3(0, 0, 0);

	var min = new THREE.Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
	var max = new THREE.Vector3(Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE);

	var visitCoords = function(callback){
		Object.keys(map).forEach(function(x){
			Object.keys(map[x]).forEach(function(y){
				Object.keys(map[x][y]).forEach(function(z){
					callback(x, y, z);
				})
			})
		})
	}

	var visitBlocks = function(callback){
		visitCoords(function(x, y, z){
			callback(map[x][y][z]);
		})
	}

	var blockCollection = {
		setGrid: function(value){ grid = value; },
		getGrid: function(){ return grid; },
		addCollection: function(value){
			childCollections.push(value);
		},
		getChildCollections: function(){
			return childCollections;
		},

		initBoundingBox: function(){
			visitCoords(function(x, y, z){
				if(x > max.x){ max.setX(x); }
				if(y > max.y){ max.setY(y); }
				if(z > max.z){ max.setZ(z); }

				if(x < min.x){ min.setX(x); }
				if(y < min.y){ min.setY(y); }
				if(z < min.z){ min.setZ(z); }
			})
		},

		getBoundingBox: function(){
			var center = new THREE.Vector3().copy(min).add(max).multiplyScalar(0.5);
			return {
				min: min,
				center: center,
				max: max
			}
		},

		addBlock: function(x, y, z){
			if(map[x] == null){
				map[x] = {};
			}

			if(map[x][y] == null){
				map[x][y] = {};
			}

			if(map[x][y][z] != null){
				throw "already something here!";
			}

			var block = new Block();
			block.setSize(size);
			block.setGrid(new THREE.Vector3(x, y, z));

			map[x][y][z] = block;
		},

		getBlock: function(x, y, z){
			var block = map[x][y][z];
			if(block == null){
				throw "nothing here";
			}
			return block;
		},

		visitBlocks: visitBlocks,

		getSize: function(){ return size; },

		getGeometry: function(parentOffset){
			var geometry = new THREE.Geometry();
			this.visitBlocks(function(block){
				var cube = block.getGeometry();
				geometry.merge(cube);
			})

			if(parentOffset == null){
				parentOffset = new THREE.Vector3(0, 0, 0);
			}

			//apply offset
			var localOffset = new THREE.Vector3().copy(grid).multiplyScalar(size);
			localOffset.add(parentOffset);

			geometry.applyMatrix(new THREE.Matrix4().makeTranslation(localOffset.x, localOffset.y, localOffset.z));

			//merge child
			this.getChildCollections().forEach(function(collection){
				var childGeometry = collection.getGeometry(localOffset);
				geometry.merge(childGeometry);
			});

			return geometry;
		},

		getMaterial: function(){
			var material = MaterialLoader.getMeshFaceMaterial("cube");
			return material;
		}
	}

	return blockCollection;
}

module.exports = BlockCollection;
