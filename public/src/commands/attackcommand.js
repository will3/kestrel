var AttackCommand = Command.extend(function(){

}).methods({
	getOp: function(){
		return "attack";
	},

	execute: function(){
		var actor = this.params[0];
		var target = this.params[1];
	}
});