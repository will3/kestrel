var BlockModel = require("../blockengine/blockmodel");
var Block = require("../blockengine/block");
var BlockCoord = require("../blockengine/blockcoord");
var TestBlock = require("../testblock");
var THREE = require("THREE");

var ShipModel = function() {
    BlockModel.call(this, 64);

    this.gridSize = 2;

    this.addHull(0, 0, 0);

    this.addWeapon(3, 0, -1);
    this.addCargo(6, 0, -3);
    this.addCargo(8, 0, -3);
    this.addCargo(10, 0, -3);
    this.addWeapon(13, 0, -1);

    this.center();
}

ShipModel.prototype = Object.create(BlockModel.prototype);
ShipModel.prototype.constructor = ShipModel;

ShipModel.prototype.addHull = function(startX, startY, startZ) {
    for (var x = 0; x < 17; x++) {
        for (var y = 0; y < 1; y++) {
            for (var z = 0; z < 2; z++) {
                this.add(startX + x, startY + y, startZ + z, new Block().withScale(new THREE.Vector3(1, 0.5, 1)));
            }
        }
    }
};

ShipModel.prototype.addCargo = function(startX, startY, startZ) {
    for (var z = 0; z < 6; z++) {
        this.add(startX, startY, startZ + z, new Block());
    }
};

ShipModel.prototype.addWeapon = function(startX, startY, startZ) {
    for (var z = 0; z < 6; z++) {
        if (z == 3) {
            this.add(startX, startY, startZ + z, new Block().withScale(new THREE.Vector3(0.75, 0.75, 1)));
        } else if (z == 4) {
            this.add(startX, startY, startZ + z, new Block().withScale(new THREE.Vector3(0.50, 0.50, 1)));
        } else if (z == 5) {
            this.add(startX, startY, startZ + z, new Block().withScale(new THREE.Vector3(0.25, 0.25, 1)));
        } else {
            this.add(startX, startY, startZ + z, new Block());
        }
    }
}

module.exports = ShipModel;

// var ShipModel = function(){
// 	var getHull = function(){
// 		var chunk = new BlockChunk();
// 		var range = new BlockRange(
// 			new BlockCoord(0, 0, 0),
// 			new BlockCoord(17, 1, 2)
// 			)

// 		range.visit(function(x, y, z){
// 			chunk.addBlock(new BlockCoord(x, y, z), new Block());
// 		})

// 		return chunk;
// 	}

// 	var getCargo = function(){
// 		var chunk = new BlockChunk();
// 		var range = new BlockRange(
// 			new BlockCoord(0, 0, 0),
// 			new BlockCoord(1, 1, 6)
// 			)
// 		range.visit(function(x, y, z){
// 			chunk.addBlock(new BlockCoord(x, y, z), new Block());
// 		})

// 		return chunk;
// 	}

// 	var getWeapon = function(){
// 		var chunk = new BlockChunk();
// 		var range = new BlockRange(
// 			new BlockCoord(0, 0 ,0),
// 			new BlockCoord(1, 1, 6)
// 			)
// 		range.visit(function(x, y, z){
// 			chunk.addBlock(new BlockCoord(x, y, z), new Block());
// 		})

// 		return chunk;
// 	}

// 	var shipModel = {
// 		getChunk: function(){
// 			var hull = getHull();
// 			var cargo1 = getCargo();
// 			var cargo2 = getCargo();
// 			var cargo3 = getCargo();
// 			var weapon1 = getWeapon();
// 			var weapon2 = getWeapon();

// 			return hull;
// 		}
// 	}

// 	shipModel.__proto__ = Model();

// 	return shipModel;
// }

// module.exports = ShipModel;