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
var _ = require("lodash");

var Ship = function(params) {
    Entity.call(this);

    params = params || {};

    this.model = new ShipModel();
    this.shipController = new ShipController(params);
    this.rigidBody = new RigidBody();
    this.weaponController = new WeaponController();
    this.playerControl = null;

    //weapons
    var laser = new Laser();
    this.weapons = [new Weapon({
        ammo: laser,
        actor: this,
        fireInterval: params.fireInterval || 50
    })];

    this.engines = [];
    this.model.blocks.engine.visitBlocks(function(engineBlock, x, y, z) {
        var blockCoord = new THREE.Vector3(x, y, z);
        var localPosition = this.model.getLocalPosition(blockCoord);
        var engine = new Engine(engineBlock);
        engine.position = localPosition;
        this.engines.push(engine);
    }.bind(this));

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
};

Ship.prototype = Object.create(Entity.prototype);
Ship.prototype.constructor = Ship;

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

    if (this.command != null) {
        this.command.update();
    }
};

Ship.prototype.onCollision = function(entity, hitTest) {
    if (entity instanceof Ammo) {
        if (entity.actor != this) {
            this.model.damageArea(hitTest.coord.x, hitTest.coord.y, hitTest.coord.z, 1.0, 2);
            this.model.update();
        }
    }
};

Ship.prototype.addPlayerControl = function() {
    this.playerControl = new PlayerControl();
    this.addComponent(this.playerControl);
};

module.exports = Ship;