var BlockMaker = require("../blockengine/blockmaker");
var THREE = require("THREE");
var CubeMaker = require("../blockengine/cubeMaker");

var BlockShipBluePrint = function(){
	var hull = null;
	var blockMaker = new BlockMaker();
	var cubeMaker = new CubeMaker();
	
	var getHull = function(){
		if(hull != null){
			return hull;
		}

		var range = {
				xRange: [0, 17],
				yRange: [0, 1],
				zRange: [0, 2],
			}

		hull = blockMaker.createNew().map(range).scale(range, new THREE.Vector3(1, 0.5, 1)).make();

		hull.addCollection(getCargo().translate(new THREE.Vector3(6, 0, -3)).make());
		hull.addCollection(getCargo().translate(new THREE.Vector3(8, 0, -3)).make());
		hull.addCollection(getCargo().translate(new THREE.Vector3(10, 0, -3)).make());

		hull.addCollection(getWeapon().translate(new THREE.Vector3(3, 0 , -1)).make());
		hull.addCollection(getWeapon().translate(new THREE.Vector3(13, 0 , -1)).make());

		hull.initBoundingBox();
		var boundingBox = hull.getBoundingBox();
		hull.setGrid(new THREE.Vector3().copy(boundingBox.center).multiplyScalar(-1));

		return hull;
	}

	var getCargo = function(){
		var range = {
			xRange: [0, 1],
			yRange: [0 ,1],
			zRange: [0, 6]
		}

		var cargo = blockMaker.createNew().map(range);

		return cargo;
	}

	var getWeapon = function(){
		var range = {
			xRange: [0, 1],
			yRange: [0, 1],
			zRange: [0, 6]
		}

		var weapon = blockMaker.createNew().map(range);

		// return ;

		blockMaker.visit(range, function(x, y, z, block){
			if(z < 3){
				return;
			}

			var index = 6 - z;
			var slope = 1 / (6 - 3);
			var scale = index * slope;

			block.setScale(new THREE.Vector3(scale, scale, 1.0));
		});


		return weapon;
	}

	return {
		build: function(){
			return getHull();
		}
	}
}

module.exports = BlockShipBluePrint;