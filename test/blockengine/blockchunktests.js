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

        it("one block should have no neighbours", function() {
            var chunk = new BlockChunk(new BlockCoord(0, 0, 0), 512);
            var block = new Block();
            chunk.add(0, 0, 0, block);
            expect(block.hasLeft).to.be.false;
            expect(block.hasRight).to.be.false;
            expect(block.hasBottom).to.be.false;
            expect(block.hasTop).to.be.false;
            expect(block.hasBack).to.be.false;
            expect(block.hasFront).to.be.false;
        });

        it("two neighbours should initialize neighbours", function(){
            var chunk = new BlockChunk(new BlockCoord(0,0,0), 512);
            var block1 = new Block();
            chunk.add(0,0,0,block1);
            var block2 = new Block();
            chunk.add(1,0,0,block2);
            expect(block1.hasRight).to.be.true;
            expect(block2.hasLeft).to.be.true;
        });
    })
})