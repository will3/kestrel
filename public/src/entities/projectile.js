var Projectile = Entity.extend(function(power, direction){
	this.power = power;
	this.velocity = new THREE.Vector3();
	this.velocity.copy(direction);
	this.velocity.setLength(4);
	this.life = 200;
	this.collisionRadius = 1;
	this.rigidBody = null;
}).methods({
	start: function(){
		var num = 4;
		for(var i = 0; i < num; i ++){
			this.addEntity(this.createBlock(
				this.power * (num - i) / num, 
				(num - i) * 0.5
				));
		}
		this.rigidBody = new RigidBody();
	},

	createBlock: function(size, offset){
		var block = new Block();

		block.size = size;
		block.life = this.life;
		block.velocity = this.velocity;

		var sizeOverTime = function(time){
			var remainingLife = this.life - time;
			if(remainingLife < 50){
				return this.size *= 0.95;
			}
			return this.size;
		}.bind({
			size: size,
			life: this.life
		});

		// var velocityOverTime = function(time){
		// 	var remainingLife = this.life - time;
		// 	if(remainingLife < 40){
		// 		this.velocity.multiplyScalar(0.99);
		// 		return this.velocity;
		// 	}

		// 	return this.velocity;
		// }.bind({
		// 	velocity: this.velocity,
		// 	life: this.life,
		// });

		block.sizeOverTime(sizeOverTime);
		// block.velocityOverTime(velocityOverTime);

		var position = new THREE.Vector3();
		position.copy(this.velocity);
		position.multiplyScalar(offset);
		position.add(this.getPosition());
		block.setPosition(position);

		return block;
	},

	onCollision: function(entity){
		this.destroy();
	}
});