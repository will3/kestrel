var BlockCoord = require("./blockcoord");

var _ = require("lodash");

var BlockChunk = function(origin, chunkSize) {
    this.type = "BlockChunk";
    this.map = {};
    this.origin = origin || null;
    this.chunkSize = chunkSize || null;
    this.minChunkSize = 8;
    this.parent = null;
    this.children = [];
    this.lowerBound = null;
    this.higherBound = null;
};

BlockChunk.prototype = {
    constructor: BlockChunk,

    visitBlock: function(callback) {
        for (x in this.map) {
            for (y in this.map[x]) {
                for (z in this.map[x][y]) {
                    callback(this.map[x][y][z], parseInt(x), parseInt(y), parseInt(z));
                }
            }
        }
    },

    visitBlockRecursively: function(callback) {
        this.visitBlock(callback);

        for (var i in this.children) {
            this.children[i].visitBlockRecursively(callback);
        }
    },

    hasBounds: function() {
        return this.origin != null && this.chunkSize != null;
    },

    getChildrenCount: function() {
        return this.children.length;
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

        var left = this.findBlock(x - 1, y, z);
        var right = this.findBlock(x + 1, y, z);
        var bottom = this.findBlock(x, y - 1, z);
        var top = this.findBlock(x, y + 1, z);
        var back = this.findBlock(x, y, z - 1);
        var front = this.findBlock(x, y, z + 1);

        block.showLeft = (left == null);
        block.showRight = (right == null);
        block.showBottom = (bottom == null);
        block.showTop = (top == null);
        block.showBack = (back == null);
        block.showFront = (front == null);

        if (left != null) {
            left.showRight = false;
        }
        if (right != null) {
            right.showLeft = false;
        }
        if (bottom != null) {
            bottom.showTop = false;
        }
        if (top != null) {
            top.showBottom = false;
        }
        if (back != null) {
            back.showFront = false;
        }
        if (front != null) {
            front.showBack = false;
        }
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

        var left = this.findBlock(x - 1, y, z);
        var right = this.findBlock(x + 1, y, z);
        var bottom = this.findBlock(x, y - 1, z);
        var top = this.findBlock(x, y + 1, z);
        var back = this.findBlock(x, y, z - 1);
        var front = this.findBlock(x, y, z + 1);

        if (left != null) {
            left.showRight = true;
        }
        if (right != null) {
            right.showLeft = true;
        }
        if (bottom != null) {
            bottom.showTop = true;
        }
        if (top != null) {
            top.showBottom = true;
        }
        if (back != null) {
            back.showFront = true;
        }
        if (front != null) {
            front.showBack = true;
        }
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

    findBlock: function(x, y, z){
        if(!this.hasBounds()){
            return this.getBlockOrEmpty(x, y, z);
        }

        if(this.inBound(x,y,z)){
            var chunk = this.getChunk(x, y, z);
            return chunk.getBlockOrEmpty(x, y, z);
        }

        if(this.parent == null){
            return null;
        }

        return this.parent.findBlock(x, y, z);
    },

    getChunk: function(x, y, z) {
        if (!this.inBound(x, y, z)) {
            return null;
        }

        if (this.children.length == 0) {
            return this;
        }

        for (var index in this.children) {
            var child = this.children[index];
            var chunk = child.getChunk(x, y, z);
            if (chunk != null) {
                return chunk;
            }
        }

        return null;
    },

    shrink: function() {
        var min = null;
        var max = null;
        this.visitBlock(function(block, x, y, z) {
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
            child.parent = this;
            child.subdivide();
        }.bind(this));
    },

    reallocate: function() {
        this.visitBlock(function(block, x, y, z) {
            var chunk = this.getChunk(x, y, z);
            if (chunk == null) {
                throw "cannot allocate block";
            }

            chunk.addBlock(x, y, z, block);
        }.bind(this));

        //clear map
        this.map = {};
    }
};

module.exports = BlockChunk;