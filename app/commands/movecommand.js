var Command = require("../command");
var THREE = require("THREE");

var MoveCommand = function(){
	var target = null;

	var moveCommand = {
		getTarget: function(){
			return target;
		},

		execute: function(){
			var params = this.getParams();
			var x = parseInt(params[0]);
			var y = parseInt(params[1]);
			var z = parseInt(params[2]);

			target = new THREE.Vector3(x, y, z);

			this.getActor.getShipController().setCommand(this);
		},

		update: function(){
			var shipController = this.getActor().getShipController();
			shipController.move(target);
		},
	};

	moveCommand.__proto__ = Command();

	return moveCommand;
}

module.exports = MoveCommand;