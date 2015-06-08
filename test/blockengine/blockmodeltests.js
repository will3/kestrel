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
});