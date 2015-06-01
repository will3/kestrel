var Entity = require("../entity");
var assert = require("assert");
var Laser = require("./laser");
var Weapon = require("./weapon");
var ShipModel = require("../models/shipmodel");
var ModelRenderComponent = require("../components/modelrendercomponent");
var Ammo = require("./ammo");

var Ship = function() {
    Entity.call(this);

    this.shipController = null;
    this.rigidBody = null;
    this.weaponController = null;

    //weapons
    var laser = new Laser();
    this.weapons = [new Weapon({
        ammo: laser,
        actor: this,
        fireInterval: 50
    })];

    this.model = new ShipModel();
    this.renderComponent = new ModelRenderComponent(this.model);
    this.smokeTrail = null;
    this.destroyable = true;
    
    this.collisionBody = {
        type: "block",
        entity: this,
        hitTest: function(position, radius){
            return this.model.hitTest(position, radius);
        }.bind(this)
    }
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

Ship.prototype.onCollision = function(entity, hitTest){
    if(entity instanceof Ammo){
        if(entity.actor != this){
            this.model.damageArea(hitTest.coords.x, hitTest.coords.y, hitTest.coords.z, 0.4, 2);
            this.model.update();
        }
    }
}

module.exports = Ship;