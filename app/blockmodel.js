var BlockChunk = require("./blockengine/blockchunk");
var THREE = require("THREE");

var BlockModel = function(chunk) {
    this.chunk = chunk;
    this.geometries = null;
    this.gridSize = 2;
};

BlockModel.prototype = {
    constructor: BlockModel,

    makeCube: function(){
        var cube = new THREE.Geometry();

        var a, b, c, d, e, f, g, h;

        a = new THREE.Vector3(-0.5, -0.5, -0.5); //0
        b = new THREE.Vector3(0.5, -0.5, -0.5); //1
        c = new THREE.Vector3(0.5, -0.5, 0.5); //2
        d = new THREE.Vector3(-0.5, -0.5, 0.5); //3

        e = new THREE.Vector3(-0.5, 0.5, -0.5); //0
        f = new THREE.Vector3(0.5, 0.5, -0.5); //1
        g = new THREE.Vector3(0.5, 0.5, 0.5); //2
        h = new THREE.Vector3(-0.5, 0.5, 0.5); //3

        [a, b, c, d, e, f, g, h].forEach(function(vertice) {
            cube.vertices.push(vertice);
        })

        cube.faces.push(new THREE.Face3(1, 0, 2));
        cube.faces.push(new THREE.Face3(3, 2, 0));
        cube.faces.push(new THREE.Face3(4, 5, 6));
        cube.faces.push(new THREE.Face3(4, 6, 7));

        cube.faces.push(new THREE.Face3(0, 1, 5));
        cube.faces.push(new THREE.Face3(1, 2, 6));
        cube.faces.push(new THREE.Face3(2, 3, 7));
        cube.faces.push(new THREE.Face3(3, 0, 4));

        cube.faces.push(new THREE.Face3(5, 4, 0));
        cube.faces.push(new THREE.Face3(6, 5, 1));
        cube.faces.push(new THREE.Face3(7, 6, 2));
        cube.faces.push(new THREE.Face3(4, 7, 3));

        return cube;
    },

    initGeometry: function() {
    	var center = new THREE.Vector3().subVectors(this.chunk.higherBound, this.chunk.lowerBound).multiplyScalar(0.5);
		var geometries = [];

    	this.chunk.visitLeafs(function(leaf){
    		var geometry = new THREE.Geometry();

    		leaf.visitBlocks(function(block, x, y, z){
				var cube = this.makeCube();
				cube.applyMatrix(new THREE.Matrix4().makeTranslation(x - center.x, y - center.y, z - center.z));
				cube.applyMatrix(new THREE.Matrix4().makeScale(this.gridSize, this.gridSize, this.gridSize));
				geometry.merge(cube);
    		}.bind(this));

    		geometries.push(geometry);
    	}.bind(this));

    	this.geometries = geometries;
    }
};

module.exports = BlockModel;