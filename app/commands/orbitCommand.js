var Command = require("../command");
var THREE = require("THREE");
var MathUtils = require("../mathutils");
var Entity = require("../entity");
var Game = require("../game");
var assert = require("assert");

var OrbitCommand = function() {
    Command.call(this);

    this.hasActor = true;
    this.target = null;
    this.distance = 100;
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
    if (this.shipController == null) {
        this.shipController = this.actor.getComponent("ShipController");
    }
    this.shipController.orbit(this.target.position, this.distance);
};

module.exports = OrbitCommand;