var Bullet = Entity.extend(function(){

}).methods({
	start: function(){
		this.addComponent(new BulletRenderComponent());
	},
});

var BulletRenderComponent = RenderComponent.extend(function(){

}).methods({
	initGeometry: function(){
		return null;
	},

	initMaterial: function(){
		var map = THREE.ImageUtils.loadTexture("static/assets/textures/bullet.png");
		map.minFilter = THREE.NearestFilter;
		var material = new THREE.SpriteMaterial({ map: map, color: 0xffffff, fog:true });
		return material;
	},

	initObject: function(geometry, material){
		return new THREE.Sprite(material);
	},
});