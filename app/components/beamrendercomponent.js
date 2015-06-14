var THREE = require("THREE");
var RenderComponent = require("./rendercomponent");
var assert = require("assert");

var BeamRenderComponent = function() {
    RenderComponent.call(this);

    this.hasGlow = true;
    
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

module.exports = BeamRenderComponent;