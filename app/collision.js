var Entity = require("./entity");
var _ = require("lodash");
var THREE = require("THREE");
var Game = require("./game");

var Collision = function() {
    Entity.call(this);

    this.game = null;
}

Collision.prototype = Object.create(Entity.prototype);
Collision.prototype.constructor = Collision;

//visit collidable entities
Collision.prototype.visitEntities = function(callback) {
    var entities = _.filter(this.game.getEntities(), function(entity) {
        return entity.collisionBody != null;
    });

    for (var i = 0; i < entities.length; i++) {
        for (var j = 0; j < i; j++) {
            if (i == j) {
                continue;
            }

            if (entities[i].collisionFilter != null) {
                if (!entities[i].collisionFilter(entities[j])) {
                    continue;
                }
            }

            if (entities[j].collisionFilter != null) {
                if (!entities[j].collisionFilter(entities[i])) {
                    continue;
                }
            }

            callback(entities[i], entities[j]);
        }
    }
};

Collision.prototype.hitTest = function(a, b) {
    if (a.type == 'sphere' && b.type == 'sphere') {
        return this.hitTestSphereAndSphere(a, b);
    } else if (a.type == 'sphere' && b.type == 'block') {
        return this.hitTestSphereAndBlock(a, b);
    } else if (a.type == 'block' && b.type == 'sphere') {
        return this.hitTestSphereAndBlock(b, a);
    } else if (a.type == 'block' && b.type == 'block') {
        return this.hitTestBlockAndBlock(a, b);
    }

    throw "cannot resolve collisions between " + body_a.type + " and " + body_b.type;
};

Collision.prototype.hitTestSphereAndSphere = function(sphere1, sphere2) {
    var distanceVector = new THREE.Vector3();
    distanceVector.subVectors(sphere1.getPosition(), sphere2.getPosition());
    var distance = distanceVector.length();
    if (distance == 0) {
        distanceVector = new THREE.Vector3(Math.random(), Math.random(), Math.random());
        distanceVector.setLength(1);
        distance = 1;
    }

    var collisionDistance = sphere1.radius + sphere2.radius;

    return (distance <= collisionDistance);
};

Collision.prototype.hitTestSphereAndBlock = function(sphere, block) {
    var velocity = sphere.getVelocity();

    var testInterval = Math.ceil(velocity.length() * 0.5);
    var interval = new THREE.Vector3().copy(velocity).multiplyScalar(1 / testInterval);

    var position = new THREE.Vector3().copy(sphere.getPosition());
    for (var i = 0; i < testInterval; i++) {
        var hitTest = block.hitTest(position, sphere.radius);
        if(hitTest.result){
            return hitTest;
        }
        position.add(interval);
    }

    return false;
};

Collision.prototype.hitTestBlockAndBlock = function(block1, block2) {
    return false;
};

Collision.prototype.start = function() {

};

Collision.prototype.update = function() {
    this.visitEntities(function(a, b) {
        var hitTest = this.hitTest(a.collisionBody, b.collisionBody);

        //wrap result if hitTest returns primitive
        if (hitTest === true || hitTest === false) {
            hitTest = {
                result: hitTest
            };
        }

        if (hitTest.result) {
            if (a.onCollision != null) {
                a.onCollision(b, hitTest);
            }

            if (b.onCollision != null) {
                b.onCollision(a, hitTest);
            }
        }
    }.bind(this));
};

module.exports = Collision;