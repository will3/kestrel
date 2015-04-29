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
		}
	};
})();