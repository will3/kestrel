var BlockCoord = require("./blockcoord");
var _ = require("lodash");

var BlockChunk = function(origin, chunkSize){
	var params = params || {}
	var map = {}

	var visitMap = function(callback){
		Object.keys(map).forEach(function(x){
			Object.keys(map[x]).forEach(function(y){
				Object.keys(map[x][y]).forEach(function(z){
					callback(parseInt(x), parseInt(y), parseInt(z));
				})
			})
		})
	}

	var visitBlocks = function(callback){
		visitMap(function(x, y, z){
			callback(map[x][y][z], x, y, z);
		})
	}

	var clearMap = function(){
		map = {}
	}

	var blockChunk = {
		minChunkSize: 4,
		type: "BlockChunk",
		origin: origin || null,
		chunkSize: chunkSize || null,
		children: [],

		hasBounds: function(){
			return this.origin != null && this.chunkSize != null;
		},

		getChildrenCount: function(){
			return this.children.length;
		},

		getBlockCount: function(){
			var count = 0;
			visitMap(function(x, y, z){
				count ++;
			})

			this.children.forEach(function(child){
				count += child.getBlockCount();
			})

			return count;
		},

		inBound: function(coord){
			return ( 
				coord.x >= this.origin.x &&
				coord.y >= this.origin.y &&
				coord.z >= this.origin.z &&
				coord.x < this.origin.x + this.chunkSize &&
				coord.y < this.origin.y + this.chunkSize &&
				coord.z < this.origin.z + this.chunkSize
				);
		},

		addBlock: function(coord, block){
			if(this.hasBounds()){
				if(!this.inBound(coord)){
					throw "out of bounds";
				}
			}

			if(block == null){
				throw "block cannot be empty";
			}

			var x = coord.x;
			var y = coord.y;
			var z = coord.z;
			if(block.type != "Block"){
				throw "must add block";
			}

			if(map[x] == null){
				map[x] = {};
			}

			if(map[x][y] == null){
				map[x][y] = {};
			}

			if(map[x][y][z] != null){
				throw "something already here!";
			}

			map[x][y][z] = block;
		},

		removeBlock: function(coord, block){
			if(this.hasBounds()){
				if(!this.inBound(coord)){
					throw "out of bounds";
				}
			}

			var existing = this.getBlockOrEmpty(coord);
			if(existing == null){
				throw "nothing found!";
			}

			map[coord.x][coord.y][coord.z] = null;
		},

		getBlock: function(coord){
			var block = this.getBlockOrEmpty(coord);
			if(block == null){
				throw "nothing found!";
			}
			return block;
		},

		getBlockOrEmpty: function(coord){
			var x = coord.x;
			var y = coord.y;
			var z = coord.z;
			if(map[x] == null){
				return null;
			}
			if(map[x][y] == null){
				return null;
			}
			return map[x][y][z] || null;
		},

		shrink: function(){
			var min = null;
			var max = null;
			visitMap(function(x, y, z){
				if(min == null){
					min = new BlockCoord(x, y, z);
				}
				if(max == null){
					max = new BlockCoord(x, y, z);
				}
				if(x > max.x){ max.x = x; }
				if(y > max.y){ max.y = y; }
				if(z > max.z){ max.z = z; }

				if(x < min.x){ min.x = x; }
				if(y < min.y){ min.y = y; }
				if(z < min.z){ min.z = z; }
			}.bind(this));

			this.origin = min.copy();
			var size = _.max([max.x - min.x, max.y - min.y, max.z - min.z]);
			var chunkSize = this.minChunkSize;
			while(chunkSize < size){
				chunkSize *= 2;
			}
			this.chunkSize = chunkSize;
		},

		subdivide: function(){
			if(!this.hasBounds()){
				throw "origin or chunkSize not initialized, try |shrink chunk first";
			}

			if(this.chunkSize == this.minChunkSize){
				return;
			}

			var x = this.origin.x;
			var y = this.origin.y;
			var z = this.origin.z;
			var chunkSize_half = this.chunkSize / 2.0;

			this.children.push(new BlockChunk(new BlockCoord(x, y, z), chunkSize_half));
			this.children.push(new BlockChunk(new BlockCoord(x + chunkSize_half, y, z), chunkSize_half));
			this.children.push(new BlockChunk(new BlockCoord(x + chunkSize_half, y, z + chunkSize_half), chunkSize_half));
			this.children.push(new BlockChunk(new BlockCoord(x, y, z + chunkSize_half), chunkSize_half));
			
			this.children.push(new BlockChunk(new BlockCoord(x, y + chunkSize_half, z), chunkSize_half));
			this.children.push(new BlockChunk(new BlockCoord(x + chunkSize_half, y + chunkSize_half, z), chunkSize_half));
			this.children.push(new BlockChunk(new BlockCoord(x + chunkSize_half, y + chunkSize_half, z + chunkSize_half), chunkSize_half));
			this.children.push(new BlockChunk(new BlockCoord(x, y + chunkSize_half, z + chunkSize_half), chunkSize_half));
			
			//delegate blocks down
			visitBlocks(function(block, x, y, z){
				this.children.forEach(function(child){
					var coord = new BlockCoord(x, y, z);
					if(child.inBound(coord)){
						child.addBlock(coord, block);
					}
				})
			}.bind(this));

			clearMap();

			this.children.forEach(function(child){
				child.subdivide();
			})
		},

		visitMap: visitMap
	}

	return blockChunk;
}

module.exports = BlockChunk;