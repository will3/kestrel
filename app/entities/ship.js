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
var Debug = require("../debug");

var Ship = function() {
    Entity.call(this);

    this.model = new ShipModel();
    this.rigidBody = new RigidBody({
        mass: this.model.blockCount * Math.pow(this.model.gridSize, 3)
    });
    this.weaponController = new WeaponController();
    this.playerControl = null;

    //weapons
    var laser = new Laser();
    this.weapons = [new Weapon({
        ammo: laser,
        actor: this,
        fireInterval: 10
    })];

    this.engines = [];
    this.model.blocks.engine.visitBlocks(function(engineBlock, x, y, z) {
        var blockCoord = new THREE.Vector3(x, y, z);
        var localPosition = this.model.getLocalPosition(blockCoord);
        var engine = new Engine(engineBlock);
        engine.position = localPosition;
        this.engines.push(engine);
    }.bind(this));

    this.shipController = new ShipController(this.engines);

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

    this.model.onRemove(this.onRemove.bind(this));
    this.model.onBroken(this.onBroken.bind(this));
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
    if (this.command != null) {
        this.command.update();
    }

    Debug.draw(this.worldPosition.clone().add(new THREE.Vector3(0, 10, 0)), 8, new THREE.Color(1.0, 0.0, 0.0), 8);
};

Ship.prototype.onCollision = function(entity, hitTest) {
    if (entity instanceof Ammo) {
        if (entity.actor != this) {
            this.model.damageArea(hitTest.coord.x, hitTest.coord.y, hitTest.coord.z, 1.0, 2);
            this.model.update();
        }
    }
};

Ship.prototype.onRemove = function() {
    var c1 = this.model.centerOfMass.clone();
    this.model.center();
    var c2 = this.model.centerOfMass.clone();

    var diff = new THREE.Vector3().subVectors(c2, c1).multiplyScalar(this.model.gridSize);
    this.engines.forEach(function(engine) {
        engine.position.add(diff.clone().multiplyScalar(-1.0));
    });

    diff.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(this.rotation));
    this.position.add(diff);

    this.model.update();
};

Ship.prototype.onBroken = function(){
    alert("oh no");
};

Ship.prototype.addPlayerControl = function() {
    this.playerControl = new PlayerControl();
    this.addComponent(this.playerControl);
};

module.exports = Ship;