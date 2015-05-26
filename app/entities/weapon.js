var Entity = require("../entity");
var THREE = require("THREE");
var extend = require("extend");

var Weapon = function() {
    this.fireInterval = 50;
    this.cooldown = 50;
    this.actor = null;

    this.game = null;
    this.ammo = null;
}

Weapon.prototype = Object.create(Entity.prototype);
Weapon.prototype.constructor = Weapon;

Weapon.prototype.setDelta = function(value) {
    cooldown = value;
};

Weapon.prototype.shoot = function(target) {
    var ammoInstance = this.ammo.createInstance();
    ammoInstance.actor = this.actor;
    ammoInstance.target = this.target;
    ammoInstance.position = this.actor.getWorldPosition();

    this.game.addEntity(newAmmo);

    this.cooldown = 0;
};

Weapon.prototype.start = function() {

};

Weapon.prototype.update = function() {
    if (this.cooldown < this.fireInterval) {
        this.cooldown++;
    }
};

Weapon.prototype.isReady = function() {
    return (this.cooldown == this.fireInterval);
};

Weapon.prototype.fireIfReady = function(target) {
    if (!this.isReady()) {
        return;
    }

    this.shoot(target);
};

module.exports = Weapon;