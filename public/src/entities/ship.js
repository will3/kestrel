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

var ShipType = {
	AeroDynamic : 0,
	Blocky : 1,
}

var ShipBluePrint = function(){
	function getShip(size, shipType){
		var wing = null;
		if(shipType == ShipType.AeroDynamic){
			wing = new Beam([0, size], [1.5, 1.5]);
			wing.setAlignment("x");
			wing.setScale(new THREE.Vector3(1.0, 0.33, 1.0));
		}

		var seed = Math.random();
		noise.seed(seed);
		var y = seed * 65536;
		var x = seed * 65536;

		var lastBranch = null;
		var axis = "z";
		var wingSpace = 0.0;
		do{
			var random = (noise.simplex2(x * 4 , y ) + 1.0) / 2.0;
			var componentSpace = 0.0 + Math.pow(random, 1) * 4.0;
			var sensorSize = 1 + Math.pow(random, 1) * 4;
			if(lastBranch == null){
				lastBranch = getSensor(sensorSize);
				wingSpace = lastBranch.getWidth() * 1.5 + 1.0;
				var position = - wing.getLength() / 2.0 + wingSpace + lastBranch.getWidth() / 2.0;
				wing.branch(lastBranch, position, axis);
			}else{
				var branch = getSensor(sensorSize);
				var position = lastBranch.getPosition()["x"] + componentSpace + lastBranch.getWidth() + branch.getWidth();
				wingSpace = branch.getWidth() * 1.5 + 1.0;

				if(position > wing.getLength() / 2.0 - wingSpace - branch.getWidth() / 2.0){
					break;
				}

				lastBranch = branch;
				wing.branch(lastBranch, position, axis);

			}
			x ++;
		}while(true);

		return wing;
	}

	function getSensor(size){
		var beam = new Beam([0, size / 4, size], [size / 4 * 0.8, size / 4 * 0.8, 0]);

		return beam;
	}

	function getEngine(size){
		var engine = new Beam([0, 1.5], [1.2, 1.2]);

		return engine;
	}

	function getWeaponAndEngine(size, offset){

	}

	function getWeapon(size, offset){

	}

	function getCargo(size, offset){
		var cargo = new Beam([0, 1], [1.0, 1.0]);

		return cargo;
	}

	function getCargoAndEngine(size, offset){

	}

	return {
		initGeometry: function(){
			var ship = getShip(100, ShipType.AeroDynamic);
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