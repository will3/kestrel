var Block = require("../../app/blockengine/block");
var expect = require("chai").expect;

describe("Block", function() {
    it("should return faces", function() {
    	var block = new Block();
        expect(block.getFace('left', 0)).to.exist;
        expect(block.getFace('right', 0)).to.exist;
        expect(block.getFace('bottom', 0)).to.exist;
        expect(block.getFace('top', 0)).to.exist;
        expect(block.getFace('back', 0)).to.exist;
        expect(block.getFace('front', 0)).to.exist;
    })
});