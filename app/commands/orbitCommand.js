var Command = require("../command");
var THREE = require("THREE");
var MathUtils = require("../mathutils");
var Entity = require("../entity");
var assert = require("assert");

var OrbitCommand = function() {
    Command.call(this);

    this.game = null;
    this.target = null;
    this.distance = 0;
}

OrbitCommand.prototype = Object.create(Command);
OrbitCommand.prototype.constructor = OrbitCommand;

OrbitCommand.prototype.execute = function() {
    assert(this.game != null, "game cannot be empty");
    assert(this.actor != null, "target cannot be empty");

    var params = this.params || [];
    var name = params[0];
    var entities = (name != null) ? this.game.getEntities({
        name: name
    }) : [];

    var distance = null;
    if (entities.length > 0) {
        this.target = entities[0];
        distance = params[1];
    } else {
        var x = parseInt(params[0] || 0);
        var y = parseInt(params[1] || 0);
        var z = parseInt(params[2] || 0);
        distance = params[3] || 50;

        this.target = new Entity();
        this.target.position = new THREE.Vector3(x, y, z);
    }

    this.distance = parseInt(distance);

    position = new THREE.Vector3(x, y, z);

    this.actor.shipController.setCommand(this);
};

OrbitCommand.prototype.update = function() {
    var shipController = this.actor.shipController;

    var position = this.actor.position;
    //a being vector from position to target
    var a = new THREE.Vector3();
    a.subVectors(this.target.position, position);
    a.setY(0);

    var yAxis = MathUtils.yAxis;

    var b = new THREE.Vector3();
    b.copy(a);
    b.applyAxisAngle(yAxis, 3 * Math.PI / 4);

    var c = new THREE.Vector3();
    c.copy(a);
    c.applyAxisAngle(yAxis, -3 * Math.PI / 4);

    b.setLength(this.distance);
    c.setLength(this.distance);

    b.addVectors(b, this.target.position);
    c.addVectors(c, this.target.position);

    var unitFacing = shipController.getUnitFacing();
    var angle1 = Math.abs(MathUtils.angleBetween(b, position, unitFacing));
    var angle2 = Math.abs(MathUtils.angleBetween(c, position, unitFacing));

    var point = angle1 < angle2 ? b : c;

    shipController.align(point);

    shipController.accelerate(1.0);
};

module.exports = OrbitCommand;