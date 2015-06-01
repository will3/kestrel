var Block = require("../block");

var MetalBlock = function() {
    Block.call(this);

    this.color = 0xffffff;
}

MetalBlock.prototype = Object.create(Block.prototype);
MetalBlock.prototype.constructor = MetalBlock;

module.exports = MetalBlock;