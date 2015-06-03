var PointSprite = require("./entities/pointsprite");
var Game = require("./game");

var Debug = function(){
	var game = Game.getInstance();

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

			game.addEntity(indicator);
		},
	};
}();

module.exports = Debug;