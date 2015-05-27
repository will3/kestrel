var PointSprite = require("../../app/entities/pointsprite");
var expect = require("chai").expect;
var sinon = require("sinon");
var Component = require("../../app/component");
var _ = require("lodash");

describe("PointSprite", function(){
	var pointSprite, renderComponent, rigidBody;

	beforeEach(function(){
		pointSprite = new PointSprite();
		renderComponent = {};
		rigidBody = {};
		pointSprite.renderComponent = renderComponent;
		pointSprite.rigidBody = rigidBody;
	})

	describe("start", function(){
		it("should add render component", function(){
			pointSprite.start();
			expect(_.includes(pointSprite.components, renderComponent)).to.be.true;
		});

		it("should add rigid body", function(){
			pointSprite.start();
			expect(_.includes(pointSprite.components, rigidBody)).to.be.true;
		})
	});
});