var Component = require("../component");

var DragCamera = function(){
    Component.call(this);
};

DragCamera.prototype = Object.create(Component.prototype);
DragCamera.prototype.constructor = DragCamera;

DragCamera.prototype.start = function(){

};

DragCamera.prototype.update = function(){
    //     var yVector = new THREE.Vector3(this.target.x - this.camera.position.x, 0, this.target.z - this.camera.position.z);
    //     var m = MathUtils.getRotationMatrix(Math.PI / 2.0, 0, 0);
    //     var xVector = new THREE.Vector3();
    //     xVector.copy(yVector);
    //     xVector.applyMatrix4(m);

    //     xVector.normalize();
    //     yVector.normalize();

    //     this.target.add(xVector.multiplyScalar(xDiff / 2.0));
    //     this.target.add(yVector.multiplyScalar(yDiff / 2.0));

    //     this.updateCamera();
};

module.exports = DragCamera;
