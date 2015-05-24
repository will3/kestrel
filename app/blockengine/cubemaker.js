var THREE = require("THREE");

var CubeMaker = function(){
	var geometry = null;

	var make = function(bottomWidth, topWidth){
		geometry = new THREE.Geometry();
		var a, b, c, d, e, f, g, h;

		var bottom = bottomWidth || 1.0;
		var top = topWidth || 1.0;

		a = new THREE.Vector3(-0.5 * bottom, -0.5, -0.5 * bottom);	//0
		b = new THREE.Vector3(0.5 * bottom, -0.5, -0.5 * bottom);		//1
		c = new THREE.Vector3(0.5 * bottom, -0.5, 0.5 * bottom);		//2
		d = new THREE.Vector3(-0.5 * bottom, -0.5, 0.5 * bottom);		//3

		e = new THREE.Vector3(-0.5 * top, 0.5, -0.5 * top);		//0
		f = new THREE.Vector3(0.5 * top, 0.5, -0.5 * top);		//1
		g = new THREE.Vector3(0.5 * top, 0.5, 0.5 * top);		//2
		h = new THREE.Vector3(-0.5 * top, 0.5, 0.5 * top);		//3

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

		return this;
	}

	//	  7   6
	//  4	5
	//	  3   2
	//	0	1
	//size: grid size
	//offset: offset in grid
	var configure = function(size, grid, scale){
		if(scale != null){
			geometry.applyMatrix(new THREE.Matrix4().makeScale(scale.x, scale.y, scale.z));
		}

		if(grid != null){
			geometry.applyMatrix(new THREE.Matrix4().makeTranslation(grid.x, grid.y, grid.z));
		}

		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0.5, 0.5, 0.5));
		
		if(size	!= 1){
			geometry.applyMatrix(new THREE.Matrix4.makeScale(size, size, size));
		}

		return this;
	}

	var build = function(){
		return geometry;
	}

	var cube = {
		make : make,
		configure: configure,
		build: build,
	}

	return cube;
};

module.exports = CubeMaker;