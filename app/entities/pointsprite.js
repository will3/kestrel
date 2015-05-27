var Entity = require("../entity");
var RenderComponent = require("../components/rendercomponent");
var TextureLoader = require("../textureloader");
var THREE = require("THREE");
var extend = require("extend");
var RigidBody = require("../components/rigidbody");
var assert = require("assert");

var PointSprite = function() {
    Entity.call(this);

    this.renderComponent = null;
    this.rigidBody = null;

    this.texture = null;
    this.size = 4;
    this.sizeOverTimeFunc = null;
    this.velocityOverTimeFunc = null;
}

PointSprite.prototype = Object.create(Entity.prototype);
PointSprite.constructor = PointSprite;

PointSprite.prototype.updateSize = function() {
    this.transform.scale.set(this.size, this.size, this.size);
};

Object.defineProperty(PointSprite.prototype, 'velocity', {
    get: function() {
        return this.rigidBody.velocity;
    },

    set: function(value) {
        this.rigidBody.velocity = value;
    }
});

Object.defineProperty(PointSprite.prototype, 'color', {
    get: function() {
        return this.renderComponent.color;
    },

    set: function(value) {
        this.renderComponent.color = value;
    }
});

PointSprite.prototype.start = function() {
    assert(this.renderComponent != null, "renderComponent cannot be empty");
    assert(this.rigidBody != null, "rigidBody cannot be empty");

    this.addComponent(this.rigidBody);
    this.addComponent(this.renderComponent);

    this.updateSize();
};

PointSprite.prototype.update = function() {
    //update size over time
    if (this.sizeOverTimeFunc != null) {
        var newSize = this.sizeOverTimeFunc(this.frameAge);
        if (size != newSize) {
            size = newSize;
            this.updateSize();
        }
    }

    if (this.velocityOverTimeFunc != null) {
        var velocity = this.velocityOverTimeFunc(this.frameAge);
        this.velocity = velocity;
    }
}

PointSprite.prototype.sizeOverTime = function(sizeOverTimeFunc){
    this.sizeOverTimeFunc = sizeOverTimeFunc;
}

PointSprite.prototype.velocityOverTime = function(velocityOverTimeFunc){
    this.velocityOverTime = velocityOverTimeFunc;
}

var PointSpriteRenderComponent = function() {
    this.texture = null;
    this.color = null;
}

PointSpriteRenderComponent.prototype = Object.create(RenderComponent.prototype);
PointSpriteRenderComponent.prototype.constructor = PointSpriteRenderComponent;

PointSpriteRenderComponent.prototype.initMaterial = function() {
    var map = this.texture == null ? TextureLoader.getDefault() : this.texture;
    map.minFilter = THREE.NearestFilter;
    var material = new THREE.SpriteMaterial({
        map: map,
        color: this.color || 0xffffff,
        fog: true
    });

    return material;
};

PointSpriteRenderComponent.prototype.initGeometry = function() {
    return null;
};

PointSpriteRenderComponent.prototype.initObject = function(geometry, material) {
    return new THREE.Sprite(material);
};

module.exports = PointSprite;