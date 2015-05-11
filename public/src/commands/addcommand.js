var AddCommand = Command.extend(function(){

}).methods({
	execute: function(){
		var param = this.params[0];
		if(param == null || param.length == 0){
			throw "must add something";
		}

		var x = parseInt(this.params[1]);
		var y = parseInt(this.params[2]);
		var z = parseInt(this.params[3]);

		className = capitalizeFirstLetter(param);
		var constructor = window[className];

		if(constructor == null){
			throw "cannot add " + param;
		}

		var entity = new constructor();
		Game.nameEntity(className.toLowerCase(), entity);
		Game.addEntity(entity, new THREE.Vector3(x, y, z));

		function capitalizeFirstLetter(string) {
		    return string.charAt(0).toUpperCase() + string.slice(1);
		}
	},
})