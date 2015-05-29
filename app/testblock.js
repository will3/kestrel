var Block = require("./blockengine/block");
var THREE = require("THREE");

var TestBlock = function() {
    Block.call(this);
}

TestBlock.prototype = Object.create(Block.prototype);
TestBlock.prototype.constructor = TestBlock;

TestBlock.prototype.getVertice = function(index) {
    switch (index) {
        case 0:
            return new THREE.Vector3(this.x - 0.4, this.y - 0.4, this.z - 0.4); //0
        case 1:
            return new THREE.Vector3(this.x + 0.4, this.y - 0.4, this.z - 0.4); //1
        case 2:
            return new THREE.Vector3(this.x + 0.4, this.y - 0.4, this.z + 0.4); //2
        case 3:
            return new THREE.Vector3(this.x - 0.4, this.y - 0.4, this.z + 0.4); //3
        case 4:
            return new THREE.Vector3(this.x - 0.4, this.y + 0.4, this.z - 0.4); //4
        case 5:
            return new THREE.Vector3(this.x + 0.4, this.y + 0.4, this.z - 0.4); //5
        case 6:
            return new THREE.Vector3(this.x + 0.4, this.y + 0.4, this.z + 0.4); //6
        case 7:
            return new THREE.Vector3(this.x - 0.4, this.y + 0.4, this.z + 0.4); //7

        default:
            throw "invalid index";
    }
};

module.exports = TestBlock;