var Command = require('../command');

var StopCommand = function(){
	var stopCommand = {
		execute: function(){
			this.getActor().getShipController().setCommand(this);
		},

		update: function(){
			//do nothing
		},
	};

	stopCommand.__proto__ = Command();

	return stopCommand;
}

module.exports = StopCommand;