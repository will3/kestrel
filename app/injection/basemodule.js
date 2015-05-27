var _ = require("lodash");
var extend = require("extend");

var Bindable = function(key){
	var instance = null; 
	var properties = null;

	var getInstance = function(instanceOrFunc){
		if(_.isFunction(instanceOrFunc)){
			return instanceOrFunc();
		}

		return instanceOrFunc;
	};

	return{
		key: key,
		tag: null,
	
		to: function(instanceValue){
			instance = instanceValue;
			return this;
		},

		withTag: function(tag){
			this.tag = tag;
			return this;
		},

		withProperties: function(propertiesValue){
			properties = propertiesValue;
			return this;
		},

		get: function(){
			var object = getInstance(instance);

			if(object == null){
				throw "failed to initialize object";
			}

			if(properties != null){
				for (var property in properties) {
				  	if (properties.hasOwnProperty(property)) {
				    	if(!object.hasOwnProperty(property)){
				    		throw "attempt to inject " + property + " to " + object;
				    	}	
				  	}
				}
				object = extend(object, getInstance(properties));
			}
			
			return object;
		}
	}
}

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