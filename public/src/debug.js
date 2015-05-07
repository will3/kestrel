var Debug = function(){
	return {
		addIndicator: function(point){
			var indicator = new Target(2);
			indicator.getTransform().position.copy(point);
			Game.addEntity(indicator);
		},
	};
}();