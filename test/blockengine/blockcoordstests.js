var BlockCoord = require("../../app/blockengine/blockcoord");
var Block = require("../../app/blockengine/block");
var expect = require("chai").expect;

describe("BlockCoords", function(){
	describe("#constructor", function(){
		it("should initialize correctly", function(){
			var coords = new BlockCoord(1, 2, 3);
			expect(coords.x).to.equal(1);
			expect(coords.y).to.equal(2);
			expect(coords.z).to.equal(3);
		})

		it("should default coords to zero", function(){
			var coords = new BlockCoord();
			expect(coords.x).to.equal(0);
			expect(coords.y).to.equal(0);
			expect(coords.z).to.equal(0);
		})
	})

	describe("#equals", function(){
		it("should return true when equals", function(){
			var coords1 = new BlockCoord(1, 2, 3);
			var coords2 = new BlockCoord(1, 2, 3);
			expect(coords1.equals(coords2)).to.be.true;
		})

		it("should return false when don't equal", function(){
			var coords1 = new BlockCoord(1, 2, 3);
			var coords2 = new BlockCoord(2, 3, 4);
			expect(coords1.equals(coords2)).to.be.false;
		})

		it("should throw when wrong type", function(){
			var coords1 = new BlockCoord(1, 2, 3);
			var coords2 = "a string";
			expect(function(){
				coords1.equals(coords2);
			}).to.throw("must compare with BlockCoord");
		})
	})
})