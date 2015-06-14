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
    this.fireInterval = params.fireInterval || 8;
    this.fireMode = params.fireMode || "auto";

    this.cooldown = this.fireInterval;

    this.isTriggerDown = false;
    this.isTriggerUp = false;
    this.isTriggerHold = false;

    this.target = null;
    this.point = null;

    this.lastAmmoInstance = null;
}

Weapon.prototype = Object.create(Entity.prototype);
Weapon.prototype.constructor = Weapon;

Weapon.prototype.setDelta = function(value) {
    cooldown = value;
};

Weapon.prototype.shoot = function(target, point) {
    var ammoInstance = this.ammo.createInstance();
    ammoInstance.actor = this.parent;
    ammoInstance.target = target;
    ammoInstance.point = point;
    ammoInstance.position = this.parent.worldPosition;
    ammoInstance.weapon = this;

    this.root.addEntity(ammoInstance);

    this.lastAmmoInstance = ammoInstance;
};

Weapon.prototype.start = function() {

};

Weapon.prototype.update = function() {
    if (this.cooldown < this.fireInterval) {
        this.cooldown++;
    }

    var isReady = this.cooldown == this.fireInterval;
    if (!isReady) {
        return;
    }

    if (this.fireMode == "auto") {
        if (this.isTriggerHold) {
            this.shoot(this.target, this.point);
            this.cooldown = 0;
        }
    } else if (this.fireMode == "beam") {
        if (this.isTriggerDown) {
            this.shoot(this.target, this.point);
        }

        if (this.isTriggerHold) {
            this.lastAmmoInstance.target = this.target;
            this.lastAmmoInstance.point = this.point;
        }

        if (this.isTriggerUp) {
            if (this.lastAmmoInstance != null) {
                this.lastAmmoInstance.removeFromParent();
            }
        }
    }
};

Weapon.prototype.triggerDown = function() {
    if(this.isTriggerDown){
        throw "trigger already down";
    }
    this.isTriggerDown = true;
    this.isTriggerHold = true;
};

Weapon.prototype.triggerUp = function() {
    this.isTriggerUp = true;
    this.isTriggerHold = false;
};

Weapon.prototype.lateUpdate = function() {
    this.isTriggerDown = false;
    this.isTriggerUp = false;
    this.target = null;
    this.point = null;
};

module.exports = Weapon;