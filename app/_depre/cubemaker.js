var THREE = require("THREE");

var CubeMaker = function(){
	var cubeMaker = {
		//	  7   6
		//  4	5
		//	  3   2
		//	0	1
		build : function(){
			var geometry = new THREE.Geometry();

			var a, b, c, d, e, f, g, h;

			a = new THREE.Vector3(-0.5, -0.5, -0.5);	//0
			b = new THREE.Vector3(0.5, -0.5, -0.5);		//1
			c = new THREE.Vector3(0.5, -0.5, 0.5);		//2
			d = new THREE.Vector3(-0.5, -0.5, 0.5);		//3

			e = new THREE.Vector3(-0.5, 0.5, -0.5);		//0
			f = new THREE.Vector3(0.5, 0.5, -0.5);		//1
			g = new THREE.Vector3(0.5, 0.5, 0.5);		//2
			h = new THREE.Vector3(-0.5, 0.5, 0.5);		//3

			[a, b, c, d, e, f, g, h].forEach(function(vertice){
				geometry.vertices.push(vertice);
			})

			geometry.faces.push(new THREE.Face3(1, 0, 2));
			geometry.faces.push(new THREE.Face3(3, 2, 0));
			geometry.faces.push(new THREE.Face3(4, 5, 6));
			geometry.faces.push(new THREE.Face3(4, 6, 7));

			geometry.faces.push(new THREE.Face3(0, 1, 5));
			geometry.faces.push(new THREE.Face3(1, 2, 6));
			geometry.faces.push(new THREE.Face3(2, 3, 7));
			geometry.faces.push(new THREE.Face3(3, 0, 4));

			geometry.faces.push(new THREE.Face3(5, 4, 0));
			geometry.faces.push(new THREE.Face3(6, 5, 1));
			geometry.faces.push(new THREE.Face3(7, 6, 2));
			geometry.faces.push(new THREE.Face3(4, 7, 3));

			return geometry;
		}
	}

	return cubeMaker;
}

module.exports = CubeMaker;