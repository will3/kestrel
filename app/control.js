var Control = function() {
    this.mouseX = null;
    this.mouseY = null;
    this.mouseMoveHandler = null;
    this.mouseClickHandler = null;
    this.isDragging = false;
}

Control.prototype.constructor = Control;

Control.prototype.mouseMove = function(handler) {
    this.mouseMoveHandler = handler;
};

Control.prototype.mouseClick = function(handler){
    this.mouseClickHandler = handler;
};

Control.prototype.hookContainer = function(container) {
    container.onclick = function(){
        if(this.mouseClickHandler){
            this.mouseClickHandler();
        }
    }.bind(this);

    container.onmousedown = function() {
        this.isDragging = true;
    }.bind(this);

    container.onmouseup = function() {
        this.isDragging = false;
    }.bind(this);

    container.onmouseleave = function() {
        this.isDragging = false;
    }.bind(this);

    container.onmousemove = function(event) {
        if (this.isDragging) {
            var xDiff = event.clientX - this.mouseX;
            var yDiff = event.clientY - this.mouseY;

            this.mouseMoveHandler(xDiff, yDiff);
        }

        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
    }.bind(this);
};

module.exports = Control;