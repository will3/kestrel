var Block = require("./entities/block");

var Debug = function(){
	return {
		addIndicator: function(point, duration){
			var indicator = new Block();
			indicator.setSize(2);
			var life = duration == null ? 8 : duration;

			indicator.setLife(life);
			indicator.sizeOverTime(function(time){
				return 2 - time * (2 / life);
			});

			indicator.getTransform().position.copy(point);

			Game.addEntity(indicator);
		},
	};
}();

module.exports = Debug;