var RenderComponent = require('./rendercomponent');
var assert = require("assert");

var ModelRenderComponent = function(model){
	RenderComponent.call(this);
	this.model = model;
}

ModelRenderComponent.prototype = Object.create(RenderComponent.prototype);
ModelRenderComponent.prototype.constructor = RenderComponent;

ModelRenderComponent.prototype.initObject = function(){
	assert(this.model != null, "model cannot be empty");

	this.model.update();
	return this.model.object;
}

module.exports = ModelRenderComponent;