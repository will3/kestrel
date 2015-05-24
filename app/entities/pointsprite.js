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

		setOpacity: function(value){ 
			renderComponent.setOpacity(value); 
		},
		
		getOpacity: function(){ 
			return renderComponent.getOpacity(); 
		},

		setColor: function(value){ 
			renderComponent.setColor(value);
		},
		getColor: function(){ 
			return renderComponent.getColor();
		},

		setRenderComponent: function(value){
			renderComponent = value;
		},

		getRenderComponent: function(value){
			if(renderComponent == null){
				renderComponent = new PointSpriteRenderComponent();
			}
			return renderComponent;
		},

		start: function(){
			this.addComponent(this.getRenderComponent());
		}
	};

	pointSprite.__proto__ = Entity();


	return pointSprite;
}

var PointSpriteRenderComponent = function(){
	var texture = texture;
	var color = null;

	var pointSpriteRenderComponent = {
		initGeometry: function(){
			return null;
		},

		setColor: function(value){ color = value; },
		getColor: function(){ return color; },

		initMaterial: function(){
			var map = texture == null ? TextureLoader.getDefault() : texture;
			map.minFilter = THREE.NearestFilter;
			var material = new THREE.SpriteMaterial({ 
				map: map,
				color: color || 0xffffff, 
				fog:true 
			});

			return material;
		},

		initObject: function(geometry, material){
			return new THREE.Sprite(material);
		},
	};

	pointSpriteRenderComponent.__proto__ = RenderComponent();

	return pointSpriteRenderComponent;
}

module.exports = PointSprite;