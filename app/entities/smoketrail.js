var Entity = require("../entity");
var PointSprite = require("./pointsprite");
var Debug = require("../debug");
var MathUtils = require("../mathutils");
var THREE = require("THREE");
var Game = require("../game");

var SmokeTrail = function() {
	Entity.call(this);
	
    this.amount = 0;
    this.game = Game.getInstance();
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

SmokeTrail.prototype.emit = function(position, speed, size, life) {
    this.game.addEntity(this.createSprite(speed, size, life), position);
};

SmokeTrail.prototype.start = function() {

};

SmokeTrail.prototype.update = function() {
    if (this.amount == 0) {
        return;
    }

    //todo
    // this.emit(this.getWorldPosition(), new THREE.Vector3(0,1,0), 5, 8);
};

module.exports = SmokeTrail;