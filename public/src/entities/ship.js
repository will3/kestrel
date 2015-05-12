var Ship = Entity.extend(function(){
	this.shipController = null;
	this.rigidBody = null;
}).methods({
	start: function(){
		Ship.id ++;

		this.bluePrint = new ShipBluePrint();
		this.addComponent(new ShipRenderComponent(this.bluePrint));
		this.rigidBody = new RigidBody();
		this.addComponent(this.rigidBody);
		this.shipController = new ShipController();
		this.addComponent(this.shipController);
	},
});

var ShipBluePrint = function(){
	function getShip(size){
		var wing = new Beam([0, size], [size / 7.5, size / 7.5]);

		wing.setAlignment("x");
		wing.setScale(new THREE.Vector3(1.0, 0.33, 1.0));

		wing.branch(getWeapon(size), 5, 1.4);
		wing.branch(getWeapon(size), -5, 1.4);
		wing.branch(getCargo(size), 0, -0.25);
		wing.branch(getCargo(size), 2, -0.25);
		wing.branch(getCargo(size), -2, -0.25);

		return wing;
	}

	function getWeapon(){
		var beam = new Beam([0, 4, 7], [1.2, 1.2, 0]);
		beam.setAlignment("z");

		return beam;
	}

	function getCargo(){
		var beam = new Beam([0, 6], [1.2, 1.2]);
		beam.setAlignment("z");

		return beam;
	}

	return {
		initGeometry: function(){
			var ship = getShip(15);
			var geometry = ship.getGeometry();
			return geometry;
		},
	};
};

var ShipRenderComponent = RenderComponent.extend(function(bluePrint){
	this.bluePrint = bluePrint;
}).methods({
	initGeometry: function(){
		return this.bluePrint.initGeometry();
	},

	initMaterial: function(){
		return new SolidColorMaterial(new THREE.Vector4(1.0, 1.0, 0.0, 1.0));
	}
});