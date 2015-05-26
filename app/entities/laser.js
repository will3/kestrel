var Ammo = require("./ammo");
var THREE = require("THREE");
var PointSprite = require("./pointsprite");
var RigidBody = require("../components/rigidbody");

var Laser = function() {
    Ammo.call(this);

    this.rigidBody = null;
    this.velocity = null;
}

Laser.prototype = Object.create(Ammo.prototype);
Laser.prototype.constructor = Laser;

Laser.prototype.createSprite = function(size, offset, life) {
    var sprite = new PointSprite();

    sprite.setSize(size);
    sprite.setLife(life);

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
    sprite.setPosition(position);

    return sprite;
};

Laser.prototype.createInstance = function() {
    return new Laser();
};

Laser.prototype.initVelocity = function() {
    var actor = this.getActor();
    var target = this.getTarget();

    if (actor == null || target == null) {
        throw "actor or target cannot be null";
    }

    var velocity = new THREE.Vector3();
    velocity.subVectors(target.getWorldPosition(), actor.getWorldPosition());
    velocity.setLength(4);

    this.velocity = velocity;
};

Laser.prototype.start = function() {
    assert(this.rigidBody != null, "rigidBody cannot be empty");

    this.setLife(200);

    this.initVelocity();
    transform = this.getTransform();

    this.addComponent(this.getRigidBody());
    this.getRigidBody().setVelocity(this.velocity);

    var startPosition = new THREE.Vector3();
    startPosition.copy(this.velocity);
    startPosition.multiplyScalar(2);

    this.getPosition().add(startPosition);

    this.createSprites();
};

Laser.prototype.createSprites = function(time) {
    var power = 2;
    var num = 4;

    for (var i = 0; i < num; i++) {
        this.addEntity(this.createSprite(
            power * (num - i) / num, -i * 0.5,
            this.getLife()));
    }
};

Laser.prototype.onCollision = function(entity) {
    if (entity == this.getActor()) {
        return;
    }

    this.destroy();
};

module.exports = Laser;