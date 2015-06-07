var BlockModel = require("../blockengine/blockmodel");
var Block = require("../blockengine/block");
var THREE = require("THREE");

var WeaponModel = function() {
    BlockModel.call(this, {
        halfSize: 8
    });

    for (var z = 0; z < 6; z++) {
        if (z == 3) {
            this.add(0, 0, z, new Block().withScale(new THREE.Vector3(0.75, 0.75, 1)));
        } else if (z == 4) {
            this.add(0, 0, z, new Block().withScale(new THREE.Vector3(0.50, 0.50, 1)));
        } else if (z == 5) {
            this.add(0, 0, z, new Block().withScale(new THREE.Vector3(0.25, 0.25, 1)));
        } else {
            this.add(0, 0, z, new Block());
        }
    }
}

WeaponModel.prototype = Object.create(BlockModel.prototype);
WeaponModel.prototype.constructor = WeaponModel;

module.exports = WeaponModel;