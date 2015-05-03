var PointSprite = Entity.extend(function(){

}).methods({
	start: function(){
		this.addComponent(new PointSpriteRenderComponent(texture));
	},
});

var PointSpriteRenderComponent = RenderComponent.extend(function(texture){
	this.texture = texture;
}).methods({
	initGeometry: function(){
		return null;
	},

	initMaterial: function(){
		var map = this.texture == null ? getDefaultTexture() : this.texture;
		map.minFilter = THREE.NearestFilter;
		var material = new THREE.SpriteMaterial({ map: map, color: 0xffffff, fog:true });
		return material;
	},

	initObject: function(geometry, material){
		return new THREE.Sprite(material);
	},

	getDefaultTexture: function(){
		return THREE.ImageUtils.loadTexture("static/assets/textures/point16x16.png");
	}
});