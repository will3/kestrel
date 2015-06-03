var Component = require("../component");
var Control = require("../control");
var KeyMap = require("../keymap");
var MathUtils = require("../mathutils");

var PlayerControl = function() {
    Component.call(this);
};

PlayerControl.prototype = Object.create(Component.prototype);
PlayerControl.prototype.constructor = Component;

PlayerControl.prototype.start = function() {
    var control = this.root.control;
    control.registerKeys(["up", "down", "left", "right"]);
};

PlayerControl.prototype.update = function() {
    var control = this.root.control;
    var ship = this.entity;
    var camera = this.root.camera;
    var rotation = camera.rotation;
    var vector = MathUtils.getUnitVector(rotation);

    if (control.isKeyHold("up")) {
    	
    }

    if (control.isKeyHold("down")) {

    }

    if (control.isKeyHold("left")) {

    }

    if (control.isKeyHold("right")) {

    }
};

module.exports = PlayerControl;