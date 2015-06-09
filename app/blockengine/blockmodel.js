var THREE = require("THREE");
var BlockChunk = require("./blockchunk");
var BlockCoord = require("./blockcoord");
var _ = require("lodash");
var CANNON = require("CANNON");
var BlockUtils = require("./blockutils");

var BlockModel = function(params) {
    params = params || {};

    var halfSize = params.halfSize;
    var gridSize = params.gridSize || 2;
    var minChunkSize = params.minChunkSize || 4;

    var chunkHalfSize = Math.pow(2, Math.ceil(Math.log(halfSize) / Math.log(2)));
    this.chunk = new BlockChunk(new BlockCoord(-chunkHalfSize, -chunkHalfSize, -chunkHalfSize), chunkHalfSize * 2);
    this.gridSize = gridSize;
    this.minChunkSize = minChunkSize;

    this.object = new THREE.Object3D();

    this.chunkStates = {};
    this.blockRadius = null;

    this.blocks = {};
    this.blockTypesToMap = params.blockTypesToMap || null;

    this.centerOffset = new THREE.Vector3(0,0,0);
    this.centerOfMass = null;
    this.min = null;
    this.max = null;

    this.onRemoveCallback = null;
    this.onBrokenCallback = null;
};

BlockModel.prototype = {
    constructor: BlockModel,

    add: function(x, y, z, block) {
        this.chunk.add(x, y, z, block, true);
        this._updateDirty(x, y, z);
        this._updateBlockMapping(x, y, z, block, false);
    },

    remove: function(x, y, z) {
        var block = this.chunk.remove(x, y, z);
        this._updateDirty(x, y, z);
        this._updateBlockMapping(x, y, z, block, true);

        if (this.onRemoveCallback != null) {
            this.onRemoveCallback(x, y, z);
        }

        if (this.onBrokenCallback != null) {
            var contiguous = this.chunk.checkContiguous();
            if (!contiguous) {
                this.onBrokenCallback();
            }
        }
    },

    onRemove: function(callback) {
        this.onRemoveCallback = callback;
    },

    onBroken: function(callback) {
        this.onBrokenCallback = callback;
    },

    get blockCount() {
        return this.chunk.blockCount;
    },

    get mass() {
        return this.blockCount * Math.pow(this.gridSize, 3);
    },

    //simplify to sphere r n
    get rotationalInertia() {
        return 2 / 5.0 * this.mass * this.blockRadius * this.blockRadius;
    },

    _updateBlockMapping: function(x, y, z, block, isRemove) {
        if (this.blockTypesToMap == null) {
            return;
        }

        if (_.includes(this.blockTypesToMap, block.blockType)) {
            var chunk = this.blocks[block.blockType];
            if (chunk == null) {
                chunk = this.blocks[block.blockType] = new BlockChunk(this.chunk.origin, this.chunk.size);
            }

            if (isRemove) {
                chunk.remove(x, y, z);
            } else {
                chunk.add(x, y, z, block);
            }
        }
    },

    mergeModel: function(model, startX, startY, startZ) {
        this.chunk.merge(model.chunk,startX, startY, startZ);
        model.visitBlocks(function(block, x, y, z) {
            this.add(startX + x, startY + y, startZ + z, block);
        }.bind(this));
    },

    update: function() {
        for (var uuid in this.chunkStates) {
            var chunkState = this.chunkStates[uuid];
            if (chunkState.dirty) {
                this._updateChunk(chunkState.chunk);
            }

            chunkState.dirty = false;
        }

        if (this.blockCountIsDirty) {
            this._updateBlockCount();
        }
    },

    damage: function(x, y, z, amount) {
        var block = this.chunk.get(x, y, z);
        if (block == null) {
            return;
        }

        var integrity = block.integrity;
        integrity -= amount;
        if (integrity < 0) {
            integrity = 0;
        }

        block.integrity = integrity;

        if (block.integrity == 0) {
            this.remove(x, y, z);
        }

        this._updateDirty(x, y, z);
    },

    damageArea: function(centerX, centerY, centerZ, amount, blockRadius) {
        BlockUtils.visitRange(centerX, centerY, centerZ, blockRadius, function(x, y, z, distance) {
            var ratio = (blockRadius - distance + 1) / (blockRadius + 1);
            this.damage(x, y, z, amount * ratio);
        }.bind(this));
    },

    //centers model around center of mass
    center: function() {
        var xCoords = [];
        var yCoords = [];
        var zCoords = [];
        var count = 0.0;
        this.chunk.visitBlocks(function(block, x, y, z) {
            xCoords.push(x);
            yCoords.push(y);
            zCoords.push(z);
            count++;
        });

        this.min = new THREE.Vector3(_.min(xCoords), _.min(yCoords), _.min(zCoords));
        this.max = new THREE.Vector3(_.max(xCoords), _.max(yCoords), _.max(zCoords));
        this.centerOfMass = new THREE.Vector3(_.sum(xCoords) / count + 0.5, _.sum(yCoords) / count + 0.5, _.sum(zCoords) / count + 0.5);

        this.centerOffset = new THREE.Vector3().copy(this.centerOfMass).multiplyScalar(-1);

        var minRadius = new THREE.Vector3().subVectors(this.centerOfMass, this.min).length();
        var maxRadius = new THREE.Vector3().subVectors(this.max, this.centerOfMass).length();
        this.blockRadius = (maxRadius > minRadius) ? maxRadius : minRadius;

        for (var uuid in this.chunkStates) {
            this._updateChunkPosition(uuid);
        }
    },

    hitTest: function(position, radius) {
        var distance = position.distanceTo(this.object.position);
        if (distance > (radius + this.blockRadius * this.gridSize)) {
            return false;
        }

        var coords = new THREE.Vector3().copy(position).applyMatrix4(this.getWorldInverseMatrix());

        var blockRadius = Math.ceil(radius * this.gridSize);

        var blockCoord = new BlockCoord(Math.round(coords.x), Math.round(coords.y), Math.round(coords.z));
        var blockRadius = Math.ceil(radius * 2);

        var result = null;
        BlockUtils.visitRange(blockCoord.x, blockCoord.y, blockCoord.z, blockRadius, function(x, y, z, distance) {
            if (result != null) {
                return;
            }
            var block = this.chunk.get(x, y, z);
            if (block != null) {
                result = {
                    result: true,
                    block: block,
                    coord: new BlockCoord(x, y, z)
                }
            }
        }.bind(this));

        if (result != null) {
            return result;
        }

        return false;
    },

    //gets local vector from block coords
    getLocalPosition: function(blockCoords) {
        return new THREE.Vector3().copy(blockCoords).applyMatrix4(this.getLocalMatrix());
    },

    //matrix that transforms block coords to local vector
    getLocalMatrix: function() {
        var centerOffset = new THREE.Matrix4().makeTranslation(this.centerOffset.x, this.centerOffset.y, this.centerOffset.z);
        var gridSize = new THREE.Matrix4().makeScale(this.gridSize, this.gridSize, this.gridSize);
        var m = new THREE.Matrix4();
        
        m.multiply(gridSize);
        m.multiply(centerOffset);

        return m;
    },

    //matrix that transforms block coords to world vector
    // = local matrix * this.object.matrixWorld
    getWorldMatrix: function() {
        var localMatrix = this.getLocalMatrix();
        var objectMatrixWorld = this.object.matrixWorld;

        var m = new THREE.Matrix4();
        m.multiply(objectMatrixWorld);
        m.multiply(localMatrix);

        return m;
    },

    //inverse of world matrix
    getWorldInverseMatrix: function() {
        return new THREE.Matrix4().getInverse(this.getWorldMatrix());
    },

    visitBlocks: function(callback) {
        this.chunk.visitBlocks(callback);
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
        var chunkState = this._getChunkState(chunk);

        if (chunkState.mesh != null) {
            this.object.remove(chunkState.mesh);
        }

        var geometry = new THREE.Geometry();
        var materials = [];
        var material = new THREE.MeshFaceMaterial(materials);
        var mesh = new THREE.Mesh(geometry, material);

        chunkState.mesh = mesh;

        var materialMapping = {};
        chunk.visitBlocks(function(block, x, y, z) {
            if (materialMapping[block.color.getHexString()] == null) {
                materials.push(
                    // new THREE.MeshLambertMaterial({
                    new THREE.MeshBasicMaterial({
                        color: block.color
                    }));

                materialMapping[block.color.getHexString()] = {
                    index: materials.length - 1
                }
            }
        })

        chunk.visitBlocks(function(block, x, y, z) {
            var materialIndex = materialMapping[block.color.getHexString()].index;

            var left = this.chunk.get(x - 1, y, z);
            var right = this.chunk.get(x + 1, y, z);
            var bottom = this.chunk.get(x, y - 1, z);
            var top = this.chunk.get(x, y + 1, z);
            var back = this.chunk.get(x, y, z - 1);
            var front = this.chunk.get(x, y, z + 1);

            if (left == null || left.hasGaps) {
                this._addFace(chunk, block, 'left', x, y, z, materialIndex);
            }

            if (right == null || right.hasGaps) {
                this._addFace(chunk, block, 'right', x, y, z, materialIndex);
            }

            if (bottom == null || bottom.hasGaps) {
                this._addFace(chunk, block, 'bottom', x, y, z, materialIndex);
            }

            if (top == null || top.hasGaps) {
                this._addFace(chunk, block, 'top', x, y, z, materialIndex);
            }

            if (back == null || back.hasGaps) {
                this._addFace(chunk, block, 'back', x, y, z, materialIndex);
            }

            if (front == null || front.hasGaps) {
                this._addFace(chunk, block, 'front', x, y, z, materialIndex);
            }

        }.bind(this));

        this._updateChunkPosition(chunk.uuid);

        mesh.geometry.computeFaceNormals();

        this.object.add(mesh);
    },

    _addFace: function(chunk, block, face, x, y, z, materialIndex) {
        var mesh = this.chunkStates[chunk.uuid].mesh;
        var geometry = mesh.geometry;
        var verticesOffset = geometry.vertices.length;
        var result = block.getFace(face, verticesOffset);
        var vertices = result.vertices;

        var triangles = result.triangles;

        vertices.forEach(function(vertice) {
            vertice.add(new THREE.Vector3(x, y, z));
            vertice.multiplyScalar(this.gridSize);
        }.bind(this));

        vertices.forEach(function(vertice) {
            geometry.vertices.push(vertice);
        }.bind(this));

        triangles.forEach(function(triangle) {
            triangle.materialIndex = materialIndex;
            geometry.faces.push(triangle);
        }.bind(this));
    },

    _updateChunkPosition: function(uuid) {
        var chunkState = this.chunkStates[uuid];

        if (chunkState.mesh == null) {
            return;
        }

        var mesh = this.chunkStates[uuid].mesh;
        var chunk = this.chunkStates[uuid].chunk;

        var meshPosition = new THREE.Vector3();
        if (this.centerOffset != null) {
            meshPosition.add(this.centerOffset);
        }

        meshPosition.multiplyScalar(this.gridSize);
        mesh.position.copy(meshPosition);
    },

    _setDirty: function(chunk) {
        var chunkState = this._getChunkState(chunk);
        chunkState.dirty = true;
    },

    _getChunkState: function(chunk) {
        var chunkState = this.chunkStates[chunk.uuid];

        if (chunkState == null) {
            chunkState = this.chunkStates[chunk.uuid] = {};
            chunkState.chunk = chunk;
        }

        return chunkState;
    }
};

module.exports = BlockModel;