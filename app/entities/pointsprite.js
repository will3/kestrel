var Entity = require('../entity');
var RenderComponent = require('../components/rendercomponent');
var TextureLoader = require("../textureloader");
var THREE = require("THREE");

var PointSprite = Entity.extend(function(){
	this.texture = null;
}).methods({
	start: function(){
		this.addComponent(new PointSpriteRenderComponent(this.texture));
	},

	setTexture: function(value){
		this.texture = value;
	},
});

var PointSpriteRenderComponent = RenderComponent.extend(function(texture){
	this.texture = texture;
}).methods({
	initGeometry: function(){
		return null;
	},

	initMaterial: function(){
		var map = this.texture == null ? TextureLoader.getDefault() : this.texture;
		map.minFilter = THREE.NearestFilter;
		var material = new THREE.SpriteMaterial({ map: map, color: 0xffffff, fog:true });
		return material;
	},

	initObject: function(geometry, material){
		return new THREE.Sprite(material);
	},
});

module.exports = PointSprite;