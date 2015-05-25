var BlockCoord = function(x, y, z){

	var blockCoord = {
		type : "BlockCoord",
		x : x || 0,
		y : y || 0,
		z : z || 0,
		
		equals: function(coord){
			if(coord.type != "BlockCoord"){
				throw "must compare with BlockCoord";
			}

			return this.x == coord.x && this.y == coord.y && this.z == coord.z;
		},

		copy: function(){
			return new BlockCoord(this.x, this.y, this.z);
		}
	}

	return blockCoord;
}

module.exports = BlockCoord;