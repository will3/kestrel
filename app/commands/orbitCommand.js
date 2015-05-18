var Command = require("../command");
var THREE = require("THREE");
var MathUtils = require("../mathutils");

var OrbitCommand = function(){
	var target = null;
	var distance = 0;

	var orbitCommand = {
		getTarget: function(){ return target; },
		getDistance: function(){ return	distance; },
		execute: function(){
			var x = parseInt(params[0]);
			var y = parseInt(params[1]);
			var z = parseInt(params[2]);
			
			var distanceParam = params[3];
			distance = (distanceParam == null || distanceParam.length == 0) ? 50 : parseInt(distanceParam);

			target = new THREE.Vector3(x, y, z);

			this.getActor().getShipController().setCommand(this);
		},

		update: function(){
			var shipController = this.getActor().getShipController();

			var position = this.getActor().getTransform().getPosition();
			//a being vector from position to target
			var a = new THREE.Vector3();
			a.subVectors(target, position);
			a.setY(0);

			var yAxis = MathUtils.yAxis;

			var b = new THREE.Vector3();
			b.copy(a);
			b.applyAxisAngle(yAxis, 3 * Math.PI / 4);

			var c = new THREE.Vector3();
			c.copy(a);
			c.applyAxisAngle(yAxis, - 3 * Math.PI / 4);

			b.setLength(distance);
			c.setLength(distance);

			b.addVectors(b, target);
			c.addVectors(c, target);

			var unitFacing = shipController.getUnitFacing();
			var angle1 = Math.abs(MathUtils.angleBetween(b, position, unitFacing));
			var angle2 = Math.abs(MathUtils.angleBetween(c, position, unitFacing));
			
			var point = angle1 < angle2 ? b : c;

			shipController.align(point);

			shipController.accelerate(1.0);
		}
	};

	orbitCommand.__proto__ = Command();

	return orbitCommand;
}

module.exports = OrbitCommand;