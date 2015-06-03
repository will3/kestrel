var Component = require("../component");
var Control = require("../control");
var KeyMap = require("../keymap");
var MathUtils = require("../mathutils");

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
    vector.setY(0);
    vector.setLength(100);

    if (this.control.isKeyHold("up")) {
            	
    }

    if (this.control.isKeyHold("down")) {

    }

    if (this.control.isKeyHold("left")) {

    }

    if (this.control.isKeyHold("right")) {

    }
};

module.exports = PlayerControl;