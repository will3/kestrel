var AddCommand = require("./commands/addcommand");
var AttackCommand = require("./commands/attackcommand");
var ListCommand = require("./commands/listcommand");
var DestroyCommand = require("./commands/destroycommand");
var MoveCommand = require("./commands/movecommand");
var OrbitCommand = require("./commands/orbitcommand");
var SelectCommand = require("./commands/selectcommand");
var ObjectMapping = require("./objectmapping");

var CommandMapping = function() {
    return {
        add: function() {
            return new AddCommand(ObjectMapping);
        },
        attack: function() {
            return new AttackCommand();
        },
        list: function() {
            return new ListCommand();
        },
        remove: function() {
            return new DestroyCommand();
        },
        move: function() {
            return new MoveCommand();
        },
        orbit: function() {
            return new OrbitCommand();
        },
        select: function() {
            return new SelectCommand();
        }
    }
}();

module.exports = CommandMapping;