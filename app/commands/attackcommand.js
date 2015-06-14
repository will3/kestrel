var Command = require("../command");
var THREE = require("THREE");
var Game = require("../game");
var OrbitCommand = require("./orbitcommand");

var AttackCommand = function() {
    Command.call(this);

    this.hasActor = true;
    this.target = null;

    // this.orbitCommand = new OrbitCommand();
    this.shipController = null;
    this.weaponController = null;

    this.isTriggerDown = false;
}

AttackCommand.prototype = Object.create(Command.prototype);
AttackCommand.prototype.constructor = AttackCommand;

AttackCommand.prototype.start = function() {

};

AttackCommand.prototype.update = function() {
    if (this.shipController == null) {
        this.shipController = this.actor.getComponent("ShipController");
    }
    if (this.weaponController == null) {
        this.weaponController = this.actor.getComponent("WeaponController");
    }

    if(!this.isTriggerDown){
        this.weaponController.triggerDown();
        this.isTriggerDown = true;
    }

    this.weaponController.updateTarget(this.target, null);
    this.shipController.orbit(this.target.position, 200);
}

AttackCommand.prototype.setParams = function(params) {
    var targetName = params[0];
    this.target = this.game.getEntityNamed(targetName);
}

module.exports = AttackCommand;