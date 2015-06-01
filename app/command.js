var Game = require("./game");

var Command = function() {
    this.actor = null;
    this.params = null;
    this.game = Game.getInstance();
}

Command.prototype = {
    constructor: Command,

    execute: function() {
        throw "must override";
    },

    update: function() {
        throw "must override";
    }
}

module.exports = Command;