var Component = require("../component");
var THREE = require("THREE");
var MathUtils = require("../mathutils");

// //pitch
// var maxPitch = Math.PI / 2;
// var desiredPitch = 0;
// var pitchCurve = 0.1;
// var pitchMaxSpeed = 0.1;
// var pitchFriction = 0.97;

var RotationState = function(params){
	var params = params;
	var max = Math.PI / 2;
	var desired = 0;
	var curve = 0.1;
	var maxSpeed = 0.1;
	var friction = 0.95;
	var orientation = "";

	var getVectorValue = function(vector){
		if(orientation == "x"){
			return vector.x;
		}else if(orientation == "y"){
			return vector.y;
		}else if(orientation == "z"){
			return vector.z;
		}

		throw "invalid orientation";
	}

	var setVectorValue = function(vector, value){
		if(orientation == "x"){
			vector.setX(value);
		}else if(orientation == "y"){
			vector.setY(value);
		}else if(orientation == "z"){
			vector.setZ(value);
		}else{
			throw "invalid orientation";
		}
	}

	return {
		setAmount : function(amount){
			desired = max * amount;
		},

		setDesired: function(amount){
			desired = amount;
		},

		update : function(transform){
			var rotation = transform.getRotation();

			var value = getVectorValue(rotation);
			
			var speed = (desired - value) * curve;
			if(speed > maxSpeed){
				speed = maxSpeed;
			}else if(speed < - maxSpeed){
				speed = - maxSpeed;
			}
			value += speed;
			value *= friction;

			setVectorValue(rotation, value);

			desired = 0;
		}
	}
}

var ShipController = function(roll, pitch){
	//engine
	var force = 0.025;

	var roll = roll != null ? roll : new Roll();
	var pitch = pitch != null ? pitch : new Pitch();

	//yaw
	var yawForce = 0.015;

	var command = null;

	//amount 0 - 1
	var bank = function(amount){
		roll.setAmount(amount);
	};

	//bank to achieve yaw velocity
	var bankForYawVelocity = function(yawVelocity){
		var bankFactor = yawVelocity / - yawForce;
		if(bankFactor > 1){
			bankFactor = 1;
		}else if(bankFactor < -1){
			bankFactor = -1;
		}
		var desiredRoll = Math.asin(bankFactor);

		roll.setDesired(desiredRoll);
	};

	var updatePitch = function(transform){
		var rotation = transform.getRotation();
		var pitch = rotation.y;
		var pitchChange = (desiredPitch - pitch) * pitchCurve;
		if(pitchChange > pitchMaxSpeed){
			pitchChange = pitchMaxSpeed;
		}else if(pitchChange < - pitchMaxSpeed){
			pitchChange = - pitchMaxSpeed;
		}
		pitch += pitchChange;

		pitch *= pitchFriction;

		rotation.setY(pitch);

		desiredPitch = 0;
	};

	var updateYaw = function(transform){
		var rotation = transform.getRotation();
		var bankFactor = Math.sin(rotation.z);
		var yawVelocity =  bankFactor * - yawForce;

		var yaw = rotation.x;
		yaw += yawVelocity;
		rotation.setX(yaw);
	};

	var shipController = {
		getRoll: function(){ return roll; },
		getRigidBody: function(){
			return this.getEntity().getRigidBody();
		},

		getPosition: function(){
			return this.getTransform().position;
		},

		start: function(){

		},

		setCommand: function(value){
			if(command != null){
				command.destroy();
				command = null;
			}

			command = value;
		},

		getMaxVelocity: function(){
			return this.force / (1 - this.friction);
		},

		update: function(){
			var transform = this.getTransform();
			roll.update(transform);
			updateYaw(transform);
			updatePitch(transform);

			if(command != null){
				command.update();
			}
		},

		accelerate: function(amount){
			var rotation = this.getTransform().rotation;
			var vector = MathUtils.getUnitVector(rotation.x, rotation.y, rotation.z);
			vector.multiplyScalar(amount * this.force);
			this.getRigidBody().acceleration.add(vector);
		},

		accelerateForVelocity: function(velocity){
			var velocityDiff = velocity - this.getRigidBody().velocity.length();
			//accelerate
			if(velocityDiff > 0){
				var amount = velocityDiff / this.force;
				if(amount > 1){
					amount = 1;
				}
				this.accelerate(amount);
			}
		},

		align: function(point){
			var position = this.getTransform().position;

			var a = new THREE.Vector3();
			a.copy(point);
			var b = new THREE.Vector3();
			b.copy(position)
			var c = this.getUnitFacing();

			var angleBetween = MathUtils.angleBetween(a, b, c);

			var desiredYawSpeed = angleBetween * 0.1;

			bankForYawVelocity(desiredYawSpeed);
			var xDiff = point.x - position.x;
			var yDiff = point.y - position.y;
			var zDiff = point.z - position.z;

			desiredPitch = Math.atan2(-yDiff, Math.sqrt(xDiff * xDiff + zDiff * zDiff));
		},

		getUnitFacing: function(){
			var position = this.getTransform().position;
			var rotation = this.getTransform().rotation;
			var unitFacing = MathUtils.getUnitVector(rotation.x, rotation.y, rotation.z);
			var c = new THREE.Vector3();
			c.addVectors(position, unitFacing);

			return c;
		},

		move: function(point){
			this.align(point);

			var position = this.getTransform().position;
			
			var distanceVector = new THREE.Vector3();
			distanceVector.subVectors(point, position);
			var distance = distanceVector.length();
			var desiredVelocity = (distance - 10.0) * 0.05;
			this.accelerateForVelocity(desiredVelocity);
		}
	};

	shipController.__proto__ = Component();

	return shipController;
}

ShipController.Roll = Roll;

module.exports = ShipController;