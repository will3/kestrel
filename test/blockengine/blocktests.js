var Block = require("../../app/blockengine/block");
var BlockCoord = require("../../app/blockengine/blockcoord");
var expect = require("chai").expect;

describe("Block", function(){
	it("should have type Block", function(){
		var block = new Block();
		expect(block.type).to.equal("Block");
	})

	describe("#constructor", function(){
		it("should initialize correctly", function(){
			var blockCoord = new BlockCoord(1, 2, 3);
			var block = new Block();

		})
	})	
})