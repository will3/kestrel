function Beam(segments, sides){
	var segments = segments;
	var sides = sides;
	var vertices = [];
	var faceIndices = [];

	//assume 4 edges
	var edges = 4;

	var centerY = getCenterY();

	var geometry;

	var geometryNeedsUpdate = true;

	var alignment = "y";

	//initialize geometry
	//align along y axis
	function makeGeometry(){
		geometry = new THREE.Geometry();

		//make points
		for(var segmentIndex = 0; segmentIndex < segments.length; segmentIndex ++){
			for(var edgeIndex = 0; edgeIndex < edges; edgeIndex ++){
				var point = getPoint(segmentIndex, edgeIndex);
				geometry.vertices.push(point);		
			}
		}

		//make faces
		for(var segmentIndex = 0; segmentIndex < segments.length; segmentIndex ++){
			var nextSegmentIndex = segmentIndex + 1;
			for(var edgeIndex = 0; edgeIndex < edges; edgeIndex ++){
				//make cross cuts

				//make sides
				if(segmentIndex < segments.length - 1){
					var nextEdgeIndex = (edgeIndex == edges - 1) ? 0 : edgeIndex + 1;

					// d c
					// a b
					var a = getIndex(segmentIndex, edgeIndex); 
					var b = getIndex(segmentIndex, nextEdgeIndex); 
					var c = getIndex(nextSegmentIndex, nextEdgeIndex); 
					var d = getIndex(nextSegmentIndex, edgeIndex); 

					geometry.faces.push(new THREE.Face3(a, c, b));
					geometry.faces.push(new THREE.Face3(c, a, d));
				}
			}

			var a = getIndex(segmentIndex, 0);
			var b = getIndex(segmentIndex, 1);
			var c = getIndex(segmentIndex, 2);
			var d = getIndex(segmentIndex, 3);
			
			if(segmentIndex == 0){
				geometry.faces.push(new THREE.Face3(a, b, c));
				geometry.faces.push(new THREE.Face3(c, d, a));
			}

			if(segmentIndex == segments.length - 1){
				geometry.faces.push(new THREE.Face3(a, c, b));
				geometry.faces.push(new THREE.Face3(c, a, d));
			}
		}

		var m;

		if(alignment == "x"){
			var m = MathUtils.getRotationMatrix(0, 0, Math.PI / 2);
		}else if(alignment == "y"){
			var m = MathUtils.getRotationMatrix(0, 0, 0);
		}else if(alignment == "z"){
			var m = MathUtils.getRotationMatrix(0, Math.PI/2, 0);
		}else if(alignment == "-x"){
			var m = MathUtils.getRotationMatrix(0, 0, - Math.PI / 2);
		}else if(alignment == "-y"){
			var m = MathUtils.getRotationMatrix(0, Math.PI, 0);
		}else if(alignment == "-z"){
			var m = MathUtils.getRotationMatrix(0, -Math.PI/2, 0);
		}

		geometry.applyMatrix(m);
		// geometry.verticesNeedsUpdate = true;

		return geometry;
	}

	function getPoint(segmentIndex, edgeIndex){
		var y = segments[segmentIndex] - centerY;
		var side = sides[segmentIndex];

		var x = side / 2.0;
		var z = side / 2.0;

		switch(edgeIndex){
			case 0:
				return new THREE.Vector3(-x, y, -z);
				break;
			case 1:
				return new THREE.Vector3(x, y, -z);
				break;
			case 2:
				return new THREE.Vector3(x, y, z);
				break;
			case 3:
				return new THREE.Vector3(-x, y, z);
				break;
			default:
				throw "unsupported edgeIndex";
		}
	}

	function getCenterY(){
		var minY = Math.min.apply(Math, segments);
		var maxY = Math.max.apply(Math, segments);
		return (minY + maxY) / 2.0;
	}

	function getIndex(segmentIndex, edgeIndex){
		return segmentIndex * edges + edgeIndex;
	}

	return {
		getGeometry : function(){
			if(geometryNeedsUpdate){
				geometry = null;
			}

			if(geometry == null){
				geometry = makeGeometry();
			}

			return geometry;
		},

		setAlignment : function(value){
			if(alignment != value){
				alignment = value;
				geometryNeedsUpdate = true;
			}
		}

	}
}