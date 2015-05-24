var Missile = require("../../app/entities/missile");
var sinon = require("sinon");
var expect = require("chai").expect;

describe("Missile", function(){
	var missile;

	beforeEach(function(){
		missile = new Missile();
	})

	it("should has collision", function(){
		expect(missile.hasCollision()).to.be.true;
	})
})