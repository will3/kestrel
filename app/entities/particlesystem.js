var Entity = require("../entity");
var PointSprite = require("./pointsprite");
var Debug = require("../debug");
var MathUtils = require("../mathutils");
var THREE = require("THREE");

var ParticleSystem = function() {
    Entity.call(this);

    this.amount = 0;

    this.position = new THREE.Vector3();
    this.velocity = new THREE.Vector3(0, 1, 0);
    this.size = 1;
    this.life = null;
}

ParticleSystem.prototype = Object.create(Entity.prototype);
ParticleSystem.prototype.constructor = ParticleSystem;

//emit in world space
ParticleSystem.prototype.emit = function() {
    var sprite = new PointSprite();
    sprite.position = this.position;
    sprite.velocity = this.velocity;
    sprite.size = this.size;
    sprite.life = this.life;

    if (this.life != null) {
        sprite.sizeOverTime(function(time) {
            return this.size - time * (this.size / this.life);
        }.bind(this));
    }

    this.root.addEntity(sprite);
};

ParticleSystem.prototype.start = function() {

};

ParticleSystem.prototype.update = function() {

};

module.exports = ParticleSystem;