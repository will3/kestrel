var Component = require("../component");

var RotateCamera = function(){
    Component.call(this);
};

RotateCamera.prototype = Object.create(Component.prototype);
RotateCamera.prototype.constructor = RotateCamera;

RotateCamera.prototype.start = function(){
  // rotateCamera: function(xDiff, yDiff) {
    //     this.cameraRotation.y += -xDiff * 0.01;
    //     this.cameraRotation.x += yDiff * 0.01;

    //     if (this.cameraRotation.x > Math.PI / 2.0) {
    //         this.cameraRotation.x = Math.PI / 2.0;
    //     } else if (this.cameraRotation.x < -Math.PI / 2.0) {
    //         this.cameraRotation.x = -Math.PI / 2.0;
    //     }

    //     this.updateCamera();
    // },
};

RotateCamera.prototype.update = function(){

};

module.exports = RotateCamera;