var Component = require("../component");
var THREE = require("THREE");
var MathUtils = require("../mathutils");
var Game = require("../game");
var _ = require("lodash");

var RenderComponent = function() {
    this.innerObject = null;
    this.game = Game;
    this.geometry = null;
    this.material = null;
};

RenderComponent.prototype = Object.create(Component);
RenderComponent.prototype.constructor = RenderComponent;

RenderComponent.prototype.updateTransform = function() {
    var transform = this.entity.getTransform();

    if (this.innerObject == null) {
        return;
    }

    var position = this.entity.getWorldPosition();
    this.innerObject.position.set(position.x, position.y, position.z);

    var rotation = transform.rotation;
    this.innerObject.rotation.setFromRotationMatrix(MathUtils.getRotationMatrix(rotation.x, rotation.y, rotation.z));

    var scale = transform.scale;
    var actualScale = this.innerObject.scale;
    if (!scale.equals(actualScale)) {
        this.innerObject.scale.set(scale.x, scale.y, scale.z);
    }
};

RenderComponent.prototype.start = function() {
    this.geometry = this.initGeometry();
    this.material = this.initMaterial();
    this.innerObject = this.initObject(this.geometry, this.material);
    this.game.getScene().add(this.innerObject);
    this.updateTransform(this.entity);
};

RenderComponent.prototype.update = function() {
    this.updateTransform(this.entity);
};

RenderComponent.prototype.destroy = function() {
    this.game.getScene().remove(this.innerObject);
};

RenderComponent.prototype.initGeometry = function() {
    throw "must override";
};

RenderComponent.prototype.initMaterial = function() {
    throw "must override";
};

RenderComponent.prototype.initObject = function(geometry, material) {
    throw "must override";
};

module.exports = RenderComponent;
