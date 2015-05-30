var Command = require("../command");
var THREE = require("THREE");
var assert = require("assert");

var AddCommand = function() {
    Command.call(this);

    this.objectMapping = null;
    this.game = null;
}

AddCommand.prototype = Object.create(Command.prototype);
AddCommand.constructor = AddCommand;

AddCommand.prototype.execute = function() {
	assert(this.objectMapping != null, "objectMapping cannot be null");
	assert(this.game != null, "game cannot be null");

    if (this.params == null || this.params.length == 0 || this.params[0].length == 0) {
        throw "must add something";
    }

    var param = this.params[0].toLowerCase();

    var x = parseInt(this.params[1]);
    var y = parseInt(this.params[2]);
    var z = parseInt(this.params[3]);

    var objectFunc = this.objectMapping[param];
    if(objectFunc == null){
        throw "cannot add " + param;
    }

    var entity = objectFunc();
    this.game.nameEntity(param, entity);
    this.game.addEntity(entity, new THREE.Vector3(x, y, z));
};

module.exports = AddCommand;