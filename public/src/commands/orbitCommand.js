var OrbitCommand = Command.extend(function(){
	this.target = null;
	this.actor = null;
	this.distance = 0;
}).methods({
	getOp: function(){
		return "orbit";
	},

	execute: function(){
		this.actor = Game.getEntity(this.params[0]);

		var x = parseInt(this.params[1]);
		var z = parseInt(this.params[2]);
		
		var distanceParam = this.params[3];
		this.distance = (distanceParam == null || distanceParam.length == 0) ? 50 : parseInt(distanceParam);

		this.target = new THREE.Vector3(x, 0, z);

		this.actor.shipController.setCommand(this);
	},

	update: function(){
		var shipController = this.actor.shipController;

		var position = this.actor.getTransform().position;

		var diffX = this.target.x - position.x;
		var diffZ = this.target.z - position.z;
		var distanceFromTarget = Math.sqrt(diffX * diffX + diffZ * diffZ);

		Debug.addIndicator(this.target);

		if(distanceFromTarget < this.distance){
			var vector = new THREE.Vector3();
			vector.subVectors(position, this.target);
			var length = vector.length();
			vector.setLength(length + 10);

			var b = new THREE.Vector3();
			var c = new THREE.Vector3();
			b.copy(vector);
			c.copy(vector);

			b.applyAxisAngle(MathUtils.getYAxis(), 0.1);
			c.applyAxisAngle(MathUtils.getYAxis(), - 0.1);
			b.addVectors(b, this.target);
			c.addVectors(c, this.target);

			var point = this.getPointWithCloserAngle(b, c);
			shipController.bankForPoint(point);

			Debug.addIndicator(point, 5);

			shipController.accelerate(1.0);
		}else{
			this.orbit(this.distance, position);
		}
	},

	orbit: function(radius, position){
		var shipController = this.actor.shipController;

		var tangentPoint = this.getTangentPoint(radius, position);

		shipController.bankForPoint(tangentPoint);
		Debug.addIndicator(tangentPoint);
		shipController.accelerate(1.0);
	},

	getTangentPoint: function(radius, position){
		var tangents = MathUtils.findTangentPoints(this.target, radius, position);	
		var b = tangents[0];
		var c = tangents[1];

		b.addVectors(b, this.target);
		c.addVectors(c, this.target);

		var point = this.getPointWithCloserAngle(b, c);

		return point;
	},

	getPointWithCloserAngle: function(b, c){
		var position = this.actor.getTransform().position;

		var shipController = this.actor.shipController;

		var unitFacing = shipController.getUnitFacing();
		var angle1 = Math.abs(MathUtils.angleBetween(b, position, unitFacing));
		var angle2 = Math.abs(MathUtils.angleBetween(c, position, unitFacing));
		
		var point = angle1 < angle2 ? b : c;

		return point;
	},

	destroy: function(){

	}
});