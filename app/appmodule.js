var Game = require("./game");
var EntityRunner = require("./entityrunner");
var Collision = require("./collision");
var ShipController = require("./components/shipcontroller");
var WeaponController = require("./components/weaponcontroller");
var BaseModule = require("./injection/basemodule");
var Weapon = require("./entities/weapon");
var SmokeTrail = require("./entities/smokeTrail");
var Ship = require("./entities/ship");
var extend = require("extend");
var RigidBody = require("./components/rigidbody");
var Laser = require("./entities/laser");
var RenderComponent = require("./components/rendercomponent");
var AddCommand = require("./commands/addcommand");
var Console = require("./console");
var Control = require("./control");

var AppModule = function() {
    BaseModule.call(this);
}

AppModule.prototype = Object.create(BaseModule.prototype);
AppModule.prototype.constructor = AppModule;

AppModule.prototype.load = function() {
    this.bindKey("entityRunner").to(new EntityRunner());
    this.bindKey("collision").to(function() {
        return new Collision();
    });

    this.bindKey("shipController").to(function() {
        return new ShipController();
    });

    this.bindKey("weaponController").to(function() {
        return new WeaponController();
    });

    this.bindKey("rigidBody").withTag("ship").to(function() {
        var rigidBody = new RigidBody();
        rigidBody.collisionRadius = 9;
        return rigidBody;
    });

    this.bindKey("rigidBody").withTag("laser").to(function() {
        var rigidBody = new RigidBody();
        rigidBody.defaultFriction = 1;
        rigidBody.collisionRadius = 1;
        return rigidBody;
    });

    this.bindKey("rigidBody").withTag("pointSprite").to(function() {
        var rigidBody = new RigidBody();
        rigidBody.defaultFriction = 1;
        return rigidBody;
    });

    this.bindKey("weapons").to(function() {
        var laser = new Laser();
        // var missile = new Missile();

        weapons = [];

        var weapon1 = new Weapon(laser);
        weapon1.actor = this;
        weapon1.delta = 0;
        weapons.push(weapon1);

        var weapon2 = new Weapon(laser);
        weapon2.actor = this;
        weapon2.delta = 8;
        weapons.push(weapon2);

        return weapons;
    });

    this.bindKey("laser").to(function() {
        return new Laser();
    }).withProperties(function() {
        return {
            rigidBody: this.get("rigidBody", "laser")
        };
    }.bind(this));

    this.bindKey("smokeTrail").to(function() {
        return new SmokeTrail();
    });

    this.bindKey("renderComponent").withTag("ship").to(function() {
        //todo
        return new RenderComponent();
    });

    this.bindKey("ship").to(function() {
        return new Ship();
    }).withProperties(function() {
        return {
            shipController: this.get("shipController"),
            rigidBody: this.get("rigidBody", "ship"),
            weaponController: this.get("weaponController"),
            weapons: this.get("weapons"),
            smokeTrail: this.get("smokeTrail"),
            renderComponent: this.get("renderComponent", "ship")
        };
    }.bind(this));

    this.bindKey("game").to(new Game()).withProperties(function() {
        return {
            entityRunner: this.get("entityRunner"),
            collision: this.get("collision"),
            control: this.get("control")
        };
    }.bind(this));

    this.bindKey("objectMapping").to(function() {
        return {
            ship: require("./entities/ship")
        };
    });

    this.bindKey("addCommand").to(function() {
        return new AddCommand();
    }).withProperties(function() {
        return {
            objectMapping: this.get("objectMapping"),
            game: this.get("game")
        };
    }.bind(this));

    this.bindKey("input").to(function() {
        return document.getElementById('console_text');
    });

    this.bindKey("commandMapping").to(function() {
        return {
            "add": require('./commands/addcommand'),
            "attack": require('./commands/attackcommand'),
            "list": require('./commands/listcommand'),
            "remove": require('./commands/destroycommand'),
            "move": require('./commands/movecommand'),
            "orbit": require('./commands/orbitcommand'),
            "select": require('./commands/selectcommand'),
            "align": require('./commands/aligncommand'),
            "stop": require('./commands/stopcommand'),
        };
    });

    this.bindKey("console").to(new Console()).withProperties(function() {
        return {
            input: this.get("input"),
            commandMapping: this.get("commandMapping")
        };
    }.bind(this));

    this.bindKey("keyMap").to({
        console: "q",
        zoomIn: "pageup",
        zoomOut: "pagedown"
    });

    this.bindKey("control").to(
        new Control()
    ).withProperties({
        keyMap: this.get("keyMap")
    });
}

module.exports = AppModule;