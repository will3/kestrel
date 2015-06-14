var Ammo = require("./ammo");
var THREE = require("THREE");
var BeamRenderComponent = require("../components/BeamRenderComponent");
var Console = require("../console");

var Beam = function() {
    Ammo.call(this);

    this.renderComponent = new BeamRenderComponent();
};

Beam.prototype = Object.create(Ammo.prototype);
Beam.prototype.constructor = Beam;

Beam.prototype.createInstance = function() {
    return new Beam();
};

Beam.prototype.start = function() {
    this.addComponent(this.renderComponent);
    this.renderComponent.point = this.getPoint();
};

Beam.prototype.update = function(){
	//update position
	this.position = this.actor.worldPosition;

	//update render component
	this.renderComponent.point = this.getPoint();
	this.renderComponent.needsRedraw = true;
};

Beam.prototype.getPoint = function(){
	if(this.point == null){
		this.point = this.target.worldPosition;
	}

	return this.point;
};

module.exports = Beam;
