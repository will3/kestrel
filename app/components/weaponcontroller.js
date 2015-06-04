var Component = require("../component");
var THREE = require("THREE");
var Game = require("../game");

var WeaponController = function() {
    Component.call(this);

    this.type = "WeaponController";
    
    this.targets = [];
};

WeaponController.prototype = Object.create(Component.prototype);
WeaponController.prototype.constructor = WeaponController;

WeaponController.prototype.setTarget = function(target) {
    this.targets = [target];
};

WeaponController.prototype.start = function() {

};

WeaponController.prototype.update = function() {

};

WeaponController.prototype.fireIfReady = function(target) {
    var weapons = this.entity.weapons;
    weapons.forEach(function(weapon) {
        weapon.fireIfReady(target);
    });
}

module.exports = WeaponController;