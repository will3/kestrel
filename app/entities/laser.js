var Ammo = require("./ammo");
var THREE = require("THREE");
var PointSprite = require("./pointsprite");
var RigidBody = require("../components/rigidbody");
var assert = require("assert");

var Laser = function() {
    Ammo.call(this);

    this.rigidBody = new RigidBody({
        defaultFriction: 1,
    });
    
    this.setCollisionRadius(1);

    this.velocity = null;
}

Laser.prototype = Object.create(Ammo.prototype);
Laser.prototype.constructor = Laser;

Laser.prototype.createInstance = function() {
    return new Laser();
};

Laser.prototype.initVelocity = function() {
    var velocity = new THREE.Vector3();
    velocity.subVectors(this.target.getWorldPosition(), this.actor.getWorldPosition());

    if (velocity.length() == 0) {
        velocity = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
    }
    velocity.setLength(8);

    this.velocity = velocity;
};

Laser.prototype.start = function() {
    assert(this.actor != null, "actor cannot be empty");
    assert(this.target != null, "target cannot be empty");

    this.life = 200;

    this.initVelocity();

    this.addComponent(this.rigidBody);
    this.rigidBody.velocity = this.velocity;

    var startPosition = new THREE.Vector3();
    startPosition.copy(this.velocity);
    startPosition.multiplyScalar(2);

    this.position.add(startPosition);

    this.createSprites();
};

Laser.prototype.createSprites = function(time) {
    var power = 4;
    var num = 4;

    for (var i = 0; i < num; i++) {
        this.addEntity(this.createSprite(
            power * (num - i) / num, -i * 0.5,
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

    if(entity instanceof Ammo){
        return;
    }

    this.destroy();
};

module.exports = Laser;