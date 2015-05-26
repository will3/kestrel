var Command = require('../command');
var THREE = require("THREE");

var AlignCommand = function() {
    Command.call(this);

    this.target = null;
}

AlignCommand.prototype = Object.create(Command.prototype);
AlignCommand.constructor = AlignCommand;

AlignCommand.prototype.execute = function() {
    var x = parseInt(this.params[0]);
    var y = parseInt(this.params[1]);
    var z = parseInt(this.params[2]);

    this.target = new THREE.Vector3(x, y, z);

    this.actor.shipController.setCommand(this);
};

AlignCommand.prototype.update = function() {
    var shipController = this.actor.shipController;
    shipController.align(this.target);
};

module.exports = AlignCommand;