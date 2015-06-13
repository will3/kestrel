var Ship = require("./entities/ship");
var SphereModel = require("./models/spheremodel");
var Entity = require("./entity");
var ModelRenderComponent = require("./components/modelrendercomponent");
var PointSprite = require("./entities/pointsprite");
var TextureLoader = require("./textureloader");
var THREE = require("THREE");

var ObjectMapping = function() {
    return {
        "ship": function() {
            return new Ship();
        },
        "playership": function() {
            var ship = new Ship({
                agilityBonus: 5
            });
            ship.addPlayerControl();
            return ship;
        }
    };
}();

module.exports = ObjectMapping;