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
    this.radius = null;
};

BlockModel.prototype = {
    constructor: BlockModel,

    get chunkRadius() {
        return this.chunk.radius;
    },

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

        this._centerOffset = center.multiplyScalar(-1);

        this.radius = new THREE.Vector3().subVectors(max, min).multiplyScalar(0.5).length();

        for (var uuid in this.meshMapping) {
            this._updateChunkPosition(uuid);
        }
    },

    hitTest: function(position, radius) {
        var distance = position.distanceTo(this.object.position);
        if (distance > (radius + this.radius)) {
            return false;
        }

        var coords = new THREE.Vector3().copy(position).applyMatrix4(this.getWorldInverseMatrix());

        var blockRadius = Math.ceil(radius * this.gridSize);

        var blockCoord = new BlockCoord(Math.round(coords.x), Math.round(coords.y), Math.round(coords.z));
        var blockRadius = Math.ceil(radius * 2);

        var block = this.chunk.get(blockCoord.x, blockCoord.y, blockCoord.z);

        if (block != null) {
            return {
                result: true,
                block: block,
                coords: blockCoord
            }
        }

        return false;
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
            this.object.remove(this.meshMapping[chunk.uuid].mesh);
        }

        var geometry = new THREE.Geometry();
        var material = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });

        var mesh = new THREE.Mesh(geometry, material);
        this.meshMapping[chunk.uuid] = {
            mesh: mesh,
            chunk: chunk
        };

        chunk.visitBlocks(function(block, x, y, z) {

            var left = this.chunk.get(x - 1, y, z);
            var right = this.chunk.get(x + 1, y, z);
            var bottom = this.chunk.get(x, y - 1, z);
            var top = this.chunk.get(x, y + 1, z);
            var back = this.chunk.get(x, y, z - 1);
            var front = this.chunk.get(x, y, z + 1);

            if (left == null || left.hasGaps) {
                this._addFace(chunk, block, 'left', x, y, z);
            }

            if (right == null || right.hasGaps) {
                this._addFace(chunk, block, 'right', x, y, z);
            }

            if (bottom == null || bottom.hasGaps) {
                this._addFace(chunk, block, 'bottom', x, y, z);
            }

            if (top == null || top.hasGaps) {
                this._addFace(chunk, block, 'top', x, y, z);
            }

            if (back == null || back.hasGaps) {
                this._addFace(chunk, block, 'back', x, y, z);
            }

            if (front == null || front.hasGaps) {
                this._addFace(chunk, block, 'front', x, y, z);
            }

        }.bind(this));

        this._updateChunkPosition(chunk.uuid);

        this.object.add(mesh);
    },

    getWorldMatrix: function() {
        var centerOffset = new THREE.Matrix4().makeTranslation(this._centerOffset.x, this._centerOffset.y, this._centerOffset.z);
        var gridSize = new THREE.Matrix4().makeScale(this.gridSize, this.gridSize, this.gridSize);
        var objectMatrixWorld = this.object.matrixWorld;

        var m = new THREE.Matrix4();
        m.multiply(objectMatrixWorld);
        m.multiply(gridSize);
        m.multiply(centerOffset);

        return m;
    },

    getWorldInverseMatrix: function() {
        return new THREE.Matrix4().getInverse(this.getWorldMatrix());
    },

    _updateChunkPosition: function(uuid) {
        if (this.meshMapping[uuid] == null) {
            return;
        }

        var mesh = this.meshMapping[uuid].mesh;
        var chunk = this.meshMapping[uuid].chunk;

        var meshPosition = new THREE.Vector3();
        if (this._centerOffset != null) {
            meshPosition.add(this._centerOffset);
        }

        meshPosition.multiplyScalar(this.gridSize);
        mesh.position.copy(meshPosition);
    },

    _setDirty: function(chunk) {
        var chunkState = this.chunkStates[chunk.uuid];
        if (chunkState == null) {
            chunkState = this.chunkStates[chunk.uuid] = {};
            chunkState.chunk = chunk;
        }

        chunkState.dirty = true;
    },

    _addFace: function(chunk, block, face, x, y, z) {
        var mesh = this.meshMapping[chunk.uuid].mesh;
        var geometry = mesh.geometry;
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