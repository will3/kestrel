var Component = require("../component");
var THREE = require("THREE");

var RigidBody = function(params) {
    Component.call(this);

    this.velocity = new THREE.Vector3();
    this.acceleration = new THREE.Vector3();
    this.friction = 0.98;

    if (params == null) {
        params = {};
    }

    this.defaultFriction = params.defaultFriction || 0.98;
};

RigidBody.prototype = Object.create(Component.prototype);
RigidBody.prototype.constructor = RigidBody;

RigidBody.prototype.start = function() {
    this.friction = this.defaultFriction;
};

RigidBody.prototype.update = function() {
    this.velocity.add(this.acceleration);
    this.velocity.multiplyScalar(this.friction);
    this.transform.position.add(this.velocity);

    this.acceleration.set(0, 0, 0);
    this.friction = this.defaultFriction;
};

RigidBody.prototype.applyForce = function(force) {
    this.acceleration.add(force);
};

RigidBody.prototype.applyFriction = function(friction) {
    this.friction *= friction;
};

module.exports = RigidBody;