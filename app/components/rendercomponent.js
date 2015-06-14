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
};

RenderComponent.prototype = Object.create(Component.prototype);
RenderComponent.prototype.constructor = RenderComponent;

RenderComponent.prototype.updateTransform = function() {
    var transform = this.entity.transform;
    var position = this.entity.worldPosition;

    this.objects.forEach(function(object) {
        if (!position.equals(object.position)) {
            object.position.set(position.x, position.y, position.z);
        }

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
    if (this.hasGlow) {
        this.glowObject = this.initObject();
        this.game.scene2.add(this.glowObject);
        this.objects.push(this.glowObject);
    }

    this.object = this.initObject();
    this.game.scene.add(this.object);
    this.objects.push(this.object);

    this.updateTransform();
};

RenderComponent.prototype.update = function() {
    this.updateTransform();
};

RenderComponent.prototype.destroy = function() {
    if(this.object != null){
        this.game.scene.remove(this.object);
    }

    if(this.glowObject != null){
        this.game.scene2.remove(this.glowObject);
    } 
};

RenderComponent.prototype.initObject = function(geometry, material) {
    throw "must override";
};

module.exports = RenderComponent;