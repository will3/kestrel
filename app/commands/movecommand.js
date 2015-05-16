var Command = require("../command");
var THREE = require("THREE");

var MoveCommand = Command.extend(function(){
	this.target = null;
	this.actor = null;
}).methods({
	execute: function(){
		var x = parseInt(this.params[0]);
		var y = parseInt(this.params[1]);
		var z = parseInt(this.params[2]);

		this.target = new THREE.Vector3(x, y, z);

		this.actor.shipController.setCommand(this);
	},

	update: function(){
		var shipController = this.actor.shipController;

		shipController.move(this.target);
	},

	destroy: function(){

	},
});

module.exports = MoveCommand;