var Component = require("../component");
var THREE = require("THREE");
var MathUtils = require("../mathutils");
var _ = require("lodash");

var ShipController = function() {
    Component.call(this);

    this.force = 0.025;

    this.yaw = {
        yawForce: 0.015,
        value: 0,

        update: function(roll) {
            var bankFactor = Math.sin(roll.value);
            var yawVelocity = bankFactor * -this.yawForce;

            this.value += yawVelocity;
        }
    };

    //engine
    this.pitch = {
        desired: null,
        resting: 0,
        max: Math.PI / 2,
        curve: 0.1,
        maxSpeed: 0.1,
        friction: 0.95,
        value: 0,

        update: function() {
            if (this.desired == null) {
                this.desired = this.resting;
            }

            if (this.desired != null) {
                var speed = (this.desired - this.value) * this.curve;
                if (speed > this.maxSpeed) {
                    speed = this.maxSpeed;
                } else if (speed < -this.maxSpeed) {
                    speed = -this.maxSpeed;
                }

                this.value += speed;
                this.value *= this.friction;
            }

            this.desired = this.resting;
        }
    };

    this.roll = _.clone(this.pitch, true);

    //yaw
    this.yawForce = 0.015;
    this.command = null;
    this.engineEmission = 0.0;

    this.engines = null;
};

ShipController.prototype = Object.create(Component.prototype);
ShipController.prototype.constructor = ShipController;

Object.defineProperty(ShipController.prototype, 'rigidBody', {
    get: function() {
        return this.entity.rigidBody;
    }
});

ShipController.prototype.setCommand = function(command){
    if(this.command != null){
        this.command.destroy();
        this.command = null;
    }

    this.command = command;
};

//amount 0 - 1
ShipController.prototype.bank = function(amount) {
    this.roll.setAmount(amount);
};

ShipController.prototype.update = function() {
    var entity = this.entity;
    this.roll.update();
    this.pitch.update();
    this.yaw.update(this.roll);
    entity.rotation.set(this.pitch.value, this.yaw.value, this.roll.value);

    if (this.command != null) {
        this.command.update();
    }
};

ShipController.prototype.accelerate = function(amount) {
    this.engineEmission = amount;

    var rotation = this.transform.rotation;
    var vector = MathUtils.getUnitVector(this.transform.rotation);
    vector.multiplyScalar(amount * this.force);
    this.rigidBody.applyForce(vector);
};

ShipController.prototype.align = function(point) {
    var position = this.transform.position;

    var a = new THREE.Vector3();
    a.copy(point);
    var b = new THREE.Vector3();
    b.copy(position)
    var c = this.getUnitFacing();

    var angleBetween = MathUtils.angleBetween(a, b, c);

    var desiredYawSpeed = angleBetween * 0.1;

    this._bankForYawVelocity(desiredYawSpeed);
    var xDiff = point.x - position.x;
    var yDiff = point.y - position.y;
    var zDiff = point.z - position.z;

    this.pitch.desired = Math.atan2(-yDiff, Math.sqrt(xDiff * xDiff + zDiff * zDiff));
};

ShipController.prototype.move = function(point) {
    this.align(point);
    this.accelerate(1.0);
};

ShipController.prototype.getUnitFacing = function() {
    var position = this.transform.position;
    var rotation = this.transform.rotation;
    var unitFacing = MathUtils.getUnitVector(rotation);
    var c = new THREE.Vector3();
    c.addVectors(position, unitFacing);

    return c;
};

//bank to achieve yaw velocity
ShipController.prototype._bankForYawVelocity = function(yawVelocity) {
    var bankFactor = yawVelocity / -this.yawForce;
    if (bankFactor > 1) {
        bankFactor = 1;
    } else if (bankFactor < -1) {
        bankFactor = -1;
    }
    var desiredRoll = Math.asin(bankFactor);

    this.roll.desired = desiredRoll;
};

module.exports = ShipController;