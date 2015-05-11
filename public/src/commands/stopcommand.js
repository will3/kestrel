var StopCommand = Command.extend(function(){

}).methods({
	getOp: function(){
		return "stop";
	},

	execute: function(){
		this.actor.shipController.setCommand(this);
	},

	update: function(){
		//do nothing
	},
});