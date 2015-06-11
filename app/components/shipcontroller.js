var Component = require("../component");
var THREE = require("THREE");
var MathUtils = require("../mathutils");
var _ = require("lodash");

var ShipController = function(params) {
    Component.call(this);

    params = params || {};

    this.type = "ShipController";
    this.model = params.model;
    this.engines = params.engines;
    this.agilityBonus = params.agilityBonus || 1;
    var powerSource = params.powerSource;
    this.powerSource = powerSource;

    this.yaw = {
        controller: this,
        value: 0,

        update: function(roll, accelerateAmount) {
            var bankFactor = Math.sin(roll.value);
            var yawVelocity = bankFactor * -this.controller.turnRate * accelerateAmount;

            this.value += yawVelocity;
        }
    };

    //engine
    this.pitch = {
        desired: null,
        max: Math.PI / 2,
        curve: 0.1,
        maxSpeed: 0.05,
        friction: 0.95,
        restingFriction: 0.99,
        value: 0,
        powerSource: powerSource,

        update: function() {
            if (this.desired == null) {
                this.value *= this.restingFriction;
                return;
            }

            var speed = (this.desired - this.value) * this.curve;
            speed *= this.powerSource.power;

            if (speed > this.maxSpeed) {
                speed = this.maxSpeed;
            } else if (speed < -this.maxSpeed) {
                speed = -this.maxSpeed;
            }

            this.value += speed;
            this.value *= this.friction;
        }
    };

    this.roll = _.clone(this.pitch);

    this.engines = null;

    this.accelerateAmount = 0;
};

ShipController.prototype = Object.create(Component.prototype);
ShipController.prototype.constructor = ShipController;

Object.defineProperty(ShipController.prototype, "rigidBody", {
    get: function() {
        return this.entity.rigidBody;
    }
});

Object.defineProperty(ShipController.prototype, "turnRate", {
    get: function() {
        return 0.035 * this.agilityBonus * this.powerSource.power;
    }
});

Object.defineProperty(ShipController.prototype, "yawCurve", {
    get: function() {
        return 0.035 / this.turnRate * 0.6;
    }
});

//amount 0 - 1
ShipController.prototype.bank = function(amount) {
    this.roll.setAmount(amount);
};

ShipController.prototype.update = function() {
    var entity = this.entity;
    this.roll.update();
    this.pitch.update();
    this.yaw.update(this.roll, this.accelerateAmount);
    entity.rotation.set(this.pitch.value, this.yaw.value, this.roll.value);

    this.roll.desired = null;
    this.pitch.desired = null;
};

ShipController.prototype.lateUpdate = function() {
    this.accelerateAmount = 0;
};

ShipController.prototype.accelerate = function(amount) {
    this.accelerateAmount = amount;

    if (this.engines == null) {
        return;
    }

    this.engines.forEach(function(engine) {
        engine.amount = amount;
    }.bind(this));
};

ShipController.prototype.align = function(point) {
    var position = this.transform.position;

    var a = new THREE.Vector3();
    a.copy(point);
    var b = new THREE.Vector3();
    b.copy(position)
    var c = this.getUnitFacing();

    var angleBetween = MathUtils.angleBetween(a, b, c);

    var desiredYawSpeed = angleBetween * this.yawCurve;

    this._bankForYawVelocity(desiredYawSpeed);
    var xDiff = point.x - position.x;
    var yDiff = point.y - position.y;
    var zDiff = point.z - position.z;

    this.pitch.desired = Math.atan2(-yDiff, Math.sqrt(xDiff * xDiff + zDiff * zDiff));
};

ShipController.prototype.orbit = function(target, distance) {
    var position = this.transform.position;
    //a being vector from position to target
    var a = new THREE.Vector3();
    a.subVectors(target, position);
    a.setY(position.y);

    var yAxis = MathUtils.yAxis;

    var b = new THREE.Vector3();
    b.copy(a);
    b.applyAxisAngle(yAxis, 3 * Math.PI / 4);

    var c = new THREE.Vector3();
    c.copy(a);
    c.applyAxisAngle(yAxis, -3 * Math.PI / 4);

    b.setLength(distance);
    c.setLength(distance);

    b.addVectors(b, target);
    c.addVectors(c, target);

    var unitFacing = this.getUnitFacing();
    var angle1 = Math.abs(MathUtils.angleBetween(b, position, unitFacing));
    var angle2 = Math.abs(MathUtils.angleBetween(c, position, unitFacing));

    var point = angle1 < angle2 ? b : c;

    this.align(point);

    this.accelerate(1.0);
}

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
    var bankFactor = yawVelocity / -this.turnRate;
    if (bankFactor > 1) {
        bankFactor = 1;
    } else if (bankFactor < -1) {
        bankFactor = -1;
    }
    var desiredRoll = Math.asin(bankFactor);

    this.roll.desired = desiredRoll;
};

module.exports = ShipController;