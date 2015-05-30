var PointSprite = require("./entities/pointsprite");

var Debug = function(){
	return {
		addIndicator: function(point, duration){
			var indicator = new PointSprite();
			indicator.size = 2;
			var life = duration == null ? 8 : duration;

			indicator.life = life;
			indicator.sizeOverTime(function(time){
				return 2 - time * (2 / life);
			});

			indicator.position = point;

			Game.addEntity(indicator);
		},
	};
}();

module.exports = Debug;