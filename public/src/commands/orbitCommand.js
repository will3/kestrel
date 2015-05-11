var OrbitCommand = Command.extend(function(){
	this.target = null;
	this.actor = null;
	this.distance = 0;
	this.targetIndicators = [];
}).methods({
	execute: function(){
		var x = parseInt(this.params[0]);
		var y = parseInt(this.params[1]);
		var z = parseInt(this.params[2]);
		
		var distanceParam = this.params[3];
		this.distance = (distanceParam == null || distanceParam.length == 0) ? 50 : parseInt(distanceParam);

		this.target = new THREE.Vector3(x, y, z);

		this.actor.shipController.setCommand(this);
	},

	update: function(){
		Debug.addIndicator(this.target);

		var shipController = this.actor.shipController;

		var position = this.actor.getTransform().position;
		//a being vector from position to target
		var a = new THREE.Vector3();
		a.subVectors(this.target, position);
		a.setY(0);

		var yAxis = MathUtils.yAxis;

		var b = new THREE.Vector3();
		b.copy(a);
		b.applyAxisAngle(yAxis, 3 * Math.PI / 4);

		var c = new THREE.Vector3();
		c.copy(a);
		c.applyAxisAngle(yAxis, - 3 * Math.PI / 4);

		b.setLength(this.distance);
		c.setLength(this.distance);

		b.addVectors(b, this.target);
		c.addVectors(c, this.target);

		var unitFacing = shipController.getUnitFacing();
		var angle1 = Math.abs(MathUtils.angleBetween(b, position, unitFacing));
		var angle2 = Math.abs(MathUtils.angleBetween(c, position, unitFacing));
		
		var point = angle1 < angle2 ? b : c;

		shipController.align(point);

		Debug.addIndicator(point);

		shipController.accelerate(1.0);
	},

	destroy: function(){
		var that = this;

		this.targetIndicators.forEach(function(indicator){
			that.actor.removeEntity(indicator);
		});
	}
});