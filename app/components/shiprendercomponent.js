var RenderComponent = require('./rendercomponent');
var assert = require("assert");

var ShipRenderComponent = function(){
	RenderComponent.call(this);
	this.model = null;
}

ShipRenderComponent.prototype = Object.create(RenderComponent.prototype);
ShipRenderComponent.prototype.constructor = RenderComponent;

ShipRenderComponent.prototype.initObject = function(){
	assert(this.model != null, "model cannot be empty");

	this.model.update();
	return this.model.object;
}

module.exports = ShipRenderComponent;