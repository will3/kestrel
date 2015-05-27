var BlockModel = require("../../app/blockengine/blockmodel");
var BlockChunk = require("../../app/blockengine/blockchunk");
var BlockCoord = require("../../app/blockengine/blockcoord");
var Block = require("../../app/blockengine/block");
var expect = require("chai").expect;

describe("#BlockModel", function() {
    var blockChunk, blockModel;

    beforeEach(function() {
        blockChunk = new BlockChunk(new BlockCoord(0, 0, 0), 512);
        blockModel = new BlockModel(blockChunk);
    })

    it("should show 6 faces for one block", function() {
        blockChunk.add(0, 0, 0, new Block());
        blockModel.initObject();
        var object = blockModel.object;
        expect(object.children[0].geometry.faces.length).to.equal(6 * 2);
    })

    it("should show 10 faces for two neighbouring blocks", function(){
    	blockChunk.add(0,0,0, new Block());
    	blockChunk.add(1,0,0, new Block());
    	blockModel.initObject();
    	var object = blockModel.object;
    	expect(object.children[0].geometry.faces.length).to.equal(10 * 2);
    })
})