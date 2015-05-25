var klass = require("klass");

var Component = function(){
	this.entity = null;
	this.started = false;
}

Component.prototype = {
	constructor: Component,

	getName:function(){
		throw "must override getName";
	},

	start: function(){

	},

	update: function(){

	},

	destroy: function(){

	},

	get transform(){
		return this.entity.getTransform();
	}
}

module.exports = Component;