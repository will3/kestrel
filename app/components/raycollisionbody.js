var CollisionBody = require("./collisionbody");

var RayCollisionBody = function(){
	CollisionBody.call(this);

	this.type = "RayCollisionBody";
	this.bodyType = "Ray";
};

RayCollisionBody.prototype = Object.create(CollisionBody.prototype);
RayCollisionBody.prototype.constructor = RayCollisionBody;

RayCollisionBody.prototype.hitTest = function(body){
	if(body.bodyType == "sphere"){

	}else if(body.bodyType == "block"){
		
	}
}

module.exports = BeamCollisionBody;