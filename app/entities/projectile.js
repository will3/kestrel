var Entity = require("../entity");
var THREE = require("THREE");
var Block = require("./block");
var RigidBody = require("../components/rigidbody");

var Projectile = function(params){
	var params = params	== null ? {} : params;
	var power = params.power != null ? params.power : 4;
	var direction = params.direction;

	if(direction == null) {
		throw "direction cannot be empty";
	}

	var life = params.life != null ? params.life : 200;
	var num = params.num != null ? params.num : 4;
	var speed = params.speed != null ? params.speed : 4;

	var collisionRadius = 1;
	var actor = null;

	//components
	var rigidBody = null;
	var transform = null;

	var velocity = null;
	function getVelocity(){
		if(velocity == null){
			velocity = new THREE.Vector3();
			velocity.copy(direction);
			velocity.setLength(speed);
		}

		return velocity;
	}

	function createBlock(size, offset){
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

		var velocity = getVelocity();
		position.copy(velocity);
		position.multiplyScalar(offset);
		position.add(transform.position);
		block.setPosition(position);

		return block;
	},

	var projectile = {
		hasCollision : true,
		setActor: function(value){ actor = value; },
		getActor: function(){ return actor; },
		getRigidBody: function(){ return rigidBody; },

		start: function(){
			var velocity = getVelocity();
			var startPosition = new THREE.Vector3();
			startPosition.copy(velocity);
			startPosition.multiplyScalar(0.5);
			this.getPosition().add(startPosition);

			var num = 4;
			for(var i = 0; i < num; i ++){
				this.addEntity(this.createBlock(
					power * (num - i) / num, 
					- i * 0.5
					));
			}

			transform = getTransform();
			rigidBody = new RigidBody();
			rigidBody.defaultFriction = 1;
			this.addComponent(rigidBody);
			rigidBody.velocity = velocity;
		},

		update: function(){
			//update age
			if(this.getFrameAge() > life && life != -1){
				this.removeFromParent();
			}
		},

		onCollision: function(entity){
			if(entity == actor){
				return;
			}

			this.destroy();
		}
	};

	projectile.__proto__ = Entity();

	return projectile;
}

module.exports = Projectile;