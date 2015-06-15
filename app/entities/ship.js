var Entity = require("../entity");
var Laser = require("./laser");
var Weapon = require("./weapon");
var ShipModel = require("../models/shipmodel");
var Ammo = require("./ammo");
var ShipController = require("../components/shipcontroller");
var WeaponController = require("../components/weaponcontroller");
var RigidBody = require("../components/rigidbody");
var Engine = require("./engine");
var THREE = require("THREE");
var PlayerControl = require("../components/playercontrol");
var _ = require("lodash");
var Debug = require("../debug");
var ModelEntity = require("./modelentity");
var BlockCollisionBody = require("../components/blockcollisionbody");
var Beam = require("./beam");

var Ship = function(params) {
    ModelEntity.call(this, new ShipModel());

    this.type = "Ship";

    params = params || {};

    this.weaponController = new WeaponController();
    this.playerControl = null;

    this.weapons = [];

    this.engines = _.filter(this.blockEntities, function(entity) {
        return entity.type == "Engine";
    });

    this.shipController = new ShipController({
        engine: this.engines,
        model: this.model,
        agilityBonus: params.agilityBonus,
        powerSource: this
    });

    this.destroyable = true;

    this.collisionBody = new BlockCollisionBody(this.model);
    this.addComponent(this.collisionBody);

    this.command = null;

    this.minPowerIntegrity = 0.2;
};

Ship.prototype = Object.create(ModelEntity.prototype);
Ship.prototype.constructor = Ship;

Ship.prototype.initBlockEntities = function() {
    var engines = [];
    this.model.blocks.engine.visitBlocks(function(engineBlock, x, y, z) {
        var engine = new Engine({
            block: engineBlock,
            x: x,
            y: y,
            z: z,
            powerSource: this
        });
        engine.setPositionFromModel(this.model);
        engines.push(engine);
    }.bind(this));

    return engines;
};

Object.defineProperty(Ship.prototype, "integrity", {
    get: function() {
        return this.model.blockCount / this.maxBlockSize;
    }
});

Object.defineProperty(Ship.prototype, "power", {
    get: function() {
        var power = this.integrity - this.minPowerIntegrity;
        if (power < 0) {
            power = 0;
        }
        return Math.pow(power, 1.4);
    }
});

Ship.prototype.start = function() {
    Ship.id++;

    this.shipController.engines = this.engines;

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
    if (this.command != null) {
        this.command.update();
    }

    Debug.draw(this.worldPosition.clone().add(new THREE.Vector3(0, 10, 0)), 8, new THREE.Color(1.0, 0.0, 0.0), 2);
};

Ship.prototype.onCollision = function(entity, hitTest) {
    if (entity instanceof Laser) {
        if (entity.actor != this) {
            this.damageArea(hitTest.coord.x, hitTest.coord.y, hitTest.coord.z, 1.0, 2);
            this.model.update();
        }
    } else if (entity instanceof Beam) {
        if (entity.actor != this) {
            this.damageArea(hitTest.coord.x, hitTest.coord.y, hitTest.coord.z, 0.1, 2);
            this.model.update();
        }
    }
};

Ship.prototype.addPlayerControl = function() {
    this.playerControl = new PlayerControl();
    this.addComponent(this.playerControl);
};

module.exports = Ship;