var BlockChunk = require("./blockengine/blockchunk");
var THREE = require("THREE");

var BlockModel = function(chunk) {
    this.chunk = chunk;
    this.geometry = null;
    this.gridSize = 2;

    //	  7   6
    //  4	5
    //	  3   2
    //	0	1
    this.getVertices = function() {
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
    };

    this.getLeft = function() {
        return [
            new THREE.Face3(3, 0, 4),
            new THREE.Face3(4, 7, 3)
        ];
    };

    this.getRight = function() {
        return [
            new THREE.Face3(6, 5, 1),
            new THREE.Face3(1, 2, 6)
        ];
    };

    this.getBottom = function() {
        return [
            new THREE.Face3(1, 0, 2),
            new THREE.Face3(3, 2, 0)
        ];
    };

    this.getTop = function() {
        return [
            new THREE.Face3(4, 5, 6),
            new THREE.Face3(4, 6, 7)
        ];
    };

    this.getBack = function() {
        return [
            new THREE.Face3(0, 1, 5),
            new THREE.Face3(5, 4, 0)
        ];
    };

    this.getFront = function() {
        return [
            new THREE.Face3(2, 3, 7),
            new THREE.Face3(7, 6, 2)
        ];
    };
};

//should
//update should show from block model
BlockModel.prototype = {
    constructor: BlockModel,

    initGeometry: function() {
        var center = new THREE.Vector3().subVectors(this.chunk.higherBound, this.chunk.lowerBound).multiplyScalar(0.5);
        var geometries = [];
        var geometry = new THREE.Geometry();

        this.chunk.visitBlockRecursively(function(block, x, y, z) {
            if (!block.shouldShow()) {
                return;
            }

            var cube = new THREE.Geometry();
            var vertices = this.getVertices();
            for (var i in vertices) {

                cube.vertices.push(vertices[i]);
                if (block.showLeft) {
                	var left = this.getLeft();
                	cube.faces.push(left[0]);
                	cube.faces.push(left[1]);
                }

                if (block.showRight) {
                	var right = this.getRight();
                	cube.faces.push(right[0]);
                	cube.faces.push(right[1]);
                }

                // if (block.showBottom) {
                // 	var bottom = this.getBottom();
                //     cube.faces.push(bottom[0]);
                //     cube.faces.push(bottom[1]);
                // }
                // if (block.showTop) {
                //     var top = this.getTop();
                //     cube.faces.push(top[0]);
                //     cube.faces.push(top[1]);
                // }
                // if (block.showBack) {
                //     var back = this.getBack();
                //     cube.faces.push(back[0]);
                //     cube.faces.push(back[1]);
                // }
                // if (block.showFront) {
                // 	var front = this.getFront();
                // 	cube.faces.push(front[0]);
                // 	cube.faces.push(front[1]);
                // }
            }

            cube.applyMatrix(new THREE.Matrix4().makeTranslation(x - center.x, y - center.y, z - center.z));
            cube.applyMatrix(new THREE.Matrix4().makeScale(this.gridSize, this.gridSize, this.gridSize));
            geometry.merge(cube);

        }.bind(this));

        this.geometry = geometry;
    }
};

module.exports = BlockModel;