var THREE = require("THREE");
var BlockChunk = require("./blockchunk");
var BlockCoord = require("./blockcoord");
var _ = require("lodash");

var BlockModel = function(halfSize) {
    this.chunk = new BlockChunk(new BlockCoord(-halfSize, -halfSize, -halfSize), halfSize * 2);
    this.gridSize = 2;
    this.minChunkSize = 4;

    this.meshMapping = {};
    this.object = new THREE.Object3D();

    this.chunkStates = {};
};

BlockModel.prototype = {
    constructor: BlockModel,

    add: function(x, y, z, block) {
        this.chunk.add(x, y, z, block);
        this.updateDirty(x, y, z);
    },

    remove: function(x, y, z) {
        this.chunk.remove(x, y, z);
        this.updateDirty(x, y, z);
    },

    updateDirty: function(x, y, z) {
        this.setDirty(this.chunk.getChunk(x, y, z, this.minChunkSize));

        if (this.chunk.get(x - 1, y, z) != null) {
            this.setDirty(this.chunk.getChunk(x - 1, y, z, this.minChunkSize));
        }
        if (this.chunk.get(x + 1, y, z) != null) {
            this.setDirty(this.chunk.getChunk(x + 1, y, z, this.minChunkSize));
        }
        if (this.chunk.get(x, y - 1, z) != null) {
            this.setDirty(this.chunk.getChunk(x, y - 1, z, this.minChunkSize));
        }
        if (this.chunk.get(x, y + 1, z) != null) {
            this.setDirty(this.chunk.getChunk(x, y + 1, z, this.minChunkSize));
        }
        if (this.chunk.get(x, y, z - 1) != null) {
            this.setDirty(this.chunk.getChunk(x, y, z - 1, this.minChunkSize));
        }
        if (this.chunk.get(x, y, z + 1) != null) {
            this.setDirty(this.chunk.getChunk(x, y, z + 1, this.minChunkSize));
        }

        var chunk = this.chunk.getChunk(x, y, z, this.minChunkSize);
        this.setDirty(chunk);
    },

    setDirty: function(chunk) {
        var chunkState = this.chunkStates[chunk.uuid];
        if (chunkState == null) {
            chunkState = this.chunkStates[chunk.uuid] = {};
            chunkState.chunk = chunk;
        }

        chunkState.dirty = true;
    },

    update: function() {
        for (var uuid in this.chunkStates) {
            var chunkState = this.chunkStates[uuid];
            if (chunkState.dirty) {
                this.updateChunk(chunkState.chunk);
            }

            chunkState.dirty = false;
        }
    },

    updateChunk: function(chunk) {
        if (this.meshMapping[chunk.uuid] != null) {
            this.object.remove(this.meshMapping[chunk.uuid]);
        }

        var geometry = new THREE.Geometry();
        var material = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });

        this.meshMapping[chunk.uuid] = mesh = new THREE.Mesh(geometry, material);

        chunk.visitBlocks(function(block, x, y, z) {

            var left = this.chunk.get(x - 1, y, z);
            var right = this.chunk.get(x + 1, y, z);
            var bottom = this.chunk.get(x, y - 1, z);
            var top = this.chunk.get(x, y + 1, z);
            var back = this.chunk.get(x, y, z - 1);
            var front = this.chunk.get(x, y, z + 1);

            if (left == null) {
                this.addFace(geometry, block, 'left');
            }

            if (right == null) {
                this.addFace(geometry, block, 'right');
            }

            if (bottom == null) {
                this.addFace(geometry, block, 'bottom');
            }

            if (top == null) {
                this.addFace(geometry, block, 'top');
            }

            if (back == null) {
                this.addFace(geometry, block, 'back');
            }

            if (front == null) {
                this.addFace(geometry, block, 'front');
            }

        }.bind(this));

        this.object.add(mesh);
    },

    addFace: function(geometry, block, face) {
        var verticesOffset = geometry.vertices.length;
        var result = block.getFace(face, verticesOffset);
        var vertices = result.vertices;
        var triangles = result.triangles;

        vertices.forEach(function(vertice) {
            geometry.vertices.push(vertice);
        }.bind(this));

        triangles.forEach(function(triangle) {
            geometry.faces.push(triangle);
        }.bind(this));
    }
};

module.exports = BlockModel;