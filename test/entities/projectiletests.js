var Projectile = require("../../app/entities/projectile");
var expect = require("chai").expect;
var sinon = require("sinon");
var THREE = require("THREE");
var _ = require("lodash");
var Entity = require("../../app/entity");

describe("Projectile", function(){
	var projectile = null;

	beforeEach(function(){
		projectile = new Projectile();
		projectile.setDirection(new THREE.Vector3(1, 0, 0));
		projectile.setSpeed(5);
		projectile.setPower(2);

		projectile.createBlock = function(){
			return new Entity();
		}
	})

	it("should be collidable", function(){
		expect(projectile.hasCollision()).to.equal(true);
	})

	describe("#start", function(){
		it("should create blocks", function(){
			projectile.start();
			expect(projectile.getChildEntities().length).to.equal(4);
		});

		it("should create rigid body", function(){
			projectile.start();
			expect(projectile.getRigidBody()).to.not.equal(null);
			expect(_.includes(projectile.getComponents(), projectile.getRigidBody())).to.equal(true);
		});

		it("should initialize velocity", function(){
			projectile.start();
			expect(projectile.getRigidBody().getVelocity().equals(new THREE.Vector3(5, 0, 0))).to.equal(true);
		});
	})

	describe("#update", function(){
		it("should remove self when no life", function(){

		})
	})
});
