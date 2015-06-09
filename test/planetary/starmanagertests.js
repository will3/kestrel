var StarManager = require("../../app/planetary/starmanager");
var expect = require("chai").expect;

describe("StarManager", function(){
	describe("#initStars", function(){
		it("should generate some stars", function(){
			var starManager = new StarManager();
			starManager.initStars();
			expect(starManager.stars.length).to.be.gt(0);
		});
	});
});
