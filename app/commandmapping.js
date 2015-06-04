var AddCommand = require("./commands/addcommand");
var AttackCommand = require("./commands/attackcommand");
var ListCommand = require("./commands/listcommand");
var DestroyCommand = require("./commands/destroycommand");
var MoveCommand = require("./commands/movecommand");
var OrbitCommand = require("./commands/orbitcommand");
var SelectCommand = require("./commands/selectcommand");
var Ship = require("./entities/ship");

var CommandMapping = function() {
    return {
        add: function() {
            return new AddCommand({
                "ship": function() {
                    return new Ship();
                },
                "playership": function() {
                    var ship = new Ship({
                        force: 0.05,
                        yawForce: 0.25,
                        yawCurve: 0.008,
                        fireInterval: 8
                    });
                    ship.addPlayerControl();
                    return ship;
                }
            });
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