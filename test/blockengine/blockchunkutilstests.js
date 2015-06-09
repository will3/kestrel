var BlockChunkUtils = require("../../app/blockengine/blockchunkutils");
var BlockChunk = require("../../app/blockengine/blockchunk");
var Block = require("../../app/blockengine/block");
var expect = require("chai").expect;
var BlockCoord = require("../../app/blockengine/blockcoord");
var _ = require("lodash");

describe("BlockChunkUtils", function() {
    describe("#_visitBlocksContiguous", function() {
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
            BlockChunkUtils._visitBlocksContiguous(chunk, 3, 3, 3, function() {
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

            // 10 * 10 * 10
            for (var x = 100; x < 110; x++) {
                for (var y = 100; y < 110; y++) {
                    for (var z = 100; z < 110; z++) {
                        chunk.add(x, y, z, new Block());
                    }
                }
            }

            // 1
            chunk.add(500, 500, 500, new Block());

            var groups = BlockChunkUtils.getContiguousGroups(chunk);

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