var Command = require("../command");
var THREE = require("THREE");

var AddCommand = function(){
	var objectMapping = {
		"ship": require('../entities/ship'),
	};

	var game = null;

	var addCommand = {
		setObjectMapping: function(value){ objectMapping = value; },
		getObjectMapping: function(){ return objectMapping; },
		getGame: function(){ if(game == null){ game = Game; } return game; },
		setGame: function(value){ game = value; },
		execute: function(){
			var params = this.getParams();
			if(params == null || params.length == 0 || params[0].length == 0){
				throw "must add something";
			}

			var param = params[0];

			var x = parseInt(params[1]);
			var y = parseInt(params[2]);
			var z = parseInt(params[3]);

			className = capitalizeFirstLetter(param);
			var constructor = objectMapping == null ? null : objectMapping[className.toLowerCase()];

			if(constructor == null){
				throw "cannot add " + param;
			}

			var entity = new constructor();
			this.getGame().nameEntity(className.toLowerCase(), entity);
			this.getGame().addEntity(entity, new THREE.Vector3(x, y, z));

			function capitalizeFirstLetter(string) {
			    return string.charAt(0).toUpperCase() + string.slice(1);
			}
		},
	}

	addCommand.__proto__ = Command();

	return addCommand;
}

module.exports = AddCommand;