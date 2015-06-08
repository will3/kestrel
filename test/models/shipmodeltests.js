var ShipModel = require("../../app/models/shipmodel");
var expect = require("chai").expect;

describe("ShipModel", function(){
	it("should have 61 blocks", function(){
		var model = new ShipModel();
		expect(model.blockCount).to.equal(61);
	});

	it("should have 2 engine blocks", function(){
		var model = new ShipModel();
		var chunk = model.blocks["engine"];
		expect(chunk.blockCount).to.equal(2);
	});
});