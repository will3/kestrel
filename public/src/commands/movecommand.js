var MoveCommand = Command.extend(function(){
	this.target = null;
	this.actor = null;
	this.targetIndicator = null;
}).methods({
	getOp: function(){
		return "move";
	},

	execute: function(){
		this.actor = Game.getEntity(this.params[0]);

		var x = parseInt(this.params[1]);
		var z = parseInt(this.params[2]);

		this.target = new THREE.Vector3(x, 0, z);

		this.actor.shipController.setCommand(this);

		this.drawIndicator();
	},

	update: function(){
		var shipController = this.actor.shipController;

		shipController.bankForPoint(this.target);

		var position = this.actor.getTransform().position;
		
		var distanceVector = new THREE.Vector3();
		distanceVector.subVectors(this.target, position);
		var distance = distanceVector.length();
		var desiredVelocity = (distance - 10.0) * 0.05;
		shipController.accelerateForVelocity(desiredVelocity);
	},

	drawIndicator: function(){
		if(this.targetIndicator != null){
			this.actor.removeEntity(this.targetIndicator);
		}

		this.targetIndicator = new Target();
		this.targetIndicator.getTransform().position.copy(this.target);
		this.actor.addEntity(this.targetIndicator);
	},

	destroy: function(){
		if(this.targetIndicator == null){
			return;
		}

		this.actor.removeEntity(this.targetIndicator);
	}
});