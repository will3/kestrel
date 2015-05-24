var Ammo = require("./ammo");
var THREE = require("THREE");
var PointSprite = require("./pointsprite");
var RigidBody = require("../components/rigidbody");

var Laser = function() {
	var rigidBody = null;
	var velocity = null;

	var createSprite = function(size, offset, velocity, life){
		var sprite = new PointSprite();

		sprite.setSize(size);
		sprite.setLife(life);

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

		sprite.sizeOverTime(sizeOverTime);

		var position = new THREE.Vector3();

		position.copy(velocity);
		position.multiplyScalar(offset);
		sprite.setPosition(position);

		return sprite;
	}

	var laser = {
		createInstance: function(){ return new Laser(); },

		getRigidBody: function(){ 
			if(rigidBody == null){
				rigidBody = new RigidBody();
				rigidBody.setDefaultFriction(1);
				rigidBody.setCollisionRadius(1);
			}
			return rigidBody;
		},

		initVelocity: function(){
			var actor = this.getActor();
			var target = this.getTarget();

			if(actor == null || target == null){
				throw "actor or target cannot be null";
			}

			var v = new THREE.Vector3();
			v.subVectors(target.getWorldPosition(), actor.getWorldPosition());
			v.setLength(4);

			velocity = v;
		},

		start: function(){
			this.setLife(200);

			this.initVelocity();
			transform = this.getTransform();

			this.addComponent(this.getRigidBody());
			this.getRigidBody().setVelocity(velocity);

			var startPosition = new THREE.Vector3();
			startPosition.copy(velocity);
			startPosition.multiplyScalar(2);

			this.getPosition().add(startPosition);

			this.createSprites();
		},

		createSprites: function(time){
			var power = 2;
			var num = 4;
			
			for(var i = 0; i < num; i ++){
				this.addEntity(createSprite(
					power * (num - i) / num, 
					- i * 0.5,
					velocity,
					this.getLife())
				);
			}
		},

		onCollision: function(entity){
			if(entity == this.getActor()){
				return;
			}

			this.destroy();
		}
	};

	laser.__proto__ = Ammo();

	return laser;
}

module.exports = Laser;