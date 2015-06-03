var Entity = require("./entity");
var KeyMap = require("./keymap");
var _ = require("lodash");
var assert = require("assert");

//inject Control.registerKey as MouseTrap doesn't play well with mocha tests
var Control = function() {
    Entity.call(this);

    this.mouseX = null;
    this.mouseY = null;
    this.mouseMoveHandler = null;
    this.isDragging = false;
    this.registeredKeys = [];

    this.keydowns = [];
    this.keyups = [];
    this.keyholds = [];

    this.registerKeyFunc = null;
}

Control.prototype = Object.create(Entity.prototype);
Control.prototype.constructor = Control;

Control.prototype.mouseMove = function(handler) {
    this.mouseMoveHandler = handler;
};

Control.prototype.hookContainer = function(container) {
    container.mousedown(function() {
        this.isDragging = true;
    }.bind(this));

    container.mouseup(function() {
        this.isDragging = false;
    }.bind(this));

    container.mouseleave(function() {
        this.isDragging = false;
    }.bind(this));

    container.mousemove(function(event) {
        if (this.isDragging) {
            var xDiff = event.clientX - this.mouseX;
            var yDiff = event.clientY - this.mouseY;

            this.mouseMoveHandler(xDiff, yDiff);
        }

        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
    }.bind(this));
};

Control.prototype.start = function() {

};

Control.prototype.update = function() {
    this.keyups = [];
    this.keydowns = [];
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