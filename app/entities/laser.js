var Ammo = require("./ammo");
var THREE = require("THREE");
var PointSprite = require("./pointsprite");
var RigidBody = require("../components/rigidbody");
var assert = require("assert");
var MathUtils = require("../mathutils");
var SphereCollisionBody = require("../components/spherecollisionbody");

var Laser = function() {
    Ammo.call(this);

    this.rigidBody = new RigidBody({
        defaultFriction: 1,
    });

    this.collisionBody = new SphereCollisionBody(2);
    this.collisionBody.filter(function(entity) {
        if (entity == this.actor) {
            return false;
        }

        if (entity instanceof Ammo) {
            return false;
        }

        return true;
    }.bind(this));
    this.addComponent(this.collisionBody);

    this.velocity = null;
    this.speed = 16;
}

Laser.prototype = Object.create(Ammo.prototype);
Laser.prototype.constructor = Laser;

Laser.prototype.createInstance = function() {
    return new Laser();
};

Laser.prototype.initPointVelocity = function() {
    var velocity = new THREE.Vector3().subVectors(this.point, this.actor.worldPosition);
    velocity.setLength(this.speed);
    this.velocity = velocity;
};

Laser.prototype.initTargetVelocity = function() {
    var distanceVector = new THREE.Vector3().subVectors(this.target.worldPosition, this.actor.worldPosition);
    var distance = distanceVector.length();
    var time = distance / this.speed;

    var projectedTargetPosition = new THREE.Vector3().addVectors(
        this.target.worldPosition,
        new THREE.Vector3().copy(this.target.rigidBody.velocity).multiplyScalar(time)
    );

    var velocity = new THREE.Vector3().subVectors(projectedTargetPosition, this.actor.worldPosition);

    if (velocity.length() == 0) {
        velocity = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
    }

    velocity.setLength(this.speed);

    this.velocity = velocity;
};

Laser.prototype.start = function() {
    assert(this.actor != null, "actor cannot be empty");

    this.life = 200;

    if (this.point != null) {
        this.initPointVelocity();
    } else if (this.target != null) {
        this.initTargetVelocity();
    }

    this.addComponent(this.rigidBody);
    this.rigidBody.velocity = this.velocity;

    var startPosition = new THREE.Vector3();
    startPosition.copy(this.velocity);
    startPosition.multiplyScalar(1);

    this.position.add(startPosition);

    this.createSprites();
};

Laser.prototype.createSprites = function(time) {
    var power = 4;
    var num = 4;

    for (var i = 0; i < num; i++) {
        this.addEntity(this.createSprite(
            power * (num - i) / num, -i / this.speed * 4,
            this.life));
    }
};

Laser.prototype.createSprite = function(size, offset, life) {
    var sprite = new PointSprite();

    sprite.size = size;
    sprite.life = life;

    var sizeOverTime = function(time) {
        var remainingLife = this.life - time;
        if (remainingLife < 50) {
            return this.size *= 0.95;
        }
        return this.size;
    }.bind({
        size: size,
        life: life
    });

    sprite.sizeOverTime(sizeOverTime);

    var position = new THREE.Vector3();

    position.copy(this.velocity);
    position.multiplyScalar(offset);
    sprite.position = position;

    return sprite;
};

Laser.prototype.onCollision = function(entity) {
    if (entity == this.actor) {
        return;
    }

    if (entity instanceof Ammo) {
        return;
    }

    this.removeFromParent();
};

module.exports = Laser;