var Injector = function() {
    this.module = null;

    return {
        loadModule: function(mod) {
        	this.module = mod;
        	this.module.load();
        },

        get: function(key, tag) {
        	if(this.module == null){
        		throw "no modules loaded for " + key + ((tag != null) ? (" " + tag) : "");
        	}

        	var object = this.module.get(key, tag);

        	if(object == null){
        		throw "failed to load dependency " + key;
        	}

        	return object;
        }
    }
}();

module.exports = Injector;
