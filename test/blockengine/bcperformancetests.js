var BlockChunk = require("../../app/blockengine/blockchunk");
var BlockCoord = require("../../app/blockengine/blockcoord");
var Block = require("../../app/blockengine/block");

describe("BlockChunk performance", function() {
    it("should get blocks timely", function() {
        var chunk = new BlockChunk(new BlockCoord(0, 0, 0), 512);
        chunk.add(123, 234, 345, new Block());

        var iterations = 1000000;

        for (var i = 0; i < iterations; i++) {
            var block = chunk.get(123, 234, 345);
        }
    });

    it("should get in bound timely", function() {
        var chunk = new BlockChunk(new BlockCoord(0, 0, 0), 512);
        var iterations = 10000000;

        for (var i = 0; i < iterations; i++) {
            var result = chunk.inBound(256, 256, 256);
        }
    });

    it("should subdivide recursively timely", function() {
        var chunk = new BlockChunk(new BlockCoord(0, 0, 0), 512);
        var iterations = 10000;

        for (var i = 0; i < iterations; i++) {
            chunk.subdivide();
        }
    });

    it("should add blocks timely", function() {
        var chunk = new BlockChunk(new BlockCoord(0, 0, 0), 512);

        for (var x = 0; x < 10; x++) {
            for (var y = 0; y < 100; y++) {
                for (var z = 0; z < 100; z++) {
                    var block = new Block();
                    chunk.add(x, y, z, new Block());
                }
            }
        }
    });

    it("should visitBlocksContiguous timely", function() {
        var chunk = new BlockChunk(new BlockCoord(0, 0, 0), 512);

        for (var x = 0; x < 100; x++) {
            for (var y = 0; y < 100; y++) {
                for (var z = 0; z < 10; z++) {
                    var block = new Block();
                    chunk.add(x, y, z, new Block());
                }
            }
        }

        chunk.visitBlocksContiguous(0, 0, 0, function(block, x, y, z) {

        });
    });
});