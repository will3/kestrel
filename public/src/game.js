var Game = (function(){
	var scene;
	var camera;
	var renderer;
	var control;
	var target = new THREE.Vector3();
	var cameraYawPitchRow = new THREE.Vector3();
	var distance = 500.0;
	var frameRate = 60.0;
	var keyboard;
	var entityRunner = new EntityRunner();
	var physics = new Physics();

	var onEnterFrame = function(){ 
		entityRunner.run();
	}

	var updateCamera = function(){
		var yaw = cameraYawPitchRow.x;
		var pitch = cameraYawPitchRow.y;
		var roll = cameraYawPitchRow.z;
		var matrix = MathUtils.getRotationMatrix(yaw, pitch, roll); 
		var unitZ = new THREE.Vector3(0, 0, 1);
		unitZ.applyMatrix4(matrix);
		unitZ.setLength(distance);

		var position = new THREE.Vector3();
		position.subVectors(target, unitZ);

		camera.position.set(position.x, position.y, position.z);
		camera.lookAt(target);
		camera.updateMatrix();
	}

	var initScene = function(){
		var WIDTH = container.width(),
		    	HEIGHT = container.height();

		var VIEW_ANGLE = 45,
		    ASPECT = WIDTH / HEIGHT,
		    NEAR = 0.1,
		    FAR = 10000;

		renderer = new THREE.WebGLRenderer();
		camera = new THREE.PerspectiveCamera(  VIEW_ANGLE,
	                                ASPECT,
	                                NEAR,
	                                FAR  );

		scene = new THREE.Scene();

		renderer.setSize(WIDTH, HEIGHT);

		container.append(renderer.domElement);

		render();

		cameraYawPitchRow.set(Math.PI / 4.0, Math.PI / 4.0);

		updateCamera();

		scene.add(camera);

		THREEx.WindowResize(renderer, camera);

		keyboard = new THREEx.KeyboardState(renderer.domElement);
		renderer.domElement.setAttribute("tabIndex", "0");
		renderer.domElement.focus();

		// only on keyup
		keyboard.domElement.addEventListener('keyup', function(event){
			if(keyboard.eventMatches(event, KeyMap.console)){
				Console.focus();
			}else if(keyboard.eventMatches(event, KeyMap.zoomIn)){
				zoomIn();
			}else if(keyboard.eventMatches(event, KeyMap.zoomOut)){
				zoomOut();
			}
		})
	}

	var zoomIn = function(){
		distance /= 1.2;
		updateCamera();
	}

	var zoomOut = function(){
		distance *= 1.2;
		updateCamera();
	}

	var mouseMove = function(xDiff, yDiff){
		var yVector = new THREE.Vector3(target.x - camera.position.x, 0, target.z - camera.position.z);
		var m = MathUtils.getRotationMatrix(Math.PI / 2.0, 0, 0);
		var xVector = new THREE.Vector3();
		xVector.copy(yVector);
		xVector.applyMatrix4(m);

		xVector.normalize();
		yVector.normalize();

		target.addVectors(target, xVector.multiplyScalar(xDiff / 2.0));
		target.addVectors(target, yVector.multiplyScalar(yDiff / 2.0));

		updateCamera();
	}

	var initControl = function(){
		control = new Control();
		control.hookContainer(container);

		control.mousemove(function(xDiff, yDiff){
			mouseMove(xDiff, yDiff)
		});
	}

	var render = function(){
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}

	return{
		initialize: function(container) {
			initScene();
			initControl();
			this.addEntity(physics);
			setInterval(onEnterFrame, 1000 / frameRate);
		},

		addEntity : function(entity){
			entityRunner.addEntity(entity);
		},

		removeEntity: function(entity){
			entityRunner.removeEntity(entity);
		},

		getScene: function(){
			return scene;
		},

		getEntity: function(name){
			var entities = $.grep(entityRunner.entities, function(e){ return e.name == name });
			if(entities == null || entities.length == 0){
				throw "cannot find entity with name: " + name;
			}

			if(entities.length > 1){
				throw "more than more entity with name: " + name + " found";
			}

			return entities[0];
		},

		getPhysics: function(){
			return physics;
		},

		getNamedEntities: function(){
			var entities = $.grep(this.getEntities(), function(e){
				return e.name != null;
			});

			return entities;
		},

		getEntities: function(){
			return entityRunner.entities;
		}
	};
})();
