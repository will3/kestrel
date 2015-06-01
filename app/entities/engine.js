var Entity = require("../entity");
var ParticleSystem = require("./particlesystem");
var THREE = require("THREE");

var Engine = function(power) {
    Entity.call(this);

    this.emission = 0;
    this.particleSystem = new ParticleSystem();
    this.power = power || 5;
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

    var velocity = new THREE.Vector3(0, 0, -1).applyMatrix4(this.worldRotationMatrix);
    velocity.setLength(1);

    this.particleSystem.emit(this.worldPosition, velocity, this.power * this.emission, 10);
};

module.exports = Engine;