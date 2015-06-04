var Command = require("../command");
var THREE = require("THREE");
var MathUtils = require("../mathutils");
var Entity = require("../entity");
var Game = require("../game");
var assert = require("assert");

var OrbitCommand = function() {
    Command.call(this);

    this.type = "navigation";
    this.hasActor = true;
    this.target = null;
    this.distance = 0;
}

OrbitCommand.prototype = Object.create(Command.prototype);
OrbitCommand.prototype.constructor = OrbitCommand;

OrbitCommand.prototype.setParams = function(params) {
    var name = params[0];

    if (name == null) {
        throw "must orbit something";
    }

    this.target = this.game.getEntityNamed(name);
    this.distance = parseInt(params[1] || 100);
};

OrbitCommand.prototype.start = function() {

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