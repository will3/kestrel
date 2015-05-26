var BlockChunk = require("../../app/blockengine/blockchunk");
var BlockCoord = require("../../app/blockengine/blockcoord");
var Block = require("../../app/blockengine/block");
var expect = require("chai").expect;
var _ = require("lodash");

describe("BlockChunk", function(){
	it("should be of type BlockChunk", function(){
		var blockChunk = new BlockChunk();
		expect(blockChunk.type).to.equal("BlockChunk");
	});

	describe("#addBlock", function(){
		it("should be able to retrieve later", function(){
			var blockChunk = new BlockChunk();
			var block = new Block();
			blockChunk.addBlock(1, 2, 3, block);
			expect(blockChunk.getBlock(1, 2, 3)).to.exist;
		});

		it("should throw if out of bounds", function(){
			var blockChunk = new BlockChunk(new BlockCoord(1, 1, 1), 2);
			expect(function(){
				blockChunk.addBlock(0, 0, 0, new Block());
			}).to.throw("out of bounds");
			expect(function(){
				blockChunk.addBlock(3, 3, 3, new Block());
			}).to.throw("out of bounds");
		});

		it("shoudn't throw if no bounds defined", function(){
			var blockChunk = new BlockChunk();
			blockChunk.addBlock(999, 999, 999, new Block());
		});
	});

	describe("#removeBlock", function(){
		it("should throw if out of bounds", function(){
			var blockChunk = new BlockChunk(new BlockCoord(1, 1, 1), 2);
			expect(function(){
				blockChunk.removeBlock(0, 0, 0, new Block());
			}).to.throw("out of bounds");
			expect(function(){
				blockChunk.removeBlock(3, 3, 3, new Block());
			}).to.throw("out of bounds");
		});

		it("should throw if no existing block found", function(){
			var blockChunk = new BlockChunk(new BlockCoord(1, 1, 1), 2);
			blockChunk.addBlock(1, 1, 1, new Block());
			expect(function(){
				blockChunk.removeBlock(2, 2, 2)
			}).to.throw("nothing found!");
		});

		it("should remove existing block", function(){
			var blockChunk = new BlockChunk(new BlockCoord(1, 1, 1), 2);
			blockChunk.addBlock(1, 1, 1, new Block());
			blockChunk.removeBlock(1, 1, 1);
			var block = blockChunk.getBlockOrEmpty(1, 1, 1);
			expect(block).to.be.null;
		});
	});

	describe("#visitMap", function(){
		it("should visit all blocks", function(){
			var blockChunk = new BlockChunk();
			blockChunk.addBlock(1, 2, 3, new Block());
			blockChunk.addBlock(-1, -2, -3, new Block());
			blockChunk.addBlock(999, 999, 999, new Block());
			blockChunk.addBlock(0, 0, 0, new Block());
			var count = 0;
			blockChunk.visitMap(function(block){
				count ++;
			})
			expect(count).to.equal(4);
		});
	});

	describe("#shrink", function(){
		it("should reset origin and chunkSize", function(){
			var blockChunk = new BlockChunk();
			blockChunk.addBlock(1, 1, 1, new Block());
			blockChunk.addBlock(16, 16, 16, new Block());
			blockChunk.shrink();
			expect(blockChunk.origin.equals(new BlockCoord(1, 1, 1))).to.be.true;
			expect(blockChunk.chunkSize).to.equal(16);
		});

		it("should reset origin and chunkSize for negative numbers", function(){
			var blockChunk = new BlockChunk();
			blockChunk.addBlock(-1, -1, -1, new Block());
			blockChunk.addBlock(-16, -16, -16, new Block());
			blockChunk.shrink();
			expect(blockChunk.origin.equals(new BlockCoord(-16, -16, -16))).to.be.true;
			expect(blockChunk.chunkSize).to.equal(16);
		});
	});

	describe("#subdivide", function(){
		it("should not subdivide if haven't been shrinked", function(){
			var blockChunk = new BlockChunk();
			blockChunk.addBlock(-1, -1, -1, new Block());
			blockChunk.addBlock(16, 16, 16, new Block());
			expect(function(){
				blockChunk.subdivide();
			}).to.throw("origin or chunkSize not initialized, try |shrink chunk first");
		});

		it("should subdivide", function(){
			var blockChunk = new BlockChunk();
			blockChunk.addBlock(-1, -1, -1, new Block());
			blockChunk.addBlock(16, 16, 16, new Block());
			blockChunk.shrink();
			blockChunk.subdivide();
			expect(blockChunk.getChildrenCount()).to.equal(8);
		});

		it("should not subdivide if chunk size is min", function(){
			var blockChunk = new BlockChunk(new BlockCoord(0, 0, 0), 2);
			blockChunk.minChunkSize = 2;
			blockChunk.subdivide();
			expect(blockChunk.getChildrenCount()).to.equal(0);
		});
	});

	describe("#reallocate", function(){
		it("should allocate blocks to child", function(){
			var blockChunk = new BlockChunk();
			blockChunk.addBlock(-1, -1, -1, new Block());
			blockChunk.addBlock(16, 16, 16, new Block());
			blockChunk.shrink();
			blockChunk.subdivide();
			blockChunk.reallocate();
			var count = 0;
			blockChunk.children.forEach(function(child){
				count += child.getBlockCount();
			})
			expect(count).to.equal(2);
			//parent should get block count from child as well
			expect(blockChunk.getBlockCount()).to.equal(2);
		});
	});
})