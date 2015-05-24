var PointSprite = require("./entities/pointsprite");

var Debug = function(){
	return {
		addIndicator: function(point, duration){
			var indicator = new PointSprite();
			indicator.setSize(2);
			var life = duration == null ? 8 : duration;

			indicator.setLife(life);
			indicator.sizeOverTime(function(time){
				return 2 - time * (2 / life);
			});

			indicator.getTransform().getPosition().copy(point);

			Game.addEntity(indicator);
		},
	};
}();

module.exports = Debug;