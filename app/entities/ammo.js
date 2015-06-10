var Entity = require("../entity.js");
var THREE = require("THREE");
var SphereCollisionBody = require("../components/spherecollisionbody");

var Ammo = function() {
    Entity.call(this);

    this.actor = null;
    this.target = null;
    this.point = null;
    this.destroyable = true;

    this.collisionBody = new SphereCollisionBody(2);
    this.collisionBody.filter(function(entity) {
        if (entity == this.actor) {
            return false;
        }

        if (entity instanceof Ammo) {
            return false;
        }

        return true;
    }.bind(this));

    this.addComponent(this.collisionBody);
}

Ammo.prototype = Object.create(Entity.prototype);
Ammo.prototype.constructor = Ammo;

Ammo.prototype.createInstance = function() {
    throw "must override";
};

module.exports = Ammo;