var Laser = require("../../app/entities/laser");
var expect = require("chai").expect;
var sinon = require("sinon");
var THREE = require("THREE");
var _ = require("lodash");
var Entity = require("../../app/entity");

describe("Laser", function(){
	var laser = null;
	var actor = null;
	var target = null;

	beforeEach(function(){
		laser = new Laser();
		actor = new Entity();
		target = new Entity();
		target.setPosition(new THREE.Vector3(100, 100, 100));

		laser.setActor(actor);
		laser.setTarget(target);

		laser.createBlock = function(){
			return new Entity();
		}
	})

	it("should has collision", function(){
		expect(laser.hasCollision()).to.equal(true);
	})

	describe("#start", function(){
		it("should create blocks", function(){
			laser.start();
			expect(laser.getChildEntities().length).to.equal(4);
		});

		it("should create rigid body", function(){
			laser.start();
			expect(laser.getRigidBody()).to.not.equal(null);
			expect(_.includes(laser.getComponents(), laser.getRigidBody())).to.equal(true);
		});

		it("should initialize velocity", function(){
			laser.start();
			expect(laser.getRigidBody().getVelocity().length()).to.be.gt(0);
		});
	})

	describe("#update", function(){
		it("should remove self when no life", function(){

		})
	})
});
