var injector = require("../app/injector");
injector.loadModule(require("./testmodule"));
var appmodule = require("../app/appmodule");
var expect = require("chai").expect;

describe("AppModule", function(){
	it("should be singleton", function(){
		expect(require("../app/appmodule")).to.equal(require("../app/appmodule"));
	});

	it("should exist", function(){
		expect(require("../app/appmodule")).to.exist;
	});
})