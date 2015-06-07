var Game = require("./game");

var Command = function() {
    this.hasActor = false;
    this.actor = null;
    this.game = Game.getInstance();
}

Command.prototype = {
    constructor: Command,

    setParams: function() {
        throw "must override";
    },

    set params(value){
    	this.setParams(value);
    },

    start: function(){

    },

    update: function(){

    }
}

module.exports = Command;