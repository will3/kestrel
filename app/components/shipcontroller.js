var Component = require("../component");
var THREE = require("THREE");
var MathUtils = require("../mathutils");

var RotationState = function(params){
	var desired = null;

	var params = params != null ? params : {};
	var resting = params.resting != null ? params.resting : null;
	var max = params.max != null ? params.max : Math.PI / 2;
	var curve = params.curve != null ? params.curve : 0.1;
	var maxSpeed = params.maxSpeed != null ? params.maxSpeed : 0.1;
	var friction = params.friction != null ? params.friction : 0.95;
	var axis = params.axis != null ? params.axis : "";

	var getVectorValue = null;
	var setVectorValue = null;
	if(axis == "x"){
		getVectorValue = function(vector){ return vector.x; }
		setVectorValue = function(vector, value){ vector.setX(value); }
	}else if(axis == "y"){
		getVectorValue = function(vector){ return vector.y; }
		setVectorValue = function(vector, value){ vector.setY(value); }
	}else if(axis == "z"){
		getVectorValue = function(vector){ return vector.z; }
		setVectorValue = function(vector, value){ vector.setZ(value); }
	}else{
		throw "invalid axis " + axis;
	}

	return {
		getAxis: function(){ return axis; },
		setAmount : function(amount){
			desired = max * amount;
		},

		setDesired: function(amount){
			desired = amount;
		},

		update : function(entity){
			if(desired == null){
				desired = resting;
			}

			if(desired != null){
				var transform = entity.getTransform();
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
			}

			desired = resting;
		}
	}
}

var Roll = function(){
	return new RotationState({
		axis: "z",
		resting: 0,
	});
}

var Pitch = function(){
	return new RotationState({
		axis: "x",
		resting: 0,
	});
}

var Yaw = function(roll){
	var roll = roll;
	var yawForce = 0.015;

	return {
		setYawForce: function(value){ yawForce = value; },
		getYawForce: function(){ return yawForce; },
		
		update: function(entity){
			var transform = entity.getTransform();
			var rotation = transform.getRotation();
			var bankFactor = Math.sin(rotation.z);
			var yawVelocity =  bankFactor * - yawForce;

			var yaw = rotation.x;
			yaw += yawVelocity;
			rotation.setY(yaw);
		}
	};
}

var ShipController = function(yaw, pitch, roll){
	//engine
	var force = 0.025;

	var roll = roll != null ? roll : new Roll();
	var pitch = pitch != null ? pitch : new Pitch();
	var yaw = yaw != null ? yaw : new Yaw(roll);

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
		setForce: function(value){
			force = value;
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

		update: function(){
			var transform = this.getTransform();
			var entity = this.getEntity();
			roll.update(entity);
			pitch.update(entity);
			yaw.update(entity);

			if(command != null){
				command.update();
			}
		},

		accelerate: function(amount){
			var rotation = this.getTransform().getRotation();
			var vector = MathUtils.getUnitVector(rotation.x, rotation.y, rotation.z);
			vector.multiplyScalar(amount * force);
			this.getRigidBody().applyForce(vector);
		},

		align: function(point){
			bank(1);
			// var position = this.getTransform().getPosition();

			// var a = new THREE.Vector3();
			// a.copy(point);
			// var b = new THREE.Vector3();
			// b.copy(position)
			// var c = this.getUnitFacing();

			// var angleBetween = MathUtils.angleBetween(a, b, c);

			// var desiredYawSpeed = angleBetween * 0.1;

			// bankForYawVelocity(desiredYawSpeed);
			// var xDiff = point.x - position.x;
			// var yDiff = point.y - position.y;
			// var zDiff = point.z - position.z;

			// pitch.setDesired(Math.atan2(-yDiff, Math.sqrt(xDiff * xDiff + zDiff * zDiff)));
		},

		move: function(point){
			this.align(point);
			this.acceleration(1.0);
		},

		getUnitFacing: function(){
			var position = this.getTransform().getPosition();
			var rotation = this.getTransform().getRotation();
			var unitFacing = MathUtils.getUnitVector(rotation.x, rotation.y, rotation.z);
			var c = new THREE.Vector3();
			c.addVectors(position, unitFacing);

			return c;
		}
	};

	shipController.__proto__ = Component();

	return shipController;
}

ShipController.RotationState = RotationState;
ShipController.Roll = Roll;
ShipController.Pitch = Pitch;
ShipController.Yaw = Yaw;

module.exports = ShipController;