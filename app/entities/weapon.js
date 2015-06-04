var Entity = require("../entity");
var THREE = require("THREE");
var extend = require("extend");
var assert = require("assert");

//params
//ammo
//actor
//delta
var Weapon = function(params) {
    Entity.call(this);

    if (params == null) {
        params = {};
    }

    this.ammo = params.ammo;
    this.actor = params.actor;
    this.fireInterval = params.fireInterval || 8;

    this.cooldown = this.fireInterval;
}

Weapon.prototype = Object.create(Entity.prototype);
Weapon.prototype.constructor = Weapon;

Weapon.prototype.setDelta = function(value) {
    cooldown = value;
};

Weapon.prototype.shoot = function(target, point) {
    assert(this.actor != null, "actor cannot be empty");

    var ammoInstance = this.ammo.createInstance();
    ammoInstance.actor = this.actor;
    ammoInstance.target = target;
    ammoInstance.point = point;
    ammoInstance.position = this.actor.worldPosition;

    this.root.addEntity(ammoInstance);
};

Weapon.prototype.start = function() {

};

Weapon.prototype.update = function() {
    if (this.cooldown < this.fireInterval) {
        this.cooldown++;
    }
};

Weapon.prototype.fireIfReady = function(target, point) {
    if (this.cooldown == this.fireInterval) {
        this.shoot(target, point);
        this.cooldown = 0;
        return true;
    }
    return false;
};

module.exports = Weapon;