var BlockModel = require("../blockengine/blockmodel");
var Block = require("../blockengine/block");

var CargoModel = function() {
    BlockModel.call(this, 8);

    for (var z = 0; z < 5; z++) {
        this.add(0, 0, z, new Block());
    }
}

CargoModel.prototype = Object.create(BlockModel.prototype);
CargoModel.prototype.constructor = CargoModel;

module.exports = CargoModel;