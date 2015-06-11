var Entity = require("../entity");
var ParticleSystem = require("./particlesystem");
var THREE = require("THREE");
var assert = require("assert");
var MathUtils = require("../mathutils");
var BlockEntity = require("./blockentity");

var Engine = function(params) {
    BlockEntity.call(this, params);

    this.type = "Engine";

    this.amount = 0;

    this.particleSystem = new ParticleSystem();
    this.particleSystem.life = 5;
    this.power = this.block.power;

    this.rigidBody = null;

    this.powerSource = params.powerSource;
};

Engine.prototype = Object.create(BlockEntity.prototype);
Engine.prototype.constructor = Engine;

Object.defineProperty(Engine.prototype, "health", {
    get: function() {
        return this.block.integrity;
    }
});

Engine.prototype.start = function() {
    this.addEntity(this.particleSystem);
    this.rigidBody = this.parent.getComponent("RigidBody");
    assert(this.rigidBody != null, "rigidBody cannot be empty");
};

Engine.prototype.getEmissionDirection = function() {
    var velocity = new THREE.Vector3().copy(this.block.direction).applyMatrix4(this.worldRotationMatrix);
    velocity.setLength(1);
    return velocity;
};

Engine.prototype.update = function() {
    if (this.amount == 0) {
        return;
    }

    var velocity = this.getEmissionDirection();

    var emitOffset = new THREE.Vector3().copy(velocity).setLength(5);

    if (this.output > 0) {
        this.particleSystem.position = this.worldPosition.add(emitOffset);
        this.particleSystem.velocity = velocity;
        this.particleSystem.size = this.output;
        this.particleSystem.emit();

        this.updateAcceleration();
    }
};

Object.defineProperty(Engine.prototype, "output", {
    get: function(){
        return this.power * this.outputRatio;
    }
});

Object.defineProperty(Engine.prototype, "outputRatio", {
    get: function(){
        return this.amount * this.health * this.powerSource.power;
    }
});

Engine.prototype.updateAcceleration = function() {
    var powerToForce = 3.0;
    var direction = this.getEmissionDirection();
    var force = this.output * powerToForce;
    direction.setLength(-this.amount * force);
    this.rigidBody.applyForce(direction);
};

Engine.prototype.lateUpdate = function() {
    this.amount *= 0.9;
    if (this.amount < 0.01) {
        this.amount = 0.0;
    }
};

module.exports = Engine;