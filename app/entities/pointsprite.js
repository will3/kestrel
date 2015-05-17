var Entity = require('../entity');
var RenderComponent = require('../components/rendercomponent');
var TextureLoader = require("../textureloader");
var THREE = require("THREE");
var extend = require("extend");

var PointSprite = function(){
	var texture = null;
	var renderComponent = null;

	var pointSprite = {
		setTexture: function(value){ texture = value; },
		getTexture: function(){ return texture; },

		setRenderComponent: function(value){
			renderComponent = value;
		},

		getRenderComponent: function(value){
			if(renderComponent == null){
				renderComponent = new PointSpriteRenderComponent(texture);
			}
			return renderComponent;
		},

		start: function(){
			this.addComponent(this.getRenderComponent());
		},
	};

	pointSprite.__proto__ = Entity();


	return pointSprite;
}

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