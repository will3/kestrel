var Entity = require("../entity");
var ParticleSystem = require("./particlesystem");
var THREE = require("THREE");

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
};

Engine.prototype.update = function() {
    if (this.emission == 0) {
        return;
    }

    var velocity = this.engineBlock.direction.applyMatrix4(this.worldRotationMatrix);
    velocity.setLength(1);

    this.particleSystem.emit(this.worldPosition, velocity, this.power * this.amount, 5);
};

module.exports = Engine;