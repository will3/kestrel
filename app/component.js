var klass = require("klass");

var Component = klass(function(){
	this.entity = null;
}).methods({
	getName:function(){
		throw "must override getName";
	},

	start: function(){

	},

	update: function(){

	},

	destroy: function(){

	},

	getComponent: function(name){
		return this.entity.getComponent(name);
	},

	getTransform:function(){
		return this.entity.getTransform();
	}
});

module.exports = Component;