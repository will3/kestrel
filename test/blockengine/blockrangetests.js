var BlockRange = require("../../app/blockengine/blockrange");
var expect = require("chai").expect;
var BlockCoord = require("../../app/blockengine/blockcoord");

describe("BlockRange", function(){
	describe("#visit", function(){
		it("should visit all coords", function(){
			var blockRange = new BlockRange(new BlockCoord(0, 0, 0), new BlockCoord(4, 4, 4));
			var count = 0;
			blockRange.visit(function(x, y, z){
				count ++;
			})
			expect(count).to.equal(4 * 4 * 4);
		})
	})
})