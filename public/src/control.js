function Control()
{
	var lastX;
	var lastY;

	var that = this;

	var mouseMoveHandler;

	this.isDragging = false;

	return {
		mousemove: function(handler){
			mouseMoveHandler = handler;
		},

		hookContainer: function(container){

			container.onmousedown = function(){
				that.isDragging = true;
			};

			container.onmouseup = function(){
				that.isDragging = false;
			};

			container.onmouseleave = function(){
				that.isDragging = false;
			};

			container.onmousemove = function(event){
				if(that.isDragging){
					var xDiff = event.clientX - that.lastX;
					var yDiff = event.clientY - that.lastY;

					mouseMoveHandler(xDiff, yDiff);
				}

				that.lastX = event.clientX;
				that.lastY = event.clientY;
			};
		}
	};
}

var KeyMap = (function(){
	return {
		console: "q",
		zoomIn: "pageup",
		zoomOut: "pagedown",
	};
})();

Control.KeyMap = KeyMap;

module.exports = Control;