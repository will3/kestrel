var THREE = require("THREE");
var BlockChunk = require("./blockchunk");
var BlockCoord = require("./blockcoord");

var BlockModel = function(halfSize) {
    this.chunk = new BlockChunk(new BlockCoord(-halfSize, -halfSize, -halfSize), halfSize * 2);
    this.gridSize = 2;
    this.minChunkSize = 4;

    this.faceMapping = {};

    this.geometry = new THREE.Geometry();
    this.material = new THREE.MeshBasicMaterial({
        color: 0xffffff
    });
    this.object = new THREE.Mesh(this.geometry, this.material);
};

BlockModel.prototype = {
    constructor: BlockModel,

    add: function(x, y, z, block) {        
        this.chunk.add(x, y, z, block);

        this.addBlockGeometry(block, x, y, z);

        //update neighbours
        this.updateBlockGeometry(this.chunk.get(x - 1, y, z), x - 1, y, z);
        this.updateBlockGeometry(this.chunk.get(x + 1, y, z), x + 1, y, z);
        this.updateBlockGeometry(this.chunk.get(x, y - 1, z), x, y - 1, z);
        this.updateBlockGeometry(this.chunk.get(x, y + 1, z), x, y + 1, z);
        this.updateBlockGeometry(this.chunk.get(x, y, z - 1), x, y, z - 1);
        this.updateBlockGeometry(this.chunk.get(x, y, z + 1), x, y, z + 1);
    },

    getFaces: function(uuid) {
        return this.faceMapping[uuid];
    },

    //need to 
    //update faces
    //update neighbour blocks
    //update neighbour chunks
    //add tests
    // add: function(x, y, z, block) {
    //     this.chunk.add(x, y, z, block);
    //     var chunk = this.chunk.getChunk(x, y, z, this.minChunkSize);
    //     var mesh = chunk.getMesh();
    //     if(this.meshMapping[chunk.uuid] != null){
    //         this.object.remove(mesh);
    //         this.meshMapping[chunk.uuid] = null;
    //     }

    //     this.object.add(mesh);
    //     this.meshMapping[chunk.uuid] = mesh;
    // },

    addFace: function(cube, block, face) {
        if (cube.vertices.length != 8) {
            throw "cube not initialized";
        }

        var plane;
        switch (face) {
            case 'left':
                plane = this.getLeft();
                break;
            case 'right':
                plane = this.getRight();
                break;
            case 'bottom':
                plane = this.getBottom();
                break;
            case 'top':
                plane = this.getTop();
                break;
            case 'back':
                plane = this.getBack();
                break;
            case 'front':
                plane = this.getFront();
                break;
            default:
                throw "invalid face: " + face;
        }

        if (this.faceMapping[block.uuid] == null) {
            this.faceMapping[block.uuid] = {};
        }

        this.faceMapping[face] = plane;

        cube.faces.push(plane[0]);
        cube.faces.push(plane[1]);
    },

    addBlockGeometry: function(block, x, y, z) {
        var cube = new THREE.Geometry();
        var vertices = this.getVertices();
        for (var i in vertices) {
            cube.vertices.push(vertices[i]);
        }

        if (!block.hasLeft) {
            this.addFace(cube, block, 'left');
        }
        if (!block.hasRight) {
            this.addFace(cube, block, 'right');
        }
        if (!block.hasBottom) {
            this.addFace(cube, block, 'bottom');
        }
        if (!block.hasTop) {
            this.addFace(cube, block, 'top');
        }
        if (!block.hasBack) {
            this.addFace(cube, block, 'back');
        }
        if (!block.hasFront) {
            this.addFace(cube, block, 'front');
        }

        if (cube.faces.length == 0) {
            return;
        }

        cube.applyMatrix(new THREE.Matrix4().makeTranslation(x, y, z));

        this.geometry.merge(cube);
    },

    removeBlockGeometry: function(block) {
        var faces = this.faceMapping[block.uuid];
        for (var i in faces) {
            _.pull(this.geometry.faces, faces[i][0]);
            _.pull(this.geometry.faces, faces[i][1]);
        }
    },

    updateBlockGeometry: function(block, x, y, z) {
        if(block == null){
            return;
        }
        this.removeBlockGeometry(block);
        this.addBlockGeometry(block, x, y, z);
    },

    getVertices: function() {
        return [
            new THREE.Vector3(-0.5, -0.5, -0.5), //0
            new THREE.Vector3(0.5, -0.5, -0.5), //1
            new THREE.Vector3(0.5, -0.5, 0.5), //2
            new THREE.Vector3(-0.5, -0.5, 0.5), //3
            new THREE.Vector3(-0.5, 0.5, -0.5), //0
            new THREE.Vector3(0.5, 0.5, -0.5), //1
            new THREE.Vector3(0.5, 0.5, 0.5), //2
            new THREE.Vector3(-0.5, 0.5, 0.5), //3
        ];
    },

    getLeft: function() {
        return [
            new THREE.Face3(0, 3, 4),
            new THREE.Face3(7, 4, 3)
        ];
    },

    getRight: function() {
        return [
            new THREE.Face3(5, 6, 1),
            new THREE.Face3(2, 1, 6)
        ];
    },

    getBottom: function() {
        return [
            new THREE.Face3(0, 1, 2),
            new THREE.Face3(2, 3, 0)
        ];
    },

    getTop: function() {
        return [
            new THREE.Face3(5, 4, 6),
            new THREE.Face3(6, 4, 7)
        ];
    },

    getBack: function() {
        return [
            new THREE.Face3(1, 0, 5),
            new THREE.Face3(4, 5, 0)
        ];
    },

    getFront: function() {
        return [
            new THREE.Face3(3, 2, 7),
            new THREE.Face3(6, 7, 2)
        ];
    }
};

module.exports = BlockModel;