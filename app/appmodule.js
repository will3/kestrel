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
var Console = require("./console");
var Control = require("./control");
var AddCommand = require("./commands/addcommand");
var AttackCommand = require("./commands/attackcommand");
var ListCommand = require("./commands/listcommand");
var DestroyCommand = require("./commands/destroycommand");
var MoveCommand = require("./commands/movecommand");
var OrbitCommand = require("./commands/orbitcommand");
var SelectCommand = require("./commands/selectcommand");
var AlignCommand = require("./commands/aligncommand");

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

        this.bindKey("addCommand").toType(AddCommand).withProperties(function() {
            return {
                objectMapping: this.get("objectMapping"),
                game: this.get("game")
            };
        }.bind(this));
        this.bindKey("attackCommand").toType(AttackCommand).withProperties(function() {
            return {
                game: this.get("game")
            };
        }.bind(this));
        this.bindKey("listCommand").toType(ListCommand).withProperties(function() {
            return {
                game: this.get("game")
            };
        }.bind(this));
        this.bindKey("destroyCommand").toType(DestroyCommand).withProperties(function() {
            return {
                game: this.get("game")
            };
        }.bind(this));
        this.bindKey("moveCommand").toType(MoveCommand);
        this.bindKey("orbitCommand").toType(OrbitCommand).withProperties(function() {
            return {
                game: this.get("game")
            };
        }.bind(this));
        this.bindKey("selectCommand").toType(SelectCommand).withProperties(function() {
            return {
                game: this.get("game"),
                console: function() {
                    return this.get("console");
                }.bind(this)
            };
        }.bind(this));
        this.bindKey("alignCommand").toType(AlignCommand);

        this.bindKey("commandMapping").to(function() {
                return {
                    add: function() {
                        return this.get("addCommand");
                    }.bind(this),
                    attack: function() {
                        return this.get("attackCommand");
                    }.bind(this),
                    list: function() {
                        return this.get("listCommand");
                    }.bind(this),
                    remove: function() {
                        return this.get("destroyCommand");
                    }.bind(this),
                    move: function() {
                        return this.get("moveCommand");
                    }.bind(this),
                    orbit: function() {
                        return this.get("orbitCommand");
                    }.bind(this),
                    select: function() {
                        return this.get("selectCommand");
                    }.bind(this),
                    align: function() {
                        return this.get("alignCommand");
                        }.bind(this)
                    };
                }.bind(this));

            this.bindKey("console").to(new Console()).withProperties(function() {
                return {
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