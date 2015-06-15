var Entity = require("../entity");
var THREE = require("THREE");
var BlockCoord = require("../blockengine/blockcoord");

var BlockEntity = function(params) {
    Entity.call(this);

    params = params || null;

    this.block = params.block;
    this.blockCoord = new BlockCoord(params.x, params.y, params.z);
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
