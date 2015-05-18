var Block = require("../../app/entities/block");
var Component = require("../../app/component");
var expect = require("chai").expect;
var THREE = require("THREE");
var sinon = require("sinon");
var _ = require("lodash");

describe('Block', function(){
	var block;
	var renderComponent;

	beforeEach(function(){
		block = new Block();
		renderComponent = new Component();
		block.setRenderComponent(renderComponent);
	});

	describe('start', function(){
		it('should initialize components', function(){
			block.start();
			expect(block.getRigidBody().defaultFriction).to.equal(1);
			expect(_.includes(block.getComponents(), block.getRigidBody())).to.equal(true);
			expect(_.includes(block.getComponents(), block.getRenderComponent())).to.equal(true);
		});

		it('should initialize size', function(){
			block.setSize(99);
			block.start();
			expect(block.getTransform().getScale().equals(new THREE.Vector3(99, 99, 99))).to.equal(true);
		});

		it('should initialize velocity', function(){
			block.setVelocity(new THREE.Vector3(1, 2, 3));
			block.start();
			expect(block.getRigidBody().getVelocity().equals(new THREE.Vector3(1, 2, 3))).to.equal(true);
		});
	});

	describe('update', function(){
		it('should destroy self if no life left', function(){
			var mockBlock = sinon.mock(block);
			block.setLife(100);
			block.setFrameAge(101);
			block.start();
			mockBlock.expects("removeFromParent");
			
			block.update();

			mockBlock.verify();
		})

		it("shouldn't destroy self if has life left", function(){
			var mockBlock = sinon.mock(block);
			block.setLife(100);
			block.setFrameAge(99);
			block.start();
			mockBlock.expects("removeFromParent").never();
			
			block.update();

			mockBlock.verify();
		})

		it("shouldn't destroy self if no life limit", function(){
			var mockBlock = sinon.mock(block);
			block.setLife(-1);
			block.setFrameAge(99999);
			block.start();
			mockBlock.expects("removeFromParent").never();
			
			block.update();

			mockBlock.verify();
		})

		it('should update size over time', function(){
			var sizeOverTime = sinon.stub().returns(42);
			block.sizeOverTime(sizeOverTime);
			block.start();
			block.update();
			expect(block.getTransform().getScale().equals(new THREE.Vector3(42, 42, 42))).to.equal(true);
		})

		it('should update velocity over time', function(){
			var velocity = new THREE.Vector3(42, 42, 42);
			var velocityOverTime = sinon.stub().returns(velocity);
			block.velocityOverTime(velocityOverTime);
			block.start();
			block.update();
			expect(block.getRigidBody().getVelocity().equals(new THREE.Vector3(42, 42, 42))).to.equal(true);
		})
	});
});
