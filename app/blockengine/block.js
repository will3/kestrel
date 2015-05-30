var THREE = require("THREE");

var Block = function() {
    this.uuid = THREE.Math.generateUUID();
    this.scale = null;
}

Block.prototype = {
    constructor: Block,

    withScale: function(scale){
        this.scale = scale;
        return this;
    },

    getStandardVertice: function(index) {
        switch (index) {
            case 0:
                return new THREE.Vector3(-0.5, -0.5, -0.5); //0
            case 1:
                return new THREE.Vector3(+0.5, -0.5, -0.5); //1
            case 2:
                return new THREE.Vector3(+0.5, -0.5, +0.5); //2
            case 3:
                return new THREE.Vector3(-0.5, -0.5, +0.5); //3
            case 4:
                return new THREE.Vector3(-0.5, +0.5, -0.5); //4
            case 5:
                return new THREE.Vector3(+0.5, +0.5, -0.5); //5
            case 6:
                return new THREE.Vector3(+0.5, +0.5, +0.5); //6
            case 7:
                return new THREE.Vector3(-0.5, +0.5, +0.5); //7

            default:
                throw "invalid index";
        }
    },

    getVertice: function(index) {
        var vertice = this.getStandardVertice(index);

        if (this.scale != null) {
            vertice.setX(vertice.x * this.scale.x);
            vertice.setY(vertice.y * this.scale.y);
            vertice.setZ(vertice.z * this.scale.z);
        }

        return vertice;
    },

    getVertices: function(indexes) {
        var vertices = [];
        indexes.forEach(function(index) {
            vertices.push(this.getVertice(index));
        }.bind(this));

        return vertices;
    },

    getFace: function(face, indexOffset) {
        var indices = [];

        //    7   6
        //  4   5
        //    3   2
        //  0   1
        switch (face) {
            case 'left':
                indices = [7, 4, 0, 3];
                break;
            case 'right':
                indices = [5, 6, 2, 1];
                break;
            case 'bottom':
                indices = [0, 1, 2, 3];
                break;
            case 'top':
                indices = [5, 4, 7, 6];
                break;
            case 'back':
                indices = [1, 0, 4, 5];
                break;
            case 'front':
                indices = [6, 7, 3, 2];
                break;
            default:
                throw "invalid face " + face;
        }

        var vertices = this.getVertices(indices);

        // var triangles = [
        //     new THREE.Face3(indexOffset + indices[0], indexOffset + indices[1], indexOffset + indices[2]),
        //     new THREE.Face3(indexOffset + indices[2], indexOffset + indices[3], indexOffset + indices[0])
        // ];

        var triangles = [
            new THREE.Face3(indexOffset + 0, indexOffset + 1, indexOffset + 2),
            new THREE.Face3(indexOffset + 2, indexOffset + 3, indexOffset + 0)
        ];

        return {
            vertices: vertices,
            triangles: triangles
        };
    }
}

module.exports = Block;