var klass = require("klass");

var Component = function(){
	var entity = null;

	var component = {
		setEntity: function(value){ entity = value; },
		getEntity: function(){ return entity; },
		getName:function(){
			throw "must override getName";
		},

		start: function(){

		},

		update: function(){

		},

		destroy: function(){

		},

		getTransform: function(){
			return entity.getTransform();
		}
	}

	return component;
}

module.exports = Component;