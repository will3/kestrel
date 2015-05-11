var Target = PointSprite.extend(function(lifeTime){
	this.lifeTime = lifeTime == null ? -1 : lifeTime;
}).methods({
	start: function(){
		this.supr();

		this.getTransform().scale.set(2, 2, 2);
	},

	update: function(){
		this.supr();

		if(this.frameAge > this.lifeTime && this.lifeTime != -1){
			this.removeFromParent();
		}
	}
});