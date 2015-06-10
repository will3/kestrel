var klass = require("klass");

var Component = function() {
    this.entity = null;
    this.started = false;
}

Component.prototype = {
    constructor: Component,

    getName: function() {
        throw "must override getName";
    },

    start: function() {

    },

    update: function() {

    },

    lateUpdate: function() {

    },

    destroy: function() {

    },

    get transform() {
        return this.entity.transform;
    },

    get root() {
        return this.entity.root;
    },

    getComponent: function(type) {
        return this.entity.getComponent(type);
    },

    getComponentOrEmpty: function(type) {
        return this.entity.getComponentOrEmpty(type);
    },

    getComponents: function(type) {
        return this.entity.getComponents(type);
    }
}

module.exports = Component;