var Component = require("../component");
var THREE = require("THREE");

var TransformComponent = function() {
    Component.call(this);

    this.position = new THREE.Vector3();
    this.rotation = new THREE.Euler();
    this.rotation.order = 'YXZ';
    this.scale = new THREE.Vector3(1, 1, 1);
}

TransformComponent.prototype = Object.create(Component.prototype);
TransformComponent.prototype.constructor = TransformComponent;

Object.defineProperty(TransformComponent.prototype, "quaternion", {
    get: function() {
        return new THREE.Quaternion().setFromEuler(this.rotation);
    }
});

module.exports = TransformComponent;