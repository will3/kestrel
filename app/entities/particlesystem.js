var Entity = require("../entity");
var PointSprite = require("./pointsprite");
var Debug = require("../debug");
var MathUtils = require("../mathutils");
var THREE = require("THREE");

var ParticleSystem = function() {
    Entity.call(this);

    this.amount = 0;
}

ParticleSystem.prototype = Object.create(Entity.prototype);
ParticleSystem.prototype.constructor = ParticleSystem;

ParticleSystem.prototype.createSprite = function(velocity, size, life) {
    var pointsprite = new PointSprite();
    pointsprite.size = size;
    pointsprite.life = life;
    pointsprite.sizeOverTime(function(time) {
        return size - time * (size / life);
    });
    pointsprite.velocity = velocity;

    return pointsprite;
};

ParticleSystem.prototype.emit = function(position, velocity, size, life) {
    this.root.addEntity(this.createSprite(velocity, size, life), position);
};

ParticleSystem.prototype.start = function() {

};

ParticleSystem.prototype.update = function() {

};

module.exports = ParticleSystem;