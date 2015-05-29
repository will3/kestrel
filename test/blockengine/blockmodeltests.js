var BlockModel = require("../../app/blockengine/blockmodel");
var BlockChunk = require("../../app/blockengine/blockchunk");
var BlockCoord = require("../../app/blockengine/blockcoord");
var Block = require("../../app/blockengine/block");
var expect = require("chai").expect;

describe("#BlockModel", function() {
    var blockChunk, blockModel;

    beforeEach(function() {
        blockModel = new BlockModel(256);
    })

    it("should show 6 faces for one block", function() {
        blockModel.add(0, 0, 0, new Block());
        expect(blockModel.object.geometry.faces.length).to.equal(6 * 2);
    })

    it("should show 10 faces for two neighbouring blocks", function(){
    	blockModel.add(0,0,0, new Block());
    	blockModel.add(1,0,0, new Block());
    	expect(blockModel.object.geometry.faces.length).to.equal(10 * 2);
    })
})