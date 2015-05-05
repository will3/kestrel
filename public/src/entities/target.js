var Target = Bullet.extend(function(lifeTime){
	this.lifeTime = lifeTime == null ? -1 : lifeTime;
}).methods({
	start: function(){
		this.supr();

		this.getTransform().scale.set(10, 10, 10);
		Game.nameEntity("target", this);
	},

	update: function(){
		this.supr();

		if(this.frameAge > this.lifeTime && this.lifeTime != -1){
			this.removeFromParent();
		}
	}
});