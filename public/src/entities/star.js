var Star = Entity.extend({
	start: function(){
		this.addComponent(new StarRenderComponent());
	},

	update: function(){

	}
});

var StarRenderComponent = RenderComponent.extend(function(){
	
}).methods({
	initGeometry: function(){
		var side = 500;

		var geometry = new THREE.BufferGeometry();
		var positions = new Float32Array( side * side * 3);
		var colors = new Float32Array(side * side * 3);

		var color = new THREE.Color();

		noise.seed(Math.random());

		for(var i = 0; i < side; i ++){
			for(var j = 0; j < side; j ++){
				var index = (i * side + j) * 3;

				var x = i - side / 2.0;
				var y = noise.simplex2(i / 100, j / 100) * 50;
				var z = j - side / 2.0;

				//positions
				positions[ index ]     = x;
				positions[ index + 1 ] = y;
				positions[ index + 2 ] = z;

				//colors
				color.setRGB( 1.0, 1.0, 1.0 );

				colors[ index ]     = color.r;
				colors[ index + 1 ] = color.g;
				colors[ index + 2 ] = color.b;
			}
		}

		geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
		geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

		geometry.computeBoundingSphere();

		function createStars(){

		}

		return geometry;
	},


	initMaterial: function(){
		var material = new THREE.PointCloudMaterial( { size: 1, vertexColors: THREE.VertexColors } );

		return material;
	},

	initObject: function(geometry, material){
		return new THREE.PointCloud( geometry, material );
	}
});