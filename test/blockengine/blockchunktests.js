var BlockChunk = require("../../app/blockengine/blockchunk");
var expect = require("chai").expect;
var _ = require("lodash");
var sinon = require("sinon");
var BlockCoord = require("../../app/blockengine/blockcoord");
var Block = require("../../app/blockengine/block");

describe("BlockChunk", function() {
    it("should be of type BlockChunk", function() {
        var chunk = new BlockChunk(new BlockCoord(0, 0, 0), 32);
        expect(chunk.type).to.equal("BlockChunk");
    });

    it("should throw for invalid size", function() {
        expect(function() {
            new BlockChunk(new BlockCoord(0, 0, 0), 33)
        }).to.throw("invalid size");
    });

    describe("#subdivide", function() {
        it("should subdivide", function() {
            var chunk = new BlockChunk(new BlockCoord(0, 0, 0), 8);
            chunk.subdivide();
        });
    });

    describe("#add", function() {
        it("should be able to retrieve back", function() {
            var chunk = new BlockChunk(new BlockCoord(0, 0, 0), 8);
            var block = new Block();
            chunk.add(4, 2, 1, block);
            var result = chunk.get(4, 2, 1);
            expect(result).to.equal(block);
        });
    })
})