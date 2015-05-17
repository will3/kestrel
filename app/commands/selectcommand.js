var Command = require("../command");
var Console = require("../console");

var SelectCommand = function(){
	var selectCommand = {
		execute: function(){
			var params = this.getParams();
			var entity = Game.getEntity(params[0]);
			Console.setSelectedEntity(entity);
		},
	};

	selectCommand.__proto__ = Command();

	return selectCommand;
}

module.exports = SelectCommand;