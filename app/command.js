var Command = function(){
	var actor = null;
	var params = null;
	
	var command = {
		getActor: function(){ return actor; },
		setActor: function(value){ actor = value; },
		getParams: function(){ return params; },
		setParams: function(value){ params = value; },
		execute: function(){
			throw "must override";
		},

		update: function(){
			throw "must override";
		},

		destroy: function(){

		},
	};

	return command;
}

module.exports = Command;