var Command = function() {
    this.actor = null;
    this.params = null;
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