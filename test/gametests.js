describe('Game', function(){
	var game = null;
	var entityRunner = null;

	beforeEach(function(){
		entityRunner = sinon.mock(new EntityRunner());
		game = new Kestrel.Game(entityRunner.object);
	});

	describe('addEntity', function(){
		it('should add and initialize entity', function(){
			var entity = mockEntity();
			entity.expects("start");
			entityRunner.expects("addEntity").withArgs(entity.object);

			game.addEntity(entity.object);

			entity.verify();
			entityRunner.verify();
		});
	});

	describe('removeEntity', function(){
		it('should remove and destroy entity', function(){
			var entity = mockEntity();
			entity.expects("destroy");
			entityRunner.expects("removeEntity").withArgs(entity.object);

			game.removeEntity(entity.object);

			entity.verify();
			entityRunner.verify();
		});
	});

	describe('getEntity', function(){
		it('should return entity with name', function(){
			var entity = mockEntity();
			var expectedEntity = entityWithName("name1");
			entityRunner.object.entities = [ expectedEntity ];

			expect(game.getEntity("name1")).to.equal(expectedEntity);
		});

		it('should throw when entity not found', function(){
			entityRunner.object.entities = [];

			expect(function(){game.getEntity("name1")}).to.throw("cannot find entity with name: name1");
		});

		it('should throw when more than one entity found', function(){
			entityRunner.object.entities = [
				entityWithName("name1"),
				entityWithName("name1"),
			];

			expect(function(){game.getEntity("name1")}).to.throw("more than one entity with name: name1 found");
		});
	});

	describe("getEntities", function(){
		it("should return entities with name", function(){
			var expectedEntity1 = entityWithName("name1");
			var expectedEntity2 = entityWithName("name2");

			entityRunner.object.entities = [expectedEntity1, expectedEntity2];

			expect(game.getEntities("name1").length).to.equal(2);
		});
	});

	describe("nameEntity", function(){
		it("should increment id with same name", function(){
			var entity1 = new Entity();
			var entity2 = new Entity();

			Game.nameEntity("ship", entity1);
			Game.nameEntity("ship", entity2);

			expect(entity1.name).to.equal("ship0");
			expect(entity2.name).to.equal("ship1");
		});
	});

	function mockEntity(){
		return sinon.mock(new Entity());
	}

	function entityWithName(name){
		var entity = new Entity();
		entity.name = name;

		return entity;
	}
});

// 		getNamedEntities: function(){
// 			var entities = $.grep(this.getEntities(), function(e){
// 				return e.name != null;
// 			});

// 			return entities;
// 		},

// 		nameEntity: function(name, entity){
// 			if(nameRegistry[name] == undefined){
// 				nameRegistry[name] = 0;
// 			}else{
// 				nameRegistry[name] = nameRegistry[name] + 1;
// 			}

// 			entity.name = name + nameRegistry[name];
// 		}
// 	};

// Kestrel.Game = function(){
// 	var scene;
// 	var camera;
// 	var renderer;
// 	var control;
// 	var target = new THREE.Vector3();
// 	var cameraYawPitchRow = new THREE.Vector3();
// 	var distance = 500.0;
// 	var frameRate = 60.0;
// 	var keyboard;
// 	var entityRunner = new EntityRunner();
// 	var physics = new Physics();
// 	var nameRegistry = {};

// 	var onEnterFrame = function(){ 
// 		entityRunner.run();
// 	}

// 	var updateCamera = function(){
// 		var yaw = cameraYawPitchRow.x;
// 		var pitch = cameraYawPitchRow.y;
// 		var roll = cameraYawPitchRow.z;
// 		var matrix = MathUtils.getRotationMatrix(yaw, pitch, roll); 
// 		var unitZ = new THREE.Vector3(0, 0, 1);
// 		unitZ.applyMatrix4(matrix);
// 		unitZ.setLength(distance);

// 		var position = new THREE.Vector3();
// 		position.subVectors(target, unitZ);

// 		camera.position.set(position.x, position.y, position.z);
// 		camera.lookAt(target);
// 		camera.updateMatrix();
// 	}

// 	var initScene = function(){
// 		var WIDTH = container.width(),
// 		    	HEIGHT = container.height();

// 		var VIEW_ANGLE = 45,
// 		    ASPECT = WIDTH / HEIGHT,
// 		    NEAR = 0.1,
// 		    FAR = 10000;

// 		renderer = new THREE.WebGLRenderer();
// 		camera = new THREE.PerspectiveCamera(  VIEW_ANGLE,
// 	                                ASPECT,
// 	                                NEAR,
// 	                                FAR  );

// 		scene = new THREE.Scene();

// 		renderer.setSize(WIDTH, HEIGHT);

// 		container.append(renderer.domElement);

// 		render();

// 		cameraYawPitchRow.set(Math.PI / 4.0, Math.PI / 4.0);

// 		updateCamera();

// 		scene.add(camera);

// 		THREEx.WindowResize(renderer, camera);

// 		keyboard = new THREEx.KeyboardState(renderer.domElement);
// 		renderer.domElement.setAttribute("tabIndex", "0");
// 		renderer.domElement.focus();

// 		// only on keyup
// 		keyboard.domElement.addEventListener('keyup', function(event){
// 			if(keyboard.eventMatches(event, KeyMap.console)){
// 				Console.focus();
// 			}else if(keyboard.eventMatches(event, KeyMap.zoomIn)){
// 				zoomIn();
// 			}else if(keyboard.eventMatches(event, KeyMap.zoomOut)){
// 				zoomOut();
// 			}
// 		})
// 	}

// 	var zoomIn = function(){
// 		distance /= 1.2;
// 		updateCamera();
// 	}

// 	var zoomOut = function(){
// 		distance *= 1.2;
// 		updateCamera();
// 	}

// 	var mouseMove = function(xDiff, yDiff){
// 		var yVector = new THREE.Vector3(target.x - camera.position.x, 0, target.z - camera.position.z);
// 		var m = MathUtils.getRotationMatrix(Math.PI / 2.0, 0, 0);
// 		var xVector = new THREE.Vector3();
// 		xVector.copy(yVector);
// 		xVector.applyMatrix4(m);

// 		xVector.normalize();
// 		yVector.normalize();

// 		target.addVectors(target, xVector.multiplyScalar(xDiff / 2.0));
// 		target.addVectors(target, yVector.multiplyScalar(yDiff / 2.0));

// 		updateCamera();
// 	}

// 	var initControl = function(){
// 		control = new Control();
// 		control.hookContainer(container);

// 		control.mousemove(function(xDiff, yDiff){
// 			mouseMove(xDiff, yDiff)
// 		});
// 	}

// 	var render = function(){
// 		renderer.render(scene, camera);
// 		requestAnimationFrame(render);
// 	}


// };

// var Game = new Kestrel.Game();
