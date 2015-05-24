var Entity = require("../entity");
var RenderComponent = require("../components/rendercomponent");
var TextureLoader = require("../textureloader");
var THREE = require("THREE");
var extend = require("extend");
var RigidBody = require("../components/rigidbody");

var PointSprite = function(){
	var texture = null;
	var size = 4;
	var sizeOverTimeFunc = null;
	var velocityOverTimeFunc = null;

	var renderComponent = null;
	var rigidBody = null;
	var transform = null;

	var updateSize = function(){
		transform.getScale().set(size, size, size);
	}

	var pointSprite = {
		setTexture: function(value){ texture = value; },
		getTexture: function(){ return texture; },
		setSize: function(value){ size = value; },
		getSize: function(){ return size; },
		setVelocity: function(value){ this.getRigidBody().setVelocity(value); },
		getVelocity: function(){ return this.getRigidBody().getVelocity(); },
		setColor: function(value){ color = value; },
		getColor: function(){ return color; },
		setOpacity: function(value){ opacity = value; },
		getOpacity: function(){ return opacity; },
		getRigidBody:  function(){
			if(rigidBody == null){
				rigidBody = new RigidBody();
				rigidBody.setDefaultFriction(1);
			}
			return rigidBody;
		},
		setRigidBody: function(value){ rigidBody = value; },
		sizeOverTime: function(func){
			sizeOverTimeFunc = func;
		},

		velocityOverTime: function(func){
			velocityOverTimeFunc = func;
		},

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
			transform = this.getTransform();
			this.addComponent(this.getRigidBody());
			this.addComponent(this.getRenderComponent());

			updateSize();
		},

		update: function(){
			//update size over time
			if(sizeOverTimeFunc != null){
				var newSize = sizeOverTimeFunc(this.getFrameAge());
				if(size != newSize){
					size = newSize;
					updateSize();
				}
			}

			if(velocityOverTimeFunc != null){
				var velocity = velocityOverTimeFunc(this.getFrameAge());
				this.setVelocity(velocity);
			}
		}
	};

	pointSprite.__proto__ = Entity();


	return pointSprite;
}

var PointSpriteRenderComponent = function(){
	var texture = texture;
	var color = null;
	var opacity = 1.0;

	var getMatrial = function(){
		var map = texture == null ? TextureLoader.getDefault() : texture;
		map.minFilter = THREE.NearestFilter;
		var material = new THREE.SpriteMaterial({ 
			map: map,
			color: color || 0xffffff, 
			fog:true 
		});
		material.opacity = opacity;

		return material;
	}

	var pointSpriteRenderComponent = {
		initGeometry: function(){
			return null;
		},

		setColor: function(value){ color = value; },
		getColor: function(){ return color; },
		setOpacity: function(value){ opacity = value; },
		getOpacity: function(){ return opacity; },

		initObject: function(){
			return new THREE.Sprite(getMatrial());
		}
	};

	pointSpriteRenderComponent.__proto__ = RenderComponent();

	return pointSpriteRenderComponent;
}

module.exports = PointSprite;