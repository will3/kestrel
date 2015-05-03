var MathUtils = (function(){
	return{

		getRotationMatrix: function(yaw, pitch, roll){
			var m = new THREE.Matrix4();
			m.makeRotationFromEuler(this.getEuler(yaw, pitch, roll));
			return m;
		},

		getEuler: function(yaw, pitch, roll){
			return new THREE.Euler(pitch, yaw, roll, 'YXZ');
		},

		getUnitVector: function(yaw, pitch, roll){
			var unitZ = new THREE.Vector3(0, 0, 1);
			var m = this.getRotationMatrix(yaw, pitch, roll);
			unitZ.applyMatrix4(m);

			return unitZ;
		},

		//get sum of cross products ignoring y
		getSumOverEdgesXZ: function(points){
			var sum = 0;

			for(var i = 0; i < points.length; i++){
				var point = points[i];
				var nextPoint = (i == points.length - 1) ? points[0] : points[i + 1];
				
				sum += (nextPoint.x - point.x) * (nextPoint.z + point.z);
			}

			return sum;
		}
	};
})();