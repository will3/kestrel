var THREE = require("THREE");

var Block = function() {
    this.uuid = THREE.Math.generateUUID();

    // this.hasLeft = false;
    // this.hasRight = false;
    // this.hasBottom = false;
    // this.hasTop = false;
    // this.hasBack = false;
    // this.hasFront = false;

    //faces for block
    // this.vertices = null;
    // this.leftFace = null;
    // this.rightFace = null;
    // this.bottomFace = null;
    // this.topFace = null;
    // this.backFace = null;
    // this.frontFace = null;
}

Block.prototype = {
    // constructor: Block,

    // shouldShow: function(){
    // 	return !(this.hasLeft && this.hasRight && this.hasBottom && this.hasTop && this.hasBack && this.hasFront);
    // },

    // getGeometry: function() {
    // 	if(!this.shouldShow()){
    // 		return null;
    // 	}

    //     if (this.geometry == null) {
    //         this.geometry = new THREE.Geometry();

    //         var vertices = this.getVertices();

    //         for (var i in vertices) {
    //             this.geometry.vertices.push(vertices[i]);
    //         }

    //         var faces = [];
    //         if (!this.hasLeft) {
    //             faces = faces.concat(this.getLeftFace());
    //         }

    //         if (!this.hasRight) {
    //             faces = faces.concat(this.getRightFace());
    //         }

    //         if (!this.hasBottom) {
    //             faces = faces.concat(this.getBottomFace());
    //         }

    //         if (!this.hasTop) {
    //             faces = faces.concat(this.getTopFace());
    //         }

    //         if (!this.hasBack) {
    //             faces = faces.concat(this.getBackFace());
    //         }

    //         if (!this.hasFront) {
    //             faces = faces.concat(this.getFrontFace());
    //         }

    //         for (var i in faces) {
    //             this.geometry.faces.push(faces[i]);
    //         }
    //     }

    //     return this.geometry;
    // },

    // getVertices: function() {
    //     if (this.vertices == null) {
    //         this.vertices = [
    //             new THREE.Vector3(-0.5, -0.5, -0.5), //0
    //             new THREE.Vector3(0.5, -0.5, -0.5), //1
    //             new THREE.Vector3(0.5, -0.5, 0.5), //2
    //             new THREE.Vector3(-0.5, -0.5, 0.5), //3
    //             new THREE.Vector3(-0.5, 0.5, -0.5), //0
    //             new THREE.Vector3(0.5, 0.5, -0.5), //1
    //             new THREE.Vector3(0.5, 0.5, 0.5), //2
    //             new THREE.Vector3(-0.5, 0.5, 0.5), //3
    //         ];
    //     }

    //     return this.vertices;
    // },

    // getLeftFace: function() {
    //     if (this.leftFace == null) {
    //         this.leftFace = [
    //             new THREE.Face3(0, 3, 4),
    //             new THREE.Face3(7, 4, 3)
    //         ];
    //     }

    //     return this.leftFace;
    // },

    // getRightFace: function() {
    //     if (this.rightFace == null) {
    //         this.rightFace = [
    //             new THREE.Face3(5, 6, 1),
    //             new THREE.Face3(2, 1, 6)
    //         ];
    //     }
    //     return this.rightFace;
    // },

    // getBottomFace: function() {
    //     if (this.bottomFace == null) {
    //         this.bottomFace = [
    //             new THREE.Face3(0, 1, 2),
    //             new THREE.Face3(2, 3, 0)
    //         ];
    //     }

    //     return this.bottomFace;
    // },

    // getTopFace: function() {
    //     if (this.topFace == null) {
    //         this.topFace = [
    //             new THREE.Face3(5, 4, 6),
    //             new THREE.Face3(6, 4, 7)
    //         ];
    //     }

    //     return this.topFace;
    // },

    // getBackFace: function() {
    //     if (this.backFace == null) {
    //         this.backFace = [
    //             new THREE.Face3(1, 0, 5),
    //             new THREE.Face3(4, 5, 0)
    //         ];
    //     }

    //     return this.backFace;
    // },

    // getFrontFace: function() {
    //     if (this.frontFace == null) {
    //         this.frontFace = [
    //             new THREE.Face3(3, 2, 7),
    //             new THREE.Face3(6, 7, 2)
    //         ];
    //     }

    //     return this.frontFace;
    // }
}

module.exports = Block;