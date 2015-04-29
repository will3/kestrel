var ShipController = Component.extend(function(){
	this.force = 0.04;
	this.velocity = new THREE.Vector3();
	this.acceleration = new THREE.Vector3();

	this.maxRoll = Math.PI / 2;
	this.desiredRoll = 0;
	this.rollSpeedFactor = 0.2;
	this.rollStability = 0.95;
	this.yawForce = 0.02;

}).methods({
	getName: function(){
		return "ShipController";
	},

	start: function(){

	},

	getPosition: function(){
		return this.getTransform().position;
	},

	getMaxVelocity: function(){
		var physics = this.getPhysics();
		return this.force / (1 - physics.friction);
	},

	update: function(){
		this.updatePosition();
		this.updateRoll();
		this.updateYaw();
	},

	updatePosition: function(){
		this.velocity.add(this.acceleration);
		this.velocity.multiplyScalar(this.getPhysics().friction);
		this.getTransform().position.add(this.velocity);
		this.acceleration.set(0, 0, 0);
	},

	updateRoll: function(){
		var rotation = this.getTransform().rotation;

		var roll = rotation.z;
		roll += (this.desiredRoll - roll) * this.rollSpeedFactor;
		roll *= this.rollStability;
		rotation.setZ(roll);

		this.desiredRoll = 0;
	},

	updateYaw: function(){
		var speedFactor = this.velocity.length() / this.getMaxVelocity();
		var rotation = this.getTransform().rotation;
		var bankFactor = Math.sin(rotation.z);
		var yawVelocity = speedFactor * bankFactor * - this.yawForce;

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

	//amount 0 - 1
	bank: function(amount){
		this.desiredRoll = this.maxRoll * amount;
	},

	getPhysics: function(){
		return Game.getPhysics();
	}
});