var Entity = require("../entity");
var THREE = require("THREE");
var Block = require("./block");
var RigidBody = require("../components/rigidbody");
var ParticleSystem = require("./particlesystem");

var Projectile = function() {
	var power = 4;
	var num = 4;
	var life = 200;
	var actor = null;
	var defaultSpeed = 4;

	function createBlock(size, offset, velocity){
		var block = new Block();

		block.setSize(size);
		block.setLife(life);

		var sizeOverTime = function(time){
			var remainingLife = this.life - time;
			if(remainingLife < 50){
				return this.size *= 0.95;
			}
			return this.size;
		}.bind({
			size: size,
			life: life
		});

		block.sizeOverTime(sizeOverTime);

		var position = new THREE.Vector3();

		position.copy(velocity);
		position.multiplyScalar(offset);
		block.setPosition(position);

		return block;
	}

	var projectile = {
		destroyable: true,
		getPower: function(){ return power; }, 
		setPower: function(value){ power = value;},
		getActor: function(){ return actor; },
		setActor: function(value){ actor = value; },
		getCollisionRadius: function(){ return 1; },

		start: function(){
			if(this.getSpeed() == 0){
				this.setSpeed(defaultSpeed);
			}

			if(this.getDirection() == null){
				throw "must have direction";
			}

			transform = this.getTransform();
			var velocity = this.getVelocity();

			this.addComponent(this.getRigidBody());
			this.getRigidBody().setVelocity(velocity);

			var startPosition = new THREE.Vector3();
			startPosition.copy(velocity);
			startPosition.multiplyScalar(2);

			this.getPosition().add(startPosition);

			this.emit(0);
		},

		emit: function(time){
			if(time == 0){
				var num = 4;
				for(var i = 0; i < num; i ++){
					this.addEntity(this.createBlock(
						power * (num - i) / num, 
						- i * 0.5,
						this.getVelocity())
					);
				}
			}
		},

		createBlock: createBlock,

		update: function(){
			//update age
			if(this.getFrameAge() > life && life != -1){
				this.removeFromParent();
			}
		},

		onCollision: function(entity){
			if(entity == this.getActor()){
				return;
			}

			this.destroy();
		}
	};

	projectile.__proto__ = ParticleSystem();

	return projectile;
}

module.exports = Projectile;