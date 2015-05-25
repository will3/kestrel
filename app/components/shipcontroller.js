var Component = require("../component");
var THREE = require("THREE");
var MathUtils = require("../mathutils");

var RotationState = function(params) {
    var desired = null;

    var params = params != null ? params : {};
    var resting = params.resting != null ? params.resting : null;
    var max = params.max != null ? params.max : Math.PI / 2;
    var curve = params.curve != null ? params.curve : 0.1;
    var maxSpeed = params.maxSpeed != null ? params.maxSpeed : 0.1;
    var friction = params.friction != null ? params.friction : 0.95;
    var axis = params.axis != null ? params.axis : "";

    var getVectorValue = null;
    var setVectorValue = null;
    if (axis == "x") {
        getVectorValue = function(vector) {
            return vector.x;
        }
        setVectorValue = function(vector, value) {
            vector.setX(value);
        }
    } else if (axis == "y") {
        getVectorValue = function(vector) {
            return vector.y;
        }
        setVectorValue = function(vector, value) {
            vector.setY(value);
        }
    } else if (axis == "z") {
        getVectorValue = function(vector) {
            return vector.z;
        }
        setVectorValue = function(vector, value) {
            vector.setZ(value);
        }
    } else {
        throw "invalid axis " + axis;
    }

    return {
        getAxis: function() {
            return axis;
        },
        setAmount: function(amount) {
            desired = max * amount;
        },

        setDesired: function(amount) {
            desired = amount;
        },

        update: function(entity) {
            if (desired == null) {
                desired = resting;
            }

            if (desired != null) {
                var transform = entity.getTransform();
                var rotation = transform.getRotation();

                var value = getVectorValue(rotation);

                var speed = (desired - value) * curve;
                if (speed > maxSpeed) {
                    speed = maxSpeed;
                } else if (speed < -maxSpeed) {
                    speed = -maxSpeed;
                }
                value += speed;
                value *= friction;

                setVectorValue(rotation, value);
            }

            desired = resting;
        }
    }
}

var Roll = function() {
    return new RotationState({
        axis: "z",
        resting: null,
    });
}

var Pitch = function() {
    return new RotationState({
        axis: "y",
        resting: null,
    });
}

var Yaw = function() {
    var yawForce = 0.015;

    return {
        setYawForce: function(value) {
            yawForce = value;
        },
        getYawForce: function() {
            return yawForce;
        },

        update: function(entity) {
            var transform = entity.transform;
            var rotation = transform.rotation;
            var bankFactor = Math.sin(rotation.z);
            var yawVelocity = bankFactor * -yawForce;

            var yaw = rotation.x;
            yaw += yawVelocity;
            rotation.setX(yaw);
        }
    };
}

var ShipController = function() {
    this.force = 0.025;

    //engine
    this.roll = new Roll();
    this.pitch = new Pitch();
    this.yaw = new Yaw();

    //yaw
    this.yawForce = 0.015;
    this.command = null;
    this.engineAmount = 0.0;
};

ShipController.prototype = Object.create(Component);

Object.defineProperty(ShipController, 'rigidBody', {
    get: function() {
        return this.entity.rigidBody;
    }
});

Object.defineProperty(ShipController, 'command', {
    get: function() {
        return this.command;
    },

    set: function(value) {
	    if (this.command != null) {
	        this.command.destroy();
	        this.command = null;
	    }

        this.command = value;
    }
});

//amount 0 - 1
ShipController.prototype.bank = function(amount) {
    this.roll.setAmount(amount);
};

//bank to achieve yaw velocity
ShipController.prototype.bankForYawVelocity = function(yawVelocity) {
    var bankFactor = yawVelocity / - this.yawForce;
    if (bankFactor > 1) {
        bankFactor = 1;
    } else if (bankFactor < -1) {
        bankFactor = -1;
    }
    var desiredRoll = Math.asin(bankFactor);

    this.roll.setDesired(desiredRoll);
};

ShipController.prototype.updateYaw = function(transform) {
    var rotation = transform.rotation;
    var bankFactor = Math.sin(rotation.z);
    var yawVelocity = bankFactor * -yawForce;

    var yaw = rotation.x;
    yaw += yawVelocity;
    rotation.setX(yaw);
};

ShipController.prototype.update = function() {
    var transform = this.transform;
    var entity = this.entity;
    this.roll.update(entity);
    this.pitch.update(entity);
    this.yaw.update(entity);

    if (this.command != null) {
        this.command.update();
    }
};


ShipController.prototype.accelerate = function(amount) {
    engineAmount = amount;
    var rotation = this.getTransform().getRotation();
    var vector = MathUtils.getUnitVector(rotation.x, rotation.y, rotation.z);
    vector.multiplyScalar(amount * force);
    this.getRigidBody().applyForce(vector);
};

ShipController.prototype.align = function(point) {
    var position = this.getTransform().getPosition();

    var a = new THREE.Vector3();
    a.copy(point);
    var b = new THREE.Vector3();
    b.copy(position)
    var c = this.getUnitFacing();

    var angleBetween = MathUtils.angleBetween(a, b, c);

    var desiredYawSpeed = angleBetween * 0.1;

    bankForYawVelocity(desiredYawSpeed);
    var xDiff = point.x - position.x;
    var yDiff = point.y - position.y;
    var zDiff = point.z - position.z;

    pitch.setDesired(Math.atan2(-yDiff, Math.sqrt(xDiff * xDiff + zDiff * zDiff)));
};

ShipController.prototype.move = function(point) {
    this.align(point);
    this.accelerate(1.0);
};

ShipController.prototype.getUnitFacing = function() {
    var position = this.getTransform().getPosition();
    var rotation = this.getTransform().getRotation();
    var unitFacing = MathUtils.getUnitVector(rotation.x, rotation.y, rotation.z);
    var c = new THREE.Vector3();
    c.addVectors(position, unitFacing);

    return c;
};

module.exports = ShipController;
