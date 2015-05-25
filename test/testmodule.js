var injector = require("../app/injector");
var BaseModule = require("../app/basemodule");

var TestModule = function() {

};

TestModule.prototype = new BaseModule();
TestModule.prototype.constructor = TestModule;

TestModule.prototype.load = function() {
    this.bind("game").to(function(){
    	return {
    		removeEntity: function() {}
    	}
    });

    this.bind("entityRunner").to(function(){
    	return {
	        addEntity: function() {},
	        removeEntity: function() {}
    	};
    });

    this.bind("collision").to(function(){
    	return {};
    });

    this.bind("shipController").to(function(){
    	return {};
    });

    this.bind("weaponController").to(function(){
    	return {};
    });

    this.bind("rigidBody").withTag("ship").to(function(){
    	return {};
    });

    this.bind("weapons").to(function(){
    	return [];
    });

    this.bind("smokeTrail").to(function(){
    	return {};
    });

    this.bind("renderComponent").withTag("ship").to(function(){
    	return {};
    });
};

module.exports = new TestModule();
