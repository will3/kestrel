var TransformComponent = require("./components/transformcomponent");
var THREE = require("THREE");
var _ = require("lodash");
var MathUtils = require("./mathutils");

var Entity = function() {
    this.name = null;
    this.transform = new TransformComponent();
    this.components = [];
    this.childEntities = [];
    this.frameAge = 0;
    this.parent = null;
    this.started = false;
    this.life = null;
    this.destroyable = false;

    this.collisionBody = null;
    this.collisionFilter = null;
};

Entity.prototype = {
    constructor: Entity,

    setCollisionRadius: function(radius) {
        this.collisionBody = {
            getPosition: function() {
                return this.position
            }.bind(this),

            type: 'sphere',
            radius: radius
        };
    },

    addEntity: function(entity) {
        if (entity.parent != null) {
            throw "entity already has a parent entity";
        }

        entity.parent = this;
        this.childEntities.push(entity);
    },

    removeEntity: function(entity) {
        entity.destroy();
        _.pull(this.childEntities, entity);
    },

    addComponent: function(component) {
        component.entity = this;
        this.components.push(component);
    },

    getComponent: function(type){
        var components = _.filter(this.components, function(component){
            return component.type == type;
        });

        return components[0];
    },

    removeComponent: function(component) {
        component.destroy();
        _.pull(this.components, component);
    },

    removeFromParent: function(){
        if(this.parent == null){
            this.destroy();
        }else{
            this.parent.removeEntity(this);
        }
    },

    start: function() {
        //override to provide behaviour
    },

    update: function() {
        //override to provide behaviour
    },

    lateUpdate: function(){

    },

    destroy: function() {
        this.components.forEach(function(component) {
            component.destroy();
        });

        this.childEntities.forEach(function(childEntity) {
            childEntity.destroy();
        });
    },

    get position() {
        return this.transform.position;
    },

    set position(value) {
        this.transform.position = value;
    },

    get scale() {
        return this.transform.scale;
    },

    set scale(scale) {
        this.transform.scale = scale;
    },

    get rotation() {
        return this.transform.rotation;
    },

    set rotation(rotation) {
        this.transform.rotation = rotation;
    },

    get quaternion(){
        return this.transform.quaternion;
    },

    get root() {
        if (this.parent == null) {
            return null;
        }

        var entity = this;
        while (entity.parent != null) {
            entity = entity.parent;
        }

        return entity;
    },

    get worldPosition() {
        return new THREE.Vector3(0, 0, 0).applyMatrix4(this.worldTransformMatrix);
    },

    get transformMatrix() {
        return new THREE.Matrix4().compose(this.position, this.quaternion, this.scale);
    },

    get worldTransformMatrix() {
        if(this.parent == null){
            return this.transformMatrix;
        }

        return new THREE.Matrix4().multiplyMatrices(this.parent.worldTransformMatrix, this.transformMatrix);
    },

    get rotationMatrix() {
        return new THREE.Matrix4().makeRotationFromEuler(this.rotation);
    },

    get worldRotationMatrix() {
        var m = this.rotationMatrix;

        var entity = this;
        while (entity.parent != null) {
            entity = entity.parent;
            m.multiply(entity.rotationMatrix);
        }

        return m;
    }
}

module.exports = Entity;