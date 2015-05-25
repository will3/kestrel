var Entity = require("../entity");
var injector = require("../injector");

var Ship = function() {
    this.shipController = injector.get("shipController");
    this.rigidBody = injector.get("rigidBody", "ship");
    this.weaponController = injector.get("weaponController");
    this.weapons = injector.get("weapons");
    this.smokeTrail = injector.get("smokeTrail");
    this.destroyable = true;
    this.renderComponent = injector.get("renderComponent", "ship");	//todo
    // model: new ShipModel(),
}

Ship.prototype = Object.create(Component);

Ship.prototype.start = function() {
    Ship.id++;

    this.addComponent(this.renderComponent);
    this.addComponent(this.rigidBody);
    this.addComponent(this.shipController);
    this.addComponent(this.weaponController);

    this.weapons.forEach(function(weapon) {
        this.addEntity(weapon);
    }.bind(this));

    this.smokeTrail.ship = this;
    this.addEntity(this.smokeTrail);
};

Ship.prototype.update = function() {
    this.smokeTrail.amount = shipController.engineAmount;
};

module.exports = Ship;
