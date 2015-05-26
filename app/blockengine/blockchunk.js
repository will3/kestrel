var BlockCoord = require("./blockcoord");

var _ = require("lodash");

var BlockChunk = function(origin, chunkSize) {
    this.type = "BlockChunk";
    this.map = {};
    this.origin = origin || null;
    this.chunkSize = chunkSize || null;
    this.minChunkSize = 8;
    this.children = [];
    this.lowerBound = null;
    this.higherBound = null;
};

BlockChunk.prototype = {
    constructor: BlockChunk,

    visitMap: function(callback) {
        for(x in this.map){
            for(y in this.map[x]){
                for(z in this.map[x][y]){
                    callback(parseInt(x), parseInt(y), parseInt(z));
                }
            }
        }
    },

    visitBlocks: function(callback) {
        this.visitMap(function(x, y, z) {
            callback(this.map[x][y][z], x, y, z);
        }.bind(this));
    },

    visitLeafs: function(callback){
        if(this.children.length == 0){
            callback(this);
            return;
        }

        for(var i in this.children){
            this.children[i].visitLeafs(callback);
        }
    },

    clearMap: function() {
        this.map = {}
    },

    hasBounds: function() {
        return this.origin != null && this.chunkSize != null;
    },

    getChildrenCount: function() {
        return this.children.length;
    },

    getBlockCount: function() {
        var count = 0;
        this.visitMap(function(x, y, z) {
            count++;
        })

        this.children.forEach(function(child) {
            count += child.getBlockCount();
        })

        return count;
    },

    inBound: function(x, y, z) {
        return (
            x >= this.origin.x &&
            y >= this.origin.y &&
            z >= this.origin.z &&
            x < this.origin.x + this.chunkSize &&
            y < this.origin.y + this.chunkSize &&
            z < this.origin.z + this.chunkSize
        );
    },

    addBlock: function(x, y, z, block) {
        if (this.hasBounds()) {
            if (!this.inBound(x, y, z)) {
                throw "out of bounds";
            }
        }

        if (block == null) {
            throw "block cannot be empty";
        }

        if (block.type != "Block") {
            throw "must add block";
        }

        if (this.map[x] == null) {
            this.map[x] = {};
        }

        if (this.map[x][y] == null) {
            this.map[x][y] = {};
        }

        if (this.map[x][y][z] != null) {
            throw "something already here!";
        }

        this.map[x][y][z] = block;
    },

    removeBlock: function(x, y, z) {
        if (this.hasBounds()) {
            if (!this.inBound(x, y, z)) {
                throw "out of bounds";
            }
        }

        var existing = this.getBlockOrEmpty(x, y, z);
        if (existing == null) {
            throw "nothing found!";
        }

        this.map[x][y][z] = null;
    },

    getBlock: function(x, y, z) {
        var block = this.getBlockOrEmpty(x, y, z);
        if (block == null) {
            throw "nothing found!";
        }
        return block;
    },

    getBlockOrEmpty: function(x, y, z) {
        if (this.map[x] == null) {
            return null;
        }
        if (this.map[x][y] == null) {
            return null;
        }
        return this.map[x][y][z] || null;
    },

    getChunk: function(x, y, z){
        if(!this.inBound(x, y, z)){
            return null;
        }

        if(this.children.length == 0){
            return this;
        }

        for(var index in this.children){
            var child = this.children[index];
            var chunk = child.getChunk(x, y, z);
            if(chunk != null){
                return chunk;
            }
        }

        return null;
    },

    shrink: function() {
        var min = null;
        var max = null;
        this.visitMap(function(x, y, z) {
            if (min == null) {
                min = new BlockCoord(x, y, z);
            }
            if (max == null) {
                max = new BlockCoord(x, y, z);
            }
            if (x > max.x) {
                max.x = x;
            }
            if (y > max.y) {
                max.y = y;
            }
            if (z > max.z) {
                max.z = z;
            }

            if (x < min.x) {
                min.x = x;
            }
            if (y < min.y) {
                min.y = y;
            }
            if (z < min.z) {
                min.z = z;
            }
        }.bind(this));

        this.lowerBound = min;
        this.higherBound = max;

        this.origin = min.copy();
        var size = _.max([max.x - min.x, max.y - min.y, max.z - min.z]);
        var chunkSize = this.minChunkSize;
        while (chunkSize < size) {
            chunkSize *= 2;
        }
        this.chunkSize = chunkSize;
    },

    subdivide: function() {
        if (!this.hasBounds()) {
            throw "origin or chunkSize not initialized, try |shrink chunk first";
        }

        if (this.chunkSize == this.minChunkSize) {
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

        this.children.forEach(function(child) {
            child.subdivide();
        })
    },

    reallocate: function(){
        this.visitBlocks(function(block, x, y, z){
            var chunk = this.getChunk(x, y, z);
            if(chunk == null){
                throw "cannot allocate block";
            }

            chunk.addBlock(x, y, z, block);
        }.bind(this));

        this.clearMap();
    }
};

module.exports = BlockChunk;