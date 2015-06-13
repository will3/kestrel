var Ammo = require("./ammo");
var RenderComponent = require("../components/rendercomponent");
var THREE = require("THREE");
var assert = require("assert");

var Beam = function() {
    Ammo.call(this);

    this.life = 1;

    this.renderComponent = new BeamRenderComponent();
};

Beam.prototype = Object.create(Ammo.prototype);
Beam.prototype.constructor = Beam;

Beam.prototype.createInstance = function() {
    return new Beam();
};

Beam.prototype.start = function() {
    this.addComponent(this.renderComponent);
    this.renderComponent.point = this.point;
};

module.exports = Beam;

var BeamRenderComponent = function() {
    RenderComponent.call(this);

    this.point = null;
    this.geometry = null;
    this.material = null;
};

BeamRenderComponent.prototype = Object.create(RenderComponent.prototype);
BeamRenderComponent.prototype.constructor = BeamRenderComponent;

BeamRenderComponent.prototype.initGeometry = function() {
	assert(this.point != null, "point cannot be empty");
	
    this.geometry = new THREE.Geometry();
    this.geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var direction = new THREE.Vector3().subVectors(this.point, this.transform.position);
    this.geometry.vertices.push(direction.setLength(5000));

    this.geometry.colors.push(new THREE.Color(1.0, 0.0, 0.0));
    this.geometry.colors.push(new THREE.Color(1.0, 0.0, 0.0));
};

BeamRenderComponent.prototype.updateGeometry = function() {
    this.initGeometry();
    if (this.innerObject != null) {
        this.innerObject.elementsNeedUpdate = true;
    }
};

BeamRenderComponent.prototype.initObject = function() {
    this.initGeometry();

    this.material = new THREE.LineBasicMaterial({
        opacity: 0.1,
        linewidth: 1,
        vertexColors: THREE.VertexColors
    });

    var line = new THREE.Line(this.geometry, this.material);

    return line;
};