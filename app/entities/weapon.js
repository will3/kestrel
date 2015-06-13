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
    this.fireMode = params.fireMode || "auto";

    this.cooldown = this.fireInterval;

    this.isDown = false;
    this.isUp = false;
    this.isHold = false;

    this.target = null;
    this.point = null;
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
    ammoInstance.weapon = this;

    this.root.addEntity(ammoInstance);
};

Weapon.prototype.start = function() {

};

Weapon.prototype.update = function() {
    if (this.cooldown < this.fireInterval) {
        this.cooldown++;
    }

    var isReady = this.cooldown == this.fireInterval;
    if(!isReady){
        return;
    }

    if(this.fireMode == "auto"){
        if(this.isHold){
            this.shoot(this.target, this.point);
            this.cooldown = 0;
        }    
    }
};

Weapon.prototype.triggerDown = function() {
    this.isDown = true;
    this.isHold = true;
};

Weapon.prototype.triggerUp = function() {
    this.isUp = true;
    this.isHold = false;
};

Weapon.prototype.lateUpdate = function(){
    this.isDown = false;
    this.isUp = false;
    this.target = null;
    this.point = null;
};

module.exports = Weapon;