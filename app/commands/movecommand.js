var Command = require("../command");
var THREE = require("THREE");
var assert = require("assert");

var MoveCommand = function() {
    Command.call(this);

    this.target = null;
}

MoveCommand.prototype = Object.create(Command.prototype);
MoveCommand.prototype.constructor = MoveCommand;

MoveCommand.prototype.execute = function() {
	assert(this.actor != null, "actor cannot be empty");

    var x = parseInt(this.params[0]);
    var y = parseInt(this.params[1]);
    var z = parseInt(this.params[2]);

    this.target = new THREE.Vector3(x, y, z);

    this.actor.setCommand(this);
};

MoveCommand.prototype.update = function() {
    var shipController = this.entity.shipController;
    shipController.move(this.target);
};

module.exports = MoveCommand;