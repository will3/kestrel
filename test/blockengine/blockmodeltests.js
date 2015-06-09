var BlockModel = require("../../app/blockengine/blockmodel");
var BlockChunk = require("../../app/blockengine/blockchunk");
var BlockCoord = require("../../app/blockengine/blockcoord");
var Block = require("../../app/blockengine/block");
var expect = require("chai").expect;
var THREE = require("THREE");

describe("#BlockModel", function() {
    var blockChunk, blockModel;

    beforeEach(function() {
        blockModel = new BlockModel({
            halfSize: 256
        });
    });

    it("should show 6 faces for one block", function() {
        blockModel.add(0, 0, 0, new Block());
        blockModel.update();
        expect(blockModel.object.children[0].geometry.faces.length).to.equal(6 * 2);
    });

    it("should show 10 faces for two blocks", function() {
        blockModel.add(0, 0, 0, new Block());
        blockModel.add(1, 0, 0, new Block());
        blockModel.update();

        var faceCount = 0;
        blockModel.object.children.forEach(function(child) {
            faceCount += child.geometry.faces.length;
        });

        expect(faceCount).to.equal(10 * 2);
    });

    it("should map block types", function() {
        blockModel.blockTypesToMap = ["block"];
        blockModel.add(0, 0, 0, new Block());
        expect(blockModel.blocks["block"].blockCount).to.equal(1);
    });

    describe("#center", function() {
        it("should init min, max and centerOfMass for block", function() {
            for (var x = 0; x <= 2; x++) {
                for (var y = 0; y <= 2; y++) {
                    for (var z = 0; z <= 2; z++) {
                        blockModel.add(x, y, z, new Block());
                    }
                }
            }

            blockModel.center();
            expect(blockModel.centerOfMass.equals(new THREE.Vector3(1.5, 1.5, 1.5))).to.be.true;
        });
    });

    // getLocalPosition: function(blockCoords) {
    describe("#getLocalPosition", function() {
        it("should translate block coordinates", function() {
            blockModel.centerOffset = new THREE.Vector3(-1, -1, -1);
            var localPosition = blockModel.getLocalPosition(new THREE.Vector3(5, 5, 5));
            expect(localPosition.equals(new THREE.Vector3(8, 8, 8)));
        });
    });

    describe("#getWorldMatrix", function() {
        // it("should give local matrix * object |matrixWorld", function() {
        //     var m1 = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(1.0, 1.0, 1.0));
        //     var m2 = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(2.0, 2.0, 2.0));
        //     var expected = new THREE.Matrix4().multiplyMatrices(m1, m2);

        //     var object = {};
        //     object.matrixWorld = m1;

        //     blockModel.getLocalMatrix = function(){
        //         return m2;
        //     };

        //     var actual = blockModel.getWorldMatrix();

        //     console.log(expected);
        //     console.log(actual);
        // });
    });
});