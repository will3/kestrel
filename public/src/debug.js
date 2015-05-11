var Debug = function(){
	return {
		addIndicator: function(point){
			var indicator = new Block();
			indicator.size = 2;
			indicator.life = 8;
			indicator.sizeOverTime(function(time){
				return 2 - time * 0.25;
			});

			indicator.getTransform().position.copy(point);

			Game.addEntity(indicator);
		},
	};
}();