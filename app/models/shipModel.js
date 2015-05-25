var Component = require("../component");
var BlockChunk = require("../blockengine/blockchunk");
var Block = require("../blockengine/block");
var BlockRange = require("../blockengine/blockrange");
var BlockCoord = require("../blockengine/blockcoord");
var Model = require("./model");

var ShipModel = function(){
	var getHull = function(){
		var chunk = new BlockChunk();
		var range = new BlockRange(
			new BlockCoord(0, 0, 0),
			new BlockCoord(17, 1, 2)
			)

		range.visit(function(x, y, z){
			chunk.addBlock(new BlockCoord(x, y, z), new Block());
		})

		return chunk;
	}

	var getCargo = function(){
		var chunk = new BlockChunk();
		var range = new BlockRange(
			new BlockCoord(0, 0, 0),
			new BlockCoord(1, 1, 6)
			)
		range.visit(function(x, y, z){
			chunk.addBlock(new BlockCoord(x, y, z), new Block());
		})

		return chunk;
	}

	var getWeapon = function(){
		var chunk = new BlockChunk();
		var range = new BlockRange(
			new BlockCoord(0, 0 ,0),
			new BlockCoord(1, 1, 6)
			)
		range.visit(function(x, y, z){
			chunk.addBlock(new BlockCoord(x, y, z), new Block());
		})

		return chunk;
	}

	var shipModel = {
		getChunk: function(){
			var hull = getHull();
			var cargo1 = getCargo();
			var cargo2 = getCargo();
			var cargo3 = getCargo();
			var weapon1 = getWeapon();
			var weapon2 = getWeapon();
			
			return hull;
		}
	}

	shipModel.__proto__ = Model();

	return shipModel;
}

module.exports = ShipModel;