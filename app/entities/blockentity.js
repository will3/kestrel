var Entity = require("../entity");
var THREE = require("THREE");
var BlockCoord = require("../blockengine/blockcoord");

var BlockEntity = function(blockInfo) {
    Entity.call(this);

    this.block = blockInfo.block;
    this.blockCoord = new BlockCoord(blockInfo.x, blockInfo.y, blockInfo.z);
};

BlockEntity.prototype = Object.create(Entity.prototype);
BlockEntity.prototype.constructor = BlockEntity;

BlockEntity.prototype.start = function() {

};

BlockEntity.prototype.update = function() {

};

BlockEntity.prototype.setPositionFromModel = function(model) {
    var localPosition = model.getLocalPosition(this.blockCoord);
    this.position = localPosition;
};

module.exports = BlockEntity;