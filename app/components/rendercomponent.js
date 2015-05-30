var Component = require("../component");
var THREE = require("THREE");
var MathUtils = require("../mathutils");
var Game = require("../game");
var _ = require("lodash");
var assert = require("assert");

var RenderComponent = function() {
    Component.call(this);
    
    this.innerObject = null;
    this.game = null;
    this.geometry = null;
    this.material = null;
};

RenderComponent.prototype = Object.create(Component.prototype);
RenderComponent.prototype.constructor = RenderComponent;

RenderComponent.prototype.updateTransform = function() {
    var transform = this.entity.transform;

    if (this.innerObject == null) {
        return;
    }

    var position = this.entity.getWorldPosition();
    if(!position.equals(this.innerObject.position)){
        this.innerObject.position.set(position.x, position.y, position.z);
    }

    var rotation = transform.rotation;
    if(!rotation.equals(this.innerObject.rotation)){
        this.innerObject.rotation.set(rotation.x, rotation.y, rotation.z);
    }

    var scale = transform.scale;
    var actualScale = this.innerObject.scale;
    if (!scale.equals(actualScale)) {
        this.innerObject.scale.set(scale.x, scale.y, scale.z);
    }
};

RenderComponent.prototype.start = function() {
    assert(this.game != null, "game cannot be null");

    this.innerObject = this.initObject();
    this.game.scene.add(this.innerObject);
    this.updateTransform(this.entity);
};

RenderComponent.prototype.update = function() {
    this.updateTransform(this.entity);
};

RenderComponent.prototype.destroy = function() {
    this.game.scene.remove(this.innerObject);
};

RenderComponent.prototype.initObject = function(geometry, material) {
    throw "must override";
};

module.exports = RenderComponent;
