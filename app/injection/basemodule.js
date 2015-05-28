var _ = require("lodash");
var extend = require("extend");
var Bindable = require("./bindable");

var BaseModule = function(){
	this.bindings = [];
};

BaseModule.prototype = {
	constructor: BaseModule,

	load: function(){
		throw "must override";
	},

	bindKey: function(key){
		var binding = new Bindable(key);
		this.bindings.push(binding);
		return binding;
	},

	get: function(key, tag){
		var bindings = _.filter(this.bindings, function(binding){
			return (binding.key == key) && (tag == null || binding.tag == tag);
		});

		var desc = key + (tag != null ? " tag:" + tag : "");
		if(bindings.length == 0){
			throw "no bindings found for " + desc;
		}

		if(bindings.length > 1){
			throw "more than one binding found for " + desc;
		}

		return bindings[0].get();
	}
};

module.exports = BaseModule;