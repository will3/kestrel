var Entity = require("../entity");
var Laser = require("./laser");
var Weapon = require("./weapon");
var ShipModel = require("../models/shipmodel");
var ModelRenderComponent = require("../components/modelrendercomponent");
var Ammo = require("./ammo");
var ShipController = require("../components/shipcontroller");
var WeaponController = require("../components/weaponcontroller");
var RigidBody = require("../components/rigidbody");
var Engine = require("./engine");
var THREE = require("THREE");
var PlayerControl = require("../components/playercontrol");

var Ship = function(params) {
    Entity.call(this);

    this.shipController = new ShipController(params);
    this.rigidBody = new RigidBody();
    this.weaponController = new WeaponController();
    this.playerControl = null;

    //weapons
    var laser = new Laser();
    this.weapons = [new Weapon({
        ammo: laser,
        actor: this,
        fireInterval: 50
    })];

    var sideEngine1 = new Engine(3);
    sideEngine1.position = new THREE.Vector3(10, 0, -9);
    var sideEngine2 = new Engine(3);
    sideEngine2.position = new THREE.Vector3(-10, 0, -9);

    this.engines = [
        // mainEngine,
        sideEngine1,
        sideEngine2
    ];

    this.model = new ShipModel();
    this.renderComponent = new ModelRenderComponent(this.model);
    this.destroyable = true;

    this.collisionBody = {
        type: "block",
        entity: this,
        hitTest: function(position, radius) {
            return this.model.hitTest(position, radius);
        }.bind(this)
    }

    this.command = null;
}

Ship.prototype = Object.create(Entity.prototype);
Ship.prototype.constructor = Ship;

Ship.prototype.setCommand = function(command) {
    this.clearCommand();
    this.command = command;
    this.addComponent(command);
};

Ship.prototype.clearCommand = function(){
    if (this.command != null) {
        this.removeComponent(this.command);
        this.command = null;
    }
}

Ship.prototype.start = function() {
    Ship.id++;

    this.shipController.engines = this.engines;

    this.addComponent(this.renderComponent);
    this.addComponent(this.rigidBody);
    this.addComponent(this.shipController);
    this.addComponent(this.weaponController);

    this.weapons.forEach(function(weapon) {
        this.addEntity(weapon);
    }.bind(this));

    this.engines.forEach(function(engine) {
        this.addEntity(engine);
    }.bind(this));
};

Ship.prototype.update = function() {
    this.engines.forEach(function(engine) {
        engine.emission = this.shipController.accelerateAmount;
    }.bind(this));
};

Ship.prototype.onCollision = function(entity, hitTest) {
    if (entity instanceof Ammo) {
        if (entity.actor != this) {
            this.model.damageArea(hitTest.coord.x, hitTest.coord.y, hitTest.coord.z, 0.3, 2);
            this.model.update();
        }
    }
}

Ship.prototype.addPlayerControl = function(){
    this.playerControl = new PlayerControl();
    this.addComponent(this.playerControl);
}

module.exports = Ship;