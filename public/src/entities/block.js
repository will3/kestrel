var Block = PointSprite.extend(function(){
	this.size = 4;
	this.life = -1;
	this.sizeOverTimeFunc = null;
}).methods({
	start: function(){
		this.supr();
		this.updateSize();
	},

	update: function(){
		this.supr();

		if(this.frameAge > this.life && this.life != -1){
			this.removeFromParent();
		}

		//update size
		if(this.sizeOverTimeFunc != null){
			var size = this.sizeOverTimeFunc(this.frameAge);
			if(this.size != size){
				this.size = size;
				this.updateSize();
			}
		}
	},

	updateSize: function(){
		this.getTransform().scale.set(this.size, this.size, this.size);
	},

	sizeOverTime: function(func){
		this.sizeOverTimeFunc = func;
	},
});