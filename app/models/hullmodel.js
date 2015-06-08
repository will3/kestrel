var BlockModel = require("../blockengine/blockmodel");
var Block = require("../blockengine/block");
var THREE = require("THREE");

var HullModel = function() {
    BlockModel.call(this, {
    	halfSize : 18
    });

    for (var x = 0; x < 17; x++) {
        for (var y = 0; y < 1; y++) {
            for (var z = 0; z < 2; z++) {
                this.add(x,  y,  z, new Block().withScale(new THREE.Vector3(1, 0.5, 1)));
            }
        }
    }
};

HullModel.prototype = Object.create(BlockModel.prototype);
HullModel.prototype.constructor = HullModel;

module.exports = HullModel;