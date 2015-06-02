var Entity = require("./entity");
var KeyMap = require("./keymap");
var _ = require("lodash");
var MouseTrap = require("mousetrap");

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

Control.prototype.start = function(){

};

Control.prototype.update = function(){
    this.keyups = [];
    this.keydowns = [];
};

Control.prototype.isKeyHold = function(key) {
    return _.includes(this.keyholds, key);
};

Control.prototype.isKeyDown = function(key) {
    return _.includes(this.keydowns, key);
};

Control.prototype.isKeyUp = function(key) {
    return _.includes(this.keyups, key);
};

Control.prototype.registerKeys = function(keys) {
    for (var i in keys) {
        this.registerKey(keys[i]);
    }
};

Control.prototype.registerKey = function(key) {
    if (_.includes(this.registeredKeys, key)) {
        return;
    }

    this.registeredKeys.push(key);

    MouseTrap.bind(KeyMap[key], function() {
        this.keydowns.push(key);
        this.keyholds.push(key);
    }.bind(this));

    MouseTrap.bind(KeyMap[key], function() {
        _.pull(this.keyholds, key);
        this.keyups.push(key);
    }.bind(this), 'keyup');
};

module.exports = Control;