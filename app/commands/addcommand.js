var Command = require("../command");
var THREE = require("THREE");
var assert = require("assert");
var Game = require("../game");

var AddCommand = function(objectMapping) {
    Command.call(this);

    this.objectMapping = objectMapping;
    
    this.objectName = null;
    this.position = null;
}

AddCommand.prototype = Object.create(Command.prototype);
AddCommand.constructor = AddCommand;

AddCommand.prototype.start = function() {
    var objectFunc = this.objectMapping[this.objectName];
    if(this.objectName == null){
        throw "must add something";
    }
    if (objectFunc == null) {
        throw "cannot add " + this.objectName;
    }

    var entity = objectFunc();
    this.game.nameEntity(this.objectName, entity);
    entity.position = this.position;
    this.game.addEntity(entity);
};

AddCommand.prototype.setParams = function(params) {
    params = params || [];
    this.objectName = params[0];
    var x = parseInt(params[1] || 0);
    var y = parseInt(params[2] || 0);
    var z = parseInt(params[3] || 0);
    this.position = new THREE.Vector3(x, y, z);
}

module.exports = AddCommand;