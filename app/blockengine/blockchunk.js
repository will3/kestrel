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

    //  7   6  
    //4   5
    //  3   2  
    //0   1
    this.children = [];
    this.childrenMap = [];

    this.block = null;

    //mesh for chunk
    this.mesh = null;
};

BlockChunk.prototype = {
    constructor: BlockChunk,

    merge: function(chunk, xOffset, yOffset, zOffset) {
        if (chunk.type != "BlockChunk") {
            throw "attempt to merge non chunk object";
        }

        chunk.visitBlocks(function(block, x, y, z) {
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

        chunk.block = block;
    },

    remove: function(x, y, z) {
        var chunk = this.getChunk(x, y, z);

        if (chunk.size != 1 || chunk.block == null) {
            throw "block doesn't exisit";
        }

        chunk.block = null;
    },

    visitBlocks: function(callback, stopFunc) {
        if (this.children.length == 0) {
            if (this.block != null) {
                callback(this.block, this.origin.x, this.origin.y, this.origin.z);
                if (stopFunc != null) {
                    var stop = stopFunc();
                    if (stop) {
                        return;
                    }
                }
            }
        }

        for (var i in this.children) {
            this.children[i].visitBlocks(callback);
        }
    },

    visitBlocksContiguous: function(x, y, z, callback, visitedBlocks) {
        if (visitedBlocks == null) {
            visitedBlocks = [];
        }

        var block = this.get(x, y, z);
        if (block == null) {
            return;
        }

        if (_.contains(visitedBlocks, block.uuid)) {
            return;
        }

        callback(block, x, y, z);
        visitedBlocks.push(block.uuid);

        this.visitBlocksContiguous(x - 1, y, z, callback, visitedBlocks);
        this.visitBlocksContiguous(x + 1, y, z, callback, visitedBlocks);
        this.visitBlocksContiguous(x, y - 1, z, callback, visitedBlocks);
        this.visitBlocksContiguous(x, y + 1, z, callback, visitedBlocks);
        this.visitBlocksContiguous(x, y, z - 1, callback, visitedBlocks);
        this.visitBlocksContiguous(x, y, z + 1, callback, visitedBlocks);
    },

    getContiguousGroups: function() {
        //construct block mapping
        var total = 0;
        var testChunk = new BlockChunk(this.origin, this.size);

        this.visitBlocks(function(block, x, y, z) {
            testChunk.add(x, y, z, {
                block: block,
                x: x,
                y: y,
                z: z
            });

            total++;
        });

        var groups = [];
        var count = 0;
        while (count < total) {
            var firstResult = null;
            var stop = false;

            testChunk.visitBlocks(function(block, x, y, z) {
                firstResult = block;
                stop = true;
            }, function() {
                return stop;
            })

            var group = [];
            this.visitBlocksContiguous(firstResult.x, firstResult.y, firstResult.z, function(block, x, y, z) {
                group.push({
                    block: block,
                    x: x,
                    y: y,
                    z: z
                });

                testChunk.remove(x, y, z);

                count++;
            });

            groups.push(group);
        }

        return groups;
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

        var size_half = this.size / 2.0;
        var xIndex = (x < (this.origin.x + size_half)) ? 0 : 1;
        var yIndex = (y < (this.origin.y + size_half)) ? 0 : 1;
        var zIndex = (z < (this.origin.z + size_half)) ? 0 : 1;

        var child = this.childrenMap[xIndex][yIndex][zIndex];

        return child.getChunk(x, y, z, minChunkSize);
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

        this.children = [];
        for (var i in coords) {
            this.children.push(new BlockChunk(coords[i], size_half));
        }

        this.childrenMap = [
            [
                [],
                []
            ],
            [
                [],
                []
            ]
        ];

        this.childrenMap[0][0][0] = this.children[0];
        this.childrenMap[1][0][0] = this.children[1];
        this.childrenMap[1][0][1] = this.children[2];
        this.childrenMap[0][0][1] = this.children[3];

        this.childrenMap[0][1][0] = this.children[4];
        this.childrenMap[1][1][0] = this.children[5];
        this.childrenMap[1][1][1] = this.children[6];
        this.childrenMap[0][1][1] = this.children[7];
    }
};

module.exports = BlockChunk;