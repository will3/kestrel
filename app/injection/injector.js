var BaseModule = require("./basemodule");

var Injector = function() {
    this.module = null;

    return {
        loadModule: function(mod) {
            if(!mod instanceof BaseModule){
                throw "attempt to load non module object";
            }

        	this.module = mod;
        	this.module.load();
        },

        get: function(key, tag) {
            if(this.module == null){
                throw "no modules loaded";
            }

            var desc = key + ((tag != null) ? (" " + tag) : "");

        	var object = this.module.get(key, tag);

        	if(object == null){
        		throw "failed to get " + desc;
        	}

        	return object;
        }
    }
};

module.exports = Injector;
