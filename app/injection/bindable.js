var _ = require("lodash");

var Bindable = function(key) {
    var instance = null;
    var properties = null;

    var getInstance = function(instanceOrFunc) {
        if (_.isFunction(instanceOrFunc)) {
            return instanceOrFunc();
        }

        return instanceOrFunc;
    };

    return {
        key: key,
        tag: null,

        to: function(instanceValue) {
            instance = instanceValue;
            return this;
        },

        toType: function(type){
        	instance = function(){
        		return new type();
        	}
        	return this;
        },

        withTag: function(tag) {
            this.tag = tag;
            return this;
        },

        withProperties: function(propertiesValue) {
            properties = propertiesValue;
            return this;
        },

        get: function() {
            var object = getInstance(instance);

            if (object == null) {
                throw "failed to initialize object";
            }

            var propertiesInstance = getInstance(properties);
            if (propertiesInstance != null) {
                for (var property in propertiesInstance) {
                    if (propertiesInstance.hasOwnProperty(property)) {
                        if (!object.hasOwnProperty(property)) {
                            throw "attempt to inject " + property + " to " + object;
                        }
                    }

                    object[property] = propertiesInstance[property];
                }
            }

            return object;
        }
    }
}

module.exports = Bindable;