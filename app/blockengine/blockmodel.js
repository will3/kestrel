var THREE = require("THREE");

var BlockModel = function(chunk) {
    this.chunk = chunk;
    this.object = null;
    this.gridSize = 2;
    this.minChunkSize = 4;

    //mesh mapping with chunk's uuid
    this.meshMapping = {};
};

BlockModel.prototype = {
    constructor: BlockModel,

    //need to 
    //update faces
    //update neighbour blocks
    //update neighbour chunks
    //add tests
    add: function(x, y, z, block) {
        this.chunk.add(x, y, z, block);
        var chunk = this.chunk.getChunk(x, y, z, this.minChunkSize);
        var mesh = chunk.getMesh();
        if(this.meshMapping[chunk.uuid] != null){
            this.object.remove(mesh);
            this.meshMapping[chunk.uuid] = null;
        }

        this.object.add(mesh);
        this.meshMapping[chunk.uuid] = mesh;
    },

    initObject: function() {
        this.object = new THREE.Object3D();

        this.chunk.visitChunks(function(chunk) {
            var mesh = chunk.getMesh();
            if (mesh != null) {
                this.object.add(mesh);
                this.meshMapping[chunk.uuid] = mesh;
            }
        }.bind(this), this.minChunkSize);
    }
};

module.exports = BlockModel;