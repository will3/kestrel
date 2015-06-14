var Entity = require("./entity");
var _ = require("lodash");
var THREE = require("THREE");
var CollisionBody = require("./components/collisionbody");

var Collision = function() {
    Entity.call(this);
}

Collision.prototype = Object.create(Entity.prototype);
Collision.prototype.constructor = Collision;

//visit collidable entities
Collision.prototype.visitCollisionBodies = function(callback) {
    var bodies = [];
    this.root.getEntities().forEach(function(entity) {
        var collisionBody = entity.getComponentOrEmpty(CollisionBody);
        if (collisionBody != null) {
            bodies.push(collisionBody);
        }
    });

    for (var i = 0; i < bodies.length; i++) {
        for (var j = 0; j < i; j++) {
            if (i == j) {
                continue;
            }

            if (bodies[i].filterFunc != null) {
                if (!bodies[i].filterFunc(bodies[j])) {
                    continue;
                }
            }

            if (bodies[j].filterFunc != null) {
                if (!bodies[j].filterFunc(bodies[i])) {
                    continue;
                }
            }

            callback(bodies[j], bodies[i]);
        }
    }
};

Collision.prototype.start = function() {

};

Collision.prototype.update = function() {
    this.visitCollisionBodies(function(a, b) {
        var hitTestResult = this.hitTest(a, b);

        if(hitTestResult == null){
            return;
        }

        if (hitTestResult.result == true) {
            this.notifyCollision(a, b, hitTestResult);
        }
    }.bind(this));
};

var shouldResolveHitTest = function(a, b){
    var type1 = a.bodyType;
    var type2 = b.bodyType;

    return type1 == type2 ||
    type1 == "block" && type2 == "sphere" ||
    type1 == "ray" && type2 == "block" ||
    type1 == "ray" && type2 == "sphere";
}

Collision.prototype.hitTest = function(a, b) {
    var hitTestResult;
    if (shouldResolveHitTest(a, b)) {
        hitTestResult = a.hitTest(b);
    } else if (shouldResolveHitTest(b, a)) {
        hitTestResult = b.hitTest(a);
    } else {
        throw "cannot resolve collisions between " + a.type + " and " + b.type;
    }
    return hitTestResult;
}

Collision.prototype.notifyCollision = function(a, b, hitTest) {
    if (a.entity.onCollision != null) {
        a.entity.onCollision(b.entity, hitTest);
    }

    if (b.entity.onCollision != null) {
        b.entity.onCollision(a.entity, hitTest);
    }
};

module.exports = Collision;