var Entity = require("../entity");
var RigidBody = require("../components/rigidbody");
var THREE = require("THREE");
var BlockModel = require("../blockengine/blockmodel");
var ModelRenderComponent = require("../components/modelrendercomponent");
var Block = require("../blockengine/block");
var BlockUtils = require("../blockengine/blockutils");
var BlockChunkUtils = require("../blockengine/blockchunkutils");

var ModelEntity = function(model) {
    Entity.call(this);

    this.model = model;

    this.maxHealth = this.model.blockCount;

    this.rigidBody = new RigidBody({
        mass: this.model.blockCount * Math.pow(this.model.gridSize, 3)
    });
    this.addComponent(this.rigidBody);

    this.renderComponent = new ModelRenderComponent(this.model);
    this.addComponent(this.renderComponent);

    this.blockEntities = this.initBlockEntities();

    this.maxBlockSize = this.model.blockCount;
};

ModelEntity.prototype = Object.create(Entity.prototype);
ModelEntity.prototype.constructor = ModelEntity;

Object.defineProperty(ModelEntity.prototype, "health", function() {
    return this.model.blockCount / this.maxHealth;
});

//override this
ModelEntity.prototype.initBlockEntities = function() {
    return null;
};

ModelEntity.prototype.onRemove = function(block, x, y, z) {
    var debriPosition = this.model.getWorldPosition(new THREE.Vector3(x, y, z));
    var debriRotation = this.model.getWorldRotation();
    var model = new BlockModel({
        halfSize: 4
    });
    model.add(0, 0, 0, block);
    var debri = new ModelEntity(model);
    debri.position = debriPosition;
    debri.rotation = debriRotation;
    debri.rigidBody.velocity.copy(this.rigidBody.velocity);

    this.root.addEntity(debri);

    // this.centerModelToCenterOfMass();
};

// ModelEntity.prototype.centerModelToCenterOfMass = function() {
//     var c1 = this.model.centerOfMass.clone();
//     this.model.center();
//     var c2 = this.model.centerOfMass.clone();

//     var diff = new THREE.Vector3().subVectors(c2, c1).multiplyScalar(this.model.gridSize);
//     this.blockEntities.forEach(function(blockEntity) {
//         blockEntity.setPositionFromModel(this.model);
//     }.bind(this));

//     diff.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(this.rotation));
//     this.position.add(diff);

//     this.model.update();
// };

ModelEntity.prototype.damage = function(x, y, z, amount) {
    var block = this.model.get(x, y, z);
    if (block == null) {
        return;
    }

    var integrity = block.integrity;
    var minIntegrity = 0.0;
    integrity -= amount;
    if (integrity < minIntegrity) {
        integrity = minIntegrity;
    }

    block.integrity = integrity;

    if (block.integrity == minIntegrity) {
        var block = this.model.remove(x, y, z);

        this.onRemove(block, x, y, z);
        var contiguous = BlockChunkUtils.checkContiguous(this.model.chunk);
        if (!contiguous) {
            this.onBroken();
        }
    }

    this.model.setNeedsUpdate(x, y, z);
};

ModelEntity.prototype.damageArea = function(centerX, centerY, centerZ, amount, blockRadius) {
    BlockUtils.visitRange(centerX, centerY, centerZ, blockRadius, function(x, y, z, distance) {
        var ratio = (blockRadius - distance + 1) / (blockRadius + 1);
        this.damage(x, y, z, amount * ratio);
    }.bind(this));
};

ModelEntity.prototype.onBroken = function() {
    this.breakApart();
};

ModelEntity.prototype.breakApart = function() {
    var groups = BlockChunkUtils.getContiguousGroups(this.model.chunk);

    if (groups.count <= 1) {
        throw "can't break apart contiguous block model";
    }

    var maxLength = 0;
    var maxGroup = null;
    groups.forEach(function(group) {
        if (group.length > maxLength) {
            maxLength = group.length;
            maxGroup = group;
        }
    });

    groups.forEach(function(group) {
        if (group == maxGroup) {
            return;
        }

        group.forEach(function(blockInfo) {
            this.model.remove(blockInfo.x, blockInfo.y, blockInfo.z);
            this.onRemove(blockInfo.block, blockInfo.x, blockInfo.y, blockInfo.z);
        }.bind(this));
    }.bind(this));
};

module.exports = ModelEntity;