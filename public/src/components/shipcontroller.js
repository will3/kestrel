var ShipController = Component.extend(function(){
	this.force = 0.04;
	this.velocity = new THREE.Vector3();
	this.acceleration = new THREE.Vector3();
	this.decceleration = 1.0;

	this.maxDecceleration = 0.7;
	this.maxRoll = Math.PI / 2;
	this.desiredRoll = 0;
	this.rollSpeed = 0.1;
	this.rollStability = 0.95;
	this.yawForce = 0.02;
	this.friction = 0.96;

	this.command = null;
}).methods({
	getName: function(){
		return "ShipController";
	},

	start: function(){

	},

	setCommand: function(command){
		if(this.command != null){
			this.command.destroy();
			this.command = null;
		}

		this.command = command;
	},

	getPosition: function(){
		return this.getTransform().position;
	},

	getMaxVelocity: function(){
		return this.force / (1 - this.friction);
	},

	update: function(){
		this.updatePosition();
		this.updateRoll();
		this.updateYaw();

		if(this.command != null){
			this.command.update();
		}
	},

	updatePosition: function(){
		this.velocity.add(this.acceleration);
		this.velocity.multiplyScalar(this.decceleration);
		this.velocity.multiplyScalar(this.friction);
		this.getTransform().position.add(this.velocity);
		this.acceleration.set(0, 0, 0);
		this.decceleration = 1.0;
	},

	updateRoll: function(){
		var rotation = this.getTransform().rotation;

		var roll = rotation.z;
		roll += (this.desiredRoll - roll) * this.rollSpeed;
		roll *= this.rollStability;
		rotation.setZ(roll);

		this.desiredRoll = 0;
	},

	updateYaw: function(){
		var rotation = this.getTransform().rotation;
		var bankFactor = Math.sin(rotation.z);
		var yawVelocity =  bankFactor * - this.yawForce;

		var yaw = rotation.x;
		yaw += yawVelocity;
		rotation.setX(yaw);
	},

	accelerate: function(amount){
		var rotation = this.getTransform().rotation;
		var vector = MathUtils.getUnitVector(rotation.x, rotation.y, rotation.z);
		vector.multiplyScalar(amount * this.force);
		this.acceleration.add(vector);
	},

	accelerateForVelocity: function(velocity){
		var velocityDiff = velocity - this.velocity.length();
		//accelerate
		if(velocityDiff > 0){
			var amount = velocityDiff / this.force;
			if(amount > 1){
				amount = 1;
			}
			this.accelerate(amount);
		//deccelerate
		}else{
			var decceleration = velocity / this.velocity.length();
			if(decceleration < this.maxDecceleration){
				decceleration = this.maxDecceleration;
			}

			this.decceleration = decceleration;
		}
	},

	//amount 0 - 1
	bank: function(amount){
		this.desiredRoll = this.maxRoll * amount;
	},

	//bank to achieve yaw velocity
	bankForYawVelocity: function(yawVelocity){
		var bankFactor = yawVelocity / -this.yawForce;
		if(bankFactor > 1){
			bankFactor = 1;
		}else if(bankFactor < -1){
			bankFactor = -1;
		}
		var desiredRoll = Math.asin(bankFactor);
		var amount = desiredRoll / this.maxRoll;

		this.bank(amount);
	},

	bankForPoint: function(point){
		var position = this.getTransform().position;

		var a = new THREE.Vector3();
		a.copy(point);
		var b = new THREE.Vector3();
		b.copy(position)
		var c = this.getUnitFacing();

		var angleBetween = MathUtils.angleBetween(a, b, c);

		var desiredYawSpeed = angleBetween * 0.1;

		this.bankForYawVelocity(desiredYawSpeed);
	},

	getUnitFacing: function(){
		var position = this.getTransform().position;
		var rotation = this.getTransform().rotation;
		var unitFacing = MathUtils.getUnitVector(rotation.x, rotation.y, rotation.z);
		var c = new THREE.Vector3();
		c.addVectors(position, unitFacing);

		return c;
	},
});