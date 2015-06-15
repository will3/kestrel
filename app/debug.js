var PointSprite = require("./entities/pointsprite");
var Game = require("./game");

var Debug = function(){
	var game = Game.getInstance();

	return {
		draw: function(point, duration, color, size){
			var indicator = new PointSprite();
			indicator.size = size || 2;
			var life = duration || 8;

			indicator.color = color || new THREE.Color(1.0, 1.0, 1.0);
			indicator.life = life;
			indicator.sizeOverTime(function(time){
				return size - time * (size / life);
			});

			indicator.position = point;

			game.addEntity(indicator);
		},
	};
}();

module.exports = Debug;