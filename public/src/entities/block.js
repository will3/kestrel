var Block = PointSprite.extend(function(params){
	this.params = params;
	this.scale = 4;
	this.lifetime = -1;
}).methods({
	start: function(){
		this.supr();

		if(this.params.scale != null){ 
			this.scale = this.params.scale; 
		}
		if(this.params.lifetime != null){ 
			this.lifetime = this.params.lifetime; 
		}

		this.getTransform().scale.set(this.scale, this.scale, this.scale);
	},

	update: function(){
		this.supr();

		if(this.frameAge > this.lifetime && this.lifetime != -1){
			this.removeFromParent();
		}
	},
});