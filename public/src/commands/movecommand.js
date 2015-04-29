var MoveCommand = Command.extend(function(){
	this.target = null; //optional name
	this.actor = null; //optional name
}).methods({
	getOp: function(){
		return "move";
	},

	execute: function(){
		this.actor = Game.getEntity(this.params[0]);

		var x = this.params[1];
		var z = this.params[2];

		this.target = new THREE.Vector3(x, 0, z);

		this.actor.issueCommand(this);
	},

	update: function(){
		var shipController = this.actor.shipController;
		// shipController.accelerate(1.0);
	},
});