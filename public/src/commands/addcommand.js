var AddCommand = Command.extend(function(){

}).methods({
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

		var entity = new constructor();
		Game.nameEntity(className.toLowerCase(), entity);
		Game.addEntity(entity);

		function capitalizeFirstLetter(string) {
		    return string.charAt(0).toUpperCase() + string.slice(1);
		}
	},
})