var klass = require("klass");

var Component = function(){
	var entity = null;
	var started = false;
	
	var component = {
		setEntity: function(value){ entity = value; },
		getEntity: function(){ return entity; },
		getName:function(){
			throw "must override getName";
		},
		getStarted: function(){ return started; },
		setStarted: function(value){ started = value; },

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