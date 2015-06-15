var CollisionBody = require("./collisionbody");
var SphereCollisionBody = require("./spherecollisionbody");
var BlockCoord = require("../blockengine/blockcoord");
var THREE = require("THREE");
var BlockUtils = require("../blockengine/blockutils");

var BlockCollisionBody = function(model) {
    CollisionBody.call(this);

    this.model = model;

    this.type = "BlockCollisionBody";
    this.bodyType = "block";
    
    //hit test iteration against a moving target
    //every unit it travels,
    //actual test iterations are rounded up
    this.velocityIteration = 0.25;

    //THREE Object3D representing bounding sphere for collision body
    this.boundingSphere = null;
};

BlockCollisionBody.prototype = Object.create(CollisionBody.prototype);
BlockCollisionBody.prototype.constructor = BlockCollisionBody;

BlockCollisionBody.prototype.getBoundingSphere = function(){
    if(this.boundingSphere == null){
        this.boundingSphereRadius = this.model.blockRadius * this.model.gridSize;
        var geometry = new THREE.SphereGeometry(this.boundingSphereRadius);
        var material = new THREE.MeshBasicMaterial();
        this.boundingSphere = new THREE.Mesh(geometry, material);
    }

    this.boundingSphere.position.copy(this.transform.position);

    this.boundingSphere.updateMatrixWorld();

    return this.boundingSphere;
};

BlockCollisionBody.prototype.hitTest = function(body) {
    if (body.type == "SphereCollisionBody") {
        var velocity = body.velocity;

        if(velocity == null){
            return this.hitTestSphere(body.radius, body.transform.position);
        }

        var testInterval = Math.ceil(velocity.length() * this.velocityIteration);
        var positionIteration = new THREE.Vector3().copy(velocity).multiplyScalar(1 / testInterval);

        var position = new THREE.Vector3().copy(body.transform.position);
        for (var i = 0; i < testInterval; i++) {
            var hitTest = this.hitTestSphere(body.radius, position);
            if (hitTest.result) {
                return hitTest;
            }
            position.add(positionIteration);
        }

        return {
            result: false
        };
    } else if (body.type == "BlockCollisionBody") {
        return {
            result: false
        }
    }

    throw "hitTest not implemented for type " + body.type;
};

BlockCollisionBody.prototype.hitTestSphere = function(radius, position) {
    var distance = position.distanceTo(this.model.object.position);
    if (distance > (radius + this.model.blockRadius * this.model.gridSize)) {
        return {
            result: false
        };
    }

    var coords = new THREE.Vector3().copy(position).applyMatrix4(this.model.getWorldInverseMatrix());

    var blockRadius = Math.ceil(radius * this.model.gridSize);

    var blockCoord = new BlockCoord(Math.round(coords.x), Math.round(coords.y), Math.round(coords.z));
    var blockRadius = Math.ceil(radius * 2);

    var result = null;

    BlockUtils.visitRange(blockCoord.x, blockCoord.y, blockCoord.z, blockRadius, function(x, y, z, distance) {
        if (result != null) {
            return;
        }
        var block = this.model.chunk.get(x, y, z);
        if (block != null) {
            var point = new THREE.Vector3(x,y,z).applyMatrix4(this.model.getWorldMatrix());
            result = {
                result: true,
                block: block,
                point: point,
                coord: new BlockCoord(x, y, z)
            }
        }
    }.bind(this));

    if (result != null) {
        return result;
    }

    return {
        result: false
    };
}

module.exports = BlockCollisionBody;