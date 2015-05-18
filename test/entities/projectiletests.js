var Projectile = require("../../app/entities/projectile");
var expect = require("chai").expect;
var sinon = require("sinon");
var THREE = require("THREE");
var _ = require("lodash");
var Entity = require("../../app/entity");

describe("Projectile", function(){
	var projectile = null;

	beforeEach(function(){
		projectile = new Projectile({
			power : 2,
			direction : new THREE.Vector3(1, 0, 0),
			num : 4,
			speed : 5,
		});

		projectile.createBlock = function(){
			return new Entity();
		};
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
			expect(projectile.getRigidBody().velocity.equals(new THREE.Vector3(5, 0, 0))).to.equal(true);
		});
	})

	describe("#update", function(){
		it("should remove self when no life", function(){

		})
	})
});
