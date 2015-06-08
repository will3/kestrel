var Entity = require("../entity");
var ParticleSystem = require("./particlesystem");
var THREE = require("THREE");
var assert = require("assert");
var MathUtils = require("../mathutils");

var Engine = function(engineBlock) {
    Entity.call(this);

    this.engineBlock = engineBlock;

    this.amount = 0;

    this.particleSystem = new ParticleSystem();
    this.power = engineBlock.power;
};

Engine.prototype = Object.create(Entity.prototype);
Engine.prototype.constructor = Engine;

Engine.prototype.start = function() {
    this.addEntity(this.particleSystem);
    this.rigidBody = this.parent.getComponent("RigidBody");
    assert(this.rigidBody != null, "rigidBody cannot be empty");
};

Engine.prototype.getEmissionDirection = function() {
    var velocity = new THREE.Vector3().copy(this.engineBlock.direction).applyMatrix4(this.worldRotationMatrix);
    velocity.setLength(1);
    return velocity;
};

Engine.prototype.update = function() {
    if (this.amount == 0) {
        return;
    }

    var velocity = this.getEmissionDirection();

    var emitOffset = new THREE.Vector3().copy(velocity).setLength(5);
    this.particleSystem.emit(this.worldPosition.add(emitOffset), velocity, this.power * this.amount, 5);
};

Engine.prototype.lateUpdate = function() {
    this.amount *= 0.9;
    if (this.amount < 0.01) {
        this.amount = 0.0;
    }
};

Engine.prototype.accelerate = function(amount) {
    var powerToFoce = 3.0;
    var direction = this.getEmissionDirection();
    direction.setLength(-amount * this.power * powerToFoce);
    this.rigidBody.applyForce(direction);
    this.amount = amount;
};

module.exports = Engine;
