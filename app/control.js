var Control = function() {
    this.mouseX = null;
    this.mouseY = null;
    this.mouseMoveHandler = null;
    this.isDragging = false;
}

Control.prototype.constructor = Control;

Control.prototype.mouseMove = function(handler) {
    this.mouseMoveHandler = handler;
};

Control.prototype.hookContainer = function(container) {

    container.mousedown(function() {
        this.isDragging = true;
    }.bind(this));

    container.mouseup(function() {
        this.isDragging = false;
    }.bind(this));

    container.mouseleave(function() {
        this.isDragging = false;
    }.bind(this));

    container.mousemove(function(event) {
        if (this.isDragging) {
            var xDiff = event.clientX - this.mouseX;
            var yDiff = event.clientY - this.mouseY;

            this.mouseMoveHandler(xDiff, yDiff);
        }

        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
    }.bind(this));
};

module.exports = Control;