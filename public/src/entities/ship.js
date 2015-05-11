var Ship = Entity.extend(function(){
	this.shipController = null;
	this.rigidBody = null;
}).methods({
	start: function(){
		Ship.id ++;

		this.addComponent(new ShipRenderComponent());
		this.rigidBody = new RigidBody();
		this.addComponent(this.rigidBody);
		this.shipController = new ShipController();
		this.addComponent(this.shipController);
	},
});

var ShipRenderComponent = RenderComponent.extend(function(){
	
}).methods({
	initGeometry: function(){
		var wing = getWingGeometry();
		var mBay1 = getMBayGeoemtry();
		var mBay2 = getMBayGeoemtry();
		var cargo1 = getCargoGeometry();
		var cargo2 = getCargoGeometry();
		var cargo3 = getCargoGeometry();

		var geometry = wing;

		geometry.merge(mBay1, new THREE.Matrix4().makeTranslation(5, 1.4, 0));
		geometry.merge(mBay2, new THREE.Matrix4().makeTranslation(-5, 1.4, 0));
		geometry.merge(cargo1, new THREE.Matrix4().makeTranslation(0, -0.25, 0));
		geometry.merge(cargo2, new THREE.Matrix4().makeTranslation(2, -0.25, 0));
		geometry.merge(cargo3, new THREE.Matrix4().makeTranslation(-2, -0.25, 0));

		var m = MathUtils.getRotationMatrix(0, Math.PI / 2 , 0);
		geometry.applyMatrix(m);

		return geometry;

		function getWingGeometry(){
			var beam = new Beam([0, 15], [2, 2]);
			beam.setAlignment("x");
			var geometry = beam.getGeometry();
			geometry.applyMatrix(new THREE.Matrix4().makeScale(1.0, 1.0, 0.5));
			return geometry;
		}

		function getMBayGeoemtry(){
			var beam = new Beam([0, 4, 7], [1.2, 1.2, 0]);
			beam.setAlignment("y");
			return beam.getGeometry();
		}

		function getCargoGeometry(){
			var beam = new Beam([0, 3, 6], [1.2, 1.2, 1.2]);
			beam.setAlignment("y");
			return beam.getGeometry();
		}
	},

	initMaterial: function(){
		return new SolidColorMaterial(new THREE.Vector4(1.0, 1.0, 0.0, 1.0));
	}
});