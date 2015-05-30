var Entity = require("../entity");
var assert = require("assert");
var Laser = require("./laser");
var Weapon = require("./weapon");

var Ship = function() {
    Entity.call(this);

    this.shipController = null;
    this.rigidBody = null;
    this.weaponController = null;

    //weapons
    var laser = new Laser();
    this.weapons = [new Weapon({
        ammo: laser,
        actor: this
    })];

    this.smokeTrail = null;
    this.renderComponent = null;

    this.destroyable = true;
}

Ship.prototype = Object.create(Entity.prototype);
Ship.prototype.constructor = Ship;

Ship.prototype.start = function() {
    Ship.id++;

    assert(this.shipController != null, "shipController cannot be empty");
    assert(this.rigidBody != null, "rigidBody cannot be empty");
    assert(this.weaponController != null, "weaponController cannot be empty");
    assert(this.weapons != null, "weapons cannot be empty");
    assert(this.smokeTrail != null, "smokeTrail cannot be empty");
    assert(this.renderComponent != null, "renderComponent cannot be empty");

    this.addComponent(this.renderComponent);
    this.addComponent(this.rigidBody);
    this.addComponent(this.shipController);
    this.addComponent(this.weaponController);

    this.weapons.forEach(function(weapon) {
        this.addEntity(weapon);
    }.bind(this));

    this.smokeTrail.ship = this;
    this.addEntity(this.smokeTrail);
};

Ship.prototype.update = function() {
    // this.smokeTrail.amount = shipController.engineAmount;
};

module.exports = Ship;