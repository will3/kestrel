var MoveCommand = Command.extend(function(){
	this.target = null;
	this.actor = null;
	this.targetIndicator = null;
}).methods({
	getOp: function(){
		return "move";
	},

	execute: function(){
		this.actor = Game.getEntity(this.params[0]);

		var x = this.params[1];
		var z = this.params[2];

		this.target = new THREE.Vector3(x, 0, z);

		this.actor.issueCommand(this);
	},

	update: function(){
		var shipController = this.actor.shipController;
		shipController.accelerate(1.0);

		var rotation = this.actor.getTransform().rotation;
		var position = this.actor.getTransform().position;
		var targetIndicatorPosition = this.targetIndicator == null ? null : this.targetIndicator.getTransform().position;
		var targetIndicatorNeedsRedraw = targetIndicatorPosition == null ? true : targetIndicatorPosition.equals(position);
		if(targetIndicatorNeedsRedraw){
			if(this.targetIndicator != null){
				this.actor.removeEntity(this.targetIndicator);
			}

			this.targetIndicator = new Bullet();
			this.targetIndicator.getTransform().scale.set(10, 10, 10);
			Game.nameEntity("target", this.targetIndicator);
			this.targetIndicator.getTransform().position.copy(this.target);
			this.actor.addEntity(this.targetIndicator);
		}
		var unitFacing = MathUtils.getUnitVector(rotation.x, rotation.y, rotation.z);

		var a = new THREE.Vector3();
		a.copy(position)

		var b = new THREE.Vector3();
		b.copy(this.target);

		var c = new THREE.Vector3();
		c.addVectors(a, unitFacing);

		var sum = MathUtils.getSumOverEdgesXZ([a, b, c]);

		if(sum > 0){
			shipController.bank(1);
		}else{
			shipController.bank(-1);
		}
	},
});