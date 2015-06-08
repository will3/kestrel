var Block = require("../blockengine/block");
var THREE = require("THREE");

var EngineBlock = function(direction) {
    Block.call(this);

    this.type = "EngineBlock";
    this.blockType = "engine";

    this.setColor(new THREE.Color(0.8, 0.8, 0.8));
    this.scale = new THREE.Vector3(1.2, 1.2, 1.2);
    this.direction = direction;
    this.power = 3;
};

EngineBlock.prototype = Object.create(Block.prototype);
EngineBlock.prototype.constructor = EngineBlock;

module.exports = EngineBlock;