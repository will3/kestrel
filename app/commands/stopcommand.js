var Command = require('../command');

var StopCommand = Command.extend(function(){

}).methods({
	execute: function(){
		this.actor.getShipController().setCommand(this);
	},

	update: function(){
		//do nothing
	},
});

module.exports = StopCommand;