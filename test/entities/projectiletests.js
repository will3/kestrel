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

	describe("When Created", function(){
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

	describe("update", function(){
		it("should remove self when no life", function(){

		})
	})
});

// var power = power;
// 	var velocity = new THREE.Vector3();
// 	velocity.copy(direction);
// 	velocity.setLength(4);

// 	var life = 200;
// 	var hasCollision = true;
// 	var collisionRadius = 1;
// 	var rigidBody = null;
// 	var actor = null;

// 	var projectile = {
// 		update: function(){
// 			//update age
// 			if(this.getFrameAge() > life && life != -1){
// 				this.removeFromParent();
// 			}
// 		},

// 		createBlock: function(size, offset){
// 			var block = new Block();

// 			block.setSize(size);
// 			block.setLife(life);

// 			var sizeOverTime = function(time){
// 				var remainingLife = this.life - time;
// 				if(remainingLife < 50){
// 					return this.size *= 0.95;
// 				}
// 				return this.size;
// 			}.bind({
// 				size: size,
// 				life: life
// 			});

// 			block.sizeOverTime(sizeOverTime);

// 			var position = new THREE.Vector3();
// 			position.copy(velocity);
// 			position.multiplyScalar(offset);
// 			position.add(this.getPosition());
// 			block.setPosition(position);

// 			return block;
// 		},

// 		onCollision: function(entity){
// 			if(entity == actor){
// 				return;
// 			}

// 			this.destroy();
// 		}