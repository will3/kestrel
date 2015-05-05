var OrbitCommand = Command.extend(function(){
	this.target = null;
	this.actor = null;
	this.distance = 0;
	this.targetIndicators = [];
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

		this.addIndicator(this.target);
	},

	update: function(){
		var shipController = this.actor.shipController;

		var position = this.actor.getTransform().position;
		//a being vector from position to target
		var a = new THREE.Vector3();
		a.subVectors(this.target, position);

		//b and c being points |this.distance along vectors perpendicular to a
		var b = new THREE.Vector3(a.z, 0, -a.x);
		b.setLength(this.distance);
		var c = new THREE.Vector3(-b.x, 0, -b.z);
		c.setLength(this.distance);
		b.addVectors(b, this.target);
		c.addVectors(c, this.target);

		this.addIndicator(b, 5);
		this.addIndicator(c, 5);

		var unitFacing = shipController.getUnitFacing();
		var angle1 = Math.abs(MathUtils.angleBetween(b, position, unitFacing));
		var angle2 = Math.abs(MathUtils.angleBetween(c, position, unitFacing));
		
		var point = angle1 < angle2 ? b : c;

		shipController.bankForPoint(point);
		shipController.accelerate(1.0);
	},

	addIndicator: function(point, lifeTime){
		var indicator = new Target(lifeTime);
		indicator.getTransform().position.copy(point);
		this.actor.addEntity(indicator);

		this.targetIndicators.push(indicator);
	},

	destroy: function(){
		var that = this;

		this.targetIndicators.forEach(function(indicator){
			that.actor.removeEntity(indicator);
		});
	}
});