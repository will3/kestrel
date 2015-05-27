var Component = require("../app/component");
var expect = require("chai").expect;
var sinon = require("sinon");

describe("Component", function(){
	var component = null;

	beforeEach(function(){
		component = new Component();
	})

	describe("#getTransform", function(){
		it("returns entity's transform", function(){
			var transform = {};
			var entity = {};
			entity.transform = transform;

			component.entity = entity;

			expect(component.transform).to.equal(transform);
		})
	})
})