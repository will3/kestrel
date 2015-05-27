var Block = require("../../app/blockengine/block");
var expect = require("chai").expect;

describe("Block", function() {
    describe("#getGeometry", function() {
        it("should have 12 faces with no neighbours", function() {
            var block = new Block();
            var geometry = block.getGeometry();
            expect(geometry.faces.length).to.equal(12);
        })
    })
});