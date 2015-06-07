var Block = require("./blockengine/block");
var THREE = require("THREE");

var TestBlock = function() {
    Block.call(this);
}

TestBlock.prototype = Object.create(Block.prototype);
TestBlock.prototype.constructor = TestBlock;

TestBlock.prototype.getStandardVertice = function(index) {
    switch (index) {
        case 0:
            return new THREE.Vector3(-0.45, -0.45, -0.45); //0
        case 1:
            return new THREE.Vector3(+0.45, -0.45, -0.45); //1
        case 2:
            return new THREE.Vector3(+0.45, -0.45, +0.45); //2
        case 3:
            return new THREE.Vector3(-0.45, -0.45, +0.45); //3
        case 4:
            return new THREE.Vector3(-0.45, +0.45, -0.45); //4
        case 5:
            return new THREE.Vector3(+0.45, +0.45, -0.45); //5
        case 6:
            return new THREE.Vector3(+0.45, +0.45, +0.45); //6
        case 7:
            return new THREE.Vector3(-0.45, +0.45, +0.45); //7

        default:
            throw "invalid index";
    }
};

module.exports = TestBlock;