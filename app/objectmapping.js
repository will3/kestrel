var Ship = require("./entities/ship");
var SphereModel = require("./models/spheremodel");
var Entity = require("./entity");
var ModelRenderComponent = require("./components/modelrendercomponent");

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
        },
        "sphere": function(){
            var sphere = new Entity();
            var sphereModel = new SphereModel(8);
            sphere.addComponent(new ModelRenderComponent(sphereModel));
            return sphere;
        }
    };
}();

module.exports = ObjectMapping;