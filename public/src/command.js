var Command = klass(function(){
	this.params = null;
}).methods({
	execute: function(){
		throw "must override";
	},

	update: function(){
		throw "must override";
	},

	destroy: function(){

	},
});
