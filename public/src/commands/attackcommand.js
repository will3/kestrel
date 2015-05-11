var AttackCommand = Command.extend(function(){
	this.cooldown = 0;
	this.actor = null;
	this.target = null;
}).methods({
	execute: function(){
		var targetName = this.params[0];
		this.target = Game.getEntity(targetName);

		this.actor.shipController.setCommand(this);

		this.shoot();
	},

	update: function(){
		var shipController = this.actor.shipController;
		shipController.align(this.target.getPosition());

		if(this.cooldown % 20 == 0){
			this.shoot();
		}

		this.cooldown ++;
	},

	shoot: function(){
		var direction = new THREE.Vector3();
		direction.subVectors(this.target.getPosition(), this.actor.getPosition());
		direction.setLength(1);

		var projectile = new Projectile(2, direction);
		Game.addEntity(projectile, this.actor.getPosition());
	},
});