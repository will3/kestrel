var BlockModel = require("../blockengine/blockmodel");
var Block = require("../blockengine/block");

var ShipModel = function(){
	BlockModel.call(this, 64);

	this.add(0,0,0, new Block());
	this.add(1,1,1, new Block());
	this.add(2,2,2, new Block());
}

ShipModel.prototype = Object.create(BlockModel.prototype);
ShipModel.prototype.constructor = ShipModel;

module.exports = ShipModel;