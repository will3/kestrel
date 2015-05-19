var ParticleSystem = require("../../app/entities/particleSystem");
var expect = require("chai").expect;
var sinon = require("sinon");

describe("ParticleSystem", function(){
	var particleSystem;

	beforeEach(function(){
		particleSystem = new ParticleSystem();
	})

	describe("#getRigidBody", function(){
		it("should be frictionless", function(){
			expect(particleSystem.getRigidBody().getDefaultFriction()).to.equal(1);
		})
	})
})