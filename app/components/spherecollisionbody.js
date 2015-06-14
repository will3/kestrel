var CollisionBody = require("./collisionbody");
var THREE = require("THREE");

var SphereCollisionBody = function(radius) {
    CollisionBody.call(this);

    this.type = "SphereCollisionBody";
    this.bodyType = "sphere";

    this.radius = radius;
};

SphereCollisionBody.prototype = Object.create(CollisionBody.prototype);
SphereCollisionBody.prototype.constructor = SphereCollisionBody;

SphereCollisionBody.prototype.hitTest = function(body) {
    if (body.type == "SphereCollisionBody") {
        var distanceVector = new THREE.Vector3().subVectors(this.transform.position, body.transform.position);
        var distance = distanceVector.length();
        var collisionDistance = this.radius + body.radius;

        return {
            result: (distance < collisionDistance)
        };
    }

    throw "hit test not implemented for type " + body;
};

module.exports = SphereCollisionBody;