var BlockCoord = require("./blockcoord");
var _ = require("lodash");
var assert = require("assert");
var Block = require("./block");
var THREE = require("THREE");

var BlockChunk = function(origin, size) {
    if ((Math.log(size) / Math.log(2)) % 1 != 0) {
        throw "invalid size";
    }

    this.uuid = THREE.Math.generateUUID();

    this.type = "BlockChunk";

    this.origin = origin;
    this.size = size;
    this.radius = Math.sqrt(size * size * 3);

    this.children = [];
    this.block = null;

    //mesh for chunk
    this.mesh = null;
};

BlockChunk.prototype = {
    constructor: BlockChunk,

    merge: function(chunk, xOffset, yOffset, zOffset){
        if(chunk.type != "BlockChunk"){
            throw "attempt to merge non chunk object";
        }

        chunk.visitBlocks(function(block, x, y, z){
            this.add(x + xOffset, y + yOffset, z + zOffset, block);
        });
    },

    get: function(x, y, z) {
        var chunk = this.getChunk(x, y, z);
        if (chunk == null) {
            return null;
        }
        if (chunk.size != 1) {
            return null;
        }

        return chunk.block;
    },

    add: function(x, y, z, block) {
        if (!this.inBound(x, y, z)) {
            throw "out of bounds";
        }

        chunk = this.getChunk(x, y, z);

        while (chunk.size != 1) {
            chunk.subdivide();
            chunk = chunk.getChunk(x, y, z);
        }

        if (!block instanceof Block) {
            throw "attempt to add non block object";
        }

        chunk.block = block;
    },

    remove: function(x, y, z) {
        var chunk = this.getChunk(x, y, z);

        if (chunk.size != 1 || chunk.block == null) {
            throw "block doesn't exisit";
        }

        chunk.block = null;
    },

    visitBlocks: function(callback) {
        if (this.children.length == 0) {
            if (this.block != null) {
                callback(this.block, this.origin.x, this.origin.y, this.origin.z);
            }
        }

        for (var i in this.children) {
            this.children[i].visitBlocks(callback);
        }
    },

    visitChunks: function(callback, minChunkSize) {
        if (this.size == minChunkSize) {
            callback(this);
        }

        if (this.size < minChunkSize) {
            return;
        }

        if (this.children.length == 0) {
            return;
        }

        this.children.forEach(function(child) {
            child.visitChunks(callback, minChunkSize);
        });
    },

    inBound: function(x, y, z) {
        return (
            x >= this.origin.x &&
            y >= this.origin.y &&
            z >= this.origin.z &&
            x < this.origin.x + this.size &&
            y < this.origin.y + this.size &&
            z < this.origin.z + this.size
        );
    },

    getChunk: function(x, y, z, minChunkSize) {
        if (!this.inBound(x, y, z)) {
            return null;
        }

        if (minChunkSize != null) {
            if (this.size == minChunkSize) {
                return this;
            } else if (this.size > minChunkSize) {

            } else if (this.size < minChunkSize) {
                return null;
            }
        } else {
            if (this.children.length == 0) {
                return this;
            }
        }

        for (var i in this.children) {
            var chunk = this.children[i].getChunk(x, y, z, minChunkSize);
            if (chunk != null) {
                return chunk;
            }
        }

        return null;
    },

    subdivide: function() {
        if (this.size == 1) {
            return;
        }

        var x = this.origin.x;
        var y = this.origin.y;
        var z = this.origin.z;
        var size_half = this.size / 2.0;

        var coords = [
            new BlockCoord(x, y, z),
            new BlockCoord(x + size_half, y, z),
            new BlockCoord(x + size_half, y, z + size_half),
            new BlockCoord(x, y, z + size_half),

            new BlockCoord(x, y + size_half, z),
            new BlockCoord(x + size_half, y + size_half, z),
            new BlockCoord(x + size_half, y + size_half, z + size_half),
            new BlockCoord(x, y + size_half, z + size_half)
        ];

        for (var i in coords) {
            this.children.push(new BlockChunk(coords[i], size_half));
        }
    }
};

module.exports = BlockChunk;