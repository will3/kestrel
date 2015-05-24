var BlockCollection = require("./blockcollection");
var _ = require("lodash");

var BlockMaker = function(){
	var blockCollection = null;

	var visitRange = function(range, callback){
		var range = range || {};
		var xRange = range.xRange;
		var yRange = range.yRange;
		var zRange = range.zRange;

		if(xRange == null || yRange == null || zRange == null){
			throw "must specify range";
		}

		visitAxis(xRange, function(x){
			visitAxis(yRange, function(y){
				visitAxis(zRange, function(z){
					callback(x, y, z);
				})
			})
		})
	}

	var visitAxis = function(range, callback){
		if(_.isArray(range)){
			var min = range[0];
			var max = range[1];
			for(var i = min; i < max; i ++){
				callback(i);
			}
		}
	}

	var blockMaker = {
		createNew: function(){
			blockCollection = new BlockCollection();
			return this;
		},

		map: function(range){
			visitRange(range, function(x, y, z){
				blockCollection.addBlock(x, y, z);
			})

			return this;
		},

		scale : function(range, scale){
			visitRange(range, function(x, y, z){
				var block = blockCollection.getBlock(x, y, z);
				block.setScale(scale);
			});

			return this;
		},

		translate: function(translation){
			blockCollection.setGrid(translation);

			return this;
		},

		visit: function(range, callback){
			visitRange(range, function(x, y, z){
				callback(x, y, z, blockCollection.getBlock(x, y, z));
			});
		},

		make: function(){
			return blockCollection;
		}
	}

	return blockMaker;
}

module.exports = BlockMaker;