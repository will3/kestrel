var Component = require("../component");
var Control = require("../control");
var KeyMap = require("../keymap");
var MathUtils = require("../mathutils");
var THREE = require("THREE");
var MoveCommand = require("../commands/movecommand");
var AttackCommand = require("../commands/attackcommand");

var PlayerControl = function() {
    Component.call(this);

    this.control = null;
    this.camera = null;
    this.shipController = null;
    this.weaponController = null;
};

PlayerControl.prototype = Object.create(Component.prototype);
PlayerControl.prototype.constructor = Component;

PlayerControl.prototype.start = function() {
    this.control = this.root.control;
    this.camera = this.root.camera;
    this.shipController = this.getComponent("ShipController");
    this.weaponController = this.getComponent("WeaponController");

    this.control.registerKeys(["up", "down", "left", "right"]);
    this.control.registerKeys(["shoot"]);
};

PlayerControl.prototype.update = function() {
    this.updateDirection();
    this.updateShoot();
};

PlayerControl.prototype.updateShoot = function() {
    var shoot = this.control.keyDown("shoot");
    if (!shoot) {
        return;
    }

    var target = this.root.getEntityNamed("ship0");
    this.weaponController.fireIfReady(target);
}

PlayerControl.prototype.updateDirection = function() {
    var up = this.control.keyHold("up");
    var down = this.control.keyHold("down");
    var left = this.control.keyHold("left");
    var right = this.control.keyHold("right");

    var rotation = this.camera.rotation;
    var vector = MathUtils.getUnitVector(rotation);
    vector.setY(this.transform.position.y);
    vector.setLength(100);

    var angle = null;
    if (up && down) {
        up = down = false;
    }
    if (left && right) {
        left = right = false;
    }

    if (down && left) {
        angle = Math.PI * -0.25;
    } else if (up && left) {
        angle = Math.PI * -0.75;
    } else if (up && right) {
        angle = Math.PI * 0.75;
    } else if (down && right) {
        angle = Math.PI * 0.25;
    } else if (up) {
        angle = Math.PI;
    } else if (down) {
        angle = 0;
    } else if (left) {
        angle = -Math.PI / 2.0;
    } else if (right) {
        angle = Math.PI / 2.0;
    }

    if (angle != null) {
        vector.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        vector.add(this.transform.position);

        this.shipController.move(vector);
    }
}

module.exports = PlayerControl;