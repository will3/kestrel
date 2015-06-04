var Entity = require("./entity");
var KeyMap = require("./keymap");
var _ = require("lodash");
var assert = require("assert");

//inject Control.registerKey as MouseTrap doesn't play well with mocha tests
var Control = function() {
    Entity.call(this);

    this.registerKeyFunc = null;

    this.registeredKeys = [];

    this.mouseX = null;
    this.mouseY = null;
    this.mouseHold = false;
    this.mouseDown = false;

    this.keydowns = [];
    this.keyups = [];
    this.keyholds = [];

    this.dragX = 0;
    this.dragY = 0;
}

Control.prototype = Object.create(Entity.prototype);
Control.prototype.constructor = Control;

Control.prototype.hookContainer = function(container) {
    container.mousedown(function() {
        this.mouseHold = true;
        this.mouseDown = true;
    }.bind(this));

    container.mouseup(function() {
        this.mouseHold = false;
    }.bind(this));

    container.mouseleave(function() {
        this.mouseHold = false;
    }.bind(this));

    container.mousemove(function(event) {
        if (this.mouseHold) {
            this.dragX = event.clientX - this.mouseX;
            this.dragY = event.clientY - this.mouseY;
        }

        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
    }.bind(this));
};

Control.prototype.start = function() {

};

Control.prototype.update = function() {

};

Control.prototype.lateUpdate = function() {
    this.keyups = [];
    this.keydowns = [];
    this.dragX = 0;
    this.dragY = 0;
    this.mouseDown = false;
};

Control.prototype.keyHold = function(key) {
    return _.includes(this.keyholds, key);
};

Control.prototype.keyDown = function(key) {
    return _.includes(this.keydowns, key);
};

Control.prototype.keyUp = function(key) {
    return _.includes(this.keyups, key);
};

Control.prototype.registerKeys = function(keys) {
    for (var i in keys) {
        this.registerKey(keys[i]);
    }
};

Control.prototype.registerKey = function(key) {
    assert(this.registerKeyFunc != null, "registerKeyFunc cannot be empty");

    if (_.includes(this.registeredKeys, key)) {
        return;
    }

    this.registeredKeys.push(key);

    this.registerKeyFunc(key);
};

module.exports = Control;