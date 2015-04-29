var AddCommand = Command.extend(function(){

}).methods({
	getOp: function(){
		return "add";
	},

	execute: function(){
		var param = this.params[0];
		if(param == null || param.length == 0){
			throw "must add something";
		}

		className = capitalizeFirstLetter(param);
		var constructor = window[className];

		if(constructor == null){
			throw "cannot add " + param;
		}

		Game.addEntity(new constructor());

		function capitalizeFirstLetter(string) {
		    return string.charAt(0).toUpperCase() + string.slice(1);
		}
	}
})