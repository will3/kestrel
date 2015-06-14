var Component = require("../component");
var Control = require("../control");
var KeyMap = require("../keymap");
var MathUtils = require("../mathutils");
var THREE = require("THREE");
var MoveCommand = require("../commands/movecommand");
var AttackCommand = require("../commands/attackcommand");
var Debug = require("../debug");

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
    this.updateMouseShoot();
};

PlayerControl.prototype.updateShoot = function() {
    var keyDown = this.control.keyDown("shoot");
    var keyUp = this.control.keyUp("shoot");
    var keyHold = this.control.keyHold("shoot");

    if (keyDown) {
        this.weaponController.triggerDown();
    }

    if (keyUp) {
        this.weaponController.triggerUp();
    }

    if (keyHold) {
        var vector = MathUtils.getUnitVector(this.entity.rotation).setLength(100);
        var position = new THREE.Vector3().copy(this.entity.worldPosition).add(vector);

        this.weaponController.updateTarget(null, position);
    }
};

PlayerControl.prototype.updateMouseShoot = function() {
    var mouseDown = this.control.mouseDown;
    var mouseUp = this.control.mouseUp;
    var mouseHold = this.control.mouseHold;

    if (mouseDown) {
        this.weaponController.triggerDown();
    }

    if (mouseUp) {
        this.weaponController.triggerUp();
    }

    if (mouseHold) {
        var point = this.getGroundIntersectPoint();
        this.weaponController.updateTarget(null, point);
    }
};

// get intersect point with plane where y == entity.y, from camera ray caster
PlayerControl.prototype.getGroundIntersectPoint = function() {
    var raycaster = this.root.getCameraRaycaster();

    var x = this.transform.position.x;
    var y = this.transform.position.y;
    var z = this.transform.position.z;

    var groundGeometry = new THREE.Geometry();
    var groundWidth = 99999;
    groundGeometry.vertices.push(new THREE.Vector3(x - groundWidth, y, z - groundWidth));
    groundGeometry.vertices.push(new THREE.Vector3(x + groundWidth, y, z - groundWidth));
    groundGeometry.vertices.push(new THREE.Vector3(x + groundWidth, y, z + groundWidth));
    groundGeometry.vertices.push(new THREE.Vector3(x - groundWidth, y, z + groundWidth));
    groundGeometry.faces.push(new THREE.Face3(0, 2, 1));
    groundGeometry.faces.push(new THREE.Face3(3, 2, 0));

    var ground = new THREE.Mesh(groundGeometry, new THREE.MeshBasicMaterial({
        color: 0xff0000
    }));

    // var plane = new THREE.Mesh(geometry, new THREE.Material());
    var result = raycaster.intersectObject(ground);
    var groundPoint = result[0].point;

    return groundPoint;
};

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