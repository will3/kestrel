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
                force: 0.05,
                yawForce: 0.25,
                yawCurve: 0.008,
                fireInterval: 8
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