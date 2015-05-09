var Bullet = PointSprite.extend(function(){

}).methods({
	start: function(){
		this.addComponent(new PointSpriteRenderComponent(THREE.ImageUtils.loadTexture("public/assets/textures/target16x16.png")));
	},
});
