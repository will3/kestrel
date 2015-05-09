var SelectCommand = Command.extend(function(){
	
}).methods({
	getOp: function(){
		return "cd";
	},

	execute: function(){
		var entity = Game.getEntity(this.params[0]);
		Console.setSelectedEntity(entity);
	},
});