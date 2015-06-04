var Entity = require("../entity.js");
var THREE = require("THREE");

var Ammo = function() {
    Entity.call(this);

    this.actor = null;
    this.target = null;
    this.point = null;
    this.destroyable = true;

    this.collisionBody = {
        type: "sphere",
        radius: 2,
        getPosition: function() {
            return this.position
        }.bind(this),
        getVelocity: function() {
            return this.rigidBody.velocity;
        }.bind(this)
    }

    this.collisionFilter = function(entity) {
        if (entity == this.actor) {
            return false;
        }

        if (entity instanceof Ammo) {
            return false;
        }

        return true;
    }
}

Ammo.prototype = Object.create(Entity.prototype);
Ammo.prototype.constructor = Ammo;

Ammo.prototype.createInstance = function() {
    throw "must override";
};

module.exports = Ammo;