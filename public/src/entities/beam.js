function Beam(segments, sides){
	var segments = segments;
	var sides = sides;
	var vertices = [];
	var faceIndices = [];
	var edges = 4;

	var geometry;
	var geometryNeedsUpdate = true;

	var alignment = "y";
	var scale = null;
	var position = null;

	var childBeams = [];

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

		return geometry;
	}

	function getCenterY(){
		var minY = Math.min.apply(Math, segments);
		var maxY = Math.max.apply(Math, segments);
		return (minY + maxY) / 2.0;
	}

	function getPoint(segmentIndex, edgeIndex){
		var y = segments[segmentIndex] - getCenterY();
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

	function getIndex(segmentIndex, edgeIndex){
		return segmentIndex * edges + edgeIndex;
	}

	function assign(point, axis, value){
		if(axis == "x"){
			point.setX(value);
		}else if(axis == "y"){
			point.setY(value);
		}else if(axis == "z"){
			point.setZ(value);
		}else{
			throw "invalid axis: " + axis;
		}
	}

	return {
		getGeometry : function(){
			if(geometryNeedsUpdate){
				geometry = null;
			}

			if(geometry == null){
				geometry = makeGeometry();
			}

			if(scale != null){
				geometry.applyMatrix(new THREE.Matrix4().makeScale(scale.x, scale.y, scale.z));
			}

			if(position != null){
				geometry.applyMatrix(new THREE.Matrix4().makeTranslation(position.x, position.y, position.z));
			}

			childBeams.forEach(function(childBeam){
				geometry.merge(childBeam.getGeometry());
			});

			return geometry;
		},

		setAlignment : function(value){
			if(alignment != value){
				alignment = value;
				geometryNeedsUpdate = true;
			}
		},

		getAlignment: function(value){
			return alignment;
		},

		setScale : function(value){
			scale = value;
		},

		setPosition: function(value){
			position = value;
		},

		getPosition: function(){
			return position;
		},

		branch: function(beam, offset, extrusion){
			if(beam.getAlignment() == this.getAlignment()){
				throw "cannot attach beam of the same orientations together";
			}

			var offsetAxis = this.getAlignment();
			var extrusionAxis = beam.getAlignment();

			var position = new THREE.Vector3(0, 0, 0);
			assign(position, offsetAxis, offset);
			assign(position, extrusionAxis, extrusion);
			beam.setPosition(position);

			childBeams.push(beam);
		},
	}
}