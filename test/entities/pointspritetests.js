var PointSprite = require("../../app/entities/pointsprite");
var expect = require("chai").expect;
var sinon = require("sinon");
var Component = require("../../app/component");
var _ = require("lodash");
var THREE = require("THREE");

describe("PointSprite", function() {
    var pointSprite, renderComponent, rigidBody;

    beforeEach(function() {
        pointSprite = new PointSprite();
        renderComponent = {};
        rigidBody = {};
        pointSprite.renderComponent = renderComponent;
        pointSprite.rigidBody = rigidBody;
    })

    describe("start", function() {
        it("should add render component", function() {
            pointSprite.start();
            expect(_.includes(pointSprite.components, renderComponent)).to.be.true;
        });

        it("should add rigid body", function() {
            pointSprite.start();
            expect(_.includes(pointSprite.components, rigidBody)).to.be.true;
        })
    });

    describe("#get velocity", function() {
        it("should get velocity of rigidBody", function() {
            rigidBody.velocity = new THREE.Vector3(1, 1, 1);
            expect(pointSprite.velocity.equals(new THREE.Vector3(1, 1, 1))).to.be.true;
        })
    })

    describe("#set velocity", function() {
        it("should set velocity of rigidBody", function() {
            pointSprite.velocity = new THREE.Vector3(1, 1, 1);
            expect(rigidBody.velocity.equals(new THREE.Vector3(1, 1, 1))).to.be.true;
        })
    })
});