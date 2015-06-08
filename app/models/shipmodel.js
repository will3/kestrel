var BlockModel = require("../blockengine/blockmodel");
var Block = require("../blockengine/block");
var BlockCoord = require("../blockengine/blockcoord");
var THREE = require("THREE");
var WeaponModel = require("./weaponmodel");
var CargoModel = require("./cargomodel");
var HullModel = require("./hullmodel");

var ShipModel = function() {
    BlockModel.call(this, {
        halfSize: 64,
        blockTypesToMap: ["engine"]
    });

    this.gridSize = 2;

    this.addComponents();

    this.center();
}

ShipModel.prototype = Object.create(BlockModel.prototype);
ShipModel.prototype.constructor = ShipModel;

ShipModel.prototype.addComponents = function() {
    this.mergeModel(new HullModel(), 0, 0, 0);
    this.mergeModel(new WeaponModel(), 3, 0, -1);
    this.mergeModel(new CargoModel(), 6, 0, -2);
    this.mergeModel(new CargoModel(), 8, 0, -2);
    this.mergeModel(new CargoModel(), 10, 0, -2);
    this.mergeModel(new WeaponModel(), 13, 0, -1);
};

module.exports = ShipModel;