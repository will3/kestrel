var Component = require("../component");

var CollisionBody = function() {
    Component.call(this);

    this.type = "CollisionBody";
    this.bodyType = null;

    this.filterFunc = null;
};

CollisionBody.prototype = Object.create(Component.prototype);
CollisionBody.prototype.constructor = CollisionBody;

CollisionBody.prototype.filter = function(filterFunc) {
    this.filterFunc = filterFunc;
};

CollisionBody.prototype.hitTest = function() {
    throw "must override";
};

Object.defineProperty(CollisionBody.prototype, "velocity", {
    get: function() {
        var rigidBody = this.getComponentOrEmpty("RigidBody");
        if (rigidBody == null) {
            return null;
        }

        return rigidBody.velocity;
    }
});

module.exports = CollisionBody;