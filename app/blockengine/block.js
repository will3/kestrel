var THREE = require("THREE");
var CubeMaker = require("./cubemaker");

var Block = function(){
	var size = 2;
	var grid = new THREE.Vector3(0, 0, 0);
	var scale = new THREE.Vector3(1.0, 1.0, 1.0);
	var cubeMaker = new CubeMaker();
	var geometry = null;

	var block = {
		getSize: function(){ return size; },
		setSize: function(value){ size = value; },
		getGrid: function(){ return grid; },
		setGrid: function(value){ grid = value; },
		getScale: function(){ return scale; },
		setScale: function(value){ scale = value; },

		getGeometry: function(){
			if(geometry == null){
				geometry = cubeMaker.make().configure(size, grid, scale).build();
			}
			return geometry;
		},

		setGeometry: function(value){
			geometry = value;
		}
	}

	return block;
}

module.exports = Block;