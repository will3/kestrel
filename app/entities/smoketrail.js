var Entity = require("../entity");
var PointSprite = require("./pointsprite");
var Debug = require("../debug");
var MathUtils = require("../mathutils");
var THREE = require("THREE");

var SmokeTrail = function() {
	Entity.call(this);
	
    this.amount = 0;
    this.ship = null;
    this.game = null;
}

SmokeTrail.prototype = Object.create(Entity.prototype);
SmokeTrail.prototype.constructor = SmokeTrail;

SmokeTrail.prototype.createSprite = function(velocity, size, life) {
    var pointsprite = new PointSprite();
    pointsprite.setSize(size);
    pointsprite.setLife(life);
    pointsprite.sizeOverTime(function(time) {
        return size - time * (size / life);
    });
    pointsprite.setVelocity(velocity);

    return pointsprite;
};

SmokeTrail.prototype.emit = function(position, offset, speed, size, life) {
    var rotation = this.ship.rotation;
    var rotationMatrix = MathUtils.getRotationMatrix(rotation.x, rotation.y, rotation.z);
    offset.applyMatrix4(rotationMatrix);
    this.game.addEntity(createSprite(speed, size, life), position.add(offset));
};

SmokeTrail.prototype.start = function() {

};

SmokeTrail.prototype.update = function() {
    if (this.amount == 0) {
        return;
    }

    var rotation = ship.rotation;
    var vector = MathUtils.getUnitVector(this.rotation.x, this.rotation.y, this.rotation.z);
    vector.setLength(-1);

    emit(this.getWorldPosition(), ship.getHull().getEngineEmissionPoint(), vector, 3, 8);
};

module.exports = SmokeTrail;