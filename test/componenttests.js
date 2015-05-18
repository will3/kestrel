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
			var entity = {
				getTransform: function(){
					return transform;
				}
			};
			component.setEntity(entity);

			console.log(component.getTransform());
			expect(component.getTransform()).to.equal(transform);
		})
	})
})