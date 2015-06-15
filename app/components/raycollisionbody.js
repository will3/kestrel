var CollisionBody = require("./collisionbody");
var THREE = require("THREE");
var assert = require("assert");
var Debug = require("../debug");
var extend = require("extend");

var RayCollisionBody = function() {
    CollisionBody.call(this);

    this.type = "RayCollisionBody";
    this.bodyType = "ray";

    this.direction = null;
};

RayCollisionBody.prototype = Object.create(CollisionBody.prototype);
RayCollisionBody.prototype.constructor = RayCollisionBody;

RayCollisionBody.prototype.hitTest = function(body) {
    assert(this.direction != null, "direction cannot be empty");

    if (body.bodyType == "sphere") {

    } else if (body.bodyType == "block") {
        var sphere = body.getBoundingSphere();

        var hitTestResult = this.hitTestSphere(sphere);

        if (hitTestResult == null) {
            return null;
        }

        //every 2 unit
        var testStep = 2.0;
        var testInterval = body.boundingSphereRadius / testStep;
        testInterval = Math.floor(testInterval);

        var position = hitTestResult.point;
        var step = this.direction.clone().setLength(testStep);

        for (var i = 0; i < testInterval; i++) {
        	var blockHitTestResult = body.hitTestSphere(1, position);
        	if(blockHitTestResult != null && blockHitTestResult.result){
        		return blockHitTestResult;
        	}
        	position.add(step);
        }
    }

    return null;
}

RayCollisionBody.prototype.hitTestSphere = function(sphere) {
    var raycaster = new THREE.Raycaster(this.entity.worldPosition, this.direction);


    var results = raycaster.intersectObject(sphere);

    if (results.length == 0) {
        return null;
    }

    var result = results[0];
    var point = result.point;

    return {
        result: true,
        point: point
    };
}

module.exports = RayCollisionBody;