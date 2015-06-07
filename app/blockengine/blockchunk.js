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
    this.minChunkSize = 4;

    //  7   6  
    //4   5
    //  3   2  
    //0   1
    this.children = [];
    this.childrenMap = [];

    this.object = null;

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
        if (chunk.size != this.minChunkSize) {
            return null;
        }

        if (chunk.object == null) {
            return null;
        }

        return chunk.object[x - chunk.origin.x][y - chunk.origin.y][z - chunk.origin.z];
    },

    add: function(x, y, z, block) {
        if (!this.inBound(x, y, z)) {
            throw "out of bounds for " + x + " " + y + " " + z;
        }

        var chunk = this.getChunk(x, y, z);

        while (chunk.size != this.minChunkSize) {
            chunk.subdivide();
            chunk = chunk.getChunk(x, y, z);
        }

        if (chunk.object == null) {
            var blockMap = [];
            for (var block_x = 0; block_x < this.minChunkSize; block_x++) {
                blockMap[block_x] = [];
                for (var block_y = 0; block_y < this.minChunkSize; block_y++) {
                    blockMap[block_x][block_y] = [];
                }
            }
            chunk.object = blockMap;
        }

        chunk.object[x - chunk.origin.x][y - chunk.origin.y][z - chunk.origin.z] = block;
    },

    remove: function(x, y, z) {
        var chunk = this.getChunk(x, y, z);

        if (chunk.size != this.minChunkSize || chunk.object == null) {
            throw "block doesn't exisit";
        }

        var block = chunk.object[x - chunk.origin.x][y - chunk.origin.y][z - chunk.origin.z];
        if (block == null) {
            throw "nothing to remove at " + x + " " + y + " " + z;
        }

        chunk.object[x - chunk.origin.x][y - chunk.origin.y][z - chunk.origin.z] = null;
    },

    //return true in callback to stop loop
    visitBlocks: function(callback, firstOnly) {
        if (this.children.length != 0) {
            for (var i in this.children) {
                this.children[i].visitBlocks(callback);
            }
        }

        if (this.object == null) {
            return null;
        }

        for (var x = 0; x < this.object.length; x++) {
            for (y = 0; y < this.object[x].length; y++) {
                for (z = 0; z < this.object[x][y].length; z++) {
                    var block = this.object[x][y][z];
                    if (block != null) {
                        callback(block, x + this.origin.x, y + this.origin.y, z + this.origin.z);
                        if (firstOnly) {
                            return;
                        }
                    }
                }
            }
        }
    },

    visitBlocksContiguous: function(x, y, z, callback) {
        var detail = this._getDetail(x, y, z);
        if (detail == null) {
            throw "cannot found block at " + x + " " + y + " " + z;
        }

        var visited = new BlockChunk(this.origin, this.size);
        visited.add(x, y, z, true);

        var opened = [detail];

        var index = 0;
        while (index < opened.length) {
            var next = opened[index];

            var details = [
                this._getDetail(next.x - 1, next.y, next.z, visited),
                this._getDetail(next.x + 1, next.y, next.z, visited),
                this._getDetail(next.x, next.y - 1, next.z, visited),
                this._getDetail(next.x, next.y + 1, next.z, visited),
                this._getDetail(next.x, next.y, next.z - 1, visited),
                this._getDetail(next.x, next.y, next.z + 1, visited)
            ];

            details.forEach(function(detail) {
                if (detail != null) {
                    visited.add(detail.x, detail.y, detail.z, true);
                    opened.push(detail);
                }
            })

            callback(next.block, next.x, next.y, next.z);
            index++;
        }
    },

    _getDetail: function(x, y, z, visited) {
        if (visited != null) {
            if (visited.get(x, y, z)) {
                return null;
            }
        }
        var block = this.get(x, y, z);
        if (block == null) {
            return null;
        }
        return {
            block: block,
            uuid: block.uuid,
            x: x,
            y: y,
            z: z,
        }
    },

    getContiguousGroups: function() {
        //construct block mapping
        var total = 0;
        var tempChunk = new BlockChunk(this.origin, this.size);

        this.visitBlocks(function(block, x, y, z) {
            tempChunk.add(x, y, z, block);
            total++;
        });

        var groups = [];
        var count = 0;
        while (count < total) {
            var firstResult = null;

            tempChunk.visitBlocks(function(block, x, y, z) {
                firstResult = {
                    block: block,
                    x: x,
                    y: y,
                    z: z
                }
            }, true);

            var group = [];

            this.visitBlocksContiguous(firstResult.x, firstResult.y, firstResult.z, function(block, x, y, z) {
                group.push({
                    block: block,
                    x: x,
                    y: y,
                    z: z
                });

                tempChunk.remove(x, y, z);

                count++;
            });

            if (group.length == 0) {
                throw "failed to allocate contiguous group";
            }

            groups.push(group);
        }

        return groups;
    },

    visitChunks: function(callback, minChunkSize) {
        if (minChunkSize < this.minChunkSize) {
            throw "minChunkSize is too low";
        }

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
        if (this.size == this.minChunkSize) {
            return;
        }

        var x = this.origin.x;
        var y = this.origin.y;
        var z = this.origin.z;
        var size_half = this.size / 2.0;

        this.children = [
            new BlockChunk(new BlockCoord(x, y, z), size_half),
            new BlockChunk(new BlockCoord(x + size_half, y, z), size_half),
            new BlockChunk(new BlockCoord(x + size_half, y, z + size_half), size_half),
            new BlockChunk(new BlockCoord(x, y, z + size_half), size_half),

            new BlockChunk(new BlockCoord(x, y + size_half, z), size_half),
            new BlockChunk(new BlockCoord(x + size_half, y + size_half, z), size_half),
            new BlockChunk(new BlockCoord(x + size_half, y + size_half, z + size_half), size_half),
            new BlockChunk(new BlockCoord(x, y + size_half, z + size_half), size_half)
        ];

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