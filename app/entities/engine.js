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

    this.rigidBody = null;
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
    this.particleSystem.emit(this.worldPosition.add(emitOffset), velocity, this.power * this.amount * this.engineBlock.integrity, 5);

    this.updateAcceleration();
};

Engine.prototype.lateUpdate = function() {
    this.amount *= 0.9;
    if (this.amount < 0.01) {
        this.amount = 0.0;
    }
};

Engine.prototype.updateAcceleration = function() {
    var powerToForce = 3.0;
    var direction = this.getEmissionDirection();
    var force = this.power * powerToForce * this.engineBlock.integrity;
    direction.setLength(-this.amount * force);
    this.rigidBody.applyForce(direction);
};

module.exports = Engine;