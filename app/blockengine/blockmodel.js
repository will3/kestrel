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
    this._centerOffset = null;
};

BlockModel.prototype = {
    constructor: BlockModel,

    add: function(x, y, z, block) {
        this.chunk.add(x, y, z, block);
        this._updateDirty(x, y, z);
    },

    remove: function(x, y, z) {
        this.chunk.remove(x, y, z);
        this._updateDirty(x, y, z);
    },

    update: function() {
        for (var uuid in this.chunkStates) {
            var chunkState = this.chunkStates[uuid];
            if (chunkState.dirty) {
                this._updateChunk(chunkState.chunk);
            }

            chunkState.dirty = false;
        }
    },

    center: function() {
        var xCoords = [];
        var yCoords = [];
        var zCoords = [];
        this.chunk.visitBlocks(function(block, x, y, z) {
            xCoords.push(x);
            yCoords.push(y);
            zCoords.push(z);
        });

        var min = new THREE.Vector3(_.min(xCoords), _.min(yCoords), _.min(zCoords));
        var max = new THREE.Vector3(_.max(xCoords), _.max(yCoords), _.max(zCoords));

        var center = new THREE.Vector3().addVectors(min, max).multiplyScalar(0.5);

        var offset = center.multiplyScalar(-this.gridSize);

        this.object.children.forEach(function(child) {
            child.position.set(offset);
        });

        this._centerOffset = offset;
    },

    hitTest: function(vector){
        
    },

    _updateDirty: function(x, y, z) {
        this._setDirty(this.chunk.getChunk(x, y, z, this.minChunkSize));

        if (this.chunk.get(x - 1, y, z) != null) {
            this._setDirty(this.chunk.getChunk(x - 1, y, z, this.minChunkSize));
        }
        if (this.chunk.get(x + 1, y, z) != null) {
            this._setDirty(this.chunk.getChunk(x + 1, y, z, this.minChunkSize));
        }
        if (this.chunk.get(x, y - 1, z) != null) {
            this._setDirty(this.chunk.getChunk(x, y - 1, z, this.minChunkSize));
        }
        if (this.chunk.get(x, y + 1, z) != null) {
            this._setDirty(this.chunk.getChunk(x, y + 1, z, this.minChunkSize));
        }
        if (this.chunk.get(x, y, z - 1) != null) {
            this._setDirty(this.chunk.getChunk(x, y, z - 1, this.minChunkSize));
        }
        if (this.chunk.get(x, y, z + 1) != null) {
            this._setDirty(this.chunk.getChunk(x, y, z + 1, this.minChunkSize));
        }

        var chunk = this.chunk.getChunk(x, y, z, this.minChunkSize);
        this._setDirty(chunk);
    },

    _updateChunk: function(chunk) {
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

            if (left == null || left.hasGaps) {
                this._addFace(geometry, block, 'left', x, y, z);
            }

            if (right == null || right.hasGaps) {
                this._addFace(geometry, block, 'right', x, y, z);
            }

            if (bottom == null || bottom.hasGaps) {
                this._addFace(geometry, block, 'bottom', x, y, z);
            }

            if (top == null || top.hasGaps) {
                this._addFace(geometry, block, 'top', x, y, z);
            }

            if (back == null || back.hasGaps) {
                this._addFace(geometry, block, 'back', x, y, z);
            }

            if (front == null || front.hasGaps) {
                this._addFace(geometry, block, 'front', x, y, z);
            }

        }.bind(this));

        this.object.add(mesh);

        if (this._centerOffset != null) {
            mesh.position.copy(this._centerOffset);
        }
    },

    _setDirty: function(chunk) {
        var chunkState = this.chunkStates[chunk.uuid];
        if (chunkState == null) {
            chunkState = this.chunkStates[chunk.uuid] = {};
            chunkState.chunk = chunk;
        }

        chunkState.dirty = true;
    },

    _addFace: function(geometry, block, face, x, y, z) {
        var verticesOffset = geometry.vertices.length;
        var result = block.getFace(face, verticesOffset);
        var vertices = result.vertices;

        vertices.forEach(function(vertice) {
            vertice.add(new THREE.Vector3(x, y, z));
            vertice.multiplyScalar(this.gridSize);
        }.bind(this));

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