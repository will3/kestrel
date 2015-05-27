var Block = function(){
	this.type = "Block";

	this.showTop = false;
	this.showBottom = false;
	this.showLeft = false;
	this.showRight = false;
	this.showFront = false;
	this.showBack = false;
};

Block.prototype = {
	constructor: Block,

	shouldShow: function(){
		return this.showTop || this.showBottom || this.showLeft || this.showRight || this.showFront || this.showBack;
	}
};

module.exports = Block;