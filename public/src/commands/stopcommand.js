var StopCommand = Command.extend(function(){

}).methods({
	execute: function(){
		this.actor.shipController.setCommand(this);
	},

	update: function(){
		//do nothing
	},
});