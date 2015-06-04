var Command = require("../command");
var THREE = require("THREE");
var assert = require("assert");
var Debug = require("../debug");

var MoveCommand = function() {
    Command.call(this);

    this.type = "navigation";
    this.hasActor = true;
    this.target = null;
}

MoveCommand.prototype = Object.create(Command.prototype);
MoveCommand.prototype.constructor = MoveCommand;

MoveCommand.prototype.start = function() {

};

MoveCommand.prototype.update = function() {
    var shipController = this.actor.shipController;
    shipController.move(this.target);
};

MoveCommand.prototype.setParams = function(params){
    var x = parseInt(params[0]);
    var y = parseInt(params[1]);
    var z = parseInt(params[2]);

    this.target = new THREE.Vector3(x,y,z);
};

module.exports = MoveCommand;