var Ship = require("./entities/ship");
var SphereModel = require("./models/spheremodel");
var Entity = require("./entity");
var ModelRenderComponent = require("./components/modelrendercomponent");
var PointSprite = require("./entities/pointsprite");
var TextureLoader = require("./textureloader");
var THREE = require("THREE");
var Laser = require("./entities/laser");
var Beam = require("./entities/beam");
var Weapon = require("./entities/weapon");

//weapons
var laser = new Laser();
var beam = new Beam();
var getLaserWeapon = function() {
    return new Weapon({
        ammo: laser,
        fireInterval: 5,
        fireMode: "auto"
    });
}
var getBeamWeapon = function() {
    return new Weapon({
        ammo: beam,
        fireInterval: 1,
        fireMode: "guided"
    });
}

var ObjectMapping = function() {
    return {
        "ship": function() {
            var ship = new Ship();
            // ship.weapons = [getLaserWeapon()];
            return ship;
        },
        "playership": function() {
            var ship = new Ship({
                agilityBonus: 5
            });
            ship.weapons = [getBeamWeapon()];
            ship.addPlayerControl();
            return ship;
        }
    };
}();

module.exports = ObjectMapping;