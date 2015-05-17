var PointSprite = require("../../app/entities/pointsprite");
var expect = require("chai").expect;
var sinon = require("sinon");
var Component = require("../../app/component");

describe("Point Sprite", function(){
	describe("start", function(){
		it("should add point sprite render component", function(){
			var renderComponent = new Component();
			var pointSprite = new PointSprite();
			pointSprite.setRenderComponent(renderComponent);

			pointSprite.start();

			expect(pointSprite.getComponents().length).to.equal(1);
		});
	});
});