var _ = require("lodash");
var extend = require("extend");
var Bindable = require("./bindable");

var BaseModule = function() {
    this.bindings = [];
    this.subModules = [];
};

BaseModule.prototype = {
    constructor: BaseModule,

    load: function() {
        throw "must override";
    },

    bindKey: function(key) {
        var binding = new Bindable(key);
        this.bindings.push(binding);
        return binding;
    },

    getBindings: function(key, tag) {
        return _.filter(this.bindings, function(binding) {
            return (binding.key == key) && (tag == null || binding.tag == tag);
        });
    },

    get: function(key, tag) {
        var bindings = this.getBindings(key, tag);
        this.subModules.forEach(function(subModule){
        	bindings = bindings.concat(subModule.getBindings);
        }.bind(this));

        if (bindings.length == 0) {
            var desc = (key + " " + (tag || "")).trim();
            throw "no bindings found for " + desc;
        }

        return bindings[0].get();
    }
};

module.exports = BaseModule;