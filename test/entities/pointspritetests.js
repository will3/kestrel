var PointSprite = require("../../app/entities/pointsprite");
var expect = require("chai").expect;
var sinon = require("sinon");
var Component = require("../../app/component");
var _ = require("lodash");

describe("Point Sprite", function(){
	var pointSprite;

	beforeEach(function(){
		pointSprite = new PointSprite();
	})

	describe("start", function(){
		it("should add render component", function(){
			var renderComponent = new Component();
			pointSprite.setRenderComponent(renderComponent);
			pointSprite.start();
			expect(_.includes(pointSprite.getComponents(), renderComponent)).to.equal.true;
		});

		it("should add rigid body", function(){
			var rigidBody = new Component();
			pointSprite.setRigidBody(rigidBody);
			pointSprite.start();
			expect(_.includes(pointSprite.getComponents(), rigidBody)).to.equal.true;
		})
	});
});