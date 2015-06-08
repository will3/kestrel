var RenderComponent = require("./rendercomponent");
var TextureLoader = require("../textureloader");
var THREE = require("THREE");

var PointSpriteRenderComponent = function() {
    RenderComponent.call(this);
    
    this.texture = null;
    this.color = null;
}

PointSpriteRenderComponent.prototype = Object.create(RenderComponent.prototype);
PointSpriteRenderComponent.prototype.constructor = PointSpriteRenderComponent;

PointSpriteRenderComponent.prototype.initObject = function(geometry, material) {
    var map = this.texture == null ? TextureLoader.getDefault() : this.texture;
    map.minFilter = THREE.NearestFilter;
    var material = new THREE.SpriteMaterial({
        map: map,
        color: this.color != null ? this.color.getHex() : 0xffffff,
        fog: true
    });

    return new THREE.Sprite(material);
};

module.exports = PointSpriteRenderComponent;