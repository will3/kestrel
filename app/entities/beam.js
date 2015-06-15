var Ammo = require("./ammo");
var THREE = require("THREE");
var BeamRenderComponent = require("../components/BeamRenderComponent");
var Console = require("../console");
var RayCollisionBody = require("../components/raycollisionbody");

var Beam = function() {
    Ammo.call(this);

    this.renderComponent = new BeamRenderComponent();
    this.addComponent(this.renderComponent);

    this.collisionBody = new RayCollisionBody();
    this.collisionBody.filter(function(entity) {
        if (entity == this.actor) {
            return false;
        }

        if (entity instanceof Ammo) {
            return false;
        }

        return true;
    }.bind(this));

    this.addComponent(this.collisionBody);

    this.collisionPoint = null;
};

Beam.prototype = Object.create(Ammo.prototype);
Beam.prototype.constructor = Beam;

Beam.prototype.createInstance = function() {
    return new Beam();
};

Beam.prototype.start = function() {
    this.renderComponent.point = this.getDrawPoint();
};

Beam.prototype.update = function() {
    //update position
    this.position = this.actor.worldPosition;

    //update render component
    this.renderComponent.point = this.getDrawPoint();
    this.renderComponent.needsRedraw = true;

    //update collisionbody
    this.collisionBody.direction = this.getDirection();
};

Beam.prototype.lateUpdate = function(){
	this.collisionPoint = null;
};

Beam.prototype.getDrawPoint = function() {
	if(this.collisionPoint != null){
		return new THREE.Vector3().subVectors(this.collisionPoint, this.transform.position);
	}

	//in case a target is set instead of point
    var point = this.point || this.target.worldPosition;

    return new THREE.Vector3().subVectors(point, this.transform.position).setLength(5000);
};

Beam.prototype.getDirection = function(){
	var point = this.point || this.target.worldPosition;

	return new THREE.Vector3().subVectors(point, this.position).normalize();
}

Beam.prototype.onCollision = function(entity, hitTest){
	this.collisionPoint = hitTest.point;
};

module.exports = Beam;