var Projectile = Entity.extend(function(power, direction){
	this.power = power;
	this.velocity = new THREE.Vector3();
	this.velocity.copy(direction);
	this.velocity.setLength(4);

	this.life = 200;
	this.hasCollision = true;
	this.collisionRadius = 1;
	this.rigidBody = null;
	this.actor = null;
}).methods({
	start: function(){
		var startPosition = new THREE.Vector3();
		startPosition.copy(this.velocity);
		startPosition.multiplyScalar(0.5);
		this.getPosition().add(startPosition);

		var num = 4;
		for(var i = 0; i < num; i ++){
			this.addEntity(this.createBlock(
				this.power * (num - i) / num, 
				- i * 0.5
				));
		}
		this.rigidBody = new RigidBody();
		this.rigidBody.defaultFriction = 1;
		this.addComponent(this.rigidBody);
		this.rigidBody.velocity = this.velocity;
	},

	update: function(){
		this.supr();

		//update age
		if(this.frameAge > this.life && this.life != -1){
			this.removeFromParent();
		}
	},

	createBlock: function(size, offset){
		var block = new Block();

		block.size = size;
		block.life = this.life;

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
		if(entity == this.actor){
			return;
		}

		this.destroy();
	}
});