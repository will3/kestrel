var Entity = require("../entity");
var Laser = require("./laser");
var Weapon = require("./weapon");
var ShipModel = require("../models/shipmodel");
var ModelRenderComponent = require("../components/modelrendercomponent");
var Ammo = require("./ammo");
var ShipController = require("../components/shipcontroller");
var WeaponController = require("../components/weaponcontroller");
var RigidBody = require("../components/rigidbody");
var SmokeTrail = require("../entities/smoketrail");

var Ship = function() {
    Entity.call(this);

    this.shipController = new ShipController();
    this.rigidBody = new RigidBody();
    this.weaponController = new WeaponController();

    //weapons
    var laser = new Laser();
    this.weapons = [new Weapon({
        ammo: laser,
        actor: this,
        fireInterval: 50
    })];

    this.model = new ShipModel();
    this.renderComponent = new ModelRenderComponent(this.model);
    this.smokeTrail = new SmokeTrail();
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

    this.addComponent(this.renderComponent);
    this.addComponent(this.rigidBody);
    this.addComponent(this.shipController);
    this.addComponent(this.weaponController);

    this.weapons.forEach(function(weapon) {
        this.addEntity(weapon);
    }.bind(this));

    // this.smokeTrail.ship = this;
    // this.addEntity(this.smokeTrail);
};

Ship.prototype.update = function() {
    this.smokeTrail.amount = this.shipController.engineAmount;
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