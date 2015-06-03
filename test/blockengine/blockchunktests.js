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

    describe("#remove", function() {
        it("should remove block", function() {
            var chunk = new BlockChunk(new BlockCoord(0, 0, 0), 8);
            var block = new Block();
            chunk.add(4, 2, 1, block);
            chunk.remove(4, 2, 1);
            var block = chunk.get(4, 2, 1);
            expect(block).to.not.exist;
        })
    });

    describe("#visitBlocksContiguous", function() {
        it("should visit all contiguous blocks", function() {
            var chunk = new BlockChunk(new BlockCoord(0, 0, 0), 8);

            for (var x = 2; x < 5; x++) {
                for (var y = 2; y < 5; y++) {
                    for (var z = 2; z < 5; z++) {
                        chunk.add(x, y, z, new Block());
                    }
                }
            }

            //contiguous
            chunk.add(4, 5, 4, new Block());
            //not contiguous
            chunk.add(7, 7, 7, new Block());

            var count = 0;
            chunk.visitBlocksContiguous(3, 3, 3, function() {
                count++;
            });

            expect(count).to.equal(3 * 3 * 3 + 1);
        });
    });

    describe("#getContiguousGroups", function() {
        it("should return contiguous groups", function() {
            var chunk = new BlockChunk(new BlockCoord(0, 0, 0), 512);

            //5 * 5 * 5
            for (var x = 0; x < 5; x++) {
                for (var y = 0; y < 5; y++) {
                    for (var z = 0; z < 5; z++) {
                        chunk.add(x, y, z, new Block());
                    }
                }
            }

            10 * 10 * 10
            for (var x = 100; x < 110; x++) {
                for (var y = 100; y < 110; y++) {
                    for (var z = 100; z < 110; z++) {
                        chunk.add(x, y, z, new Block());
                    }
                }
            }

            1
            chunk.add(500, 500, 500, new Block());

            var groups = chunk.getContiguousGroups();

            expect(groups.count == 3);

            var group1 = _.filter(groups, function(group) {
                return group.length == 5 * 5 * 5;
            })

            var group2 = _.filter(groups, function(group) {
                return group.length == 10 * 10 * 10;
            })

            var group3 = _.filter(groups, function(group) {
                return group.length == 1;
            })

            expect(group1).to.exist;
            expect(group2).to.exist;
            expect(group3).to.exist;
        })
    });
});