var Entity = require("../entity");
var SmokeTrail = require("./smoketrail");

var Engine = function(){
	Entity.call(this);

	this.emission = 0;
	this.smokeTrail = new SmokeTrail();
};

Engine.prototype = Object.create(Entity.prototype);
Engine.prototype.constructor = Engine;

Engine.prototype.start = function(){
	this.addEntity(this.smokeTrail);
};

Engine.prototype.update = function(){
	this.smokeTrail.amount = this.emission;
};

module.exports = Engine;