var RenderComponent = require("./rendercomponent");
var THREE = require("THREE");
var MaterialLoader = require("../materialloader");

var MeshRenderComponent = function(){
	RenderComponent.call(this);
}

MeshRenderComponent.prototype = Object.create(RenderComponent.prototype);
MeshRenderComponent.prototype.constructor = MeshRenderComponent;

MeshRenderComponent.prototype.initGeometry = function(){
	return null; 	//todo
}

MeshRenderComponent.prototype.initMaterial = function(){
	return MaterialLoader.getSolidMaterial();
}

MeshRenderComponent.prototype.initObject = function(geometry, material){
	return new THREE.Mesh(geometry, material);
}

module.exports = MeshRenderComponent;