var Debug = function(){
	return {
		addIndicator: function(point){
			var indicator = new Block({
				lifetime: 3,
			});

			indicator.getTransform().position.copy(point);

			Game.addEntity(indicator);
		},
	};
}();