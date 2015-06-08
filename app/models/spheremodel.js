var BlockModel = require("../blockengine/blockmodel");
var Block = require("../blockengine/block");

var SphereModel = function() {
    BlockModel.call(this, {
        halfSize : 5
    });

    for (var x = -radius; x <= radius; x++) {
        for (var y = -radius; y <= radius; y++) {
            for (var z = -radius; z <= radius; z++) {
                var xDis = Math.abs(x);
                var yDis = Math.abs(y);
                var zDis = Math.abs(z);

                var distance = Math.sqrt(xDis * xDis + yDis * yDis + zDis * zDis);

                if (Math.round(distance) > radius) {
                    continue;
                }

                this.add(x, y, z, new Block());
            }
        }
    }
}

SphereModel.prototype = Object.create(BlockModel.prototype);

module.exports = SphereModel;