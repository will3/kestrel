var Component = require("../component");
var THREE = require("THREE");
var MathUtils = require("../mathutils");
var Game = require("../game");
var _ = require("lodash");
var assert = require("assert");

var RenderComponent = function() {
    Component.call(this);

    this.game = Game.getInstance();
    this.geometry = null;
    this.material = null;
    this.hasGlow = false;

    this.objects = [];

    this.object = null;
    this.glowObject = null;
    this.needsRedraw = false;
};

RenderComponent.prototype = Object.create(Component.prototype);
RenderComponent.prototype.constructor = RenderComponent;

RenderComponent.prototype.updateTransform = function() {
    var transform = this.entity.transform;
    var position = this.entity.worldPosition;

    this.objects.forEach(function(object) {
        object.position.set(position.x, position.y, position.z);

        var rotation = transform.rotation;
        if (!rotation.equals(object.rotation)) {
            object.rotation.set(rotation.x, rotation.y, rotation.z);
        }

        var scale = transform.scale;
        var actualScale = object.scale;
        if (!scale.equals(actualScale)) {
            object.scale.set(scale.x, scale.y, scale.z);
        }
    });
};

RenderComponent.prototype.start = function() {
    this.addObjects();

    this.updateTransform();
};

RenderComponent.prototype.update = function() {
    if(this.needsRedraw){
        this.redraw();
        this.needsRedraw = false;
    }
    this.updateTransform();
};

RenderComponent.prototype.destroy = function() {
    this.removeObjects();
};

RenderComponent.prototype.initObject = function(geometry, material) {
    throw "must override";
};

RenderComponent.prototype.redraw = function() {
    this.removeObjects();
    this.addObjects();
};

RenderComponent.prototype.addObjects = function() {
    if (this.hasGlow) {
        this.glowObject = this.initObject();
        this.game.scene2.add(this.glowObject);
        this.objects.push(this.glowObject);
    }

    this.object = this.initObject();
    this.game.scene.add(this.object);
    this.objects.push(this.object);
};

RenderComponent.prototype.removeObjects = function() {
    this.objects.forEach(function(object) {
        if (object.parent != null) {
            object.parent.remove(object);
        }
    });
};

module.exports = RenderComponent;