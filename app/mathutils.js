var THREE = require('THREE');

var MathUtils = (function(){
	return{
		yAxis: new THREE.Vector3(0, 1, 0),
		
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

		//graham scan
		ccw: function(p1, p2, p3){
			return (p2.x - p1.x) * (p3.z - p1.z) - (p2.z - p1.z) * (p3.x - p1.x);
		},

		//v * w = ||v|| ||w|| cos0
		angleBetween: function(p1, p2, p3){
			// p12 = new THREE.Vector3();
			// p23 = new THREE.Vector3();

			// p12.subVectors(p2, p1);
			// p23.subVectors(p3, p2);

			// return Math.acos(p12.dot(p23) / (p12.length() * p23.length()));

			var v1x = p1.x - p2.x;
			var v1y = p1.z - p2.z;
			var v2x = p3.x - p2.x;
			var v2y = p3.z - p2.z;

			return this.normalizeAngle(Math.atan2(v1x, v1y) - Math.atan2(v2x, v2y));
		},

		//normalize an angle between -pi pi
		normalizeAngle: function(angle){
			angle %= (Math.PI * 2);
			if(angle > Math.PI){
				angle -= (Math.PI * 2);
			}else if(angle < -Math.PI){
				angle += (Math.PI * 2);
			}

			return angle;
		},

		findTangentPoints: function(center, radius, point){
			var cx = center.x;
			var cy = center.z;
			var px = point.x;
			var py = point.z;

			var dx = cx - px;
		    var dy = cy - py;
		    var dd = Math.sqrt(dx * dx + dy * dy);
		    var a = Math.asin(radius / dd);
		    var b = Math.atan2(dy, dx);
		    
		    var t = b - a;
		    var t = b + a;
		
		    return [
		    	new THREE.Vector3(radius * Math.sin(t), 0, radius * -Math.cos(t)),
		    	new THREE.Vector3(radius * -Math.sin(t), 0, radius * Math.cos(t)),
		    ];
		},
	};
})();

module.exports = MathUtils;