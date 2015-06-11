var Entity = require("../entity");
var RigidBody = require("../components/rigidbody");
var THREE = require("THREE");

var ModelEntity = function(model) {
    Entity.call(this);

    this.model = model;

    this.maxHealth = this.model.blockCount;

    this.rigidBody = new RigidBody({
        mass: this.model.blockCount * Math.pow(this.model.gridSize, 3)
    });

    this.blockEntities = this.initBlockEntities();

    this.model.onRemove(this.onRemove.bind(this));
    this.model.onBroken(this.onBroken.bind(this));

    this.maxBlockSize = this.model.blockCount;
};

ModelEntity.prototype = Object.create(Entity.prototype);
ModelEntity.prototype.constructor = ModelEntity;

Object.defineProperty(ModelEntity.prototype, "health", function(){
    return this.model.blockCount / this.maxHealth;
});

//override this
ModelEntity.prototype.initBlockEntities = function(){
	return null;
};

ModelEntity.prototype.onRemove = function() {
    var c1 = this.model.centerOfMass.clone();
    this.model.center();
    var c2 = this.model.centerOfMass.clone();

    var diff = new THREE.Vector3().subVectors(c2, c1).multiplyScalar(this.model.gridSize);
    this.blockEntities.forEach(function(blockEntity) {
        blockEntity.setPositionFromModel(this.model);
    }.bind(this));

    diff.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(this.rotation));
    this.position.add(diff);

    this.model.update();
};

ModelEntity.prototype.onBroken = function(){
	this.model.breakApart();
};

module.exports = ModelEntity;