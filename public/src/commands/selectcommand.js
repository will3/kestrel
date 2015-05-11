var SelectCommand = Command.extend(function(){
	
}).methods({
	execute: function(){
		var entity = Game.getEntity(this.params[0]);
		Console.setSelectedEntity(entity);
	},
});