var MoveCommand = Command.extend(function(){
	this.target = null;
	this.actor = null;
	this.targetIndicator = null;
}).methods({
	execute: function(){
		var x = parseInt(this.params[0]);
		var y = parseInt(this.params[1]);
		var z = parseInt(this.params[2]);

		this.target = new THREE.Vector3(x, y, z);

		this.actor.shipController.setCommand(this);

		this.drawIndicator();
	},

	update: function(){
		var shipController = this.actor.shipController;

		shipController.move(this.target);
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