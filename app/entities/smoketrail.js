var Entity = require("../entity");
var PointSprite = require("./pointsprite");
var Debug = require("../debug");
var MathUtils = require("../mathutils");
var THREE = require("THREE");

var SmokeTrail = function() {
    Entity.call(this);

    this.amount = 0;
}

SmokeTrail.prototype = Object.create(Entity.prototype);
SmokeTrail.prototype.constructor = SmokeTrail;

SmokeTrail.prototype.createSprite = function(velocity, size, life) {
    var pointsprite = new PointSprite();
    pointsprite.size = size;
    pointsprite.life = life;
    pointsprite.sizeOverTime(function(time) {
        return size - time * (size / life);
    });
    pointsprite.velocity = velocity;

    return pointsprite;
};

SmokeTrail.prototype.emit = function(position, velocity, size, life) {
    this.root.addEntity(this.createSprite(velocity, size, life), position);
};

SmokeTrail.prototype.start = function() {

};

SmokeTrail.prototype.update = function() {
    if (this.amount == 0) {
        return;
    }

    var velocity = new THREE.Vector3(0, 0, -1).applyMatrix4(this.worldRotationMatrix);
    velocity.setLength(1);
    
    this.emit(this.getWorldPosition(), velocity, 5, 10);
};

module.exports = SmokeTrail;