var Command = require('../command');

var AlignCommand = Command.extend(function(){
	this.target = null;
}).methods({
	execute: function(){
		var x = parseInt(this.params[0]);
		var y = parseInt(this.params[1]);
		var z = parseInt(this.params[2]);

		this.target = new THREE.Vector3(x, y, z);

		this.actor.getShipController().setCommand(this);
	},

	update: function(){		
		var shipController = this.actor.getShipController();
		shipController.align(this.target);

		Debug.addIndicator(this.target, 2);
	},
});

module.exports = AlignCommand;