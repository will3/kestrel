var Component = require("../component");
var Control = require("../control");
var KeyMap = require("../keymap");
var MathUtils = require("../mathutils");
var THREE = require("THREE");
var MoveCommand = require("../commands/movecommand");

var PlayerControl = function() {
    Component.call(this);

    this.control = null;
    this.camera = null;
};

PlayerControl.prototype = Object.create(Component.prototype);
PlayerControl.prototype.constructor = Component;

PlayerControl.prototype.start = function() {
    this.control = this.root.control;
    this.camera = this.root.camera;

    this.control.registerKeys(["up", "down", "left", "right"]);
};

PlayerControl.prototype.update = function() {
    var ship = this.entity;
    var rotation = this.camera.rotation;
    var vector = MathUtils.getUnitVector(rotation);
    vector.setY(ship.position.y);
    vector.setLength(100);

    var up = this.control.keyHold("up");
    var down = this.control.keyHold("down");
    var left = this.control.keyHold("left");
    var right = this.control.keyHold("right");

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
        // if (ship.command == null || ship.command instanceof MoveCommand) {
        vector.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        vector.add(ship.position);

        var moveCommand = new MoveCommand();
        moveCommand.params = [vector.x, vector.y, vector.z];
        moveCommand.actor = ship;
        ship.setCommand(moveCommand);
        // }
    } else {
        ship.clearCommand();
    }
};

module.exports = PlayerControl;