var RotationState = function() {
    this.desired = null;
    this.resting = 0;
    this.max = Math.PI / 2;
    this.curve = 0.1;
    this.maxSpeed = 0.1;
    this.friction = 0.95;
    this.value = 0;
}

RotationState.prototype.constructor = RotationState;
RotationState.prototype.setAmount = function(amount) {
    this.desired = this.max * amount;
}

RotationState.prototype.update = function() {
    if (this.desired == null) {
        this.desired = this.resting;
    }

    if (this.desired != null) {
        var speed = (this.desired - this.value) * curve;
        if (speed > this.maxSpeed) {
            speed = this.maxSpeed;
        } else if (speed < -this.maxSpeed) {
            speed = -this.maxSpeed;
        }

        this.value += speed;
        this.value *= friction;
    }

    this.desired = this.resting;
}

module.exports = RotationState;