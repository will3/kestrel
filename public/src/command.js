var Command = klass(function(){
	this.params = null;
}).methods({
	getOp: function(){
		throw "must override";
	},

	execute: function(){
		throw "must override";
	},

	update: function(){
		throw "must override";
	},

	destroy: function(){

	},
});
