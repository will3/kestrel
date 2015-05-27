var Block = require("./blockengine/block");
var THREE = require("THREE");

var TestBlock = function() {
	Block.call(this);
}

TestBlock.prototype = Object.create(Block.prototype);
TestBlock.prototype.constructor = TestBlock;

TestBlock.prototype.getVertices = function() {
    return [
        new THREE.Vector3(-0.4, -0.4, -0.4), //0
        new THREE.Vector3(0.4, -0.4, -0.4), //1
        new THREE.Vector3(0.4, -0.4, 0.4), //2
        new THREE.Vector3(-0.4, -0.4, 0.4), //3
        new THREE.Vector3(-0.4, 0.4, -0.4), //0
        new THREE.Vector3(0.4, 0.4, -0.4), //1
        new THREE.Vector3(0.4, 0.4, 0.4), //2
        new THREE.Vector3(-0.4, 0.4, 0.4), //3
    ];
}

module.exports = TestBlock;