var BlockCoord = require("./blockcoord");

var BlockRange = function(lower, upper){
	var blockRange = {
		lower: lower || new BlockCoord(0, 0, 0),
		upper: upper || new BlockCoord(0, 0, 0),

		visit: function(callback){
			if(this.lower.equals(this.upper)){
				return;
			}

			for(var x = this.lower.x; x < this.upper.x; x ++){
				for(var y = this.lower.y; y < this.upper.y; y ++){
					for(var z = this.lower.z; z < this.upper.z; z ++){
						callback(x, y, z);
					}
				}
			}
		}
	}

	return blockRange;
}

module.exports = BlockRange;