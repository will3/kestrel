var BlockCoord = require("./blockcoord");
var _ = require("lodash");
var assert = require("assert");
var Block = require("./block");
var THREE = require("THREE");

var BlockChunk = function(origin, size) {
    this.uuid = THREE.Math.generateUUID();

    if ((Math.log(size) / Math.log(2)) % 1 != 0) {
        throw "invalid size";
    }

    this.type = "BlockChunk";

    this.origin = origin;
    this.size = size;

    this.children = [];
    this.block = null;

    //mesh for chunk
    this.mesh = null;
};

BlockChunk.prototype = {
    constructor: BlockChunk,

    shouldShow: function() {
        var shouldShow = false;
        this.visitBlocks(function(block, x, y, z) {
            if (block.shouldShow()) {
                shouldShow = true;
            }
        });

        return shouldShow;
    },

    getGeometry: function() {
        if (this.geometry == null) {
            if (!this.shouldShow()) {
                return null;
            }

            this.geometry = new THREE.Geometry();

            this.visitBlocks(function(block, x, y, z) {
                var blockGeometry = block.getGeometry();

                if (blockGeometry == null) {
                    //skip if no cube geometry
                    return;
                }

                blockGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(x, y, z));

                this.geometry.merge(blockGeometry);
            }.bind(this));
        }

        return this.geometry;
    },

    getMaterial: function() {
        if (this.material == null) {
            this.material = new THREE.MeshBasicMaterial({
                color: 0xffffff
            });
        }

        return this.material;
    },

    getMesh: function() {
        if (this.mesh == null) {
            if (!this.shouldShow()) {
                return null;
            }

            this.mesh = new THREE.Mesh(this.getGeometry(), this.getMaterial());
        }

        return this.mesh;
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

        var left = this.get(x - 1, y, z);
        var right = this.get(x + 1, y, z);
        var bottom = this.get(x, y - 1, z);
        var top = this.get(x, y + 1, z);
        var back = this.get(x, y, z - 1);
        var front = this.get(x, y, z + 1);

        chunk.block = block;

        if (left != null) {
            block.hasLeft = left.hasRight = true;
        }

        if (right != null) {
            block.hasRight = right.hasLeft = true;
        }

        if (bottom != null) {
            block.hasBottom = bottom.hasTop = true;
        }

        if (top != null) {
            block.hasTop = top.hasBottom = true;
        }

        if (back != null) {
            block.hasBack = back.hasFront = true;
        }

        if (front != null) {
            block.hasFront = front.hasBack = true;
        }
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

    visitChunks: function(callback, size) {
        if (this.size <= size) {
            callback(this);
        } else {
            for (var i in this.children) {
                this.children[i].visitChunks(callback, size);
            }
        }
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

    getChunk: function(x, y, z, size) {
        if (!this.inBound(x, y, z)) {
            return null;
        }

        if (size == null) {
            if (this.children.length == 0) {
                return this;
            }
        }else if(size == this.size){
            return this;
        }

        for (var i in this.children) {
            var chunk = this.children[i].getChunk(x, y, z);
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