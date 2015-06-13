var Ammo = require("./ammo");

var Beam = function(){
	Ammo.call(this);
};

Beam.prototype = Object.create(Ammo.prototype);
Beam.prototype.constructor = Beam;

module.exports = Beam;